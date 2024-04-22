import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import database from '@/database/drizzle';
import { courses, userProgress } from "@/database/schema";

export const getCourses = cache(async () => {
  const data = await database.query.courses.findMany();
  return data;
});

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) return;

  const data = await database.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    }
  });

  return data;
});

export const getCourseById = cache(async (id: number) => {
  const data = await database.query.courses.findFirst({
    where: eq(courses.id, id)
    // TODO: Populate Units and Lessons
  });

  return data;
});