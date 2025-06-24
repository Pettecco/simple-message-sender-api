import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '123456',
      autoLoadEntities: true, //Carrega entidades sem precisar especifica-las
      synchronize: true, // Sincroniza com o DB. Não deve ser usado em produção!
    }),
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
