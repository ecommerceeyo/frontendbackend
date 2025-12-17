import { PrismaClient, AdminRole, PaymentMethod, PaymentStatus, DeliveryStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================
  // 1. Create Admin Users
  // ============================================
  console.log('👤 Creating admin users...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);

  const superAdmin = await prisma.admin.upsert({
    where: { email: 'superadmin@ecommerce.com' },
    update: {},
    create: {
      email: 'superadmin@ecommerce.com',
      passwordHash: superAdminPassword,
      name: 'Super Admin',
      role: AdminRole.SUPER_ADMIN,
      active: true,
    },
  });

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: AdminRole.ADMIN,
      active: true,
    },
  });

  console.log(`  ✓ Created super admin: ${superAdmin.email}`);
  console.log(`  ✓ Created admin: ${admin.email}`);

  // ============================================
  // 2. Create Categories
  // ============================================
  console.log('\n📁 Creating categories...');

  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      active: true,
      sortOrder: 1,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      active: true,
      sortOrder: 2,
    },
  });

  const homeGarden = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home decor and garden supplies',
      active: true,
      sortOrder: 3,
    },
  });

  // Sub-categories
  const phones = await prisma.category.upsert({
    where: { slug: 'phones' },
    update: {},
    create: {
      name: 'Phones',
      slug: 'phones',
      description: 'Smartphones and mobile devices',
      parentId: electronics.id,
      active: true,
      sortOrder: 1,
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptop computers',
      parentId: electronics.id,
      active: true,
      sortOrder: 2,
    },
  });

  console.log(`  ✓ Created ${5} categories`);

  // ============================================
  // 3. Create Products
  // ============================================
  console.log('\n📦 Creating products...');

  const products = [
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system.',
      price: 850000,
      currency: 'XAF',
      comparePrice: 900000,
      sku: 'IPHONE-15-PM-256',
      stock: 25,
      lowStockThreshold: 5,
      categoryIds: [phones.id, electronics.id],
      active: true,
      featured: true,
      images: [
        { url: 'https://placeholder.com/iphone15-1.jpg', publicId: 'products/iphone15-1', isPrimary: true, sortOrder: 0 },
        { url: 'https://placeholder.com/iphone15-2.jpg', publicId: 'products/iphone15-2', isPrimary: false, sortOrder: 1 },
        { url: 'https://placeholder.com/iphone15-3.jpg', publicId: 'products/iphone15-3', isPrimary: false, sortOrder: 2 },
      ],
      specifications: [
        { key: 'Screen Size', value: '6.7 inches', group: 'Display', sortOrder: 0 },
        { key: 'Resolution', value: '2796 x 1290 pixels', group: 'Display', sortOrder: 1 },
        { key: 'Processor', value: 'A17 Pro', group: 'Performance', sortOrder: 2 },
        { key: 'RAM', value: '8GB', group: 'Performance', sortOrder: 3 },
        { key: 'Storage', value: '256GB', group: 'Storage', sortOrder: 4 },
        { key: 'Camera', value: '48MP + 12MP + 12MP', group: 'Camera', sortOrder: 5 },
        { key: 'Battery', value: '4422 mAh', group: 'Battery', sortOrder: 6 },
        { key: 'Color', value: 'Natural Titanium', group: 'Physical', sortOrder: 7 },
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Samsung flagship with S Pen, 200MP camera, and Galaxy AI features.',
      price: 780000,
      currency: 'XAF',
      sku: 'SAMSUNG-S24U-256',
      stock: 30,
      lowStockThreshold: 5,
      categoryIds: [phones.id, electronics.id],
      active: true,
      featured: true,
      images: [
        { url: 'https://placeholder.com/s24ultra-1.jpg', publicId: 'products/s24ultra-1', isPrimary: true, sortOrder: 0 },
        { url: 'https://placeholder.com/s24ultra-2.jpg', publicId: 'products/s24ultra-2', isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { key: 'Screen Size', value: '6.8 inches', group: 'Display', sortOrder: 0 },
        { key: 'Resolution', value: '3120 x 1440 pixels', group: 'Display', sortOrder: 1 },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3', group: 'Performance', sortOrder: 2 },
        { key: 'RAM', value: '12GB', group: 'Performance', sortOrder: 3 },
        { key: 'Storage', value: '256GB', group: 'Storage', sortOrder: 4 },
        { key: 'Camera', value: '200MP + 50MP + 12MP + 10MP', group: 'Camera', sortOrder: 5 },
        { key: 'Battery', value: '5000 mAh', group: 'Battery', sortOrder: 6 },
        { key: 'Color', value: 'Titanium Black', group: 'Physical', sortOrder: 7 },
        { key: 'S Pen', value: 'Included', group: 'Accessories', sortOrder: 8 },
      ],
    },
    {
      name: 'MacBook Pro 14"',
      slug: 'macbook-pro-14',
      description: 'Apple MacBook Pro with M3 Pro chip, 18GB RAM, and stunning Liquid Retina XDR display.',
      price: 1500000,
      currency: 'XAF',
      sku: 'MBP-14-M3P-512',
      stock: 15,
      lowStockThreshold: 3,
      categoryIds: [laptops.id, electronics.id],
      active: true,
      featured: true,
      specifications: [
        { key: 'Screen Size', value: '14.2 inches', group: 'Display', sortOrder: 0 },
        { key: 'Resolution', value: '3024 x 1964 pixels', group: 'Display', sortOrder: 1 },
        { key: 'Processor', value: 'Apple M3 Pro', group: 'Performance', sortOrder: 2 },
        { key: 'RAM', value: '18GB', group: 'Performance', sortOrder: 3 },
        { key: 'Storage', value: '512GB SSD', group: 'Storage', sortOrder: 4 },
        { key: 'Battery Life', value: 'Up to 17 hours', group: 'Battery', sortOrder: 5 },
        { key: 'Weight', value: '1.6 kg', group: 'Physical', sortOrder: 6 },
        { key: 'Color', value: 'Space Black', group: 'Physical', sortOrder: 7 },
      ],
      images: [
        { url: 'https://placeholder.com/mbp14-1.jpg', publicId: 'products/mbp14-1', isPrimary: true, sortOrder: 0 },
        { url: 'https://placeholder.com/mbp14-2.jpg', publicId: 'products/mbp14-2', isPrimary: false, sortOrder: 1 },
      ],
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Premium Windows laptop with Intel Core i7, 16GB RAM, and OLED display.',
      price: 950000,
      currency: 'XAF',
      sku: 'DELL-XPS15-I7',
      stock: 20,
      lowStockThreshold: 4,
      categoryIds: [laptops.id, electronics.id],
      active: true,
      featured: false,
      images: [
        { url: 'https://placeholder.com/xps15-1.jpg', publicId: 'products/xps15-1', isPrimary: true, sortOrder: 0 },
      ],
      specifications: [
        { key: 'Screen Size', value: '15.6 inches', group: 'Display', sortOrder: 0 },
        { key: 'Resolution', value: '3456 x 2160 OLED', group: 'Display', sortOrder: 1 },
        { key: 'Processor', value: 'Intel Core i7-13700H', group: 'Performance', sortOrder: 2 },
        { key: 'RAM', value: '16GB DDR5', group: 'Performance', sortOrder: 3 },
        { key: 'Storage', value: '512GB SSD', group: 'Storage', sortOrder: 4 },
        { key: 'Weight', value: '1.86 kg', group: 'Physical', sortOrder: 5 },
        { key: 'Color', value: 'Platinum Silver', group: 'Physical', sortOrder: 6 },
      ],
    },
    {
      name: 'Men\'s Cotton T-Shirt',
      slug: 'mens-cotton-tshirt',
      description: 'Premium quality 100% cotton t-shirt, comfortable and breathable.',
      price: 15000,
      currency: 'XAF',
      sku: 'TSHIRT-M-BLK-L',
      stock: 100,
      lowStockThreshold: 20,
      categoryIds: [clothing.id],
      active: true,
      featured: false,
      images: [
        { url: 'https://placeholder.com/tshirt-1.jpg', publicId: 'products/tshirt-1', isPrimary: true, sortOrder: 0 },
        { url: 'https://placeholder.com/tshirt-2.jpg', publicId: 'products/tshirt-2', isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { key: 'Material', value: '100% Cotton', group: 'Fabric', sortOrder: 0 },
        { key: 'Size', value: 'L', group: 'Fit', sortOrder: 1 },
        { key: 'Color', value: 'Black', group: 'Appearance', sortOrder: 2 },
        { key: 'Fit Type', value: 'Regular Fit', group: 'Fit', sortOrder: 3 },
        { key: 'Care', value: 'Machine Washable', group: 'Care', sortOrder: 4 },
      ],
    },
    {
      name: 'Women\'s Summer Dress',
      slug: 'womens-summer-dress',
      description: 'Elegant summer dress with floral pattern, perfect for any occasion.',
      price: 35000,
      currency: 'XAF',
      comparePrice: 45000,
      sku: 'DRESS-W-FLR-M',
      stock: 50,
      lowStockThreshold: 10,
      categoryIds: [clothing.id],
      active: true,
      featured: true,
      images: [
        { url: 'https://placeholder.com/dress-1.jpg', publicId: 'products/dress-1', isPrimary: true, sortOrder: 0 },
        { url: 'https://placeholder.com/dress-2.jpg', publicId: 'products/dress-2', isPrimary: false, sortOrder: 1 },
        { url: 'https://placeholder.com/dress-3.jpg', publicId: 'products/dress-3', isPrimary: false, sortOrder: 2 },
      ],
      specifications: [
        { key: 'Material', value: 'Polyester Blend', group: 'Fabric', sortOrder: 0 },
        { key: 'Size', value: 'M', group: 'Fit', sortOrder: 1 },
        { key: 'Pattern', value: 'Floral', group: 'Appearance', sortOrder: 2 },
        { key: 'Length', value: 'Knee Length', group: 'Fit', sortOrder: 3 },
        { key: 'Sleeve', value: 'Sleeveless', group: 'Fit', sortOrder: 4 },
        { key: 'Care', value: 'Hand Wash Recommended', group: 'Care', sortOrder: 5 },
      ],
    },
    {
      name: 'Modern Table Lamp',
      slug: 'modern-table-lamp',
      description: 'Stylish LED table lamp with touch dimmer and USB charging port.',
      price: 25000,
      currency: 'XAF',
      sku: 'LAMP-TBL-LED-01',
      stock: 40,
      lowStockThreshold: 8,
      categoryIds: [homeGarden.id],
      active: true,
      featured: false,
      images: [
        { url: 'https://placeholder.com/lamp-1.jpg', publicId: 'products/lamp-1', isPrimary: true, sortOrder: 0 },
      ],
      specifications: [
        { key: 'Light Type', value: 'LED', group: 'Lighting', sortOrder: 0 },
        { key: 'Wattage', value: '10W', group: 'Lighting', sortOrder: 1 },
        { key: 'Color Temperature', value: '3000K-6000K Adjustable', group: 'Lighting', sortOrder: 2 },
        { key: 'Material', value: 'Metal + Fabric Shade', group: 'Physical', sortOrder: 3 },
        { key: 'Height', value: '45 cm', group: 'Dimensions', sortOrder: 4 },
        { key: 'Features', value: 'Touch Dimmer, USB Port', group: 'Features', sortOrder: 5 },
      ],
    },
    {
      name: 'Indoor Plant Set',
      slug: 'indoor-plant-set',
      description: 'Set of 3 beautiful indoor plants with decorative pots, perfect for home decoration.',
      price: 45000,
      currency: 'XAF',
      sku: 'PLANT-SET-3',
      stock: 25,
      lowStockThreshold: 5,
      categoryIds: [homeGarden.id],
      active: true,
      featured: false,
      images: [
        { url: 'https://placeholder.com/plants-1.jpg', publicId: 'products/plants-1', isPrimary: true, sortOrder: 0 },
        { url: 'https://placeholder.com/plants-2.jpg', publicId: 'products/plants-2', isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { key: 'Quantity', value: '3 Plants', group: 'Contents', sortOrder: 0 },
        { key: 'Plant Types', value: 'Snake Plant, Pothos, Peace Lily', group: 'Contents', sortOrder: 1 },
        { key: 'Pot Material', value: 'Ceramic', group: 'Accessories', sortOrder: 2 },
        { key: 'Light Requirement', value: 'Low to Medium', group: 'Care', sortOrder: 3 },
        { key: 'Watering', value: 'Weekly', group: 'Care', sortOrder: 4 },
        { key: 'Pet Safe', value: 'No (Pothos toxic to pets)', group: 'Safety', sortOrder: 5 },
      ],
    },
  ];

  for (const productData of products) {
    const { images, categoryIds, specifications, ...product } = productData;

    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });

    // Create product-category relationships (many-to-many)
    for (let i = 0; i < categoryIds.length; i++) {
      await prisma.productCategory.create({
        data: {
          productId: createdProduct.id,
          categoryId: categoryIds[i],
          sortOrder: i,
        },
      });
    }

    // Create images for the product
    for (const image of images) {
      await prisma.productImage.create({
        data: {
          ...image,
          productId: createdProduct.id,
        },
      });
    }

    // Create specifications for the product
    if (specifications) {
      for (const spec of specifications) {
        await prisma.productSpecification.create({
          data: {
            ...spec,
            productId: createdProduct.id,
          },
        });
      }
    }
  }

  console.log(`  ✓ Created ${products.length} products with images and specifications`);

  // ============================================
  // 4. Create Sample Couriers
  // ============================================
  console.log('\n🚚 Creating couriers...');

  const couriers = [
    { name: 'Jean-Pierre Mballa', phone: '+237650000001', email: 'jp.mballa@delivery.com' },
    { name: 'Marie Claire Nguemo', phone: '+237650000002', email: 'mc.nguemo@delivery.com' },
    { name: 'Paul Tchinda', phone: '+237650000003', email: 'p.tchinda@delivery.com' },
  ];

  for (const courier of couriers) {
    await prisma.courier.create({
      data: courier,
    });
  }

  console.log(`  ✓ Created ${couriers.length} couriers`);

  // ============================================
  // 5. Create Application Settings
  // ============================================
  console.log('\n⚙️  Creating application settings...');

  const settings = [
    {
      key: 'store_info',
      value: {
        name: 'E-Commerce Store',
        address: 'Rue de la Liberté, Yaoundé',
        city: 'Yaoundé',
        country: 'Cameroon',
        phone: '+237600000000',
        email: 'contact@ecommerce.com',
        whatsapp: '+237600000000',
      },
    },
    {
      key: 'payment_methods_enabled',
      value: {
        momo: true,
        cod: true,
        momo_providers: ['MTN_MOMO', 'ORANGE_MONEY'],
      },
    },
    {
      key: 'delivery_settings',
      value: {
        default_fee: 2000,
        free_delivery_threshold: 100000,
        estimated_days_min: 1,
        estimated_days_max: 3,
        delivery_zones: ['Yaoundé', 'Douala', 'Bafoussam'],
      },
    },
    {
      key: 'notification_settings',
      value: {
        admin_email: 'admin@ecommerce.com',
        admin_whatsapp: '+237600000000',
        send_order_confirmation_sms: true,
        send_delivery_updates_sms: true,
        send_order_confirmation_email: true,
      },
    },
    {
      key: 'currency_settings',
      value: {
        default_currency: 'XAF',
        currency_symbol: 'FCFA',
        decimal_places: 0,
      },
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log(`  ✓ Created ${settings.length} settings`);

  // ============================================
  // 6. Create Sample Orders (for testing)
  // ============================================
  console.log('\n🛒 Creating sample orders...');

  // Get created products for order items
  const sampleProducts = await prisma.product.findMany({ take: 3 });

  const sampleOrders = [
    {
      orderNumber: 'ORD-20241201-001',
      customerPhone: '+237670000001',
      customerEmail: 'customer1@email.com',
      customerName: 'Emmanuel Nkolo',
      customerAddress: '123 Avenue Kennedy',
      customerCity: 'Yaoundé',
      customerRegion: 'Centre',
      itemsSnapshot: sampleProducts.slice(0, 2).map(p => ({
        productId: p.id,
        name: p.name,
        price: Number(p.price),
        quantity: 1,
        imageUrl: 'https://placeholder.com/product.jpg',
      })),
      paymentMethod: PaymentMethod.MOMO,
      paymentStatus: PaymentStatus.PAID,
      deliveryStatus: DeliveryStatus.DELIVERED,
      subtotal: Number(sampleProducts[0].price) + Number(sampleProducts[1].price),
      deliveryFee: 2000,
      discount: 0,
      total: Number(sampleProducts[0].price) + Number(sampleProducts[1].price) + 2000,
      currency: 'XAF',
    },
    {
      orderNumber: 'ORD-20241201-002',
      customerPhone: '+237670000002',
      customerEmail: 'customer2@email.com',
      customerName: 'Sylvie Atangana',
      customerAddress: '45 Rue de la Paix',
      customerCity: 'Douala',
      customerRegion: 'Littoral',
      itemsSnapshot: [{
        productId: sampleProducts[2].id,
        name: sampleProducts[2].name,
        price: Number(sampleProducts[2].price),
        quantity: 2,
        imageUrl: 'https://placeholder.com/product.jpg',
      }],
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      deliveryStatus: DeliveryStatus.IN_TRANSIT,
      subtotal: Number(sampleProducts[2].price) * 2,
      deliveryFee: 2000,
      discount: 5000,
      total: (Number(sampleProducts[2].price) * 2) + 2000 - 5000,
      currency: 'XAF',
    },
  ];

  for (const orderData of sampleOrders) {
    const order = await prisma.order.create({
      data: orderData,
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: order.paymentMethod,
        provider: order.paymentMethod === PaymentMethod.MOMO ? 'MTN_MOMO' : null,
        amount: order.total,
        currency: order.currency,
        status: order.paymentStatus,
        paidAt: order.paymentStatus === PaymentStatus.PAID ? new Date() : null,
      },
    });

    // Create delivery record
    const couriersList = await prisma.courier.findMany();
    await prisma.delivery.create({
      data: {
        orderId: order.id,
        courierId: couriersList[0]?.id,
        status: order.deliveryStatus,
        trackingNumber: `TRK-${order.orderNumber}`,
        assignedAt: new Date(),
        pickedUpAt: order.deliveryStatus !== DeliveryStatus.PENDING ? new Date() : null,
        deliveredAt: order.deliveryStatus === DeliveryStatus.DELIVERED ? new Date() : null,
      },
    });
  }

  console.log(`  ✓ Created ${sampleOrders.length} sample orders with payments and deliveries`);

  // ============================================
  // 7. Create Sample Daily Sales Report
  // ============================================
  console.log('\n📊 Creating sample daily sales report...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailySalesReport.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      totalOrders: 2,
      completedOrders: 1,
      cancelledOrders: 0,
      pendingOrders: 1,
      grossSales: sampleOrders.reduce((sum, o) => sum + o.subtotal, 0),
      totalDiscount: sampleOrders.reduce((sum, o) => sum + o.discount, 0),
      totalDeliveryFees: sampleOrders.reduce((sum, o) => sum + o.deliveryFee, 0),
      netSales: sampleOrders.reduce((sum, o) => sum + o.total, 0),
      momoPayments: 1,
      momoAmount: sampleOrders[0].total,
      codPayments: 1,
      codAmount: sampleOrders[1].total,
      itemsSold: 4,
      uniqueProducts: 3,
      currency: 'XAF',
    },
  });

  console.log('  ✓ Created daily sales report');

  // ============================================
  // 8. Create Sample Inventory Logs
  // ============================================
  console.log('\n📋 Creating sample inventory logs...');

  for (const product of sampleProducts) {
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        productName: product.name,
        previousStock: 0,
        newStock: product.stock,
        change: product.stock,
        reason: 'RESTOCK',
        referenceType: 'INITIAL',
        notes: 'Initial stock load',
        performedBy: superAdmin.id,
      },
    });
  }

  console.log(`  ✓ Created ${sampleProducts.length} inventory log entries`);

  // ============================================
  // Done!
  // ============================================
  console.log('\n✅ Database seed completed successfully!\n');
  console.log('📝 Summary:');
  console.log('   - 2 Admin users (superadmin@ecommerce.com / admin@ecommerce.com)');
  console.log('   - 5 Categories (with hierarchy)');
  console.log('   - 8 Products with images');
  console.log('   - 3 Couriers');
  console.log('   - 5 Application settings');
  console.log('   - 2 Sample orders');
  console.log('   - 1 Daily sales report');
  console.log('   - 3 Inventory log entries\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
