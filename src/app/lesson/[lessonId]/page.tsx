import { getLesson, getUserProgress, getUserSubscription } from "@/database/queries";
import { redirect } from "next/navigation";
import Quiz from "../quiz";

type Props = {
  params: {
    lessonId: number;
  };
}

export default async function LessonId({ params }: Props) {
  const { lessonId } = params;
  const lessonData = getLesson(lessonId);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [
    lesson,
    userProgress,
    userSubscription
  ] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData
  ]);

  if (!lesson || !userProgress) redirect("/learn");

  const initialPercentage = lesson.challenges.filter(challenge => challenge.completed).length / lesson.challenges.length * 100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initinalHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
}