import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';

const TEST_KEY = 'testKey';
const USER_ID = 1;

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN'),
    verify: jest.fn(() => ({ id: USER_ID })),
  };
});

describe('Jwt Service', () => {
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Should be Defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('sign', () => {
    it('should return a sign token', () => {
      const token = jwtService.sign(1);

      expect(typeof token).toBe('string');

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: USER_ID }, TEST_KEY);
    });
  });

  describe('verify', () => {
    it('should verify a token', () => {
      const TOKEN = 'TOKEN';
      const decodedToken = jwtService.verify(TOKEN);

      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY);

      expect(decodedToken).toEqual({ id: USER_ID });
    });
  });
});
