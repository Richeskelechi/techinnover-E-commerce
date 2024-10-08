import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomThrottlerGuard } from './request-guard'

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 25,
    }]),
    TypeOrmModule.forRoot(dataSourceOptions),
    ProductsModule,
    UsersModule,
    AdminsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
