import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // TODO: Hash the passwords
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsernameForLogin(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
