import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { admins } from "../src/data/admin";

async function seedAdminsFromEnv() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "";
  const adminName = process.env.SEED_ADMIN_NAME || "Admin";
  if (!adminEmail || !adminPassword) return;
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash, isActive: true },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      isActive: true,
    },
  });
}

async function seedAdminsFromFile() {
  for (const a of admins) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    await prisma.admin.upsert({
      where: { email: a.email.toLowerCase() },
      update: {
        name: a.name ?? null,
        passwordHash,
        isActive: a.isActive ?? true,
      },
      create: {
        email: a.email.toLowerCase(),
        name: a.name ?? null,
        passwordHash,
        isActive: a.isActive ?? true,
      },
    });
  }
}

async function main() {
  await seedAdminsFromEnv();
  await seedAdminsFromFile();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
