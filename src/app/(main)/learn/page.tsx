import FeedWrapper from "@/components/feed-wrapper"
import StickyWrapper from "@/components/sticky-wrapper"
import Header from "./header"
import { User } from "lucide-react"
import UserProgress from "@/components/user-progress"

export default function Learn() {
  return (
      <div className="flex flex-row-reverse gap-12 px-6">
        <StickyWrapper>
          <UserProgress activeCourse={{title: "Portuguese", imageSrc: "br.svg"}} hearts={5} points={100} hasActiveSubscription={false} />
        </StickyWrapper>
        <FeedWrapper>
          <Header title="Portuguese" />
          <div className="space-y-4">
            <div className="h-[700px] bg-blue-500"/>
            <div className="h-[700px] bg-blue-500"/>
            <div className="h-[700px] bg-blue-500"/>
          </div>
        </FeedWrapper>
      </div>
  )
}