import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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
    this.logger.log(`Admin login: ${admin.username}`);
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
        last_login_at: true,
      },
    });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return admin;
  }

  async updateProfile(adminId: number, dto: { email?: string; fullname?: string }) {
    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, is_active: true },
    });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    const updateData: { email?: string; fullname?: string } = {};
    if (dto.email !== undefined) {
      // Check if email is already taken by another admin
      const existingAdmin = await this.prisma.admin.findFirst({
        where: {
          email: dto.email,
          id: { not: adminId },
        },
      });
      if (existingAdmin) {
        throw new UnauthorizedException('Email đã được sử dụng bởi tài khoản khác');
      }
      updateData.email = dto.email;
    }
    if (dto.fullname !== undefined) {
      updateData.fullname = dto.fullname;
    }

    const updated = await this.prisma.admin.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        role: true,
      },
    });

    return updated;
  }

  async changePassword(adminId: number, currentPassword: string, newPassword: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, is_active: true },
    });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    // Verify current password
    const match = await bcrypt.compare(currentPassword, admin.passwordhashed);
    if (!match) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { passwordhashed: hashedPassword },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }
}
