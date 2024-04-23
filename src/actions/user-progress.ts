"use server";

import { POINTS_TO_REFILL } from "@/constants";
import database from "@/database/drizzle";
import { getCourseById, getUserProgress } from "@/database/queries";
import { challengeProgress, challenges, userProgress } from "@/database/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unathorized");

  const course = await getCourseById(courseId);

  if (!course) throw new Error("Course not found");

  // TODO: Enable once units and lessons are added
  // if(!course.units.lenght || !course.units[0].lessons.lenght) throw new Error("Course has no content");

  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    await database.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg"
    })

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  await database.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg"
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHears = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unathorized");

  const currentUserProgress = await getUserProgress();
  // TODO: get user subscription

  const challenge = await database.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  });

  if (!challenge) throw new Error("Challenge not found");

  const existingChallengeProgess = await database.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId),
    ),
  });

  const isPratice = !!existingChallengeProgess;

  if (isPratice) {
    return {
      error: "pratice"
    };
  }

  if (!currentUserProgress) throw new Error("User progress not found");

  //TODO: Hadnle subscription

  if (currentUserProgress.hearts <= 0) {
    return {
      error: "hearts"
    };
  }

  await database.update(userProgress).set({
    hearts: Math.max(currentUserProgress.hearts - 1, 0)
  }).where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${challenge.lessonId}`);
}

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) throw new Error("User progress not found");

  if (currentUserProgress.hearts === 5) throw new Error("Hearts are full");

  if (currentUserProgress.points <= POINTS_TO_REFILL) throw new Error("Not enough points");

  await database.update(userProgress).set({
    hearts: 5,
    points: currentUserProgress.points - POINTS_TO_REFILL,
  }).where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
}