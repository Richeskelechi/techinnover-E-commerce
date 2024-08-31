import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ConfigureService } from './config/config.service';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import { Admin } from './users/admin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigureService],
      useFactory: (configService: ConfigureService) => ({
        dialect: 'mysql',
        host: configService.databaseConfig.host,
        port: configService.databaseConfig.port,
        username: configService.databaseConfig.username,
        password: configService.databaseConfig.password,
        database: configService.databaseConfig.database,
        models: [Product, User, Admin],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
