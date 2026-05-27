import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const AUTHOR = 'Đồ gỗ Hùng Cường';

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  order_index: number;
  seo_title: string;
  seo_description: string;
};

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  categorySlug: string;
  thumbnail: string;
  material: string;
  dimensions: string;
  color: string;
  warranty: string;
  images: string[];
  seo_title?: string;
  seo_description?: string;
  is_featured?: boolean;
};

type SeedCollection = {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  seo_title: string;
  seo_description: string;
  order_index: number;
  categorySlugs: string[];
};

type SeedBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  seo_title: string;
  seo_description: string;
  is_featured: boolean;
  published_at: Date;
  sort_order: number;
};

const CATEGORIES: SeedCategory[] = [
  {
    name: 'Sofa',
    slug: 'sofa',
    description: 'Sofa phòng khách bọc vải, da và gỗ tự nhiên — thiết kế hiện đại, êm ái.',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    order_index: 0,
    seo_title: 'Sofa phòng khách cao cấp',
    seo_description: 'Sofa gỗ tự nhiên, bọc vải và da cho phòng khách hiện đại.',
  },
  {
    name: 'Giường',
    slug: 'giuong',
    description: 'Giường ngủ gỗ sồi, óc chó và MDF chống ẩm — nhiều kích thước cho mọi phòng ngủ.',
    thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    order_index: 1,
    seo_title: 'Giường ngủ gỗ cao cấp',
    seo_description: 'Giường ngủ gỗ tự nhiên, thiết kế tối giản và bền chắc.',
  },
  {
    name: 'Tủ quần áo',
    slug: 'tu-quan-ao',
    description: 'Tủ quần áo, tủ cánh lùa và tủ đứng — tối ưu lưu trữ phòng ngủ và không gian bếp.',
    thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
    order_index: 2,
    seo_title: 'Tủ quần áo gỗ thông minh',
    seo_description: 'Tủ quần áo gỗ MDF chống ẩm, nhiều ngăn treo và kệ gấp.',
  },
];

const PRODUCTS: SeedProduct[] = [
  {
    name: 'Sofa góc 2 chỗ bọc vải',
    slug: 'sofa-goc-2-cho-boc-vai',
    sku: 'SOFA-2C-001',
    shortDescription:
      'Sofa góc compact 2 chỗ, khung gỗ chắc, vải bọc chống bám bụi — lý tưởng căn hộ dưới 20m².',
    description: `<p>Sofa góc 2 chỗ là lựa chọn cân bằng giữa tiện nghi và diện tích. Khung gỗ được xử lý chống mối, đệm mút đàn hồi cao giúp ngồi lâu không bị mỏi lưng.</p>
<p>Thiết kế góc giúp tận dụng góc phòng, tạo luồng đi thông thoáng. Vải bọc có thể tháo rời để vệ sinh định kỳ.</p>
<ul>
<li>Kích thước phù hợp phòng khách nhỏ và studio</li>
<li>Màu beige/dễ phối rèm, thảm trung tính</li>
<li>Bảo hành khung gỗ 24 tháng</li>
</ul>`,
    price: 13500000,
    salePrice: 11900000,
    categorySlug: 'sofa',
    thumbnail: 'https://images.unsplash.com/photo-1540574163026-643ea20ade68?w=800',
    material: 'Vải polyester cao cấp, gỗ thông',
    dimensions: '200x150x85 cm',
    color: 'Beige',
    warranty: '2 năm',
    images: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade68?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    seo_title: 'Sofa góc 2 chỗ bọc vải',
    seo_description: 'Sofa góc nhỏ gọn cho phòng khách chung cư, khung gỗ bền.',
    is_featured: true,
  },
  {
    name: 'Sofa da 3 chỗ phòng khách',
    slug: 'sofa-da-3-cho-phong-khach',
    sku: 'SOFA-3C-002',
    shortDescription:
      'Sofa 3 chỗ bọc da công nghiệp, tựa lưng cao, phong cách sang trọng cho phòng khách rộng.',
    description: `<p>Sofa 3 chỗ mang phong cách sang trọng với lớp da công nghiệp bề mặt mịn, dễ lau chùi. Khung gỗ sồi chịu lực tốt, phù hợp gia đình 4–5 người sử dụng hàng ngày.</p>
<p>Đệm ghế chia 3 zone ngồi độc lập, giảm lún khi nhiều người cùng ngồi. Có thể kết hợp bàn trà thấp và đèn sàn để hoàn thiện không gian tiếp khách.</p>
<p>Gợi ý bảo quản: tránh ánh nắng trực tiếp, lau khô bằng khăn mềm mỗi tuần.</p>`,
    price: 22900000,
    salePrice: 19900000,
    categorySlug: 'sofa',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    material: 'Da công nghiệp, gỗ sồi',
    dimensions: '220x95x88 cm',
    color: 'Nâu cacao',
    warranty: '2 năm',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    seo_title: 'Sofa da 3 chỗ phòng khách',
    seo_description: 'Sofa da 3 chỗ khung gỗ sồi, thiết kế sang cho phòng khách.',
    is_featured: true,
  },
  {
    name: 'Giường ngủ gỗ sồi 1m8',
    slug: 'giuong-ngu-go-soi-1m8',
    sku: 'BED-180-001',
    shortDescription:
      'Giường đôi 1m8 khung gỗ sồi nguyên khối, đầu giường thấp tối giản, chân chắc chịu lực.',
    description: `<p>Giường 1m8 x 2m là kích thước phổ biến cho cặp đôi. Khung gỗ sồi được phủ dầu chống ẩm, giữ vân gỗ tự nhiên, hạn chế cong vênh trong điều kiện nóng ẩm.</p>
<p>Đầu giường thấp tạo cảm giác trần cao, dễ phối đèn đọc sách và tranh treo tường. Khoảng hở dưới gầm đủ để đặt hộc kéo lưu chăn mùa.</p>
<ul>
<li>Chịu tải tối đa khoảng 300kg (khung + nệm)</li>
<li>Tương thích nệm foam, lò xo hoặc latex tiêu chuẩn VN</li>
<li>Lắp đặt tại nhà miễn phí nội thành (theo chính sách cửa hàng)</li>
</ul>`,
    price: 16800000,
    salePrice: 14200000,
    categorySlug: 'giuong',
    thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    material: 'Gỗ sồi tự nhiên',
    dimensions: '180x200x90 cm',
    color: 'Vân gỗ sáng',
    warranty: '2 năm',
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
    seo_title: 'Giường ngủ gỗ sồi 1m8',
    seo_description: 'Giường đôi 1m8 khung gỗ sồi, thiết kế hiện đại.',
    is_featured: true,
  },
  {
    name: 'Giường ngủ gỗ sồi 1m6 có hộc',
    slug: 'giuong-ngu-go-soi-1m6-co-hoc',
    sku: 'BED-160-001',
    shortDescription:
      'Giường 1m6 tiết kiệm diện tích, có hộc kéo dưới gầm, phù hợp phòng ngủ nhỏ.',
    description: `<p>Giường 1m6 là giải pháp tối ưu cho phòng ngủ phụ hoặc căn hộ một phòng ngủ. Khung gỗ sồi bền, cạnh xử lý mịn tránh cấn tay.</p>
<p>Hộc kéo rộng dưới gầm giúp cất chăn, gối theo mùa mà không chiếm diện tích tủ. Đầu giường có kệ hở để đặt điện thoại, sách hoặc đèn ngủ.</p>
<p>Kết hợp nệm dày 20–25cm để đảm bảo thoáng khí và thoải mái khi nằm.</p>`,
    price: 14900000,
    salePrice: 12500000,
    categorySlug: 'giuong',
    thumbnail: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    material: 'Gỗ sồi, MDF phủ melamine',
    dimensions: '160x200x95 cm',
    color: 'Trắng vân gỗ',
    warranty: '2 năm',
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    seo_title: 'Giường ngủ gỗ sồi 1m6 có hộc',
    seo_description: 'Giường 1m6 gỗ sồi có hộc kéo, phù hợp phòng ngủ nhỏ.',
  },
  {
    name: 'Tủ quần áo 4 cánh lùa 2m4',
    slug: 'tu-quan-ao-4-canh-lua-2m4',
    sku: 'WARD-240-001',
    shortDescription:
      'Tủ 4 cánh trượt rộng 2m4, chia ngăn treo và kệ gấp, MDF chống ẩm.',
    description: `<p>Tủ quần áo 4 cánh lùa giúp mở rộng không gian sử dụng trong phòng ngủ hẹp. Ray trượt êm, bánh xe chịu tải, cánh không va chạm khi mở đồng thời.</p>
<p>Bên trong gồm: khu treo áo dài, khu treo áo ngắn, kệ gấp và 2 ngăn kéo đựng phụ kiện. Mặt ngoài phủ melamine chống ẩm, dễ vệ sinh.</p>
<p>Gợi ý lắp đặt: để cách tường sau ít nhất 5cm để cánh lùa vận hành trơn tru; kiểm tra mặt sàn bằng pháo trước khi bàn giao.</p>`,
    price: 19500000,
    salePrice: 16800000,
    categorySlug: 'tu-quan-ao',
    thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
    material: 'MDF chống ẩm, phủ melamine',
    dimensions: '240x220x60 cm',
    color: 'Trắng',
    warranty: '2 năm',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
    ],
    seo_title: 'Tủ quần áo 4 cánh lùa 2m4',
    seo_description: 'Tủ quần áo cánh lùa rộng, nhiều ngăn treo và kệ gấp.',
    is_featured: true,
  },
  {
    name: 'Tủ đứng 3 cánh có gương',
    slug: 'tu-dung-3-canh-co-guong',
    sku: 'WARD-180-001',
    shortDescription:
      'Tủ quần áo 3 cánh, 1 cánh gương soi full, phù hợp phòng ngủ master vừa và nhỏ.',
    description: `<p>Tủ 3 cánh là lựa chọn cân đối giữa dung tích và chi phí. Một cánh gương giúp phòng ngủ trông rộng hơn và tiện soi trang phục trước khi ra ngoài.</p>
<p>Ngăn bên trong được chia theo chiều cao người dùng: áo treo trên, quần gấp giữa, phụ kiện dưới. Tay nắm âm tủ tạo mặt phẳng, dễ vệ sinh.</p>
<p>Có thể đặt cạnh giường hoặc sát tường đối diện cửa sổ để tận dụng ánh sáng tự nhiên khi mở gương.</p>`,
    price: 13500000,
    salePrice: 11500000,
    categorySlug: 'tu-quan-ao',
    thumbnail: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
    material: 'MDF phủ melamine, gương soi',
    dimensions: '180x220x60 cm',
    color: 'Vân gỗ sồi',
    warranty: '2 năm',
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800'],
    seo_title: 'Tủ quần áo 3 cánh có gương',
    seo_description: 'Tủ quần áo 3 cánh gương soi, thiết kế gọn cho phòng ngủ.',
  },
];

const COLLECTIONS: SeedCollection[] = [
  {
    name: 'Phòng khách',
    slug: 'phong-khach',
    description:
      'Sofa phòng khách gỗ tự nhiên — từ sofa góc gọn cho căn hộ đến sofa da 3 chỗ sang trọng. Chọn theo diện tích và phong cách nội thất của bạn.',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000',
    seo_title: 'Nội thất phòng khách gỗ — Đồ gỗ Hùng Cường',
    seo_description: 'Sofa phòng khách bọc vải, da — khung gỗ bền, thiết kế hiện đại.',
    order_index: 0,
    categorySlugs: ['sofa'],
  },
  {
    name: 'Phòng ngủ',
    slug: 'phong-ngu',
    description:
      'Giường ngủ và tủ quần áo gỗ — giải pháp trọn gói cho phòng ngủ ấm cúng, gọn gàng và dễ bảo quản trong khí hậu nóng ẩm.',
    thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000',
    seo_title: 'Nội thất phòng ngủ gỗ — Đồ gỗ Hùng Cường',
    seo_description: 'Giường gỗ sồi, tủ quần áo cánh lùa — phòng ngủ hoàn thiện.',
    order_index: 1,
    categorySlugs: ['giuong', 'tu-quan-ao'],
  },
  {
    name: 'Phòng bếp',
    slug: 'phong-bep',
    description:
      'Tủ lưu trữ phòng bếp và bếp kết hợp — tủ đứng chống ẩm, nhiều ngăn đựng đồ khô, bát đĩa và dụng cụ nấu ăn gọn gàng.',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000',
    seo_title: 'Tủ lưu trữ phòng bếp — Đồ gỗ Hùng Cường',
    seo_description: 'Tủ đứng MDF chống ẩm cho phòng bếp, tối ưu không gian lưu trữ.',
    order_index: 2,
    categorySlugs: ['tu-quan-ao'],
  },
];

const BLOG_POSTS: SeedBlogPost[] = [
  {
    slug: 'xu-huong-noi-that-ton-mau-trung-tinh-2025',
    title: 'Xu hướng nội thất 2025: tông trung tính và gỗ tự nhiên vẫn lên ngôi',
    excerpt:
      'Beige, nâu ấm và vân gỗ sáng không chỉ là “an toàn” — chúng giúp nhà bạn rộng hơn, dễ thay đổi phụ kiện theo mùa và bền về thẩm mỹ.',
    content: `<h2>Vì sao tông trung tính trở lại mạnh mẽ?</h2>
<p>Sau giai đoạn thiên về màu tối và kim loại lạnh, năm 2025 ghi nhận sự quay về của palette ấm: kem, oatmeal, taupe và nâu gỗ nhạt. Các gia đình Việt ưu tiên không gian dễ “thở”, đặc biệt trong căn hộ 60–90m².</p>
<p>Gỗ tự nhiên — sồi, cao su, óc chó — được dùng làm “xương sống” cho sofa, bàn và kệ. Điểm nhấn màu chỉ nên chiếm 10–15% diện tích (gối, tranh, chậu cây) để tránh rối mắt.</p>
<h2>Cách phối trong phòng khách</h2>
<ul>
<li>Sofa màu beige + thảm len xám nhạt + rèm linen trắng ngà</li>
<li>Chọn 1 bức tranh lớn hoặc gương trang trí thay vì nhiều vật dụng nhỏ</li>
<li>Đèn sàn 2700–3000K tạo ánh sáng ấm buổi tối</li>
</ul>
<h2>Lưu ý khi mua đồ gỗ theo xu hướng</h2>
<p>Ưu tiên bề mặt phủ dầu hoặc PU chống ẩm, đặc biệt với đồ đặt gần cửa ra vào hoặc ban công. Hỏi rõ chế độ bảo hành co ngót, nứt mép trong 12 tháng đầu.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900',
    category: 'Xu hướng nội thất',
    seo_title: 'Xu hướng nội thất 2025: tông trung tính và gỗ',
    seo_description: 'Phân tích xu hướng màu sắc và gỗ tự nhiên cho phòng khách, phòng ngủ năm 2025.',
    is_featured: true,
    published_at: new Date('2025-02-01T08:00:00Z'),
    sort_order: 0,
  },
  {
    slug: 'xu-huong-goc-xanh-trong-nha',
    title: 'Góc xanh trong nhà: xu hướng sống lành mạnh kết hợp nội thất gỗ',
    excerpt:
      'Một góc cây nhỏ bên cửa sổ, kệ gỗ thấp và ghế đọc sách có thể biến góc thừa thành nơi thư giãn yêu thích của cả nhà.',
    content: `<h2>Góc xanh không cần diện tích lớn</h2>
<p>Chỉ cần 1–1,5m² sát cửa sổ hoặc ban công, bạn đã có thể tạo “góc xanh” với 2–3 chậu cây ánh sáng gián tiếp (trầu bà, lan ý, cây phát lộc).</p>
<h2>Chọn nội thất gỗ phù hợp</h2>
<p>Kệ gỗ thấp hoặc ghế đơn gỗ sồi giúp không gian tự nhiên, không lấn át cây. Tránh kệ quá cao che ánh sáng. Màu gỗ sáng phản chiếu tốt, giúp cây trông tươi hơn.</p>
<h2>Chăm sóc đồ gỗ khi đặt gần cây</h2>
<p>Tưới cây cẩn thận, tránh nước đọng lên mặt gỗ. Dùng lót chậu và khay hứng nước. Lau khô ngay nếu có cát/vụn đất rơi vãi.</p>
<p>Góc xanh kết hợp sofa góc nhỏ tạo không gian đa năng: đọc sách, làm việc nhẹ hoặc trò chuyện buổi chiều.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900',
    category: 'Xu hướng nội thất',
    seo_title: 'Góc xanh trong nhà và nội thất gỗ',
    seo_description: 'Hướng dẫn bố trí góc cây trong nhà với kệ gỗ, ghế và ánh sáng tự nhiên.',
    is_featured: false,
    published_at: new Date('2025-02-08T08:00:00Z'),
    sort_order: 1,
  },
  {
    slug: 'kinh-nghiem-phan-biet-go-tu-nhien-va-go-cong-nghiep',
    title: 'Phân biệt gỗ tự nhiên và gỗ công nghiệp khi mua nội thất',
    excerpt:
      'Cùng là “gỗ” nhưng MDF, MFC và gỗ tự nhiên khác nhau về độ bền, giá và cách sử dụng. Bài viết giúp bạn chọn đúng từng hạng mục trong nhà.',
    content: `<h2>Gỗ tự nhiên là gì?</h2>
<p>Gỗ tự nhiên (sồi, óc chó, gụ, cao su…) được xẻ từ thân cây, giữ vân gỗ thật. Ưu điểm: thẩm mỹ cao, bền, có thể đánh lại dầu. Nhược: giá cao hơn, dễ co ngót nếu không sấy đúng chuẩn.</p>
<h2>Gỗ công nghiệp (MDF, MFC, HDF)</h2>
<p>Là dăm gỗ ép keo dưới áp lực cao, bề mặt phủ melamine hoặc veneer. Ưu điểm: giá mềm, kích thước ổn định, phù hợp tủ, kệ số lượng lớn. Nhược: sợ nước đọng lâu ở cạnh hở, khó sửa khi trầy sâu.</p>
<h2>Nên chọn loại nào cho từng khu vực?</h2>
<ul>
<li><strong>Sofa, giường khung gỗ:</strong> ưu tiên gỗ tự nhiên hoặc khung gỗ + bọc vải/da chất lượng</li>
<li><strong>Tủ quần áo, tủ bếp:</strong> MDF/MFC chống ẩm phủ melamine là hợp lý</li>
<li><strong>Đồ trưng bày ít dùng:</strong> có thể dùng MFC tiết kiệm</li>
</ul>
<h2>Câu hỏi nên hỏi khi mua</h2>
<p>Hỏi loại gỗ cụ thể, lớp phủ bề mặt, độ dày ván, chính sách bảo hành co ngót/nứt. Yêu cầu xem mẫu thật hoặc ảnh cận cảnh mép và khớp nối.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900',
    category: 'Kinh nghiệm chọn đồ gỗ',
    seo_title: 'Phân biệt gỗ tự nhiên và gỗ công nghiệp',
    seo_description: 'So sánh gỗ tự nhiên, MDF, MFC — chọn đúng cho sofa, giường, tủ.',
    is_featured: true,
    published_at: new Date('2025-02-12T08:00:00Z'),
    sort_order: 2,
  },
  {
    slug: 'kinh-nghiem-do-am-khi-mua-noi-that-go',
    title: 'Kiểm tra độ ẩm gỗ trước khi nhận nội thất — đặc biệt ở Việt Nam',
    excerpt:
      'Độ ẩm gỗ sai chuẩn là nguyên nhân phổ biến khiến tủ cong cánh, giường kêu cót két. Đây là checklist 5 bước trước khi ký biên bản nghiệm thu.',
    content: `<h2>Độ ẩm gỗ chuẩn là bao nhiêu?</h2>
<p>Với nội thất trong nhà ở Việt Nam, độ ẩm gỗ nên trong khoảng <strong>8–12%</strong>. Cao hơn dễ co ngót sau vài tháng; thấp quá có thể giòn ở khớp nối.</p>
<h2>Checklist khi nhận hàng</h2>
<ol>
<li>Quan sát mép ván và khớp nối — không hở, không lệch</li>
<li>Ngửi mùi: tránh mùi ẩm mốc hoặc keo quá nồng</li>
<li>Gõ nhẹ: âm thanh đặc, không rỗng (với tủ MDF)</li>
<li>Kiểm tra cánh lùa, ngăn kéo chạy êm, không kẹt</li>
<li>Chụp ảnh hiện trạng làm căn cứ bảo hành</li>
</ol>
<h2>Cách bảo quản sau khi lắp đặt</h2>
<p>Tránh đặt sát tường ngoài hứng nắng mưa. Không để máy lạnh thổi trực tiếp lên bề mặt gỗ. Lau bụi bằng khăn ẩm vắt khô, sau đó lau khô. Có thể dùng dầu lau gỗ 6–12 tháng/lần với đồ gỗ tự nhiên.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1581539250439-c96689d51628?w=900',
    category: 'Kinh nghiệm chọn đồ gỗ',
    seo_title: 'Kiểm tra độ ẩm gỗ nội thất',
    seo_description: 'Hướng dẫn kiểm tra độ ẩm gỗ khi nhận tủ, giường, sofa tại nhà.',
    is_featured: false,
    published_at: new Date('2025-02-18T08:00:00Z'),
    sort_order: 3,
  },
  {
    slug: 'khong-gian-song-phong-khach-da-nang',
    title: 'Thiết kế phòng khách đa năng cho căn hộ nhỏ: sofa góc và ánh sáng',
    excerpt:
      'Phòng khách vừa tiếp khách vừa sinh hoạt cần bố trí thông minh. Gợi ý chọn sofa, màu sắc và ánh sáng cụ thể cho diện tích dưới 20m².',
    content: `<h2>Bắt đầu từ luồng đi</h2>
<p>Đặt sofa dọc tường dài hoặc góc chữ L để giữ lối đi rộng tối thiểu 80cm. Tránh chặn cửa ra vào và đường đi tới bếp.</p>
<h2>Chọn sofa phù hợp</h2>
<p>Sofa góc 2 chỗ tiết kiệm diện tích hơn sofa thẳng 3 chỗ trong căn hộ nhỏ. Nếu gia đình thường tiếp 3–4 khách, cân nhắc sofa 3 chỗ da/vải có độ đàn hồi tốt.</p>
<h2>Ánh sáng nhiều lớp</h2>
<ul>
<li><strong>Ánh sáng tổng thể:</strong> đèn trần sáng trung tính</li>
<li><strong>Ánh sáng vùng:</strong> đèn sàn cạnh sofa</li>
<li><strong>Ánh sáng điểm:</strong> đèn bàn hoặc kệ trang trí</li>
</ul>
<p>Màu tường sáng + sofa trung tính + 1 thảm lớn sẽ giúp phòng khách trông gọn và sang hơn nhiều đồ nhỏ rời rạc.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900',
    category: 'Không gian sống',
    seo_title: 'Phòng khách đa năng căn hộ nhỏ',
    seo_description: 'Bố trí phòng khách nhỏ với sofa góc, ánh sáng và màu sắc hợp lý.',
    is_featured: false,
    published_at: new Date('2025-02-22T08:00:00Z'),
    sort_order: 4,
  },
  {
    slug: 'khong-gian-song-phong-ngu-nghi-ngoi-tot',
    title: 'Phòng ngủ nghỉ ngơi tốt: chọn giường, tủ và ánh sáng đúng cách',
    excerpt:
      'Giấc ngủ chất lượng bắt đầu từ giường đúng kích thước, tủ gọn gàng và ánh sáng ấm trước khi ngủ. Hướng dẫn chi tiết từng bước.',
    content: `<h2>Chọn kích thước giường</h2>
<p>Phòng ngủ master thường dùng giường 1m8 x 2m. Phòng phụ 12–14m² có thể dùng 1m6. Để lối đi hai bên giường tối thiểu 60cm nếu có hai người cùng ngủ.</p>
<h2>Tủ quần áo và lưu trữ</h2>
<p>Tủ cánh lùa tiết kiệm không gian mở cửa hơn tủ cánh mở. Chia nội thất: 60% treo, 40% kệ gấp. Ngăn kéo đựng đồ lót và phụ kiện.</p>
<h2>Ánh sáng và màu sắc</h2>
<p>Đèn ngủ 2700–3000K, rèm che sáng kín. Màu tường sáng, gỗ ấm. Tránh TV đối diện giường nếu dễ mất ngủ.</p>
<p>Combo gợi ý: giường gỗ sồi 1m8 + tủ 4 cánh lùa + 1 đèn đọc sách — đủ cho phòng ngủ hiện đại, dễ vệ sinh.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=900',
    category: 'Không gian sống',
    seo_title: 'Thiết kế phòng ngủ nghỉ ngơi',
    seo_description: 'Chọn giường, tủ quần áo và ánh sáng cho phòng ngủ chất lượng.',
    is_featured: true,
    published_at: new Date('2025-03-01T08:00:00Z'),
    sort_order: 5,
  },
  {
    slug: 'phong-cach-scandinavian-go-nhien',
    title: 'Phong cách Scandinavian: làm sao để nhà sáng, ấm mà không lạnh',
    excerpt:
      'Scandinavian không chỉ là “toàn màu trắng”. Bí quyết nằm ở gỗ sáng, textile ấm và giảm đồ dư thừa.',
    content: `<h2>Nguyên tắc cốt lõi</h2>
<p>Scandinavian tôn vẻ đẹp của ánh sáng tự nhiên, đường nét đơn giản và chất liệu thật (gỗ, len, cotton). Không cần nhiều đồ — mỗi món phải có lý do tồn tại.</p>
<h2>Palette màu gợi ý</h2>
<ul>
<li>Nền: trắng ngà, xám nhạt</li>
<li>Gỗ: sồi, ash, beech sáng màu</li>
<li>Điểm nhấn: olive, terracotta nhạt, xanh ngọc pastel</li>
</ul>
<h2>Gợi ý nội thất gỗ</h2>
<p>Sofa góc bọc vải sáng, giường gỗ chân thấp, tủ trắng vân gỗ. Thảm len dày và rèm mỏng để không che cửa sổ.</p>
<p>Tránh quá nhiều đồ trang trí trên kệ — Scandinavian thích “không gian thở”.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900',
    category: 'Phong cách thiết kế',
    seo_title: 'Phong cách Scandinavian với gỗ',
    seo_description: 'Hướng dẫn phối nội thất gỗ phong cách Bắc Âu cho căn hộ.',
    is_featured: false,
    published_at: new Date('2025-03-05T08:00:00Z'),
    sort_order: 6,
  },
  {
    slug: 'phong-cach-indochine-go-mun-huong',
    title: 'Indochine hiện đại: gỗ trầm, ánh sáng vàng ấm trong nhà Việt',
    excerpt:
      'Indochine không nhất thiết đồ cổ. Bạn có thể kết hợp gỗ mun, gỗ hương với tường trắng và đèn lồng tre đan cho không gian sang mà ấm.',
    content: `<h2>Đặc trưng Indochine</h2>
<p>Gỗ trầm (mun, hương, gụ), hoạ tiết gạch men hoặc xi măng giả gỗ, đèn vàng ấm, không gian thoáng có chiều sâu. Không nên nhồi quá nhiều đồ thờ hoặc đồ cổ nếu nhà theo phong cách hiện đại.</p>
<h2>Cách phối với nội thất gỗ hiện đại</h2>
<p>Sofa hoặc ghế gỗ bọc vải linen, bàn trà thấp gỗ mun, rèm linen màu kem. Tránh đặt quá nhiều đồ sẫm màu trong cùng một góc.</p>
<h2>Mẹo cho căn hộ chung cư</h2>
<p>Dùng gương lớn tạo chiều sâu. Chọn 1–2 món gỗ chất lượng làm điểm nhấn thay vì nhiều món rẻ. Kết hợp cây xanh lá lớn để cân bằng tông gỗ trầm.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900',
    category: 'Phong cách thiết kế',
    seo_title: 'Phong cách Indochine với gỗ trầm',
    seo_description: 'Gợi ý phối Indochine hiện đại với gỗ mun, gỗ hương trong nhà Việt.',
    is_featured: false,
    published_at: new Date('2025-03-10T08:00:00Z'),
    sort_order: 7,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  const categorySlugs = CATEGORIES.map((c) => c.slug);
  const categoryMap = new Map<string, number>();

  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        thumbnail: cat.thumbnail,
        order_index: cat.order_index,
        seo_title: cat.seo_title,
        seo_description: cat.seo_description,
        is_active: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        thumbnail: cat.thumbnail,
        order_index: cat.order_index,
        seo_title: cat.seo_title,
        seo_description: cat.seo_description,
        is_active: true,
      },
    });
    categoryMap.set(cat.slug, row.id);
  }
  console.log('  ✓ Categories');

  const seededProductSlugs = PRODUCTS.map((p) => p.slug);
  const removedProducts = await prisma.product.deleteMany({
    where: { slug: { notIn: seededProductSlugs } },
  });
  if (removedProducts.count > 0) {
    console.log(`  ✓ Removed ${removedProducts.count} legacy products`);
  }

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category for product: ${p.categorySlug}`);
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku,
        short_description: p.shortDescription,
        description: p.description,
        price: p.price,
        sale_price: p.salePrice,
        category_id: categoryId,
        thumbnail: p.thumbnail,
        material: p.material,
        dimensions: p.dimensions,
        color: p.color,
        warranty: p.warranty,
        status: 'available',
        is_active: true,
        is_featured: p.is_featured ?? false,
        seo_title: p.seo_title ?? null,
        seo_description: p.seo_description ?? null,
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        short_description: p.shortDescription,
        description: p.description,
        price: p.price,
        sale_price: p.salePrice,
        category_id: categoryId,
        thumbnail: p.thumbnail,
        material: p.material,
        dimensions: p.dimensions,
        color: p.color,
        warranty: p.warranty,
        status: 'available',
        is_featured: p.is_featured ?? false,
        seo_title: p.seo_title ?? null,
        seo_description: p.seo_description ?? null,
      },
    });

    await prisma.productImage.deleteMany({ where: { product_id: product.id } });
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

  const removedCategories = await prisma.category.deleteMany({
    where: { slug: { notIn: categorySlugs } },
  });
  if (removedCategories.count > 0) {
    console.log(`  ✓ Removed ${removedCategories.count} legacy categories`);
  }

  const collectionSlugs = COLLECTIONS.map((c) => c.slug);
  const removedCollections = await prisma.collection.deleteMany({
    where: { slug: { notIn: collectionSlugs } },
  });
  if (removedCollections.count > 0) {
    console.log(`  ✓ Removed ${removedCollections.count} legacy collections`);
  }

  for (const col of COLLECTIONS) {
    const categoryIds = col.categorySlugs
      .map((slug) => categoryMap.get(slug))
      .filter((id): id is number => id !== undefined);

    const collection = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {
        name: col.name,
        description: col.description,
        thumbnail: col.thumbnail,
        seo_title: col.seo_title,
        seo_description: col.seo_description,
        order_index: col.order_index,
        is_active: true,
      },
      create: {
        name: col.name,
        slug: col.slug,
        description: col.description,
        thumbnail: col.thumbnail,
        seo_title: col.seo_title,
        seo_description: col.seo_description,
        order_index: col.order_index,
        is_active: true,
      },
    });

    await prisma.collectionProduct.deleteMany({
      where: { collection_id: collection.id },
    });

    const products = await prisma.product.findMany({
      where: { category_id: { in: categoryIds } },
      orderBy: { sort_order: 'asc' },
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
  console.log('  ✓ Collections (phong-khach, phong-ngu, phong-bep)');

  const seededBlogSlugs = BLOG_POSTS.map((p) => p.slug);
  const removedBlogs = await prisma.blogPost.deleteMany({
    where: { slug: { notIn: seededBlogSlugs } },
  });
  if (removedBlogs.count > 0) {
    console.log(`  ✓ Removed ${removedBlogs.count} legacy blog posts`);
  }

  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        thumbnail: post.thumbnail,
        category: post.category,
        author: AUTHOR,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        is_active: true,
        is_featured: post.is_featured,
        published_at: post.published_at,
        sort_order: post.sort_order,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        thumbnail: post.thumbnail,
        category: post.category,
        author: AUTHOR,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        is_active: true,
        is_featured: post.is_featured,
        published_at: post.published_at,
        sort_order: post.sort_order,
      },
    });
  }
  console.log('  ✓ Blog posts');

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

  const sampleProducts = await prisma.product.findMany({
    where: { category: { slug: 'sofa' } },
    take: 1,
  });
  if (sampleProducts.length > 0) {
    const count = await prisma.inquiry.count();
    if (count === 0) {
      await prisma.inquiry.create({
        data: {
          name: 'Nguyễn Văn A',
          phone: '0901234567',
          email: 'nguyenvana@example.com',
          message:
            'Tôi quan tâm sofa góc 2 chỗ bọc vải. Cho xin báo giá và thời gian giao hàng nội thành.',
          product_id: sampleProducts[0].id,
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
