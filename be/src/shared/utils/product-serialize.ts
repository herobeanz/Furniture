import { Decimal } from '@prisma/client/runtime/library';

function toNumber(value: Decimal | null | undefined): number | undefined {
  if (value == null) return undefined;
  return Number(value);
}

/** Payload gọn cho danh sách / related — không trả HTML description đầy đủ. */
export function serializeProductListItem(p: {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description?: string | null;
  shortDescription?: string | null;
  price: Decimal | null;
  sale_price?: Decimal | null;
  salePrice?: Decimal | null;
  category_id?: number | null;
  categoryId?: number | null;
  thumbnail?: string | null;
  status: string;
  material?: string | null;
  color?: string | null;
  is_contact_price?: boolean | null;
  isContactPrice?: boolean | null;
  sold_count?: number | null;
  soldCount?: number | null;
  rating?: Decimal | null;
  is_active?: boolean | null;
  isActive?: boolean | null;
  is_featured?: boolean | null;
  isFeatured?: boolean | null;
  is_hot?: boolean | null;
  isHot?: boolean | null;
  is_daily_flash_sale?: boolean | null;
  isDailyFlashSale?: boolean | null;
  flash_sale_end_at?: Date | null;
  flashSaleEndAt?: Date | null;
  sort_order?: number | null;
  sortOrder?: number | null;
  created_at?: Date | null;
  createdAt?: Date | null;
  images?: { image_url?: string | null; imageUrl?: string | null }[];
}) {
  const imageUrls =
    p.images?.map((img) => img.image_url ?? img.imageUrl).filter(Boolean) ?? [];
  const thumbnail = p.thumbnail ?? imageUrls[0] ?? undefined;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    shortDescription: p.short_description ?? p.shortDescription ?? undefined,
    price: toNumber(p.price) ?? 0,
    salePrice: toNumber(p.sale_price ?? p.salePrice),
    categoryId: p.category_id ?? p.categoryId,
    thumbnail,
    status: p.status,
    material: p.material ?? undefined,
    color: p.color ?? undefined,
    isContactPrice: p.is_contact_price ?? p.isContactPrice ?? false,
    soldCount: p.sold_count ?? p.soldCount ?? 0,
    rating: toNumber(p.rating ?? null),
    isActive: p.is_active ?? p.isActive,
    isFeatured: p.is_featured ?? p.isFeatured,
    isHot: p.is_hot ?? p.isHot,
    isDailyFlashSale: p.is_daily_flash_sale ?? p.isDailyFlashSale ?? false,
    flashSaleEndAt:
      (p.flash_sale_end_at ?? p.flashSaleEndAt)?.toISOString?.() ?? null,
    images: thumbnail ? [thumbnail] : imageUrls.slice(0, 1),
    sortOrder: p.sort_order ?? p.sortOrder ?? 0,
    createdAt:
      (p.created_at ?? p.createdAt)?.toISOString?.() ?? undefined,
  };
}
