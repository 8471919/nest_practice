import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChannelChats } from './src/entities/ChannelChats';
import { ChannelMembers } from './src/entities/ChannelMembers';
import { Channels } from './src/entities/Channels';
import { DMs } from './src/entities/DMs';
import { Mentions } from './src/entities/Mentions';
import { Users } from './src/entities/Users';
import { WorkspaceMembers } from './src/entities/WorkspaceMembers';
import { Workspaces } from './src/entities/Workspaces';
import dotenv from 'dotenv';

dotenv.config();
const ORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username:
    process.env.NODE_ENV === 'test' ? 'testuser' : process.env.DB_USERNAME,
  password:
    process.env.NODE_ENV === 'test' ? 'testpass' : process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'test' ? 'testdb' : process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ], //['entities/*.ts'], //아예 하나씩 다 import해도됨
  // autoLoadEntities: true, //버그가 있음. 직접 entity를 임포트하자.
  synchronize: false, //개발환경일 때만(그때도 처음 돌릴때만 true) true, data가 손실될 수 있다.
  logging: true, //개발할 때 query문을 볼 수 있게 하기위해 로깅을 true로 둔다.
  // migrations: [__dirname + "src/migrations/*.ts"],
  // cli: { migrationDir: 'src/migrations'},
  // charset: 'utf8mb4',
  keepConnectionAlive: true, //서버재시작(핫리로딩사용시)시 typeorm이 db연결을 유지하게 하기 위해서 true로 해둔다.
};

export = ORMConfig;
