import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import {dataSourceOptions} from './db/data-source'
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import {AppController} from './app.controller'
import {AppService} from './app.service'

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ProductsModule,
    UsersModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
