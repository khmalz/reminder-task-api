import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const staticCategoryTypes = [{ name: 'TASK_KIND' }, { name: 'TASK_TYPE' }, { name: 'TASK_COLLECTION' }];

const categoriesByType: Record<string, string[]> = {
   TASK_KIND: ['Makalah', 'PPT'],
   TASK_TYPE: ['Individu', 'Kelompok'],
   TASK_COLLECTION: ['Drive', 'LMS'],
};

async function main() {
   console.log('Start seeding static users data...');

   for (const typeData of staticCategoryTypes) {
      const type = await prisma.categoryType.upsert({
         where: { name: typeData.name },
         update: {},
         create: typeData,
      });
      console.log(`Created or updated CategoryType with ID: ${type.id} and Name: ${type.name}`);

      // Seed categories for this type with userId = null (shared categories)
      const titles = categoriesByType[typeData.name];
      if (titles && titles.length) {
         for (const title of titles) {
            const existing = await prisma.category.findFirst({
               where: {
                  title,
                  typeId: type.id,
                  userId: null,
               },
            });

            if (!existing) {
               const created = await prisma.category.create({
                  data: {
                     title,
                     typeId: type.id,
                     userId: null,
                  },
               });
               console.log(`Created Category with ID: ${created.id}, Title: ${created.title}, Type: ${type.name}`);
            } else {
               console.log(`Category already exists: ${existing.id} (${existing.title}) for Type: ${type.name}`);
            }
         }
      }
   }

   console.log('Seeding finished.');
}

main()
   .catch(e => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
