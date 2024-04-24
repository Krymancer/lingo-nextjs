"use server";

import database from "@/database/drizzle";
import { getUserProgress, getUserSubscription } from "@/database/queries";
import { challengeProgress, challenges, userProgress } from "@/database/schema";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  if (!currentUserProgress) throw new Error("User progress not found");

  const challenge = await database.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  });

  if (!challenge) throw new Error("Challenge not found");

  const lessonId = challenge.lessonId;

  const existingCahallengProgress = await database.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    )
  });

  const isPratice = !!existingCahallengProgress;

  if (currentUserProgress.hearts === 0 && !isPratice && !userSubscription?.isActive) {
    return { error: "hearts" };
  }

  if (isPratice) {
    await database.update(challengeProgress).set({
      completed: true
    }).where(
      eq(challengeProgress.id, existingCahallengProgress.id)
    );

    await database.update(userProgress).set({
      hearts: Math.min(currentUserProgress.hearts + 1, 5),
      points: currentUserProgress.points + 10,
    }).where(
      eq(userProgress.userId, userId)
    );

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leadboard");
    revalidatePath(`/lesson/${lessonId}`);
    return;
  }

  await database.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true
  });

  await database.update(userProgress).set({
    points: currentUserProgress.points + 10,
  }).where(
    eq(userProgress.userId, userId)
  );

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leadboard");
  revalidatePath(`/lesson/${lessonId}`);
};