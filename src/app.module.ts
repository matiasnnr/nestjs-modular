import { HttpModule, HttpService, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

const API_KEY = '12345$$';
const API_KEY_PROD = 'Prod12345$$';
@Module({
  imports: [UsersModule, ProductsModule, HttpModule],
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
    {
      provide: 'API_KEY',
      // useValue sirve para pasar valores a toda la app.
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
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
