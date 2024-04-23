import { getLesson, getUserProgress } from "@/database/queries";
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

  const [
    lesson,
    userProgress
  ] = await Promise.all([
    lessonData,
    userProgressData
  ]);

  if (!lesson || !userProgress) redirect("/learn");

  const initialPercentage = lesson.challenges.filter(challenge => challenge.completed).length / lesson.challenges.length * 100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initinalHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={null} // TODO: Add user subscription
    />
  );
}