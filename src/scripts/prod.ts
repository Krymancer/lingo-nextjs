import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "@/database/schema";

const sql = neon(process.env.DATABASE_URL!);
const database = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      database.delete(schema.userProgress),
      database.delete(schema.challenges),
      database.delete(schema.units),
      database.delete(schema.lessons),
      database.delete(schema.courses),
      database.delete(schema.challengeOptions),
      database.delete(schema.userSubscription),
    ]);

    // Insert courses
    const courses = await database
      .insert(schema.courses)
      .values([
        { title: "Portuguese", imageSrc: "/br.svg" },
      ])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      const units = await database
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      // For each unit, insert lessons
      for (const unit of units) {
        const lessons = await database
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Nouns", order: 1 },
            { unitId: unit.id, title: "Verbs", order: 2 },
            { unitId: unit.id, title: "Adjectives", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Sentences", order: 5 },
          ])
          .returning();

        // For each lesson, insert challenges
        for (const lesson of lessons) {
          const challenges = await database
            .insert(schema.challenges)
            .values([
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the man"?',
                order: 1,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the woman"?',
                order: 2,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the boy"?',
                order: 3,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the man"',
                order: 4,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the zombie"?',
                order: 5,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the robot"?',
                order: 6,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the girl"?',
                order: 7,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the zombie"',
                order: 8,
              },
            ])
            .returning();

          // For each challenge, insert challenge options
          for (const challenge of challenges) {
            if (challenge.order === 1) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "O homem",
                  imageSrc: "/man.svg",
                  audioSrc: "/br_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "A mulher",
                  imageSrc: "/woman.svg",
                  audioSrc: "/br_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O menino",
                  imageSrc: "/boy.svg",
                  audioSrc: "/br_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 2) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "A mulher",
                  imageSrc: "/woman.svg",
                  audioSrc: "/br_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O menino",
                  imageSrc: "/boy.svg",
                  audioSrc: "/br_boy.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O homem",
                  imageSrc: "/man.svg",
                  audioSrc: "/br_man.mp3",
                },
              ]);
            }

            if (challenge.order === 3) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "A mulher",
                  imageSrc: "/woman.svg",
                  audioSrc: "/br_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O homem",
                  imageSrc: "/man.svg",
                  audioSrc: "/br_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "O menino",
                  imageSrc: "/boy.svg",
                  audioSrc: "/br_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 4) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "A mulher",
                  audioSrc: "/br_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "O homem",
                  audioSrc: "/br_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O menino",
                  audioSrc: "/br_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 5) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O homem",
                  imageSrc: "/man.svg",
                  audioSrc: "/br_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "A mulher",
                  imageSrc: "/woman.svg",
                  audioSrc: "/br_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "O zumbi",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/br_zombie.mp3",
                },
              ]);
            }

            if (challenge.order === 6) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "el robot",
                  imageSrc: "/robot.svg",
                  audioSrc: "/br_robot.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O zumbi",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/br_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O menino",
                  imageSrc: "/boy.svg",
                  audioSrc: "/br_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 7) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "A menina",
                  imageSrc: "/girl.svg",
                  audioSrc: "/br_girl.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O zumbi",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/br_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O homem",
                  imageSrc: "/man.svg",
                  audioSrc: "/br_man.mp3",
                },
              ]);
            }

            if (challenge.order === 8) {
              await database.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "A mulher",
                  audioSrc: "/br_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "O zumbi",
                  audioSrc: "/br_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "O menino",
                  audioSrc: "/br_boy.mp3",
                },
              ]);
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();