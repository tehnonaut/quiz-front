import apiCall from "../api";
import { Participant } from "../participant/types";
import {
  CreateQuizRequest,
  Quiz,
  QuizParticipantResults,
  UpdateQuizRequest,
} from "./types";

export const getQuizListRequest = async () => {
  const { data } = await apiCall.get<{ quizzes: Quiz[] }>("/quiz");

  return data.quizzes;
};

export const getQuizRequest = async (quizId: string) => {
  const { data } = await apiCall.get<{ quiz: Quiz }>(`/quiz/${quizId}`);

  return data.quiz;
};

export const createQuizRequest = async (body: CreateQuizRequest) => {
  await apiCall.post("/quiz", body);
};

export const updateQuizRequest = async ({ _id, body }: UpdateQuizRequest) => {
  await apiCall.put(`/quiz/${_id}`, body);
};

export const deleteQuizRequest = async (quizId: string) => {
  await apiCall.delete(`/quiz/${quizId}`);
};

export const getQuizParticipantsRequest = async (quizId: string) => {
  const { data } = await apiCall.get<{
    quiz: Quiz;
    participants: Participant[];
  }>(`/quiz//${quizId}/participant`);

  return data;
};

export const getQuizParticipantResultsRequest = async ({
  quizId,
  participantId,
}: QuizParticipantResults) => {
  const { data } = await apiCall.get<{
    participant: Participant;
    quiz: Quiz;
    results: {
      answer: string;
      correct: boolean;
      question: string;
    }[];
  }>(`/quiz/${quizId}/participant/${participantId}`);

  return data;
};
