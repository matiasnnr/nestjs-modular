import { Module, Global } from '@nestjs/common';

const API_KEY = '12345$$';
const API_KEY_PROD = 'Prod12345$$';

// Con Global le decimos a este módulo que todo lo que esté dentro será global.
// Es muy útil para poder usar una misma instancia de la base de datos en todos los módulos.
// O para pasar a través de los providers cualquier valor que se vaya a usar en toda la app.
@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      // useValue sirve para pasar valores a toda la app.
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
  ],
  // mediante exports podemos exportar este provider a cualquier módulo que queramos.
  exports: ['API_KEY'],
})
export class DatabaseModule { }
