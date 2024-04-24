import FeedWrapper from "@/components/feed-wrapper";
import StickyWrapper from "@/components/sticky-wrapper";
import UserProgress from "@/components/user-progress";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/database/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Promo from "@/components/promo";
import Quests from "@/components/quests";

export default async function Leaderboard() {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();

  const [
    userProgress,
    userSubscription,
    leaderboard
  ] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const hasActiveSubscription = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={hasActiveSubscription}
        />
        {!hasActiveSubscription && (<Promo />)}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/leaderboard.svg" alt="Leaderboard" width={90} height={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl m-y-6">Leaderboard</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">see where you stand among other learns in the comunity</p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          {leaderboard.map((userProgress, index) => (
            <div
              key={userProgress.userId}
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-3">
                <AvatarImage src={userProgress.userImageSrc} className="object-cover" />
              </Avatar>
              <p className="font-bold text-neutral-800 flex-1">{userProgress.userName}</p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
}