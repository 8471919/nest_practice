import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { bcrypt } from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  getUser() {}
  async join(email: string, nickname: string, password: string) {
    //아래의 것들은 DTO에서 자동으로 체크가 가능하다.
    if (!email) {
      //이메일 없다고 에러
      throw new Error('이메일이 없네요.');
    }
    if (!nickname) {
      //닉네임 없다고 에러
      throw new Error('닉네임이 없네요.');
    }
    if (!password) {
      //비밀번호 없다고 에러
      throw new Error('빔밀번호가 없네요.');
    }

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      //이미 존재하는 유저라고 에러
      //throw는 return기능도 같이 수행
      throw new Error('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
