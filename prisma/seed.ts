import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Create Prisma client with pg adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const firstNames = [
  "Alex", "Sarah", "Mike", "Emma", "James", "Olivia", "Noah", "Ava", "Liam", "Mia",
  "Lucas", "Sophie", "Ethan", "Chloe", "Mason", "Zoe", "Logan", "Lily", "Jack", "Emily",
  "Ryan", "Grace", "Tyler", "Hannah", "Dylan", "Ella", "Nathan", "Aria", "Brandon", "Luna",
  "Justin", "Stella", "Kevin", "Nora", "Aaron", "Hazel", "Adam", "Violet", "Kyle", "Aurora",
  "Jake", "Ivy", "Sean", "Ruby", "Cole", "Willow", "Luke", "Jade", "Max", "Isla",
  "Owen", "Cora", "Caleb", "Maya", "Henry", "Elena", "Leo", "Layla", "Eli", "Riley",
  "Daniel", "Zoey", "Matthew", "Penelope", "David", "Leah", "Joseph", "Audrey", "Carter", "Bella",
  "Jayden", "Claire", "Gabriel", "Skylar", "Isaac", "Ellie", "Andrew", "Paisley", "Joshua", "Savannah",
  "Connor", "Naomi", "Hunter", "Victoria", "Evan", "Brooklyn", "Jordan", "Scarlett", "Cameron", "Autumn",
  "Blake", "Madison", "Chase", "Addison", "Parker", "Piper", "Cooper", "Harper", "Tristan", "Quinn"
];

const lastNames = [
  "Smith", "Johnson", "Brown", "Davis", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Garcia",
  "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson",
  "Hill", "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans", "Turner", "Torres", "Parker",
  "Collins", "Edwards", "Stewart", "Flores", "Morris", "Murphy", "Rivera", "Cook", "Rogers", "Morgan"
];

const bios = [
  "Designer & developer",
  "Content creator | YouTuber",
  "Photographer based in NYC",
  "Music producer | DJ",
  "Fitness coach & nutritionist",
  "Travel blogger",
  "Software engineer",
  "Artist & illustrator",
  "Podcaster",
  "Fashion influencer",
  "Gamer & streamer",
  "Chef & food blogger",
  "Startup founder",
  "Yoga instructor",
  "Musician | Guitarist",
  "Digital nomad",
  "Marketing specialist",
  "Writer & author",
  "Life coach",
  "Tech enthusiast",
  "Entrepreneur",
  "Freelance creative",
  "Video editor",
  "UX/UI designer",
  "Data scientist",
  "Crypto investor",
  "Fitness model",
  "Beauty blogger",
  "Pet lover",
  "Coffee addict",
  null, // some users have no bio
  null,
  null,
];

const linkTemplates = [
  { title: "My Website", url: "https://example.com" },
  { title: "YouTube Channel", url: "https://youtube.com/@example" },
  { title: "Latest Project", url: "https://github.com/example" },
  { title: "Buy Me a Coffee", url: "https://buymeacoffee.com/example" },
  { title: "Newsletter", url: "https://newsletter.example.com" },
  { title: "Shop", url: "https://shop.example.com" },
  { title: "Blog", url: "https://blog.example.com" },
  { title: "Portfolio", url: "https://portfolio.example.com" },
  { title: "Contact Me", url: "mailto:hello@example.com" },
  { title: "Book a Call", url: "https://calendly.com/example" },
  { title: "Discord Server", url: "https://discord.gg/example" },
  { title: "Patreon", url: "https://patreon.com/example" },
  { title: "Merch Store", url: "https://merch.example.com" },
  { title: "Podcast", url: "https://podcast.example.com" },
  { title: "Courses", url: "https://courses.example.com" },
];

const socialTemplates = [
  { platform: "instagram", url: "https://instagram.com/example" },
  { platform: "twitter", url: "https://twitter.com/example" },
  { platform: "youtube", url: "https://youtube.com/@example" },
  { platform: "tiktok", url: "https://tiktok.com/@example" },
  { platform: "spotify", url: "https://open.spotify.com/user/example" },
  { platform: "github", url: "https://github.com/example" },
  { platform: "linkedin", url: "https://linkedin.com/in/example" },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUsername(firstName: string, lastName: string, index: number): string {
  const styles = [
    () => firstName.toLowerCase(),
    () => `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    () => `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    () => `${firstName.toLowerCase()}${getRandomInt(1, 99)}`,
    () => `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}`,
    () => `the${firstName.toLowerCase()}`,
    () => `${firstName.toLowerCase()}.${lastName.toLowerCase()[0]}`,
    () => `${lastName.toLowerCase()}${firstName.toLowerCase()[0]}`,
  ];

  // Use index to help ensure uniqueness
  const style = styles[index % styles.length];
  const base = style();

  // Add number suffix for later entries to avoid collisions
  if (index >= styles.length) {
    return `${base}${Math.floor(index / styles.length)}`;
  }

  return base;
}

async function main() {
  console.log("Seeding database with 100 users...\n");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const usedUsernames = new Set<string>();

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < 100; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    let username = generateUsername(firstName, lastName, i);

    // Ensure unique username in this batch
    let attempts = 0;
    while (usedUsernames.has(username) && attempts < 10) {
      username = `${username}${getRandomInt(1, 999)}`;
      attempts++;
    }
    usedUsernames.add(username);

    // Check if user already exists in DB
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const displayName = `${firstName} ${lastName}`;
    const bio = getRandomItem(bios);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: `${username}@example.com`,
        username,
        password: hashedPassword,
        displayName,
        bio,
        profileViews: getRandomInt(10, 10000),
      },
    });

    // Create random links for this user
    const userLinks = getRandomItems(linkTemplates, 2, 7);
    for (let j = 0; j < userLinks.length; j++) {
      await prisma.link.create({
        data: {
          userId: user.id,
          title: userLinks[j].title,
          url: userLinks[j].url.replace("example", username),
          order: j,
          type: "link",
        },
      });
    }

    // Create random social links
    const userSocials = getRandomItems(socialTemplates, 1, 5);
    for (let j = 0; j < userSocials.length; j++) {
      await prisma.link.create({
        data: {
          userId: user.id,
          title: userSocials[j].platform,
          url: userSocials[j].url.replace("example", username),
          order: userLinks.length + j,
          type: "social",
          platform: userSocials[j].platform,
        },
      });
    }

    created++;
    process.stdout.write(`\rCreated ${created} users...`);
  }

  console.log(`\n\nSeeding complete! Created ${created} users, skipped ${skipped} existing.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
