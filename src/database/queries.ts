import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import database from '@/database/drizzle';
import { challengeProgress, courses, lessons, units, userProgress, userSubscription } from "@/database/schema";
import { DAY_IN_MS } from "@/constants";

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

export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress || !userProgress.activeCourseId) return;

  // TODO: confirm wheter order is needed
  const data = await database.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              }
            }
          }
        }
      }
    }
  });

  const normalizedData = data.map(unit => {
    const lessonsWithCompletedStatus = unit.lessons.map(lesson => {
      if (lesson.challenges.length === 0) return { ...lesson, completed: false }
      const allCompleteChallenges = lesson.challenges.every(challenge => {
        return challenge.challengeProgress
          && challenge.challengeProgress.length > 0
          && challenge.challengeProgress.every(progress => progress.completed);
      });

      return { ...lesson, completed: allCompleteChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress || !userProgress.activeCourseId) return;

  const unitsInActiveCourse = await database.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              },
            },
          },
        },
      },
    },
  });

  // TODO: If something goes wrong, check the last clause
  const fristUncompletedLesson = unitsInActiveCourse
    .flatMap(unit => unit.lessons)
    .find(lesson =>
      lesson.challenges
        .some(challenge =>
          !challenge.challengeProgress
          || challenge.challengeProgress.length === 0
          || challenge.challengeProgress.some(progress => progress.completed === false)
        )
    );

  return {
    activeLesson: fristUncompletedLesson,
    activeLessonId: fristUncompletedLesson?.id,
  };
});


export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) return;

  const data = await database.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return;

  // TODO: If something goes wrong, check the last clause
  const normalizedChallenges = data.challenges.map(challenge => {
    const completed = challenge.challengeProgress
      && challenge.challengeProgress.length > 0
      && challenge.challengeProgress.every(progress => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) return 0;

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) return 0;

  const completedChallenges = lesson.challenges.filter(challenge => challenge.completed);

  const percentage = Math.round(completedChallenges.length / lesson.challenges.length * 100);

  return percentage;
});

export const getUserSubscription = cache(async () => {
  const { userId } = await auth();

  if (!userId) return;

  const data = await database.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!data) return;

  const isActive = data.stripePriceId && data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive
  };
});