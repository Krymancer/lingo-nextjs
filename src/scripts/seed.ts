import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "@/database/schema";

const sql = neon(process.env.DATABASE_URL!);
const database = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await database.delete(schema.courses);
    await database.delete(schema.userProgress);
    await database.delete(schema.units);
    await database.delete(schema.lessons);
    await database.delete(schema.challenges);
    await database.delete(schema.challengeOptions);
    await database.delete(schema.challengeProgress);

    await database.insert(schema.courses).values([
      { id: 1, title: "Portuguese", imageSrc: "/br.svg" },
      { id: 2, title: "Spanish", imageSrc: "/es.svg" },
      { id: 3, title: "English", imageSrc: "/us.svg" },
      { id: 4, title: "German", imageSrc: "/de.svg" },
      { id: 5, title: "French", imageSrc: "/fr.svg" },
    ]);

    await database.insert(schema.units).values([
      { id: 1, courseId: 1, title: "Unit 1", description: "Learn the basics of Portuguese", order: 1 },
    ]);

    await database.insert(schema.lessons).values([
      { id: 1, unitId: 1, title: "Nouns", order: 1 },
      { id: 2, unitId: 1, title: "Verbs", order: 1 },
      { id: 3, unitId: 1, title: "Verbs", order: 1 },
      { id: 4, unitId: 1, title: "Verbs", order: 1 },
    ]);

    await database.insert(schema.challenges).values([
      { id: 1, lessonId: 1, type: "SELECT", question: "Which one of these is \"The man\"?", order: 1 },
      { id: 2, lessonId: 1, type: "ASSIST", question: "\"The man\"", order: 2 },
      { id: 3, lessonId: 1, type: "SELECT", question: "Which one of these is \"The robot\"", order: 3 },
      { id: 4, lessonId: 1, type: "ASSIST", question: "\"The woman\"", order: 4 },
      { id: 5, lessonId: 2, type: "ASSIST", question: "\"Eat\"", order: 4 },
    ]);

    await database.insert(schema.challengeOptions).values([
      { id: 1, challengeId: 1, text: "O homem", correct: true, imageSrc: "/man.svg", audioSrc: "/br_man.mp3" },
      { id: 2, challengeId: 1, text: "A mulher", correct: false, imageSrc: "/woman.svg", audioSrc: "/br_woman.mp3" },
      { id: 3, challengeId: 1, text: "O robô", correct: false, imageSrc: "/robot.svg", audioSrc: "/br_robot.mp3" },
      { id: 4, challengeId: 2, text: "O homem", correct: true, audioSrc: "/br_man.mp3" },
      { id: 5, challengeId: 2, text: "A mulher", correct: false, audioSrc: "/br_woman.mp3" },
      { id: 6, challengeId: 2, text: "O robô", correct: false, audioSrc: "/br_robot.mp3" },
      { id: 7, challengeId: 3, text: "O homem", correct: false, imageSrc: "/man.svg", audioSrc: "/br_man.mp3" },
      { id: 8, challengeId: 3, text: "A mulher", correct: false, imageSrc: "/woman.svg", audioSrc: "/br_woman.mp3" },
      { id: 9, challengeId: 3, text: "O robô", correct: true, imageSrc: "/robot.svg", audioSrc: "/br_robot.mp3" },
      { id: 10, challengeId: 4, text: "O homem", correct: false, audioSrc: "/br_man.mp3" },
      { id: 11, challengeId: 4, text: "A mulher", correct: true, audioSrc: "/br_woman.mp3" },
      { id: 12, challengeId: 4, text: "O robô", correct: false, audioSrc: "/br_robot.mp3" },

      { id: 13, challengeId: 5, text: "Andar", correct: false, audioSrc: "/br_walk.mp3" },
      { id: 14, challengeId: 5, text: "Comer", correct: true, audioSrc: "/br_eat.mp3" },
      { id: 15, challengeId: 5, text: "Correr", correct: false, audioSrc: "/br_run.mp3" },
    ]);

    console.log("Seeding finish");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
}

main();