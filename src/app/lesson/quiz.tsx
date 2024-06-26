"use client";

import Image from "next/image";

import Confetti from "react-confetti";

import { useRouter } from "next/navigation";
import { useAudio, useWindowSize, useMount } from "react-use";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { challengeOptions, challenges, userSubscription } from "@/database/schema";

import Header from "./header";
import QuestionBubble from "./question-bubble";
import Challenge from "./challenge";
import Footer from "./footer";
import ResultCard from "./result-card";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePraticeModal } from "@/store/use-pratice-modal";

type Props = {
  initialLessonId: number
  initialLessonChallenges: (typeof challenges.$inferSelect & { completed: boolean; challengeOptions: typeof challengeOptions.$inferSelect[]; })[];
  initinalHearts: number
  initialPercentage: number
  userSubscription?: typeof userSubscription.$inferSelect & { isActive: boolean; }
};

export default function Quiz({ initialLessonId, initialLessonChallenges, initinalHearts, initialPercentage, userSubscription }: Props) {

  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPraticeModal } = usePraticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPraticeModal();
    }
  });

  const { width, height } = useWindowSize();
  const router = useRouter();

  const [correct, _, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrect, __, incorrectControls] = useAudio({ src: "/incorrect.wav" });
  const [finish] = useAudio({ src: "/finish.wav", autoPlay: true });

  const [pending, startTranstion] = useTransition();

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initinalHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(challenge => !challenge.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  }

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  }

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find(option => option.correct);

    if (correctOption && correctOption.id === selectedOption) {
      startTranstion(() => {
        upsertChallengeProgress(challenge.id).then((response) => {
          if (response?.error === "hearts") {
            openHeartsModal();
            return;
          }

          correctControls.play();
          setStatus("correct");
          setPercentage((prev) => prev + 100 / challenges.length);

          if (initialPercentage === 100) {
            setHearts((prev) => Math.min(prev + 1, 5));
          }
        }).catch(() => toast.error("Someting went wrong. Please try again"));
      });
    } else {
      startTranstion(() => {
        reduceHearts(challenge.id)
          .then(response => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          }).catch(() => toast.error("Someting went wrong. Please try again"));
      })
    }
  }

  if (!challenge) {
    return (
      <>
        {finish}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
          width={width}
          height={height}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image src="/finish.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
          <Image src="/finish.svg" alt="Finish" className="lg:hidden block" height={50} width={50} />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job! <br /> You&apos;ve finished this lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard
              variant="points"
              value={challenges.length * 10}
            />
            <ResultCard
              variant="hearts"
              value={hearts}
            />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    )
  }

  const title = challenge.type === "ASSIST"
    ? "Select the correct meaning"
    : challenge.question;

  return (
    <>
      {correct}
      {incorrect}
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