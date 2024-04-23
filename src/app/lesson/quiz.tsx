"use client";

import { challengeOptions, challenges } from "@/database/schema";
import { useState, useTransition } from "react";
import Header from "./header";
import QuestionBubble from "./question-bubble";
import Challenge from "./challenge";
import Footer from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHears } from "@/actions/user-progress";

type Props = {
  initialLessonId: number
  initialLessonChallenges: (typeof challenges.$inferSelect & { completed: boolean; challengeOptions: typeof challengeOptions.$inferSelect[]; })[];
  initinalHearts: number
  initialPercentage: number
  userSubscription: any
};

export default function Quiz({initialLessonId, initialLessonChallenges, initinalHearts, initialPercentage, userSubscription}: Props) {
  const [pending, startTranstion] = useTransition();
  
  const [hearts, setHearts] = useState(initinalHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(challenge => !challenge.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")

  const onSelect = (id: number) => {
    if(status !== "none") return;

    setSelectedOption(id);
  }

  const challenge = challenges[activeIndex];
  const options = challenge.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  }

  const onContinue = () => {
    if(!selectedOption) return;

    if(status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if(status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find(option => option.correct);

    if(correctOption && correctOption.id === selectedOption) {
      startTranstion(() => {
        upsertChallengeProgress(challenge.id).then((response) => {
          if(response?.error === "hearts") {
            console.error("Missing hearts");
            return;
          }

          setStatus("correct");
          setPercentage((prev) => prev + 100 / challenges.length);

          if(initialPercentage === 100) {
            setHearts((prev) => Math.min(prev + 1, 5));
          }
        }).catch(() => toast.error("Someting went wrong. Please try again"));
      });
    } else {
      startTranstion(() => {
        reduceHears(challenge.id)
        .then(response => {
          if(response?.error === "hearts") {
            console.error("Missing hearts");
            return;
          }

          setStatus("wrong");

          if(!response?.error) {
            setHearts((prev) => Math.max(prev - 1, 0));
          }
        }).catch(() => toast.error("Someting went wrong. Please try again"));
      })
    }
  }

  const title = challenge.type === "ASSIST" 
  ? "Select the correct meaning"
  : challenge.question;

  return (
    <>
      <Header 
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge 
                options={options} 
                onSelect={onSelect} 
                status={status} 
                selectedOption={selectedOption} 
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer 
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
}