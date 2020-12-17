import { PartialType } from '@nestjs/mapped-types';
import { CreateContrataDto } from './create-contrata.dto';

export class UpdateContrataDto extends PartialType(CreateContrataDto) {}
