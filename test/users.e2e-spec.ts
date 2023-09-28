import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from 'src/users/entities/verification.entity';

const GRAPHQL_ENDPOINT = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let usersRepository: Repository<User>;
  let verificationRepository: Repository<Verification>;

  const TestQuery = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const PublicTest = (query: string) => TestQuery().send({ query });
  const PrivateTest = (query: string) =>
    TestQuery().set('x-jwt', token).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    await app.init();
  });

  afterAll(async () => {
    const dataSource: DataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const connection: DataSource = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    app.close();
  });

  describe('createAccount', () => {
    it('should create a new user', () => {
      return PublicTest(`
          mutation {
            createAccount(input: {
              email:"asdfsd@nad.com",
              password: "1234",
              role: Owner
            }){
              ok
              error
            }
          }`)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { createAccount },
            },
          } = res;
          expect(createAccount.ok).toBe(true);
          expect(createAccount.error).toBe(null);
        });
    });
    it('should fail if user exists', () => {
      return PublicTest(`
          mutation {
            createAccount(input: {
              email:"asdfsd@nad.com",
              password: "1234",
              role: Owner
            }){
              ok
              error
            }
          }`)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { createAccount },
            },
          } = res;
          expect(createAccount.ok).toBe(false);
          expect(createAccount.error).toBe('There is a user with same Email');
        });
    });
  });

  describe('login', () => {
    it('should get token if password is same', () => {
      return PublicTest(`
            mutation {
              login(input: {
                email:"asdfsd@nad.com",
                password: "1234",
              }) {
                ok
                error
                token
              }
            }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          token = login.token;
        });
    });

    it('should fail if password is wrong', () => {
      return PublicTest(`
            mutation {
              login(input: {
                email:"asdfsd@nad.com",
                password: "xxx",
              }) {
                ok
                error
                token
              }
            }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('Wrong Password');
          expect(login.token).toEqual(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });

    it('should find user profile', () => {
      return PrivateTest(`
            {
            userProfile(userId:${userId}){
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });
    it('should not find user profile', () => {
      return PrivateTest(`
            {
            userProfile(userId:11){
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('User not found');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return PrivateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe('asdfsd@nad.com');
        });
    }, 10000);

    it('should not find my profile', () => {
      return PublicTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    it('should edit email', () => {
      const NEW_EMAIL = 'abc@def.com';
      return PrivateTest(`
            mutation {
              editProfile(input: {
                email:"${NEW_EMAIL}"
              }) {
                ok
                error
              }
            }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        })
        .then(() => {
          return PrivateTest(`
          {
            me {
              email
            }
          }
        `)
            .expect(200)
            .expect((res) => {
              const {
                body: {
                  data: {
                    me: { email },
                  },
                },
              } = res;
              expect(email).toBe(NEW_EMAIL);
            });
        });
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] = await verificationRepository.find();
      verificationCode = verification.code;
    });
    it('should verify email', () => {
      return PublicTest(`
            mutation {
              verifyEmail(input: {
                code:"${verificationCode}"
              }) {
                ok
                error
              }
            }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail on wrong verification code', () => {
      return PublicTest(`
            mutation {
              verifyEmail(input: {
                code:"abc"
              }) {
                ok
                error
              }
            }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('Verification not Found');
        });
    });
  });
});
