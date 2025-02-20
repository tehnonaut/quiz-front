"use client";

import { useEffect, useState } from "react";
import QuizForm from "@/components/quiz-form";
import QuizQuestions from "@/components/quiz-questions";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQuizRequest } from "@/api/quiz";
import { createParticipant } from "@/api/participant";
import { Participant } from "@/api/participant/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [participantDetails, setParticipantDetails] = useState<
    Partial<Participant>
  >({
    name: "",
    studentId: "",
  });

  const { id: quizId } = useParams();

  const { mutate } = useMutation({
    mutationFn: createParticipant,
    onSuccess: (res) => {
      setParticipantDetails(res);
      setStorageItem("participant", res);
      setQuizStarted(true);
    },
  });

  useEffect(() => {
    const participant = getStorageItem("participant");
    if (participant) {
      setParticipantDetails(participant);
      setQuizStarted(true);
    }
  }, []);

  const startQuiz = (details: { name: string; studentId: string }) => {
    mutate({ ...details, quizId: quizId as string });
  };

  const { data: quizData } = useQuery({
    queryKey: ["do-quiz", quizId],
    queryFn: () => getQuizRequest(quizId as string),
    enabled: !!quizId,
  });

  return (
    <div className="container mx-auto p-4">
      {!quizStarted ? (
        <QuizForm onStart={startQuiz} />
      ) : (
        quizData && (
          <QuizQuestions
            quizData={quizData}
            participant={participantDetails as Participant}
          />
        )
      )}
    </div>
  );
}
