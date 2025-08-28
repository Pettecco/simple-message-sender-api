import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES),
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Sincroniza com o DB. Não deve ser usado em produção!
    }),
    MessageModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
