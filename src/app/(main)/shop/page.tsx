import FeedWrapper from "@/components/feed-wrapper";
import StickyWrapper from "@/components/sticky-wrapper";
import UserProgress from "@/components/user-progress";
import { getUserProgress } from "@/database/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import Items from "./items";

export default async function Shop() {
  const userProgressData = getUserProgress();

  const [
    userProgress,
  ] = await Promise.all([
    userProgressData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");


  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/shop.svg" alt="Shop" width={90} height={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl m-y-6">Shop</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">spend your points in cool stuff</p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={false}
          />
        </div>
      </FeedWrapper>
    </div>
  );
}