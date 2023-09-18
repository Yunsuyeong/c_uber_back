import { Inject, Injectable } from '@nestjs/common';
import { IJwtModuleOptions } from './interfaces/jwt-module-options.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: IJwtModuleOptions,
  ) {}
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
}
