const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  
  await prisma.commentaire.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  //creating 10 users
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `author${i}@enset.com`,
        nom: faker.person.lastName(),
        password: faker.internet.password(),
        role: 'AUTHOR',
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }
//admin
  const admin = await prisma.user.create({
    data: {
      email:  `admin@enset.com`,
      nom: faker.person.lastName(),
      password: faker.internet.password(),
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user with id: ${admin.id}`);
//categorie
  for (let i = 0; i < 10; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.department(),
      },
    });
    console.log(`Created category with id: ${category.id}`);
  }



//articles 
const users = await prisma.user.findMany({ where: { role: 'AUTHOR' } });
const categories = await prisma.category.findMany();

for (let i = 0; i < 100; i++) {
  const randomUser = users[Math.floor(Math.random() * users.length)];
  const randomCategories = categories
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 1);

  const article = await prisma.article.create({
    data: {
      titre: faker.lorem.sentence(),
      contenu: faker.lorem.paragraphs(),
      image: faker.image.imageUrl(),
      published: faker.datatype.boolean(),
      author: { connect: { id: randomUser.id } },
      categories: { connect: randomCategories.map((c) => ({ id: c.id })) },
    },
  });
  console.log(`Created article with id: ${article.id}`);
}


//comments 20 

const articles = await prisma.article.findMany();

for (const article of articles) {
  const numComments = Math.floor(Math.random() * 21);

  for (let i = 0; i < numComments; i++) {
    await prisma.commentaire.create({
      data: {
        email: faker.internet.email(),
        contenu: faker.lorem.sentences(),
        article: { connect: { id: article.id } },
      },
    });
  }

  console.log(`Created ${numComments} comments for article with id: ${article.id}`);
}

}





main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
