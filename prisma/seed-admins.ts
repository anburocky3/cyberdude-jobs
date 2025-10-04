import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type AdminSeed = {
  email: string;
  password: string;
  name?: string;
  isActive?: boolean;
};

function isAdminSeed(value: unknown): value is AdminSeed {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { email?: unknown }).email === "string" &&
    typeof (value as { password?: unknown }).password === "string"
  );
}

function isAdminSeedArray(value: unknown): value is AdminSeed[] {
  return Array.isArray(value) && value.every(isAdminSeed);
}

async function loadAdminsFromFile(): Promise<AdminSeed[]> {
  try {
    const filePath = path.resolve(process.cwd(), "src/data/admin.ts");
    const url = pathToFileURL(filePath).href;
    const mod = (await import(url)) as { admins?: unknown };
    if (isAdminSeedArray(mod.admins)) return mod.admins;
  } catch {}
  return [];
}

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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function seedAdminsFromFile() {
  const admins = await loadAdminsFromFile();
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
