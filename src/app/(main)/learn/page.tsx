import { redirect } from "next/navigation";
import { getUserProgress } from "@/database/queries";
import FeedWrapper from "@/components/feed-wrapper"
import StickyWrapper from "@/components/sticky-wrapper"
import UserProgress from "@/components/user-progress"
import Header from "./header"

export default async function Learn() {
  const userProgressData = getUserProgress();

  const [
    userProgress
  ] = await Promise.all([
    userProgressData
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  return (
    <div className="flex flex-row-reverse gap-12 px-6">
      <StickyWrapper>
        <UserProgress activeCourse={{ title: "Portuguese", imageSrc: "br.svg" }} hearts={5} points={100} hasActiveSubscription={false} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title="Portuguese" />
        <div className="space-y-4">
          <div className="h-[700px] bg-blue-500" />
          <div className="h-[700px] bg-blue-500" />
          <div className="h-[700px] bg-blue-500" />
        </div>
      </FeedWrapper>
    </div>
  )
}