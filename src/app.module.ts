import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import config from './config';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    HttpModule,
    DatabaseModule,
    // ConfigModule sirve para settear las variables de entorno en toda la app cuando isGlobal es true.
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true, // set to true if you want to use the same config for all environments
      // Valida las variables de entorno
      validationSchema: Joi.object({
        API_KEY: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    // Esto es lo mismo que el comentario de abajo
    AppService,
    // {
    //   provide: AppService,
    // useClass sirve para decirle a Nest que use un servicio que ya existe, aunque se puede abreviar
    // usando solo el nombre del servicio, tal como está arriba.
    //   useClass: AppService,
    // },
    // {
    //   provide: 'API_KEY',
    //   // useValue sirve para pasar valores a toda la app.
    //   useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    // },
    {
      provide: 'TASKS',
      // useFactory sirve para trabajar con funciones asincronas.
      useFactory: async (http: HttpService) => {
        const tasks = await http
          .get('https://jsonplaceholder.typicode.com/todos')
          .toPromise();

        // .data porque este HttpService usa Axios por detrás.
        return tasks.data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule { }
