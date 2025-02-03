import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));

  await prisma.user.createMany({
    data: users,
  });

  const posts = Array.from({ length: 100 }, () => ({
    content: faker.lorem.paragraphs(3),
    authorId: faker.helpers.arrayElement(users).id,
  }));

  await prisma.post.createMany({
    data: posts,
  });
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
