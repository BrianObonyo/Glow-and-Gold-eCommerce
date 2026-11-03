import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (name: string) => `/images/products/${name}.jfif`;

const products = [
  { name: "Velvet Matte Lipstick", description: "A richly pigmented matte lipstick in a deep rosewood shade. Comfortable, non-drying, all-day colour.", priceCents: 2400, category: "makeup", stock: 80, imageUrl: img("velvet-lipstick") },
  { name: "Satin Lip Gloss", description: "High-shine gloss with a soft petal tint and a cushiony, non-sticky feel.", priceCents: 1800, category: "makeup", stock: 95, imageUrl: img("satin-gloss") },
  { name: "Silk Skin Foundation", description: "Lightweight, buildable coverage with a natural satin finish. 30ml.", priceCents: 3800, category: "makeup", stock: 60, imageUrl: img("silk-foundation") },
  { name: "Rose Gold Powder Compact", description: "Finely milled setting powder in a refillable rose gold compact.", priceCents: 3200, category: "makeup", stock: 45, imageUrl: img("rose-compact") },
  { name: "Golden Hour Eyeshadow Palette", description: "Eight warm shades from soft matte to glittering metallic. Highly blendable.", priceCents: 4600, category: "makeup", stock: 40, imageUrl: img("golden-hour-palette") },
  { name: "Lengthening Mascara", description: "Defines, lengthens and separates lashes without clumping. Smudge-resistant.", priceCents: 2200, category: "makeup", stock: 110, imageUrl: img("lengthening-mascara") },
  { name: "Soft Blush Duo", description: "Two complementary blush shades that blend into a natural flush of colour.", priceCents: 2600, category: "makeup", stock: 4, imageUrl: img("soft-blush-duo") },
  { name: "Five-Piece Brush Set", description: "Soft synthetic brushes for face and eyes, cruelty-free and easy to clean.", priceCents: 4200, category: "makeup", stock: 35, imageUrl: img("brush-set") },
  { name: "Pearl Drop Earrings", description: "Freshwater-style pearl drops on 18k gold-plated hooks. Light enough for every day.", priceCents: 5800, category: "jewelry", stock: 25, imageUrl: img("pearl-drop-earrings") },
  { name: "Gold Layered Necklace", description: "Two delicate chains layered with a small round pendant. Gold-plated stainless steel.", priceCents: 7200, category: "jewelry", stock: 20, imageUrl: img("layered-necklace") },
  { name: "Stacking Ring Set", description: "A set of slim rings in gold and rose finishes, made to be worn together or apart.", priceCents: 4900, category: "jewelry", stock: 50, imageUrl: img("stacking-rings") },
  { name: "Crystal Tennis Bracelet", description: "A continuous line of sparkling crystals on an adjustable gold-plated chain.", priceCents: 8500, category: "jewelry", stock: 3, imageUrl: img("crystal-bracelet") },
];

async function main() {
  // SEED_RESET=1 wipes catalog, carts and orders first. Otherwise seeding is skipped if products exist.
  if (process.env.SEED_RESET) {
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
  } else if ((await prisma.product.count()) > 0) {
    for (const product of products) {
      await prisma.product.updateMany({
        where: { name: product.name },
        data: { imageUrl: product.imageUrl },
      });
    }
    console.log("Updated image paths for existing products without changing products, carts, or orders.");
    return;
  }

  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
