import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async join(email: string, nickname: string, password: string) {
    // //아래의 것들은 DTO에서 자동으로 체크가 가능하다.
    // if (!email) {
    //   //이메일 없다고 에러
    //   throw new HttpException('이메일이 없네요.', 400);
    // }
    // if (!nickname) {
    //   //닉네임 없다고 에러
    //   throw new HttpException('닉네임이 없네요.', 400);
    // }
    // if (!password) {
    //   //비밀번호 없다고 에러
    //   throw new BadRequestException('비밀번호가 없네요.');
    // }

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      //이미 존재하는 유저라고 에러
      //throw는 return기능도 같이 수행
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const returned = await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    //슬랙에 회원가입하면 기본적으로 생성되는 채널과 워크스페이스를 연결해준다.
    await this.workspaceMembersRepository.save({
      UserId: returned.id,
      WorkspaceId: 1,
    });
    await this.channelMembersRepository.save({
      UserId: returned.id,
      ChannelId: 1,
    });

    return true;
  }
}
