import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { CreateContrataDto } from './dto/create-contrata.dto';
import { UpdateContrataDto } from './dto/update-contrata.dto';
import { IContrata } from './interfaces/contrata.interface';

@Injectable()
export class ContratasService {
  constructor (
    @InjectModel('Contrata') private readonly contrataModel: PaginateModel<IContrata>
  ){}

  async crearContrata(createContrataDto: CreateContrataDto) {
    const nuevaContrata = new this.contrataModel(createContrataDto);
    return await nuevaContrata.save();
  };

  async listaTodo() {
    return await this.contrataModel.find().sort('nombre');
  };

  async listaNombres() {
    return await this.contrataModel.find({ activo: true }).sort('nombre').select('nombre')
  }

  async actualizarContrata(id: string, updateContrataDto: UpdateContrataDto) {
    return await this.contrataModel.findByIdAndUpdate(id, { $set: updateContrataDto });
  };

  async desactivarContrata(id: string, activo: boolean, fecha_baja: Date) {
    const fb = fecha_baja && !activo ? fecha_baja : null
    return await this.contrataModel.findByIdAndUpdate(id, { $set: { activo, fecha_baja: fb } });
  };
}
