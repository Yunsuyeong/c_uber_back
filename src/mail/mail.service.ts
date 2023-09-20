import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { IEmailVar, IMailModuleOptions } from './mail.interfaces';
import got from 'got';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: IMailModuleOptions,
  ) {}
  private async sendEmail(
    subject: string,
    template: string,
    emailVars: IEmailVar[],
  ) {
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: 'CUber',
      key: this.options.apiKey,
    });
    const messageData = {
      from: `ysy from CUber <mailgun@${this.options.domain}>`,
      to: 'vanquishr12@gmail.com',
      subject: subject,
      template: template,
      username: 'test',
      code: 'abcd123',
    };

    const response = await client.messages.create(
      this.options.domain,
      messageData,
    );
    console.log('response', response);
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify user email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
