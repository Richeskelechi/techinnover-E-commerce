import { config } from 'src/config/config';
import { DataSource, DataSourceOptions } from 'typeorm';
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: config.mysql.connection.host,
  username: config.mysql.connection.username,
  password: config.mysql.connection.password,
  database: config.mysql.connection.database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  charset: 'utf8mb4',
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;