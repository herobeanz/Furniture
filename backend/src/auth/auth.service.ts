import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { username, is_active: true },
    });
    if (!admin) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }
    const match = await bcrypt.compare(password, admin.passwordhashed);
    if (!match) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { last_login_at: new Date() },
    });
    const payload = { sub: admin.id, username: admin.username };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullname: admin.fullname,
        role: admin.role,
      },
    };
  }

  async getMe(adminId: number) {
    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, is_active: true },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        role: true,
      },
    });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return admin;
  }
}
