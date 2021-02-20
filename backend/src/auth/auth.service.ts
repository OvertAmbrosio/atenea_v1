import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';

import { RedisService } from 'src/database/redis.service';
import { EmpleadosService } from 'src/api/empleados/empleados.service';
import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';
import { TRespuesta, TErrorsLogin, TPayload } from 'src/helpers/types';

const capitalize = (s: string):string => {
  if (typeof s !== 'string') return '';
  let a = s.toLowerCase();
  return a.charAt(0).toUpperCase() + a.slice(1)
};

@Injectable()
export class AuthService {
  constructor(
    private readonly empleadoService: EmpleadosService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService
  ) {}
  //funcion que continua la estrategia local y ayuda a personalizar los mensajes de validacion
  async validateUser(username: string, password: string): Promise<IEmpleado|TErrorsLogin> {
    if (isEmpty(username)) { 
      throw ({username: 'Se necesita el correo o carnet.'});
    } else if(isEmpty(password)) {
      throw ({password: 'Se necesita la contraseña.'});
    } else {
      return await this.empleadoService.checkUsuario(password, username).then(async(empleado) => {
        if (!empleado) {
          throw ({ message: 'Credenciales incorrectos..'});
        } else {
          const session = await this.redisService.get(String(empleado._id));
          if(empleado.usuario.activo && !session) {
            return empleado
          } else if (session) {
            return await this.redisService.remove(String(empleado._id)).then(() => empleado);
            // throw ({message: 'Ya hay una sesión activa.'})
          } else {
            throw ({message: 'El usuario se encuentra inactivo'})
          }
        }
      }).catch((error) => {
        throw new InternalServerErrorException(error, error.message)
      })
    }
  };
  //funcion para generar el token y guardar la sesion del usuario
  public async login(empleado: IEmpleado):Promise<TRespuesta> {
    const payload: TPayload = { 
      nombre: capitalize(empleado.nombre), 
      id: empleado._id, 
      gestor: empleado.gestor,
      contrata: empleado.contrata,
      cargo:  empleado && empleado.usuario && empleado.usuario.cargo ? empleado.usuario.cargo : null,
      imagen: empleado.usuario.imagen, 
      dia: Date.now()
    };
    //generar el token segun los datos dados
    const token = this.jwtService.sign(payload);
    //guardar el token en redis y enviar un mensaje de error/confirmacion
    return await this.redisService.set(String(empleado._id), token,  86400)
      .then(() => {
        return ({
          status: 'success',
          message: 'Has iniciado sesión.',
          data: token
        })
      }).catch((error) => {
        return ({
          status: 'error',
          message: 'Error guardando el token de acceso.',
          data: error
        })
      });
  };
  //funcion para compara el token guardado en redis con el token que tiene el usuario
  public async session(token: string, id: string, nombre: string):Promise<TRespuesta> {
    return await this.redisService.get(String(id)).then((tokenUser) => {
      if (tokenUser === token) {
        return ({
          status: 'success',
          message: `Sesión verificada. Bienvenido ${capitalize(nombre)}.`
        });
      } else {
        return ({
          status: 'error',
          message: 'Error verificando la sesión.'
        });
      }
    }).catch((error) => {
      throw new InternalServerErrorException(error)
    });
  };
  //funcion para cerrar sesión
  public async logout(token: string, id: string):Promise<TRespuesta> {
    return await this.redisService.get(String(id)).then(async(tokenUser) => {
      if (tokenUser === token) {
        await this.redisService.remove(String(id)).catch((error) => {
          console.log(error);
        });
        return ({
          status: 'success',
          message: 'Sesión cerrada correctamente.'
        });
      } else {
        return ({
          status: 'error',
          message: 'Error verificando la sesión.'
        });
      }
    }).catch((error) => {
      throw new InternalServerErrorException(error);
    });
  };
}
