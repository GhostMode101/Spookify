// SpookieFY: Database initialization is now handled by Prisma Migrate.
// This file is kept as a no-op for backward compatibility.
// Run `npx prisma migrate dev` for schema changes.

const initializeDatabase = async () => {
  console.log('✓ Database managed by Prisma Migrate (no manual init needed)');
};

module.exports = { initializeDatabase };
