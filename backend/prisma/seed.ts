import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Categories (nested) ---
  const sofaCouches = await prisma.category.upsert({
    where: { slug: 'sofa-couches' },
    update: {},
    create: {
      name: 'Sofa & Couches',
      slug: 'sofa-couches',
      description: 'Sofa và ghế bành cao cấp',
      orderIndex: 0,
    },
  });
  const tables = await prisma.category.upsert({
    where: { slug: 'tables' },
    update: {},
    create: {
      name: 'Tables',
      slug: 'tables',
      description: 'Bàn ăn, bàn trà, bàn làm việc',
      orderIndex: 1,
    },
  });
  const chairs = await prisma.category.upsert({
    where: { slug: 'chairs' },
    update: {},
    create: {
      name: 'Chairs',
      slug: 'chairs',
      description: 'Ghế ăn, ghế văn phòng, ghế trang trí',
      orderIndex: 2,
    },
  });

  const livingRoomSofas = await prisma.category.upsert({
    where: { slug: 'living-room-sofas' },
    update: {},
    create: {
      name: 'Living Room Sofas',
      slug: 'living-room-sofas',
      parentId: sofaCouches.id,
      orderIndex: 0,
    },
  });
  const sectionalSofas = await prisma.category.upsert({
    where: { slug: 'sectional-sofas' },
    update: {},
    create: {
      name: 'Sectional Sofas',
      slug: 'sectional-sofas',
      parentId: sofaCouches.id,
      orderIndex: 1,
    },
  });
  const diningTables = await prisma.category.upsert({
    where: { slug: 'dining-tables' },
    update: {},
    create: {
      name: 'Dining Tables',
      slug: 'dining-tables',
      parentId: tables.id,
      orderIndex: 0,
    },
  });
  const coffeeTables = await prisma.category.upsert({
    where: { slug: 'coffee-tables' },
    update: {},
    create: {
      name: 'Coffee Tables',
      slug: 'coffee-tables',
      parentId: tables.id,
      orderIndex: 1,
    },
  });
  const diningChairs = await prisma.category.upsert({
    where: { slug: 'dining-chairs' },
    update: {},
    create: {
      name: 'Dining Chairs',
      slug: 'dining-chairs',
      parentId: chairs.id,
      orderIndex: 0,
    },
  });
  const officeChairs = await prisma.category.upsert({
    where: { slug: 'office-chairs' },
    update: {},
    create: {
      name: 'Office Chairs',
      slug: 'office-chairs',
      parentId: chairs.id,
      orderIndex: 1,
    },
  });

  console.log('  ✓ Categories');

  // --- Products ---
  const productData = [
    {
      name: 'Sofa da cao cấp 3 chỗ',
      slug: 'sofa-da-cao-cap-3-cho',
      shortDescription: 'Sofa da bò Ý, thiết kế hiện đại, êm ái',
      description: 'Sofa 3 chỗ làm từ da bò Ý nhập khẩu. Khung gỗ sồi chắc chắn, đệm mút cao cấp. Phù hợp phòng khách 15–25m².',
      price: 18900000,
      comparePrice: 22900000,
      sku: 'SOFA-3C-001',
      categoryId: livingRoomSofas.id,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
      stockQuantity: 10,
      weight: 85,
      dimensions: '220x95x88 cm',
      material: 'Da bò Ý, gỗ sồi',
      color: 'Nâu đậm',
    },
    {
      name: 'Sofa góc Sectional L-shaped',
      slug: 'sofa-goc-sectional-l-shaped',
      shortDescription: 'Sofa góc chữ L, bọc vải nỉ, nhiều màu',
      description: 'Sofa góc kiểu Sectional chữ L. Bọc vải nỉ chống bám bụi, dễ vệ sinh. Có thể tách module linh hoạt.',
      price: 25900000,
      comparePrice: 29900000,
      sku: 'SOFA-SEC-002',
      categoryId: sectionalSofas.id,
      images: ['https://images.unsplash.com/photo-1491926626787-62db157af940?w=800'],
      stockQuantity: 5,
      weight: 120,
      dimensions: '280x180x90 cm',
      material: 'Vải nỉ, khung gỗ',
      color: 'Xám',
    },
    {
      name: 'Bàn ăn gỗ sồi 6 chỗ',
      slug: 'ban-an-go-soi-6-cho',
      shortDescription: 'Bàn ăn gỗ sồi tự nhiên, mặt bàn dày 3cm',
      description: 'Bàn ăn gỗ sồi nguyên tấm. Mặt bàn dày 3cm, chân gỗ chắc chắn. Phù hợp gia đình 4–6 người.',
      price: 12500000,
      comparePrice: 14900000,
      sku: 'TABLE-DIN-001',
      categoryId: diningTables.id,
      images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'],
      stockQuantity: 8,
      weight: 45,
      dimensions: '180x90x76 cm',
      material: 'Gỗ sồi tự nhiên',
      color: 'Vân gỗ tự nhiên',
    },
    {
      name: 'Bàn trà gỗ MDF phong cách Bắc Âu',
      slug: 'ban-tra-go-mdf-phong-cach-bac-au',
      shortDescription: 'Bàn trà nhỏ gọn, 2 ngăn kéo',
      description: 'Bàn trà thiết kế Bắc Âu. Khung chân kim loại sơn tĩnh điện, mặt MDF phủ melamine chống trầy.',
      price: 2900000,
      comparePrice: 3500000,
      sku: 'TABLE-COF-001',
      categoryId: coffeeTables.id,
      images: ['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800'],
      stockQuantity: 20,
      weight: 15,
      dimensions: '120x60x45 cm',
      material: 'MDF, kim loại',
      color: 'Trắng',
    },
    {
      name: 'Ghế ăn gỗ óc chó 1 chỗ',
      slug: 'ghe-an-go-oc-cho-1-cho',
      shortDescription: 'Ghế ăn gỗ óc chó, đệm ngồi bọc da',
      description: 'Ghế ăn 1 chỗ. Khung gỗ óc chó, đệm ngồi bọc da công nghiệp. Đi kèm bộ 4 hoặc 6 chiếc.',
      price: 1850000,
      comparePrice: 2200000,
      sku: 'CHAIR-DIN-001',
      categoryId: diningChairs.id,
      images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'],
      stockQuantity: 30,
      weight: 8,
      dimensions: '48x52x88 cm',
      material: 'Gỗ óc chó, da công nghiệp',
      color: 'Nâu',
    },
    {
      name: 'Ghế văn phòng ergonomic',
      slug: 'ghe-van-phong-ergonomic',
      shortDescription: 'Ghế văn phòng chỉnh độ cao, tựa lưng và tay',
      description: 'Ghế văn phòng thiết kế ergonomic. Chỉnh chiều cao, tựa lưng, tay vịn. Lưới thoáng khí, phù hợp ngồi lâu.',
      price: 4200000,
      comparePrice: 4990000,
      sku: 'CHAIR-OFF-001',
      categoryId: officeChairs.id,
      images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'],
      stockQuantity: 15,
      weight: 18,
      dimensions: '65x65x120 cm',
      material: 'Lưới mesh, khung kim loại',
      color: 'Đen',
    },
  ];

  for (const p of productData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        price: p.price,
        comparePrice: p.comparePrice,
        weight: p.weight,
      },
    });
  }
  console.log('  ✓ Products');

  // --- CMS Pages ---
  const cmsPages = [
    {
      slug: 'about',
      title: 'Về chúng tôi',
      content: `<h1>Về chúng tôi</h1><p>Furniture Store chuyên cung cấp nội thất gia đình và văn phòng với chất lượng cao, thiết kế hiện đại.</p><p>Liên hệ: support@furniture-store.vn</p>`,
      metaTitle: 'Về chúng tôi - Furniture Store',
      metaDescription: 'Giới thiệu về Furniture Store, cửa hàng nội thất uy tín.',
    },
    {
      slug: 'privacy-policy',
      title: 'Chính sách bảo mật',
      content: `<h1>Chính sách bảo mật</h1><p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu chỉ dùng để xử lý đơn hàng và liên hệ.</p>`,
      metaTitle: 'Chính sách bảo mật',
      metaDescription: 'Chính sách bảo mật thông tin tại Furniture Store.',
    },
    {
      slug: 'terms',
      title: 'Điều khoản sử dụng',
      content: `<h1>Điều khoản sử dụng</h1><p>Khi sử dụng website, bạn đồng ý với các điều khoản của chúng tôi. Vui lòng đọc kỹ trước khi gửi yêu cầu.</p>`,
      metaTitle: 'Điều khoản sử dụng',
      metaDescription: 'Điều khoản và điều kiện sử dụng website Furniture Store.',
    },
  ];

  for (const page of cmsPages) {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log('  ✓ CMS Pages');

  // --- Admin (password: admin123) ---
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@furniture-store.vn',
      passwordHash: hashedPassword,
      fullName: 'Administrator',
      role: 'super_admin',
    },
  });
  console.log('  ✓ Admin (username: admin, password: admin123)');

  // --- Sample Inquiries ---
  const products = await prisma.product.findMany({ take: 2 });
  if (products.length >= 2) {
    const count = await prisma.inquiry.count();
    if (count === 0) {
      await prisma.inquiry.create({
        data: {
          name: 'Nguyễn Văn A',
          phone: '0901234567',
          email: 'nguyenvana@example.com',
          message: 'Tôi muốn đặt mua sofa 3 chỗ và bàn trà. Có giao hàng nội thành không?',
          productIds: [products[0].id, products[1].id],
          status: 'pending',
          source: 'website',
        },
      });
    }
  }
  console.log('  ✓ Inquiries');

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
