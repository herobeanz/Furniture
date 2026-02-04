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
      where: { username, isActive: true },
    });
    if (!admin) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });
    const payload = { sub: admin.id, username: admin.username };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    };
  }

  async getMe(adminId: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, isActive: true },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
      },
    });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return admin;
  }
}
