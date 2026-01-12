
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding ...');

  // Create 10 dummy users
  for (let i = 0; i < 1; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const username = faker.internet.username({ firstName, lastName });

    const user = await prisma.user.create({
      data: {
        username: username,
        name: `${firstName} ${lastName}`,
        email: email,
        points: faker.number.int({ min:5000, max: 10000 }),
        role: 'user',
      },
    });

    console.log(`Created user: ${user.name} (${user.id})`);

    // Create Activities for each user

    // 1. TimeBlocks
    await prisma.timeBlock.createMany({
        data: [
            {
                userId: user.id,
                task: "Morning Drill",
                startTime: "06:00",
                endTime: "07:00",
                date: new Date().toISOString().split('T')[0],
                strict: true,
                completed: true
            },
            {
                userId: user.id,
                task: "Deep Work",
                startTime: "09:00",
                endTime: "12:00",
                date: new Date().toISOString().split('T')[0],
                strict: true,
                completed: false
            }
        ]
    });

    // 2. Rituals
    await prisma.ritual.create({
        data: {
            userId: user.id,
            date: new Date().toISOString().split('T')[0],
            vow: "No distraction before noon",
            completedDailyCheckIn: faker.datatype.boolean()
        }
    });

    // 3. Timers
    await prisma.timer.create({
        data: {
            userId: user.id,
            codename: "FOCUS_SESSION",
            title: "Focus Session",
            failures: 0,
            timerStarted: new Date().toISOString(),
        }
    });

    // 4. Hourly Checkins
    await prisma.hourlyCheckin.create({
        data: {
            userId: user.id,
            note: "Checking in, all good",
            tag: "Productive",
            entryDate: new Date().toISOString().split('T')[0],
        }
    });

    // 5. Violations
    if (Math.random() > 0.7) {
        await prisma.violation.create({
            data: {
                userId: user.id,
                type: 'MISSED_BLOCK',
                tauntStatement: "You missed it!",
                dateString: new Date().toISOString().split('T')[0]
            }
        });
    }

    // 6. Urges
    await prisma.urge.create({
        data: {
            userId: user.id,
            urgeIntensity: 7,
            urgeType: 'DISTRACTION',
            urgeNotes: "Resisted checking phone",
            date: new Date().toISOString().split('T')[0],
            urgeResolved: true
        }
    });

    // 7. Points Txn
    await prisma.pointsTxn.create({
        data: {
            userId: user.id,
            type: 'TIMEBLOCK_COMPLETE_CREDIT',
            points: 10,
            balanceAfter: 10
        }
    });
    
     // 8. Mood Tracker
    await prisma.moodTracker.create({
        data: {
            userId: user.id,
            moodType: 'HAPPY',
            intensity: 8,
            notes: "Feeling great",
            date: new Date().toISOString().split('T')[0]
        }
    });

  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
