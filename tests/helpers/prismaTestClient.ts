// Re-export the singleton Prisma client for test use.
// Wrap each integration test in a transaction and roll it back in afterEach
// to keep the test DB clean:
//
// beforeEach(async () => {
//   await prisma.$executeRaw`BEGIN`;
// });
// afterEach(async () => {
//   await prisma.$executeRaw`ROLLBACK`;
// });

export { prisma } from '../../src/config/prisma';
