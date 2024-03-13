import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

// prisma = new PrismaClient();

// グローバルオブジェクト
// ホットリロードされても生成された時に1回だけ
// シングルトン
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
prisma = globalForPrisma.prisma;

// 全体に渡す
export default prisma;
