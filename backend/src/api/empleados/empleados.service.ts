import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { IEmpleado } from './interfaces/empleados.interface';
import { tipos_usuario, estado_empresa, tipos_negocios, sub_tipos_negocios } from '../../constants/enum';
import { cache_keys, variables } from '../../config/variables';
import { TPayload } from 'src/helpers/types';
import { RedisService } from 'src/database/redis.service';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectModel('Empleado') private readonly empleadoModel: PaginateModel<IEmpleado>,
    private readonly redisService: RedisService
  ) {};

  async prueba() {
    return await this.empleadoModel.find({ "usuario.cargo": tipos_usuario.AUDITOR, contrata: "5fbd1b984e03303234cb5fc0"})
  };

  async checkUsuario(password: string, username:string): Promise<IEmpleado> {    
    return await this.empleadoModel.findOne({ 
      $or: [
        { 'usuario.email': username },
        { 'carnet': username} 
      ]
    }).then( async(data) => {
      if (!data) throw ({username: "Email o carnet incorrecto"});
      const isMatch = await bcrypt.compare(password, data.usuario.password);
      if (isMatch) {
        return data;
      } else {
        throw ({password: "Contraseña incorrecta"});
      }
    })
  };
  
  async perfilUsuario(id:string):Promise<IEmpleado> {
    return await this.empleadoModel.findById(id).select('nombre apellidos fecha_nacimiento tipo_documento numero_documento nacionalidad usuario.email usuario.imagen')
  };
  //tabla de lista de personal para la tabla
  async listarPersonal(usuario:TPayload, page:number, limit:number) {
    //declarar opciones de la consulta
    const options = {
      page, limit,
      populate: [{
        path: 'contrata',
        select: 'nombre'
      }, {
        path: 'gestor',
        select: 'nombre apellidos'
      }],
      select: 'usuario.email usuario.cargo gestor ' +
              'nombre apellidos contrata  fecha_nacimiento numero_documento ' +
              'tipo_documento carnet fecha_ingreso fecha_baja estado_empresa ' +
              'nacionalidad observacion',
      sort: 'usuario.cargo contrata nombre'
    };
    //validar si tiene los permisos necesarios
    if (usuario.cargo < tipos_usuario.JEFE_CONTRATA) {
      return await this.empleadoModel.paginate({}, options);
    } else if (usuario.cargo === tipos_usuario.JEFE_CONTRATA || usuario.cargo === tipos_usuario.ALMACENERO) {
      return await this.empleadoModel.paginate({
        $and: [
          { contrata: usuario.contrata },
          { 'usuario.cargo': { $gte: tipos_usuario.JEFE_CONTRATA } }
        ] }, options)
    } else if (usuario.cargo === tipos_usuario.GESTOR) {  
      return await this.empleadoModel.paginate({
        $and: [
          { 'gestor': usuario.id },
          { 'gestor': { $ne: null } },
          { 'usuario.cargo': { $gte: tipos_usuario.GESTOR } }
        ]}, options)
    } else {
      throw new HttpException({
        status: 'error',
        message: 'Error obteniendo el cargo del usuario.'
      }, HttpStatus.FORBIDDEN)
    };
  };
  //funcion para traer los gestores para la lista del select de las tablas 
  async listarGestores(cargo:number): Promise<IEmpleado[]> {
    return await this.redisService.get(cache_keys.GESTORES).then(async(gestores) => {
      if (gestores) {
        let jsonGestores:Array<any> = JSON.parse(gestores);
        if (cargo === tipos_usuario.GESTOR) {
          return jsonGestores.filter((e) => e.carnet == "LY0771")
        } else {
          return jsonGestores
        };
      } else {
        return await this.empleadoModel.find({
          'usuario.cargo': tipos_usuario.GESTOR,
          estado_empresa: { $ne: estado_empresa.INACTIVO }
        }).select('nombre apellidos carnet').sort('apellidos').then(async(data) => {
          const string = JSON.stringify(data);

          await this.redisService.set(cache_keys.GESTORES, string, variables.redis_ttl)

          if (cargo === tipos_usuario.GESTOR) {
            return data.filter((e) => e.carnet == "LY0771")
          } else {
            return data
          };
        })
      };
    });
  };
  //funcion para traer los auditores para la lista del select de las tablas 
  async listarAuditores(): Promise<IEmpleado> {
    return await this.redisService.get(cache_keys.AUDITORES).then(async(auditores) => {
      if (auditores) {
        return JSON.parse(auditores)
      } else {
        return await this.empleadoModel.find({
          'usuario.cargo': tipos_usuario.AUDITOR,
          estado_empresa: { $ne: estado_empresa.INACTIVO }
        }).select('nombre apellidos').sort('apellidos').then(async(data) => {
          const string = JSON.stringify(data);
          return await this.redisService.set(cache_keys.AUDITORES, string, variables.redis_ttl)
            .then(() => data);
        })
      };
    });
  };
  //lista para mostrar los tecnicos en la lista de rutas, ordenes y logistica
  async listarTecnicosGlobal(): Promise<IEmpleado[]> {
    return await this.redisService.get(cache_keys.TECNICOS_GLOBAL).then(async(tecnicos) => {
      if (tecnicos) {
        return JSON.parse(tecnicos)
      } else {
        // si no hay data buscar los tecnicos en la base de datos
        return await this.empleadoModel.find({
          'usuario.cargo': tipos_usuario.TECNICO, 
          'estado_empresa': { $ne: estado_empresa.INACTIVO }
        }).populate({
          path: 'gestor',
          select: 'nombre apellidos'
        }).populate({
          path: 'auditor',
          select: 'nombre apellidos'
        }).populate({
          path: 'contrata',
          select: 'nombre'
        }).select('nombre apellidos gestor auditor contrata carnet tipo_negocio sub_tipo_negocio').sort('contrata nombre').then(async(data) => {
          const string = JSON.stringify(data);
          return await this.redisService.set(cache_keys.TECNICOS_GLOBAL, string, variables.redis_ttl)
            .then(() => data);
        });
      };
    });
  };
  //funcion para traer a los tecnicos de la contrata
  async listarTecnicosContrata(idContrata:string): Promise<IEmpleado[]> {
    return await this.empleadoModel.find({
      'usuario.cargo': tipos_usuario.TECNICO,
      contrata: idContrata,
      estado_empresa: { $ne: estado_empresa.INACTIVO }
    }).select('nombre apellidos')
  };
  //funcion para buscar los tecnicos asignados al gestor
  async listarTecnicosGestor(idGestor: string): Promise<IEmpleado[]> {
    return await this.empleadoModel.find({
      'usuario.cargo': tipos_usuario.TECNICO,
      'gestor': idGestor,
      estado_empresa: { $ne: estado_empresa.INACTIVO }
    }).populate('auditor', 'nombre apellidos')
      .populate('contrata', 'nombre').select('nombre apellidos auditor').sort('apellidos')
  };
  //funcion para buscar personal por el field y el valor
  async buscarPersonal(value: string, field: string, usuario:TPayload) {
    const busquedas = ['nombre', 'numero_documento', 'carnet']
    if (usuario.cargo < tipos_usuario.JEFE_CONTRATA && busquedas.includes(field)) {
      return await this.empleadoModel.find({[field]: { "$regex": value, '$options': 'i' } }).populate('contrata', 'nombre').limit(20)
    } else if (usuario.cargo === tipos_usuario.JEFE_CONTRATA || usuario.cargo === tipos_usuario.ALMACENERO) {
      return await this.empleadoModel.find({
        contrata: usuario.contrata, 
        'usuario.cargo': { $lte: tipos_usuario.JEFE_CONTRATA }, 
        [field]: { "$regex": value, '$options': 'i' } 
      }).populate('contrata', 'nombre').limit(20);
    } else if (usuario.cargo === tipos_usuario.GESTOR) {
      return await this.empleadoModel.find({
        'gestor': usuario.gestor, 
        'usuario.cargo': { $lte: tipos_usuario.GESTOR },
        [field]: { "$regex": value, '$options': 'i' }
      }).populate('contrata', 'nombre').limit(20)
    } else {
      throw new HttpException({
        status: 'error',
        message: 'Error obteniendo el cargo del usuario.'
      }, HttpStatus.FORBIDDEN)
    };
  };

  async cambiarContraseña(id:string, password:string, newPassword1:string, newPassword2:string) {

    if (newPassword1 !== newPassword2) throw new HttpException('Las contraseñas no coinciden.', HttpStatus.INTERNAL_SERVER_ERROR);

    const empleado:IEmpleado = await this.empleadoModel.findById(id);

    if (empleado) {      
      const isMatch = await bcrypt.compare(password, empleado.usuario.password);
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword1, salt);
        return await this.empleadoModel.findByIdAndUpdate(id, { "usuario.password": hash })
      } else {
        throw new HttpException('Contraseña incorrecta.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException('Usuario no encontrado.', HttpStatus.INTERNAL_SERVER_ERROR);
    };
  };

  async crearEmpleado(createEmpleadoDto: CreateEmpleadoDto):Promise<IEmpleado> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('12345678', salt);
    createEmpleadoDto.usuario.password = hash;

    const nuevoEmpleado = new this.empleadoModel(createEmpleadoDto);

    if (nuevoEmpleado.usuario.cargo === tipos_usuario.GESTOR) {
      return await this.redisService.remove(cache_keys.GESTORES)
        .then(async() => await nuevoEmpleado.save());
    } else if (nuevoEmpleado.usuario.cargo === tipos_usuario.TECNICO) {
      return await this.redisService.remove(cache_keys.TECNICOS_GLOBAL)
        .then(async() => await nuevoEmpleado.save());
    } else {
      return await nuevoEmpleado.save();
    };
  };

  async actualizarEmpleado(id: string, cargoUsuario: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    const empleado = await this.empleadoModel.findById(id).select('usuario.cargo');
    
    let objUpdate = {};

    if (updateEmpleadoDto.nombre) objUpdate["nombre"] = updateEmpleadoDto.nombre;
    if (updateEmpleadoDto.apellidos) objUpdate["apellidos"] = updateEmpleadoDto.apellidos;
    if (updateEmpleadoDto.carnet) objUpdate["carnet"] = updateEmpleadoDto.carnet;
    if (updateEmpleadoDto.contrata) objUpdate["contrata"] = updateEmpleadoDto.contrata;
    if (updateEmpleadoDto.tipo_documento) objUpdate["tipo_documento"] = updateEmpleadoDto.tipo_documento;
    if (updateEmpleadoDto.numero_documento) objUpdate["numero_documento"] = updateEmpleadoDto.numero_documento;
    if (updateEmpleadoDto.fecha_nacimiento) objUpdate["fecha_nacimiento"] = updateEmpleadoDto.fecha_nacimiento;
    if (updateEmpleadoDto.usuario.email) objUpdate["usuario.email"] = updateEmpleadoDto.usuario.email;
    if (updateEmpleadoDto.usuario.cargo) objUpdate["usuario.cargo"] = updateEmpleadoDto.usuario.cargo;
    if (updateEmpleadoDto.usuario.imagen) objUpdate["usuario.imagen"] = updateEmpleadoDto.usuario.imagen;
    
    //validar que el usuario a actualizar no es uno de los jefes o administrador
    if (empleado && empleado.usuario.cargo >= cargoUsuario) {
      if (empleado.usuario.cargo === tipos_usuario.GESTOR || updateEmpleadoDto.usuario.cargo === tipos_usuario.GESTOR) {
        await this.redisService.remove(cache_keys.GESTORES)
      }
      if (empleado.usuario.cargo === tipos_usuario.TECNICO || updateEmpleadoDto.usuario.cargo === tipos_usuario.TECNICO) {
        await this.redisService.remove(cache_keys.TECNICOS_GLOBAL)
      }
      if (empleado.usuario.cargo === tipos_usuario.AUDITOR || updateEmpleadoDto.usuario.cargo === tipos_usuario.AUDITOR) {
        await this.redisService.remove(cache_keys.AUDITORES)
      }

      return await this.empleadoModel.findByIdAndUpdate(id, { $set: objUpdate });
    } else {
      throw new HttpException({
        message: 'No puedes editar usuarios con cargos superiores.'
      }, HttpStatus.FORBIDDEN)
    }
  };

  async resetPassword(_id: string, usuarioCargo: number): Promise<IEmpleado> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('12345678', salt);
    
    return await this.empleadoModel.findOneAndUpdate({
      $and: [
        { _id }, { 'usuario.cargo': { $gte: usuarioCargo } } 
      ]}, { $set: {'usuario.password': hash}})
  };

  async cerrarSession(id: string): Promise<any> {
    return await this.redisService.remove(String(id));
  };

  async actualizarPermisos(_id: string, nuevoCargo: number): Promise<IEmpleado> {
    return this.empleadoModel.findByIdAndUpdate(_id, { $set: { 'usuario.cargo': nuevoCargo } }).then(async(data) => {
      if (data.usuario.cargo === tipos_usuario.GESTOR || nuevoCargo === tipos_usuario.GESTOR) await this.redisService.remove(cache_keys.GESTORES)
      if (data.usuario.cargo === tipos_usuario.TECNICO || nuevoCargo === tipos_usuario.TECNICO) await this.redisService.remove(cache_keys.TECNICOS_GLOBAL)
    
      return data;
    })
  };

  async activarCuenta(_id: string): Promise<IEmpleado> {
    return this.empleadoModel.findByIdAndUpdate(_id, { 
      $set: { 
        'usuario.activo': true, 
        estado_empresa: estado_empresa.ACTIVO, 
        fecha_baja: null 
      } 
    })
  };

  async editarEstadoEmpresa(_id: string, estado_e: number, fecha_baja?: Date): Promise<IEmpleado> {
    //declarar un obj para enviar los datos de actualizacion
    let objUpdate:any;
    //validar que estado se actualizará para cambiar el obj a enviar
    if (estado_e === 3) {
      objUpdate = {
        estado_empresa: estado_empresa.INACTIVO,
        fecha_baja, 'usuario.activo': false
      };
    } else if (estado_e === 2) {
      objUpdate = {
        estado_empresa: estado_empresa.SUSPENDIDO,
        fecha_baja, 'usuario.activo': false
      };
    } else {
      objUpdate = {
        estado_empresa: estado_empresa.ACTIVO,
        fecha_baja: null,
        'usuario.activo': true
      }
    };
    //actualizar el empleado
    return this.empleadoModel.findByIdAndUpdate(_id, objUpdate).then(async(data) => {
      if (data.usuario.cargo === tipos_usuario.GESTOR) {
        return await this.redisService.remove(cache_keys.GESTORES)
          .then(async() => {
            //eliminar el token de sesión
            if (estado_e === 1) return data;
            return await this.redisService.remove(String(data._id)).then(() => data);
          });
      } else if (data.usuario.cargo === tipos_usuario.TECNICO) {
        return await this.redisService.remove(cache_keys.TECNICOS_GLOBAL)
          .then(async() => {
            //eliminar el token de sesión
            if (estado_e === 1) return data;
            return await this.redisService.remove(String(data._id)).then(() => data);
          });
      } else {
        //eliminar el token de sesión
        if (estado_e === 1) return data;
        return await this.redisService.remove(String(data._id)).then(() => data);
      };
    });
  };
  //funcion para asignar nuevo gestor al tecnico
  async actualizarGestor(tecnicos: string[], gestor: string): Promise<IEmpleado[]> {
    return this.empleadoModel.updateMany({
        _id: { $in: tecnicos } }, { gestor: gestor
      }).then(async(data) => {
        await this.redisService.remove(cache_keys.TECNICOS_GLOBAL);
        return data;
      })
  };
  //funcion para asignar nuevo auditore al tecnico
  async actualizarAuditor(tecnicos: string[], auditor: string): Promise<IEmpleado[]> {
    return this.empleadoModel.updateMany({
        _id: { $in: tecnicos } }, { auditor: auditor
      }).then(async(data) => {
        await this.redisService.remove(cache_keys.TECNICOS_GLOBAL);
        return data;
      })
  };
  //funcion para asignar el tipo de negocio
  async actualizarNegocio(tecnicos: string[], negocio:string): Promise<IEmpleado> {
    if (tipos_negocios.includes(negocio)) {
      return this.empleadoModel.updateMany({_id: { $in: tecnicos } }, { tipo_negocio: negocio }).then(async(data) => {
        await this.redisService.remove(cache_keys.TECNICOS_GLOBAL);
        return data;
      });
    } else {
      throw new HttpException('Negocio fuera de rango', HttpStatus.NOT_FOUND);
    };
  };
  //funcion para asignar el subtipo de negocio
  async actualizarSubNegocio(tecnicos: string[], subNegocio: string): Promise<IEmpleado> {
    if (sub_tipos_negocios.includes(subNegocio)) {
      return this.empleadoModel.updateMany({_id: { $in: tecnicos } }, { sub_tipo_negocio: subNegocio }).then(async(data) => {
        await this.redisService.remove(cache_keys.TECNICOS_GLOBAL);
        return data;
      });
    } else {
      throw new HttpException('Sub Negocio fuera de rango', HttpStatus.NOT_FOUND);
    };
  };
  //cargar las columnas del gestor
  async obtenerColumnasGestor(user:string): Promise<IEmpleado> {
    return await this.empleadoModel.findById(user).select('columnas');
  };
  //guardar las preferencias de las columnas mostradas
  async actualizarColumnasGestor(user:string, columnas: string[]) {
    return await this.empleadoModel.findByIdAndUpdate(user, { columnas }).select('columnas')
  };
}
