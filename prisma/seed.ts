import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@fitcosmetics.com.br" },
    update: {},
    create: {
      email: "admin@fitcosmetics.com.br",
      password: adminPassword,
      firstName: "Admin",
      lastName: "FIT",
      name: "Admin FIT",
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create brands
  const fitBrand = await prisma.brand.upsert({
    where: { slug: "fitcosmetics" },
    update: {},
    create: {
      name: "FIT Cosmetics",
      slug: "fitcosmetics",
      description:
        "Produtos profissionais de alta qualidade para tratamento capilar",
    },
  });

  const prohall = await prisma.brand.upsert({
    where: { slug: "prohall" },
    update: {},
    create: {
      name: "Prohall Professional",
      slug: "prohall",
      description: "Excelência em produtos para salões de beleza",
    },
  });

  const visat = await prisma.brand.upsert({
    where: { slug: "visat" },
    update: {},
    create: {
      name: "Visat Hair",
      slug: "visat",
      description: "Inovação e tecnologia para cuidados com os cabelos",
    },
  });

  const tyrrel = await prisma.brand.upsert({
    where: { slug: "tyrrel" },
    update: {},
    create: {
      name: "Tyrrel Professional",
      slug: "tyrrel",
      description: "Tratamentos profissionais de última geração",
    },
  });

  console.log("Brands created");

  // Create categories
  const progressivas = await prisma.category.upsert({
    where: { slug: "progressivas" },
    update: {},
    create: {
      name: "Progressivas",
      slug: "progressivas",
      description:
        "Tratamentos de alisamento profissional para todos os tipos de cabelo",
      image: "/images/product-progressiva-gold.jpg",
      position: 1,
    },
  });

  const kits = await prisma.category.upsert({
    where: { slug: "kits" },
    update: {},
    create: {
      name: "Kits Completos",
      slug: "kits",
      description:
        "Kits com tudo que você precisa para o tratamento perfeito",
      image: "/images/product-kit.jpg",
      position: 2,
    },
  });

  const manutencao = await prisma.category.upsert({
    where: { slug: "manutencao" },
    update: {},
    create: {
      name: "Manutenção",
      slug: "manutencao",
      description:
        "Produtos para manter seu cabelo liso e saudável por mais tempo",
      image: "/images/product-shampoo.jpg",
      position: 3,
    },
  });

  console.log("Categories created");

  // Create products
  const productsData = [
    {
      name: "Progressiva Profissional Gold",
      slug: "progressiva-profissional-gold",
      description:
        "Nossa progressiva premium com tecnologia de aminoácidos. Alisa profundamente, reduz volume e proporciona brilho intenso. Fórmula sem formol, segura para todos os tipos de cabelo. Duração de até 4 meses.",
      shortDescription:
        "Alisamento profundo com brilho intenso. Sem formol.",
      price: 189.9,
      compareAtPrice: 249.9,
      stock: 150,
      categoryId: progressivas.id,
      brandId: fitBrand.id,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewCount: 847,
      benefits: [
        "Alisa até 100% dos fios",
        "Reduz volume e frizz",
        "Brilho espelhado",
        "Sem formol",
        "Duração de até 4 meses",
        "Hidratação profunda",
      ],
      howToUse:
        "1. Lave o cabelo com shampoo antirresíduos. 2. Seque 80% do cabelo. 3. Aplique a progressiva mecha a mecha. 4. Deixe agir por 40 minutos. 5. Enxágue e seque completamente. 6. Prancha mecha a mecha.",
      composition:
        "Água, Álcool Cetílico, Óleo de Argan, Queratina Hidrolisada, Aminoácidos, Pantenol, Silicones de Alta Performance.",
      images: ["/images/product-progressiva-gold.jpg"],
    },
    {
      name: "Progressiva Platinum Ultra",
      slug: "progressiva-platinum-ultra",
      description:
        "A progressiva mais potente da nossa linha. Desenvolvida para cabelos extremamente resistentes e cacheados. Tecnologia de nano queratina para penetração máxima.",
      shortDescription:
        "Para cabelos resistentes. Máxima potência de alisamento.",
      price: 249.9,
      stock: 89,
      categoryId: progressivas.id,
      brandId: fitBrand.id,
      isFeatured: true,
      isNew: true,
      rating: 4.8,
      reviewCount: 523,
      benefits: [
        "Potência máxima",
        "Ideal para cabelos resistentes",
        "Nano queratina",
        "Efeito duradouro",
        "Reconstrução capilar",
        "Proteção térmica",
      ],
      howToUse:
        "1. Lave o cabelo com shampoo antirresíduos. 2. Seque 80% do cabelo. 3. Aplique a progressiva mecha a mecha. 4. Deixe agir por 50 minutos. 5. Enxágue e seque completamente. 6. Prancha mecha a mecha.",
      composition:
        "Água, Nano Queratina, Proteínas da Seda, Óleo de Macadâmia, Ceramidas, Vitamina E.",
      images: ["/images/product-progressiva-gold.jpg"],
    },
    {
      name: "Kit Progressiva Gold + Manutenção",
      slug: "kit-progressiva-gold-manutencao",
      description:
        "Kit completo com a Progressiva Gold + Shampoo e Condicionador de Manutenção. Tudo que você precisa para um alisamento perfeito e duradouro.",
      shortDescription:
        "Kit completo: progressiva + manutenção. Economia garantida.",
      price: 289.9,
      compareAtPrice: 379.9,
      stock: 67,
      categoryId: kits.id,
      brandId: fitBrand.id,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewCount: 392,
      benefits: [
        "Kit completo",
        "Economia de 25%",
        "Manutenção incluída",
        "Resultado profissional",
        "Frete grátis",
        "Duração prolongada",
      ],
      howToUse: "Siga as instruções de cada produto incluso no kit.",
      composition:
        "Progressiva Gold + Shampoo Manutenção 300ml + Condicionador Manutenção 300ml",
      images: ["/images/product-kit.jpg"],
    },
    {
      name: "Shampoo Manutenção Liso Perfeito",
      slug: "shampoo-manutencao-liso-perfeito",
      description:
        "Shampoo desenvolvido especialmente para cabelos com progressiva. Prolonga o efeito liso, hidrata profundamente e mantém o brilho.",
      shortDescription:
        "Prolonga o liso. Hidratação e brilho intensos.",
      price: 59.9,
      stock: 234,
      categoryId: manutencao.id,
      brandId: fitBrand.id,
      isFeatured: false,
      isNew: false,
      rating: 4.7,
      reviewCount: 1203,
      benefits: [
        "Prolonga o efeito liso",
        "Hidratação profunda",
        "Brilho intenso",
        "Sem sulfatos",
        "pH balanceado",
        "Uso diário",
      ],
      howToUse:
        "Aplique no cabelo molhado, massageie suavemente e enxágue. Repita se necessário.",
      composition:
        "Água, Lauril Éter Sulfato de Sódio, Cocamidopropil Betaína, Queratina, Pantenol, Óleo de Argan.",
      images: ["/images/product-shampoo.jpg"],
    },
    {
      name: "Condicionador Manutenção Liso Perfeito",
      slug: "condicionador-manutencao-liso-perfeito",
      description:
        "Condicionador que sela as cutículas e mantém o cabelo liso, macio e brilhante. Uso após o shampoo de manutenção.",
      shortDescription:
        "Sela cutículas. Maciez e brilho duradouros.",
      price: 59.9,
      stock: 198,
      categoryId: manutencao.id,
      brandId: fitBrand.id,
      isFeatured: false,
      isNew: false,
      rating: 4.8,
      reviewCount: 987,
      benefits: [
        "Sela as cutículas",
        "Maciez extrema",
        "Brilho duradouro",
        "Desembaraça",
        "Proteção térmica",
        "Sem enxágue opcional",
      ],
      howToUse:
        "Após o shampoo, aplique no comprimento e pontas. Deixe agir por 3 minutos e enxágue.",
      composition:
        "Água, Álcool Cetílico, Óleo de Coco, Queratina, Silicone, Vitamina E, Pantenol.",
      images: ["/images/product-shampoo.jpg"],
    },
    {
      name: "Máscara Reconstrutora Intensiva",
      slug: "mascara-reconstrutora-intensiva",
      description:
        "Máscara de tratamento intensivo para cabelos danificados. Reconstrói a fibra capilar e devolve a saúde dos fios.",
      shortDescription:
        "Reconstrução profunda. Para cabelos danificados.",
      price: 79.9,
      compareAtPrice: 99.9,
      stock: 145,
      categoryId: manutencao.id,
      brandId: fitBrand.id,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewCount: 654,
      benefits: [
        "Reconstrução intensa",
        "Repara danos",
        "Fortalece os fios",
        "Brilho saudável",
        "Maciez profunda",
        "Resultado imediato",
      ],
      howToUse:
        "Após o shampoo, aplique generosamente. Deixe agir por 10-15 minutos. Enxágue bem.",
      composition:
        "Água, Queratina Hidrolisada, Proteínas do Trigo, Óleo de Argan, Ceramidas, Aminoácidos.",
      images: ["/images/product-shampoo.jpg"],
    },
    {
      name: "Progressiva Express 30min",
      slug: "progressiva-express-30min",
      description:
        "Progressiva de ação rápida para quem tem pouco tempo. Resultado profissional em apenas 30 minutos de aplicação.",
      shortDescription:
        "Resultado em 30 minutos. Praticidade sem perder qualidade.",
      price: 159.9,
      stock: 78,
      categoryId: progressivas.id,
      brandId: fitBrand.id,
      isFeatured: false,
      isNew: true,
      rating: 4.6,
      reviewCount: 312,
      benefits: [
        "Ação rápida",
        "30 minutos",
        "Resultado profissional",
        "Sem formol",
        "Prático",
        "Ideal para retoque",
      ],
      howToUse:
        "1. Lave com shampoo antirresíduos. 2. Seque 80%. 3. Aplique e deixe 30 minutos. 4. Enxágue e prancha.",
      composition:
        "Água, Queratina Express, Aminoácidos, Óleo de Macadâmia, Silicones.",
      images: ["/images/product-progressiva-gold.jpg"],
    },
    {
      name: "Kit Profissional Salão",
      slug: "kit-profissional-salao",
      description:
        "Kit completo para profissionais. Inclui 3 progressivas Gold, shampoo antirresíduos 1L e kit manutenção. Ideal para salões.",
      shortDescription:
        "Kit para profissionais. Rende até 30 aplicações.",
      price: 699.9,
      compareAtPrice: 899.9,
      stock: 34,
      categoryId: kits.id,
      brandId: fitBrand.id,
      isFeatured: true,
      isNew: false,
      rating: 5.0,
      reviewCount: 189,
      benefits: [
        "Kit profissional",
        "30 aplicações",
        "Economia de 22%",
        "Produtos premium",
        "Suporte técnico",
        "Certificado incluso",
      ],
      howToUse:
        "Siga as instruções de cada produto. Suporte técnico disponível via WhatsApp.",
      composition:
        "3x Progressiva Gold 1L + Shampoo Antirresíduos 1L + Kit Manutenção Profissional",
      images: ["/images/product-kit.jpg"],
    },
  ];

  for (const productData of productsData) {
    const { images, ...data } = productData;
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });

    // Create product images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i],
          alt: product.name,
          position: i,
        },
      });
    }
  }
  console.log("Products created");

  // Create store settings
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      storeName: "FIT Cosmetics",
      storeEmail: "contato@fitcosmetics.com.br",
      storePhone: "(11) 99999-9999",
      storeWhatsapp: "5511999999999",
      freeShippingMin: 199,
      maxInstallments: 12,
      minInstallmentValue: 10,
      metaTitle: "FIT Cosmetics - Cosméticos Profissionais",
      metaDescription:
        "Seu e-commerce de cosméticos profissionais. Progressivas, kits completos e produtos de manutenção capilar.",
      socialInstagram: "https://instagram.com/fitcosmetics",
      socialFacebook: "https://facebook.com/fitcosmetics",
    },
  });
  console.log("Store settings created");

  // Create shipping zones
  await prisma.shippingZone.createMany({
    data: [
      {
        name: "São Paulo Capital",
        zipCodeStart: "01000000",
        zipCodeEnd: "09999999",
        basePrice: 12.9,
        estimatedDays: 3,
        freeShippingMin: 199,
      },
      {
        name: "São Paulo Interior",
        zipCodeStart: "10000000",
        zipCodeEnd: "19999999",
        basePrice: 18.9,
        estimatedDays: 5,
        freeShippingMin: 299,
      },
      {
        name: "Sudeste",
        zipCodeStart: "20000000",
        zipCodeEnd: "39999999",
        basePrice: 22.9,
        estimatedDays: 7,
        freeShippingMin: 349,
      },
      {
        name: "Sul / Centro-Oeste",
        zipCodeStart: "40000000",
        zipCodeEnd: "79999999",
        basePrice: 28.9,
        estimatedDays: 10,
        freeShippingMin: 399,
      },
      {
        name: "Norte / Nordeste",
        zipCodeStart: "80000000",
        zipCodeEnd: "99999999",
        basePrice: 34.9,
        estimatedDays: 14,
        freeShippingMin: 449,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Shipping zones created");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
