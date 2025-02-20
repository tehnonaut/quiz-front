export type Participant = {
  _id: string;
  quiz: string; // id of the quiz
  name: string;
  studentId: string;
  createdAt: string;
  isCompleted: boolean;
};

export type CreateParticipant = {
  name: string;
  studentId: string;
  quizId: string;
};

export type UpdateParticipant = {
  participantId: string;
  body: {
    name: string;
    studentId: string;
    isCompleted: boolean;
  };
};

export type SaveParticipantAnswers = {
  quizId: string;
  questionId: string;
  body: {
    participantId: string;
    answer: string;
  };
};

export type ParticipantAnswer = {
  _id: string;
  participant: string;
  quiz: string;
  question: string;
  answer: string;
};
