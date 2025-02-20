import apiCall from "../api";
import {
  CreateParticipant,
  Participant,
  ParticipantAnswer,
  SaveParticipantAnswers,
  UpdateParticipant,
} from "./types";

export const createParticipant = async (body: CreateParticipant) => {
  const { data } = await apiCall.post<{ participant: Participant }>(
    "participant",
    body
  );

  return data.participant;
};

export const updateParticipant = async ({
  participantId,
  body,
}: UpdateParticipant) => {
  await apiCall.put(`participant/${participantId}`, body);
};

export const saveParticipantAnswers = async ({
  quizId,
  questionId,
  body,
}: SaveParticipantAnswers) => {
  return await apiCall.post(`/quiz/${quizId}/question/${questionId}`, body);
};

export const getParticipantAnswers = async (participantId: string) => {
  const { data } = await apiCall.get<{ answers: ParticipantAnswer[] }>(
    `/participant/${participantId}/answers`
  );

  return data.answers;
};
