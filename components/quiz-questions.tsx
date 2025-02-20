import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClockIcon } from "lucide-react";
import dayjs from "dayjs";
import { Participant } from "@/api/participant/types";
import { Quiz } from "@/api/quiz/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getParticipantAnswers,
  saveParticipantAnswers,
  updateParticipant,
} from "@/api/participant";
import QuizSuccess from "./quiz-success";

interface QuizQuestionsProps {
  participant: Participant;
  quizData: Quiz;
}

export default function QuizQuestions({
  quizData,
  participant,
}: QuizQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(quizData.duration * 60);
  const [isFinished, setIsFinished] = useState(false);

  const { mutate } = useMutation({ mutationFn: saveParticipantAnswers });
  const { mutate: onUpdate } = useMutation({
    mutationFn: updateParticipant,
    onSuccess: () => setIsFinished(true),
  });

  const { data: participantAnswers } = useQuery({
    queryKey: ["getParticipantAnswers", participant._id],
    queryFn: () => getParticipantAnswers(participant._id),
    enabled: !!participant._id,
  });

  useEffect(() => {
    if (participantAnswers?.length) {
      const answers = participantAnswers.reduce((acc, { question, answer }) => {
        acc[question] = answer;
        return acc;
      }, {} as Record<string, string>);

      setAnswers(answers);
    }
  }, [participantAnswers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onFinish = () => {
    onUpdate({
      participantId: participant._id,
      body: {
        name: participant.name,
        studentId: participant.studentId,
        isCompleted: true,
      },
    });
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      onFinish();
    }
  }, [timeRemaining]);

  useEffect(() => {
    const createdAt = dayjs(participant.createdAt);
    const now = dayjs();
    const diff = now.diff(createdAt, "minute");

    setTimeRemaining((quizData.duration - diff) * 60);

    if (diff >= quizData.duration) {
      onFinish();
    }
  }, [participant]);

  const handleChoiceChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    onSubmitToAPI(questionId, value);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const onSubmitToAPI = (questionId: string, value: string) => {
    mutate({
      quizId: quizData._id,
      questionId,
      body: {
        participantId: participant._id,
        answer: value,
      },
    });
  };

  if (isFinished) {
    return <QuizSuccess />;
  }
  return (
    <div className="space-y-8">
      <div className="bg-muted p-6 rounded-lg flex items-center justify-between">
        <p>Number of questions: {quizData.questions.length}</p>
        <h2 className="text-lg font-semibold">{quizData.title}</h2>
        <div
          className={`flex items-center gap-2 italic ${
            timeRemaining <= 60 ? "text-red-500" : ""
          }`}
        >
          <ClockIcon size={20} />
          {dayjs().startOf("day").second(timeRemaining).format("mm:ss")} minutes
          remaining
        </div>
      </div>

      <div>
        <h1>
          <b>Hello, {participant.name}!</b> Welcome to the {quizData.title}.
          <br />
          When you're ready, you can start answering the questions below.
        </h1>
      </div>

      {quizData.questions.map((question, questionIndex) => (
        <div key={question._id} className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {questionIndex + 1}. Question
          </h3>
          <p className="mb-4">{question.question}</p>

          {question.type === "choice" && (
            <RadioGroup
              onValueChange={(value) => handleChoiceChange(question._id, value)}
              value={answers[question._id]}
            >
              {question.answers?.map((choice, index) => (
                <div key={choice} className="flex items-center gap-x-2">
                  {index + 1}.
                  <RadioGroupItem
                    value={choice}
                    id={`${question._id}-${choice}`}
                  />
                  <Label htmlFor={`${question._id}-${choice}`}>{choice}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "answer" && (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[question._id] || ""}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              className="w-full min-h-[200px]"
              onBlur={(e) => onSubmitToAPI(question._id, e.target.value)}
            />
          )}
        </div>
      ))}

      <Button className="w-full" onClick={() => onFinish()}>
        Finish
      </Button>
    </div>
  );
}
