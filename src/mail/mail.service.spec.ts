import { MailService } from './mail.service';
import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '../common/common.constants';
import FormData from 'form-data';

const TEST_DOMAIN = 'test-domain';

jest.mock('form-data');

describe('Mail Service', () => {
  let mailService: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apikey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-fromEmail',
          },
        },
      ],
    }).compile();
    mailService = module.get<MailService>(MailService);
  });

  it('should be Defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('Should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };
      jest.spyOn(mailService, 'sendEmail').mockImplementation(async () => {
        return true;
      });
      mailService.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      expect(mailService.sendEmail).toHaveBeenCalledTimes(1);
      /* expect(mailService.sendEmail).toHaveBeenCalledWith(
        'Verify user email',
        'verify-email',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      ); */
    });
  });

  /* describe('sendEmail', () => {
    it('Should send a email', async () => {
      const ok = await mailService.sendEmail('', '', []);
      const formSpy = jest.spyOn(FormData.prototype, 'append');
      expect(formSpy).toHaveBeenCalled();

      expect(ok).toEqual(true);
    });
  }); */
});
