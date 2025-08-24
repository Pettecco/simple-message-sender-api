import { DynamicModule, Module } from '@nestjs/common';

export interface MyDynamicModuleConfigs {
  apiKey: string;
  apiUrl: string;
}

export const MY_DYNAMIC_CONFIG = 'MY_DYNAMIC_CONFIG';

@Module({})
export class MyDynamicModule {
  static register(myModuleConfigs: MyDynamicModuleConfigs): DynamicModule {
    return {
      module: MyDynamicModule,
      imports: [],
      controllers: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIG,
          useValue: myModuleConfigs,
        },
      ],
      exports: [MY_DYNAMIC_CONFIG],
    };
  }
}
