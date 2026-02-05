import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Hero: 4 phòng chính (Rooms) ---
  const HERO_IMAGES = {
    phongKhach: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    phongNgu: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    phongBep: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    phongTho: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  };

  // --- Rooms (Phòng) ---
  const phongKhach = await prisma.room.upsert({
    where: { slug: 'phong-khach' },
    update: { thumbnail: HERO_IMAGES.phongKhach },
    create: {
      name: 'Phòng khách',
      slug: 'phong-khach',
      description: 'Sofa, bàn trà, kệ tivi, ghế bành cho phòng khách',
      thumbnail: HERO_IMAGES.phongKhach,
      order_index: 0,
    },
  });
  const phongNgu = await prisma.room.upsert({
    where: { slug: 'phong-ngu' },
    update: { thumbnail: HERO_IMAGES.phongNgu },
    create: {
      name: 'Phòng ngủ',
      slug: 'phong-ngu',
      description: 'Giường, tủ quần áo, bàn trang điểm cho phòng ngủ',
      thumbnail: HERO_IMAGES.phongNgu,
      order_index: 1,
    },
  });
  const phongBep = await prisma.room.upsert({
    where: { slug: 'phong-bep' },
    update: { thumbnail: HERO_IMAGES.phongBep },
    create: {
      name: 'Phòng bếp',
      slug: 'phong-bep',
      description: 'Bàn ăn, ghế ăn, kệ bếp cho phòng bếp',
      thumbnail: HERO_IMAGES.phongBep,
      order_index: 2,
    },
  });
  const phongTho = await prisma.room.upsert({
    where: { slug: 'phong-tho' },
    update: { thumbnail: HERO_IMAGES.phongTho },
    create: {
      name: 'Phòng thờ',
      slug: 'phong-tho',
      description: 'Bàn thờ, kệ thờ, tủ thờ',
      thumbnail: HERO_IMAGES.phongTho,
      order_index: 3,
    },
  });

  console.log('  ✓ Rooms');

  // --- Categories (Danh mục trong mỗi phòng) ---
  // Phòng khách: Sofa, Bàn trà
  const sofaCouches = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongKhach.id, slug: 'sofa-couches' } },
    update: {},
    create: {
      name: 'Sofa & Ghế bành',
      slug: 'sofa-couches',
      description: 'Sofa và ghế bành cao cấp',
      room_id: phongKhach.id,
      order_index: 0,
    },
  });
  const coffeeTables = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongKhach.id, slug: 'coffee-tables' } },
    update: {},
    create: {
      name: 'Bàn trà',
      slug: 'coffee-tables',
      description: 'Bàn trà, bàn kệ phòng khách',
      room_id: phongKhach.id,
      order_index: 1,
    },
  });

  // Phòng bếp: Bàn ăn, Ghế ăn
  const diningTables = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongBep.id, slug: 'dining-tables' } },
    update: {},
    create: {
      name: 'Bàn ăn',
      slug: 'dining-tables',
      description: 'Bàn ăn, bàn làm việc',
      room_id: phongBep.id,
      order_index: 0,
    },
  });
  const diningChairs = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongBep.id, slug: 'dining-chairs' } },
    update: {},
    create: {
      name: 'Ghế ăn',
      slug: 'dining-chairs',
      description: 'Ghế ăn, ghế văn phòng',
      room_id: phongBep.id,
      order_index: 1,
    },
  });

  // Phòng ngủ: Giường, Tủ quần áo
  const giuong = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongNgu.id, slug: 'giuong' } },
    update: {},
    create: {
      name: 'Giường',
      slug: 'giuong',
      description: 'Giường ngủ, giường tầng',
      room_id: phongNgu.id,
      order_index: 0,
    },
  });
  const tuQuanAo = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongNgu.id, slug: 'tu-quan-ao' } },
    update: {},
    create: {
      name: 'Tủ quần áo',
      slug: 'tu-quan-ao',
      description: 'Tủ quần áo, tủ có gương',
      room_id: phongNgu.id,
      order_index: 1,
    },
  });

  // Phòng thờ: Bàn thờ, Kệ thờ
  const banTho = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongTho.id, slug: 'ban-tho' } },
    update: {},
    create: {
      name: 'Bàn thờ',
      slug: 'ban-tho',
      description: 'Bàn thờ, tủ thờ',
      room_id: phongTho.id,
      order_index: 0,
    },
  });
  const keTho = await prisma.category.upsert({
    where: { room_id_slug: { room_id: phongTho.id, slug: 'ke-tho' } },
    update: {},
    create: {
      name: 'Kệ thờ',
      slug: 'ke-tho',
      description: 'Kệ thờ, kệ tam cấp',
      room_id: phongTho.id,
      order_index: 1,
    },
  });

  console.log('  ✓ Categories');

  // --- Products ---
  const productData = [
    {
      name: 'Sofa da cao cấp 3 chỗ',
      slug: 'sofa-da-cao-cap-3-cho',
      sku: 'SOFA-3C-001',
      shortDescription: 'Sofa da bò Ý, thiết kế hiện đại, êm ái',
      description: 'Sofa 3 chỗ làm từ da bò Ý nhập khẩu. Khung gỗ sồi chắc chắn, đệm mút cao cấp. Phù hợp phòng khách 15–25m².',
      price: 18900000,
      salePrice: 22900000,
      categoryId: sofaCouches.id,
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      material: 'Da bò Ý, gỗ sồi',
      dimensions: '220x95x88 cm',
      color: 'Nâu đậm',
      warranty: '2 năm',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
    },
    {
      name: 'Sofa góc Sectional L-shaped',
      slug: 'sofa-goc-sectional-l-shaped',
      sku: 'SOFA-SEC-002',
      shortDescription: 'Sofa góc chữ L, bọc vải nỉ, nhiều màu',
      description: 'Sofa góc kiểu Sectional chữ L. Bọc vải nỉ chống bám bụi, dễ vệ sinh. Có thể tách module linh hoạt.',
      price: 25900000,
      salePrice: 29900000,
      categoryId: sofaCouches.id,
      thumbnail: 'https://images.unsplash.com/photo-1491926626787-62db157af940?w=800',
      material: 'Vải nỉ, khung gỗ',
      dimensions: '280x180x90 cm',
      color: 'Xám',
      warranty: '2 năm',
      images: ['https://images.unsplash.com/photo-1491926626787-62db157af940?w=800'],
    },
    {
      name: 'Bàn ăn gỗ sồi 6 chỗ',
      slug: 'ban-an-go-soi-6-cho',
      sku: 'TABLE-DIN-001',
      shortDescription: 'Bàn ăn gỗ sồi tự nhiên, mặt bàn dày 3cm',
      description: 'Bàn ăn gỗ sồi nguyên tấm. Mặt bàn dày 3cm, chân gỗ chắc chắn. Phù hợp gia đình 4–6 người.',
      price: 12500000,
      salePrice: 14900000,
      categoryId: diningTables.id,
      thumbnail: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
      material: 'Gỗ sồi tự nhiên',
      dimensions: '180x90x76 cm',
      color: 'Vân gỗ tự nhiên',
      warranty: '1 năm',
      images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'],
    },
    {
      name: 'Bàn trà gỗ MDF phong cách Bắc Âu',
      slug: 'ban-tra-go-mdf-phong-cach-bac-au',
      sku: 'TABLE-COF-001',
      shortDescription: 'Bàn trà nhỏ gọn, 2 ngăn kéo',
      description: 'Bàn trà thiết kế Bắc Âu. Khung chân kim loại sơn tĩnh điện, mặt MDF phủ melamine chống trầy.',
      price: 2900000,
      salePrice: 3500000,
      categoryId: coffeeTables.id,
      thumbnail: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
      material: 'MDF, kim loại',
      dimensions: '120x60x45 cm',
      color: 'Trắng',
      warranty: '6 tháng',
      images: ['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800'],
    },
    {
      name: 'Ghế ăn gỗ óc chó 1 chỗ',
      slug: 'ghe-an-go-oc-cho-1-cho',
      sku: 'CHAIR-DIN-001',
      shortDescription: 'Ghế ăn gỗ óc chó, đệm ngồi bọc da',
      description: 'Ghế ăn 1 chỗ. Khung gỗ óc chó, đệm ngồi bọc da công nghiệp. Đi kèm bộ 4 hoặc 6 chiếc.',
      price: 1850000,
      salePrice: 2200000,
      categoryId: diningChairs.id,
      thumbnail: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      material: 'Gỗ óc chó, da công nghiệp',
      dimensions: '48x52x88 cm',
      color: 'Nâu',
      warranty: '6 tháng',
      images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'],
    },
    {
      name: 'Giường ngủ gỗ sồi 1m6',
      slug: 'giuong-ngu-go-soi-1m6',
      sku: 'BED-001',
      shortDescription: 'Giường một giường gỗ sồi, đầu giường có tủ',
      description: 'Giường ngủ kích thước 1m6 x 2m. Khung gỗ sồi tự nhiên, đầu giường thiết kế có hộc tủ. Chân chắc chắn, dễ vệ sinh.',
      price: 12500000,
      salePrice: 14900000,
      categoryId: giuong.id,
      thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      material: 'Gỗ sồi',
      dimensions: '160x200x95 cm',
      color: 'Vân gỗ',
      warranty: '2 năm',
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
    },
    {
      name: 'Tủ quần áo 3 cánh có gương',
      slug: 'tu-quan-ao-3-canh-co-guong',
      sku: 'WARD-001',
      shortDescription: 'Tủ đứng 3 cánh, 1 cánh gương soi',
      description: 'Tủ quần áo 3 cánh. Bên trong có ngăn treo, ngăn gấp và kéo. Một cánh gương soi full. Gỗ MDF phủ melamine.',
      price: 11500000,
      salePrice: 13500000,
      categoryId: tuQuanAo.id,
      thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
      material: 'MDF, melamine',
      dimensions: '180x220x60 cm',
      color: 'Trắng',
      warranty: '2 năm',
      images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'],
    },
    {
      name: 'Bàn thờ gỗ gụ 1m2',
      slug: 'ban-tho-go-gu-1m2',
      sku: 'ALTAR-001',
      shortDescription: 'Bàn thờ gỗ gụ truyền thống, chạm khắc hoa văn',
      description: 'Bàn thờ gỗ gụ cao cấp. Mặt bàn rộng 1m2, chân chạm hoa văn truyền thống. Phù hợp không gian thờ cúng trang nghiêm.',
      price: 18500000,
      salePrice: 22000000,
      categoryId: banTho.id,
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      material: 'Gỗ gụ',
      dimensions: '120x85x80 cm',
      color: 'Nâu đỏ',
      warranty: '3 năm',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    },
    {
      name: 'Kệ thờ tam cấp gỗ gụ',
      slug: 'ke-tho-tam-cap-go-gu',
      sku: 'SHRINE-001',
      shortDescription: 'Kệ thờ 3 tầng tam cấp, chạm hoa văn',
      description: 'Kệ thờ tam cấp gỗ gụ. Ba tầng giảm dần, dễ bày bát hương và đồ thờ. Chạm hoa văn mai, lan, cúc, trúc.',
      price: 12000000,
      salePrice: 14500000,
      categoryId: keTho.id,
      thumbnail: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
      material: 'Gỗ gụ',
      dimensions: '110x90x35 cm',
      color: 'Nâu đỏ',
      warranty: '3 năm',
      images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800'],
    },
  ];

  for (const p of productData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        short_description: p.shortDescription,
        description: p.description,
        price: p.price,
        sale_price: p.salePrice,
        category_id: p.categoryId,
        thumbnail: p.thumbnail,
        material: p.material,
        dimensions: p.dimensions,
        color: p.color,
        warranty: p.warranty,
        status: 'available',
      },
    });

    // Create product images (delete existing first, then create new)
    await prisma.productImage.deleteMany({
      where: { product_id: product.id },
    });
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          product_id: product.id,
          image_url: p.images[i],
          is_primary: i === 0,
          order_index: i,
          alt_text: p.name,
        },
      });
    }
  }
  console.log('  ✓ Products');

  // --- CMS Pages ---
  const cmsPages = [
    {
      slug: 'about',
      title: 'Về chúng tôi',
      content: `<h1>Về chúng tôi</h1><p>Furniture Store chuyên cung cấp nội thất gia đình và văn phòng với chất lượng cao, thiết kế hiện đại.</p><p>Liên hệ: support@furniture-store.vn</p>`,
      seo_title: 'Về chúng tôi - Furniture Store',
      seo_description: 'Giới thiệu về Furniture Store, cửa hàng nội thất uy tín.',
    },
    {
      slug: 'privacy-policy',
      title: 'Chính sách bảo mật',
      content: `<h1>Chính sách bảo mật</h1><p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu chỉ dùng để xử lý đơn hàng và liên hệ.</p>`,
      seo_title: 'Chính sách bảo mật',
      seo_description: 'Chính sách bảo mật thông tin tại Furniture Store.',
    },
    {
      slug: 'terms',
      title: 'Điều khoản sử dụng',
      content: `<h1>Điều khoản sử dụng</h1><p>Khi sử dụng website, bạn đồng ý với các điều khoản của chúng tôi. Vui lòng đọc kỹ trước khi gửi yêu cầu.</p>`,
      seo_title: 'Điều khoản sử dụng',
      seo_description: 'Điều khoản và điều kiện sử dụng website Furniture Store.',
    },
  ];

  for (const page of cmsPages) {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        is_active: true,
      },
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
      passwordhashed: hashedPassword,
      fullname: 'Administrator',
      role: 'admin',
    },
  });
  console.log('  ✓ Admin (username: admin, password: admin123)');

  // --- Sample Inquiries ---
  const products = await prisma.product.findMany({ take: 2 });
  if (products.length >= 1) {
    const count = await prisma.inquiry.count();
    if (count === 0) {
      await prisma.inquiry.create({
        data: {
          name: 'Nguyễn Văn A',
          phone: '0901234567',
          email: 'nguyenvana@example.com',
          message: 'Tôi muốn đặt mua sofa 3 chỗ và bàn trà. Có giao hàng nội thành không?',
          product_id: products[0].id,
          status: 'new',
          source: 'contact',
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
