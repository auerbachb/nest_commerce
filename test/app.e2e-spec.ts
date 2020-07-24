import 'dotenv/config';
import * as request from 'supertest';
import { RegisterDTO, LoginDTO } from 'src/auth/auth.dto';
import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { async } from 'rxjs';

const app = 'http://localhost:3000';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('ROOT', () => {
  it('should ping', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('AUTH', () => {
  it('should register', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password'
    };

    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED)
  });

  it('should reject duplicate registration', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password'
    };

    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
        expect(body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      })
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('should login', () => {
    const user: LoginDTO = {
      username: 'username',
      password: 'password'
    };

    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        console.log(body);
        // expect(body.user.username).toEqual('username');
        // expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED)
  });
});