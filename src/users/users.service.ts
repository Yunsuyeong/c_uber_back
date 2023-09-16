import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const existUser = await this.users.findOne({ where: { email } });
      if (existUser) {
        return { ok: false, error: 'There is a user with same Email' };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Could not create an account' };
    }
  }
  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      const isPasswordSame = await user.checkPassword(password);
      if (!isPasswordSame) {
        return { ok: false, error: 'Wrong Password' };
      }
      return { ok: true, token: 'abasdfdsaf' };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
