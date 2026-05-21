import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private percentChange(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private formatChartLabel(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }

  async getDashboard(chartDays = 7) {
    const days = chartDays === 30 ? 30 : 7;
    const now = new Date();
    const todayStart = this.startOfDay(now);

    const weekAgo = new Date(todayStart);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(todayStart);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const monthAgo = new Date(todayStart);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const twoMonthsAgo = new Date(todayStart);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const chartStart = new Date(todayStart);
    chartStart.setDate(chartStart.getDate() - (days - 1));

    const [
      newInquiriesCount,
      newInquiriesThisWeek,
      newInquiriesLastWeek,
      activeProducts,
      productsAddedThisMonth,
      productsAddedLastMonth,
      inquiriesThisWeek,
      inquiriesLastWeek,
      distinctPhones,
      phonesThisMonth,
      phonesLastMonth,
      recentInquiriesRaw,
      latestProductsRaw,
      productsByCategory,
      chartInquiries,
    ] = await Promise.all([
      this.prisma.inquiry.count({ where: { status: 'new' } }),
      this.prisma.inquiry.count({
        where: { created_at: { gte: weekAgo } },
      }),
      this.prisma.inquiry.count({
        where: {
          created_at: { gte: twoWeeksAgo, lt: weekAgo },
        },
      }),
      this.prisma.product.count({ where: { is_active: true } }),
      this.prisma.product.count({
        where: { created_at: { gte: monthAgo } },
      }),
      this.prisma.product.count({
        where: {
          created_at: { gte: twoMonthsAgo, lt: monthAgo },
        },
      }),
      this.prisma.inquiry.count({
        where: { created_at: { gte: weekAgo } },
      }),
      this.prisma.inquiry.count({
        where: {
          created_at: { gte: twoWeeksAgo, lt: weekAgo },
        },
      }),
      this.prisma.inquiry.groupBy({ by: ['phone'], _count: { id: true } }),
      this.prisma.inquiry.findMany({
        where: { created_at: { gte: monthAgo } },
        select: { phone: true },
        distinct: ['phone'],
      }),
      this.prisma.inquiry.findMany({
        where: {
          created_at: { gte: twoMonthsAgo, lt: monthAgo },
        },
        select: { phone: true },
        distinct: ['phone'],
      }),
      this.prisma.inquiry.findMany({
        orderBy: { created_at: 'desc' },
        take: 4,
        include: {
          product: { select: { name: true } },
        },
      }),
      this.prisma.product.findMany({
        orderBy: { created_at: 'desc' },
        take: 4,
        include: {
          category: { select: { name: true } },
        },
      }),
      this.prisma.product.groupBy({
        by: ['category_id'],
        _count: { id: true },
        where: { is_active: true },
      }),
      this.prisma.inquiry.findMany({
        where: { created_at: { gte: chartStart } },
        select: { created_at: true },
      }),
    ]);

    const categoryIds = productsByCategory.map((p) => p.category_id);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const totalInCategory = productsByCategory.reduce(
      (sum, row) => sum + row._count.id,
      0,
    );

    const byCategory = productsByCategory
      .map((row) => {
        const count = row._count.id;
        const name = categoryMap.get(row.category_id) ?? 'Khác';
        return {
          name,
          count,
          percent:
            totalInCategory > 0
              ? Math.round((count / totalInCategory) * 1000) / 10
              : 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    const chartLabels: string[] = [];
    const chartData: number[] = [];
    for (let i = 0; i < days; i++) {
      const day = new Date(chartStart);
      day.setDate(chartStart.getDate() + i);
      chartLabels.push(this.formatChartLabel(day));
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      chartData.push(
        chartInquiries.filter(
          (inq) =>
            inq.created_at >= day && inq.created_at < nextDay,
        ).length,
      );
    }

    const toNumber = (value: { toNumber?: () => number } | number | null) => {
      if (value == null) return 0;
      if (typeof value === 'number') return value;
      return Number(value);
    };

    return {
      cards: {
        newInquiries: {
          value: newInquiriesCount,
          changePercent: this.percentChange(
            newInquiriesThisWeek,
            newInquiriesLastWeek,
          ),
          compareLabel: 'so với tuần trước',
        },
        products: {
          value: activeProducts,
          changePercent: this.percentChange(
            productsAddedThisMonth,
            productsAddedLastMonth,
          ),
          compareLabel: 'sản phẩm mới so với tháng trước',
        },
        weeklyInquiries: {
          value: inquiriesThisWeek,
          changePercent: this.percentChange(
            inquiriesThisWeek,
            inquiriesLastWeek,
          ),
          compareLabel: 'so với tuần trước',
        },
        customers: {
          value: distinctPhones.length,
          changePercent: this.percentChange(
            phonesThisMonth.length,
            phonesLastMonth.length,
          ),
          compareLabel: 'so với tháng trước',
        },
      },
      activityChart: {
        labels: chartLabels,
        data: chartData,
        days,
      },
      recentInquiries: recentInquiriesRaw.map((inq) => ({
        id: inq.id,
        name: inq.name,
        phone: inq.phone,
        message: inq.message,
        status: inq.status,
        productName: inq.product?.name ?? null,
        createdAt: inq.created_at.toISOString(),
      })),
      latestProducts: latestProductsRaw.map((p) => ({
        id: p.id,
        name: p.name,
        categoryName: p.category?.name ?? '—',
        price: toNumber(p.sale_price) || toNumber(p.price),
        isContactPrice: p.is_contact_price,
        thumbnail: p.thumbnail,
        isActive: p.is_active,
        createdAt: p.created_at.toISOString(),
      })),
      productsByCategory: byCategory,
    };
  }

}
