import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalRooms,
      totalCategories,
      totalProducts,
      totalInquiries,
      totalCollections,
      totalCmsPages,
      newInquiries,
      activeProducts,
    ] = await Promise.all([
      this.prisma.room.count({ where: { is_active: true } }),
      this.prisma.category.count({ where: { is_active: true } }),
      this.prisma.product.count({ where: { is_active: true } }),
      this.prisma.inquiry.count(),
      this.prisma.collection.count({ where: { is_active: true } }),
      this.prisma.cmsPage.count({ where: { is_active: true } }),
      this.prisma.inquiry.count({
        where: {
          status: 'new',
        },
      }),
      this.prisma.product.count({
        where: {
          is_active: true,
        },
      }),
    ]);

    // Get inquiries by status
    const inquiriesByStatus = await this.prisma.inquiry.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const statusCounts = inquiriesByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get recent inquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentInquiries = await this.prisma.inquiry.count({
      where: {
        created_at: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get inquiries by source
    const inquiriesBySource = await this.prisma.inquiry.groupBy({
      by: ['source'],
      _count: {
        id: true,
      },
    });

    const sourceCounts = inquiriesBySource.reduce(
      (acc, item) => {
        acc[item.source] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totals: {
        rooms: totalRooms,
        categories: totalCategories,
        products: totalProducts,
        inquiries: totalInquiries,
        collections: totalCollections,
        cmsPages: totalCmsPages,
      },
      inquiries: {
        total: totalInquiries,
        new: newInquiries,
        recent: recentInquiries,
        byStatus: statusCounts,
        bySource: sourceCounts,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
      },
    };
  }

  async getInquiriesStats() {
    const total = await this.prisma.inquiry.count();

    const byStatus = await this.prisma.inquiry.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const bySource = await this.prisma.inquiry.groupBy({
      by: ['source'],
      _count: {
        id: true,
      },
    });

    // Last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last30Days = await this.prisma.inquiry.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7Days = await this.prisma.inquiry.count({
      where: {
        created_at: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      total,
      last30Days,
      last7Days,
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
      bySource: bySource.reduce(
        (acc, item) => {
          acc[item.source] = item._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async getProductsStats() {
    const total = await this.prisma.product.count();
    const active = await this.prisma.product.count({
      where: { is_active: true },
    });
    const inactive = total - active;

    // Products by room
    const productsByRoom = await this.prisma.product.groupBy({
      by: ['category_id'],
      _count: {
        id: true,
      },
    });

    // Get category and room info
    const categoryIds = productsByRoom.map((p) => p.category_id);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      include: { room: true },
    });

    const byRoom = categories.reduce(
      (acc, cat) => {
        const count = productsByRoom.find((p) => p.category_id === cat.id)?._count.id || 0;
        const roomName = cat.room.name;
        acc[roomName] = (acc[roomName] || 0) + count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      active,
      inactive,
      byRoom,
    };
  }
}
