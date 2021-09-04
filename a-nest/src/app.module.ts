import {
  flatten,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { ChannelsController } from './channels/channels.controller';
import { ChannelsService } from './channels/channels.service';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/Users';
import { Channels } from './entities/Channels';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import { AuthModule } from './auth/auth.module';
// import dotenv from 'dotenv';
// dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Users,
        Channels,
        ChannelChats,
        ChannelMembers,
        DMs,
        Mentions,
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
    }),
  ],
  controllers: [AppController, ChannelsController],
  providers: [AppService, ChannelsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
