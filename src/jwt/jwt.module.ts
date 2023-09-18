import { DynamicModule, Global, Module } from '@nestjs/common';
import { IJwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';
import { CONFIG_OPTIONS } from './jwt.constants';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: IJwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, JwtService],
    };
  }
}
