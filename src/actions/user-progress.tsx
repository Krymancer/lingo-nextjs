"use server";

import database from "@/database/drizzle";
import { getCourseById, getUserProgress } from "@/database/queries";
import { userProgress } from "@/database/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
  const {userId} = await auth();
  const user = await currentUser();

  if(!userId || !user) throw new Error("Unathorized");

  const course = await getCourseById(courseId);

  if(!course) throw new Error("Course not found");

  // TODO: Enable once units and lessons are added
  // if(!course.units.lenght || !course.units[0].lessons.lenght) throw new Error("Course has no content");

  const existingUserProgress = await getUserProgress();

  if(existingUserProgress) {
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