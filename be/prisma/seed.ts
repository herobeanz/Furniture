import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const HERO_IMAGES = {
    phongKhach: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    phongNgu: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    phongBep: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    phongTho: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  };

  // --- Categories (slug unique toàn site) ---
  const sofaCouches = await prisma.category.upsert({
    where: { slug: 'sofa-couches' },
    update: {},
    create: {
      name: 'Sofa & Ghế bành',
      slug: 'sofa-couches',
      description: 'Sofa và ghế bành cao cấp',
      order_index: 0,
    },
  });
  const coffeeTables = await prisma.category.upsert({
    where: { slug: 'coffee-tables' },
    update: {},
    create: {
      name: 'Bàn trà',
      slug: 'coffee-tables',
      description: 'Bàn trà, bàn kệ phòng khách',
      order_index: 1,
    },
  });

  const diningTables = await prisma.category.upsert({
    where: { slug: 'dining-tables' },
    update: {},
    create: {
      name: 'Bàn ăn',
      slug: 'dining-tables',
      description: 'Bàn ăn, bàn làm việc',
      order_index: 2,
    },
  });
  const diningChairs = await prisma.category.upsert({
    where: { slug: 'dining-chairs' },
    update: {},
    create: {
      name: 'Ghế ăn',
      slug: 'dining-chairs',
      description: 'Ghế ăn, ghế văn phòng',
      order_index: 3,
    },
  });

  const giuong = await prisma.category.upsert({
    where: { slug: 'giuong' },
    update: {},
    create: {
      name: 'Giường',
      slug: 'giuong',
      description: 'Giường ngủ, giường tầng',
      order_index: 4,
    },
  });
  const tuQuanAo = await prisma.category.upsert({
    where: { slug: 'tu-quan-ao' },
    update: {},
    create: {
      name: 'Tủ quần áo',
      slug: 'tu-quan-ao',
      description: 'Tủ quần áo, tủ có gương',
      order_index: 5,
    },
  });

  const banTho = await prisma.category.upsert({
    where: { slug: 'ban-tho' },
    update: {},
    create: {
      name: 'Bàn thờ',
      slug: 'ban-tho',
      description: 'Bàn thờ, tủ thờ',
      order_index: 6,
    },
  });
  const keTho = await prisma.category.upsert({
    where: { slug: 'ke-tho' },
    update: {},
    create: {
      name: 'Kệ thờ',
      slug: 'ke-tho',
      description: 'Kệ thờ, kệ tam cấp',
      order_index: 7,
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
    // --- Extra products to make listing richer across rooms ---
    {
      name: 'Sofa vải nỉ 2 chỗ tối giản',
      slug: 'sofa-vai-ni-2-cho-toi-gian',
      sku: 'SOFA-2C-002',
      shortDescription: 'Sofa vải nỉ 2 chỗ, khung gỗ tự nhiên, phong cách tối giản.',
      description:
        'Sofa 2 chỗ bọc vải nỉ chống bám bụi, đệm mút đàn hồi tốt, phù hợp căn hộ chung cư nhỏ hoặc phòng khách tối giản.',
      price: 8900000,
      salePrice: 9900000,
      categoryId: sofaCouches.id,
      thumbnail: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800',
      material: 'Vải nỉ, gỗ thông',
      dimensions: '160x85x85 cm',
      color: 'Xanh rêu',
      warranty: '1 năm',
      images: ['https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800'],
    },
    {
      name: 'Kệ tivi gỗ sồi 1m8',
      slug: 'ke-tivi-go-soi-1m8',
      sku: 'TVSTAND-001',
      shortDescription: 'Kệ tivi gỗ sồi, 3 hộc kéo, phù hợp phòng khách hiện đại.',
      description:
        'Kệ tivi dài 1m8 làm từ gỗ sồi tự nhiên, 3 hộc kéo lưu trữ đồ gọn gàng. Bề mặt phủ dầu lau chống ẩm, giữ vân gỗ đẹp.',
      price: 6500000,
      salePrice: 7500000,
      categoryId: coffeeTables.id,
      thumbnail: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800',
      material: 'Gỗ sồi tự nhiên',
      dimensions: '180x40x50 cm',
      color: 'Vân gỗ sáng',
      warranty: '1 năm',
      images: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800'],
    },
    {
      name: 'Giường tầng trẻ em có cầu thang',
      slug: 'giuong-tang-tre-em-co-cau-thang',
      sku: 'BED-BUNK-001',
      shortDescription: 'Giường tầng gỗ thông cho 2 bé, có hộc kéo dưới gầm.',
      description:
        'Giường tầng thiết kế an toàn cho trẻ nhỏ, lan can cao, cầu thang chắc chắn, dưới gầm có 2 hộc kéo chứa đồ chơi hoặc chăn gối.',
      price: 16500000,
      salePrice: 18500000,
      categoryId: giuong.id,
      thumbnail: 'https://images.unsplash.com/photo-1617806245181-9c1a1d0d94d5?w=800',
      material: 'Gỗ thông New Zealand',
      dimensions: '200x100x170 cm',
      color: 'Trắng – gỗ tự nhiên',
      warranty: '2 năm',
      images: ['https://images.unsplash.com/photo-1617806245181-9c1a1d0d94d5?w=800'],
    },
    {
      name: 'Tủ quần áo cánh lùa 2m',
      slug: 'tu-quan-ao-canh-lua-2m',
      sku: 'WARD-002',
      shortDescription: 'Tủ quần áo cánh lùa hiện đại, tiết kiệm diện tích.',
      description:
        'Tủ quần áo 2m với 2 cánh lùa, phân chia khu vực treo đồ và gấp đồ rõ ràng. Phù hợp phòng ngủ chung cư diện tích nhỏ.',
      price: 13500000,
      salePrice: 15500000,
      categoryId: tuQuanAo.id,
      thumbnail: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      material: 'MDF chống ẩm, phủ melamine vân gỗ',
      dimensions: '200x220x60 cm',
      color: 'Vân gỗ sồi',
      warranty: '2 năm',
      images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800'],
    },
    {
      name: 'Bộ bàn ăn tròn 4 ghế',
      slug: 'bo-ban-an-tron-4-ghe',
      sku: 'DINSET-4P-001',
      shortDescription: 'Bàn ăn tròn 1m, kèm 4 ghế bọc nệm, phù hợp căn hộ nhỏ.',
      description:
        'Bộ bàn ăn tròn đường kính 1m, mặt gỗ MDF phủ veneer, chân gỗ beech. Ghế bọc nệm êm ái, dễ phối với nhiều phong cách nội thất.',
      price: 8900000,
      salePrice: 9900000,
      categoryId: diningTables.id,
      thumbnail: 'https://images.unsplash.com/photo-1555041469-869513f4afb1?w=800',
      material: 'MDF veneer, gỗ beech, nệm mút bọc vải',
      dimensions: 'Bàn tròn D100 x H75 cm',
      color: 'Trắng – gỗ sáng',
      warranty: '1 năm',
      images: ['https://images.unsplash.com/photo-1555041469-869513f4afb1?w=800'],
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

  // --- Collections ---
  const collectionProductSlugs = [
    'sofa-da-cao-cap-3-cho',
    'sofa-goc-sectional-l-shaped',
    'ban-tra-go-mdf-phong-cach-bac-au',
    'ke-tivi-go-soi-1m8',
    'giuong-ngu-go-soi-1m6',
    'giuong-tang-tre-em-co-cau-thang',
    'tu-quan-ao-3-canh-co-guong',
    'tu-quan-ao-canh-lua-2m',
    'ban-an-go-soi-6-cho',
    'bo-ban-an-tron-4-ghe',
    'ghe-an-go-oc-cho-1-cho',
    'ban-tho-go-gu-1m2',
    'ke-tho-tam-cap-go-gu',
  ];

  const collectionProductsSource = await prisma.product.findMany({
    where: { slug: { in: collectionProductSlugs } },
  });
  const productMap = new Map(collectionProductsSource.map((p) => [p.slug, p]));

  const showcaseCollections = [
    {
      name: 'Phòng khách',
      slug: 'phong-khach',
      description:
        'Khám phá các sản phẩm nội thất gỗ tự nhiên cho phòng khách – nơi thể hiện gu thẩm mỹ và đẳng cấp của gia chủ.',
      thumbnail: HERO_IMAGES.phongKhach,
      categoryIds: [sofaCouches.id, coffeeTables.id],
      order_index: 0,
    },
    {
      name: 'Phòng ngủ',
      slug: 'phong-ngu',
      description: 'Giường, tủ quần áo và nội thất phòng ngủ cao cấp.',
      thumbnail: HERO_IMAGES.phongNgu,
      categoryIds: [giuong.id, tuQuanAo.id],
      order_index: 1,
    },
    {
      name: 'Phòng bếp',
      slug: 'phong-bep',
      description: 'Bàn ăn, ghế ăn và nội thất phòng bếp.',
      thumbnail: HERO_IMAGES.phongBep,
      categoryIds: [diningTables.id, diningChairs.id],
      order_index: 2,
    },
    {
      name: 'Phòng thờ',
      slug: 'phong-tho',
      description: 'Bàn thờ, kệ thờ và nội thất phòng thờ trang nghiêm.',
      thumbnail: HERO_IMAGES.phongTho,
      categoryIds: [banTho.id, keTho.id],
      order_index: 3,
    },
  ];

  for (const sc of showcaseCollections) {
    const collection = await prisma.collection.upsert({
      where: { slug: sc.slug },
      update: {
        name: sc.name,
        description: sc.description,
        thumbnail: sc.thumbnail,
        order_index: sc.order_index,
        is_active: true,
      },
      create: {
        name: sc.name,
        slug: sc.slug,
        description: sc.description,
        thumbnail: sc.thumbnail,
        order_index: sc.order_index,
        is_active: true,
      },
    });
    await prisma.collectionProduct.deleteMany({
      where: { collection_id: collection.id },
    });
    const products = await prisma.product.findMany({
      where: { category_id: { in: sc.categoryIds } },
      orderBy: { created_at: 'asc' },
    });
    for (let i = 0; i < products.length; i++) {
      await prisma.collectionProduct.create({
        data: {
          collection_id: collection.id,
          product_id: products[i].id,
          order_index: i,
        },
      });
    }
  }
  console.log('  ✓ Showcase collections (phong-*)');

  const collectionsData = [
    {
      name: 'Combo phòng khách hiện đại',
      slug: 'combo-phong-khach-hien-dai',
      description:
        'Bộ sưu tập sofa, bàn trà và kệ tivi phù hợp cho phòng khách chung cư hiện đại, tông màu trung tính dễ phối.',
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000',
      seo_title: 'Combo phòng khách hiện đại - Đồ gỗ Hùng Cường',
      seo_description:
        'Gợi ý combo sofa, bàn trà, kệ tivi cho phòng khách hiện đại, tối ưu chi phí và thẩm mỹ.',
      productSlugs: [
        'sofa-da-cao-cap-3-cho',
        'sofa-goc-sectional-l-shaped',
        'ban-tra-go-mdf-phong-cach-bac-au',
        'ke-tivi-go-soi-1m8',
      ],
    },
    {
      name: 'Phòng ngủ ấm cúng cho gia đình trẻ',
      slug: 'phong-ngu-am-cung-cho-gia-dinh-tre',
      description:
        'Set giường ngủ, tủ quần áo và giường tầng cho bé, phù hợp căn hộ 2 phòng ngủ cho gia đình trẻ.',
      thumbnail: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1000',
      seo_title: 'Phòng ngủ ấm cúng cho gia đình trẻ',
      seo_description:
        'Gợi ý nội thất phòng ngủ với giường, tủ và giường tầng cho gia đình trẻ, tối ưu không gian.',
      productSlugs: [
        'giuong-ngu-go-soi-1m6',
        'giuong-tang-tre-em-co-cau-thang',
        'tu-quan-ao-3-canh-co-guong',
        'tu-quan-ao-canh-lua-2m',
      ],
    },
    {
      name: 'Góc ăn uống gia đình 4–6 người',
      slug: 'goc-an-uong-gia-dinh-4-6-nguoi',
      description:
        'Bộ sưu tập bàn ăn và ghế ăn dành cho gia đình nhỏ, phong cách hiện đại, dễ vệ sinh và bền chắc.',
      thumbnail: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000',
      seo_title: 'Góc ăn uống gia đình 4–6 người',
      seo_description:
        'Combo bàn ăn gỗ sồi, bộ bàn tròn và ghế ăn cho không gian bếp ấm cúng.',
      productSlugs: [
        'ban-an-go-soi-6-cho',
        'bo-ban-an-tron-4-ghe',
        'ghe-an-go-oc-cho-1-cho',
      ],
    },
    {
      name: 'Không gian thờ trang nghiêm',
      slug: 'khong-gian-tho-trang-nghiem',
      description:
        'Set bàn thờ và kệ thờ gỗ gụ, giúp bạn dễ dàng hoàn thiện không gian thờ cúng trang nghiêm tại gia.',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000',
      seo_title: 'Không gian thờ trang nghiêm',
      seo_description:
        'Bộ sưu tập bàn thờ, kệ thờ gỗ gụ cao cấp cho phòng thờ gia đình.',
      productSlugs: ['ban-tho-go-gu-1m2', 'ke-tho-tam-cap-go-gu'],
    },
    {
      name: 'Combo nội thất cơ bản cho căn hộ mới',
      slug: 'combo-noi-that-co-ban-cho-can-ho-moi',
      description:
        'Combo lựa chọn nhanh gồm sofa, bàn trà, giường ngủ và tủ quần áo – đủ cho một căn hộ mới vào ở.',
      thumbnail: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1000',
      seo_title: 'Combo nội thất cơ bản cho căn hộ mới',
      seo_description:
        'Gợi ý combo nội thất cơ bản cho căn hộ mới với sofa, bàn trà, giường và tủ quần áo.',
      productSlugs: [
        'sofa-vai-ni-2-cho-toi-gian',
        'ban-tra-go-mdf-phong-cach-bac-au',
        'giuong-ngu-go-soi-1m6',
        'tu-quan-ao-canh-lua-2m',
      ],
    },
  ];

  for (let idx = 0; idx < collectionsData.length; idx++) {
    const c = collectionsData[idx];
    const orderIndex = idx + showcaseCollections.length;
    const collection = await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        thumbnail: c.thumbnail,
        seo_title: c.seo_title,
        seo_description: c.seo_description,
        order_index: orderIndex,
        is_active: true,
      },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        thumbnail: c.thumbnail,
        seo_title: c.seo_title,
        seo_description: c.seo_description,
        order_index: orderIndex,
        is_active: true,
      },
    });

    // Reset products in this collection then add according to productSlugs
    await prisma.collectionProduct.deleteMany({
      where: { collection_id: collection.id },
    });

    for (let i = 0; i < c.productSlugs.length; i++) {
      const slug = c.productSlugs[i];
      const product = productMap.get(slug);
      if (!product) {
        console.warn(`⚠️  Product not found for collection seed: ${slug}`);
        continue;
      }
      await prisma.collectionProduct.create({
        data: {
          collection_id: collection.id,
          product_id: product.id,
          order_index: i,
        },
      });
    }
  }
  console.log('  ✓ Collections');

  // --- Blog Posts ---
  const blogPosts = [
    {
      slug: 'bi-quyet-bo-tri-phong-khach-go-am-cung',
      title: 'Bí quyết bố trí phòng khách gỗ ấm cúng',
      excerpt:
        'Một vài gợi ý đơn giản để phòng khách với nội thất gỗ trở nên ấm cúng, hiện đại mà vẫn thoáng đãng.',
      content:
        '<p>Phòng khách là không gian trung tâm của ngôi nhà. Khi sử dụng nội thất gỗ, bạn nên chú ý tới màu sắc, ánh sáng và cách bố trí để tránh cảm giác nặng nề.</p><p>Kết hợp sofa nỉ màu sáng với bàn trà gỗ, thêm thảm và đèn sàn sẽ giúp không gian cân bằng hơn.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900',
      category: 'phong-khach',
      author: 'Đồ gỗ Hùng Cường',
      seo_title: 'Bí quyết bố trí phòng khách gỗ ấm cúng',
      seo_description: 'Gợi ý bố trí nội thất gỗ cho phòng khách ấm cúng, hiện đại.',
      is_featured: true,
      published_at: new Date('2024-01-10T08:00:00Z'),
    },
    {
      slug: 'chon-giuong-ngu-go-phu-hop-cho-can-ho-chung-cu',
      title: 'Chọn giường ngủ gỗ phù hợp cho căn hộ chung cư',
      excerpt:
        'Giường ngủ là trung tâm của phòng ngủ. Chọn đúng kích thước và chất liệu giúp bạn ngủ ngon hơn mỗi đêm.',
      content:
        '<p>Khi chọn giường ngủ cho căn hộ, hãy ưu tiên kích thước phù hợp diện tích phòng, khung gỗ chắc chắn và thiết kế đơn giản.</p><p>Giường có hộc kéo hoặc ngăn chứa đồ cũng là lựa chọn tối ưu cho không gian nhỏ.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=900',
      category: 'phong-ngu',
      author: 'Đồ gỗ Hùng Cường',
      seo_title: 'Chọn giường ngủ gỗ cho căn hộ chung cư',
      seo_description: 'Kinh nghiệm chọn giường ngủ gỗ bền đẹp cho phòng ngủ chung cư.',
      is_featured: true,
      published_at: new Date('2024-01-15T08:00:00Z'),
    },
    {
      slug: 'go-go-nao-phu-hop-lam-ban-an-gia-dinh',
      title: 'Gỗ gì phù hợp làm bàn ăn gia đình?',
      excerpt: 'So sánh nhanh một số loại gỗ phổ biến khi làm bàn ăn: sồi, óc chó, cao su, xoan đào...',
      content:
        '<p>Mỗi loại gỗ có ưu/nhược điểm riêng. Gỗ sồi vân đẹp, giá vừa phải; gỗ óc chó cao cấp, màu trầm sang trọng; gỗ cao su kinh tế.</p><p>Tùy ngân sách và phong cách nội thất, bạn có thể chọn loại phù hợp cho gia đình.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1616628187878-8a6c0d5c1765?w=900',
      category: 'phong-bep',
      author: 'Đồ gỗ Hùng Cường',
      seo_title: 'Gỗ nào phù hợp làm bàn ăn gia đình?',
      seo_description: 'Tư vấn chọn chất liệu gỗ cho bàn ăn bền đẹp, phù hợp ngân sách.',
      is_featured: false,
      published_at: new Date('2024-01-20T08:00:00Z'),
    },
    {
      slug: 'nhung-luu-y-khi-thiet-ke-phong-tho-gia-dinh',
      title: 'Những lưu ý khi thiết kế phòng thờ gia đình',
      excerpt:
        'Phòng thờ cần trang nghiêm nhưng vẫn hài hòa với tổng thể nội thất. Một vài nguyên tắc cơ bản bạn nên biết.',
      content:
        '<p>Khi bố trí bàn thờ, nên tránh đặt đối diện nhà vệ sinh hoặc dưới xà ngang. Chiều cao bàn thờ và khoảng cách tới trần cũng cần hợp lý.</p><p>Chọn chất liệu gỗ tốt, màu trầm ấm sẽ giúp không gian thờ cúng thêm trang trọng.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900',
      category: 'phong-tho',
      author: 'Đồ gỗ Hùng Cường',
      seo_title: 'Lưu ý khi thiết kế phòng thờ gia đình',
      seo_description: 'Các nguyên tắc cơ bản khi thiết kế phòng thờ với nội thất gỗ.',
      is_featured: false,
      published_at: new Date('2024-01-25T08:00:00Z'),
    },
    {
      slug: 'meo-giu-do-go-ben-dep-lau-nam',
      title: 'Mẹo giữ đồ gỗ bền đẹp lâu năm',
      excerpt:
        'Một vài thói quen nhỏ khi sử dụng và vệ sinh sẽ giúp nội thất gỗ luôn như mới sau nhiều năm.',
      content:
        '<p>Hạn chế đặt đồ nóng trực tiếp lên bề mặt gỗ, lau ngay khi bị đổ nước, dùng khăn mềm để vệ sinh.</p><p>Có thể sử dụng dầu lau chuyên dụng 6–12 tháng một lần để nuôi dưỡng bề mặt gỗ.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900',
      category: 'kinh-nghiem',
      author: 'Đồ gỗ Hùng Cường',
      seo_title: 'Mẹo giữ đồ gỗ bền đẹp lâu năm',
      seo_description: 'Chia sẻ cách bảo quản đồ gỗ trong gia đình luôn bền đẹp.',
      is_featured: false,
      published_at: new Date('2024-02-01T08:00:00Z'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? null,
        content: post.content,
        thumbnail: post.thumbnail ?? null,
        category: post.category ?? null,
        author: post.author ?? null,
        seo_title: post.seo_title ?? null,
        seo_description: post.seo_description ?? null,
        is_active: true,
        is_featured: post.is_featured ?? false,
        published_at: post.published_at ?? null,
      },
    });
  }
  console.log('  ✓ Blog posts');

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
