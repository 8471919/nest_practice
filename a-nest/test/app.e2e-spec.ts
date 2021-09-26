import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import passport from 'passport';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(passport.initialize());
    app.use(passport.session());
    await app.init();
  });

  it('/users/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/users/login')
      .send({ email: '8471919@naver.com', password: '1234' })
      .expect(200)
      .expect('Hello World!');
  });
});
