import { toast } from '@/hooks/use-toast';
import apiCall from '../api';
import { Participant } from '../participant/types';
import {
	AnswerResponse,
	CreateQuizRequest,
	Question,
	Quiz,
	QuizParticipantResults,
	UpdateQuizRequest,
	ReviewAnswerRequest,
} from './types';

export const getQuizListRequest = async () => {
	const { data } = await apiCall.get<{ quizzes: Quiz[] }>('/quiz');

	return data.quizzes;
};

export const getQuizRequest = async (quizId: string) => {
	const response = await apiCall.get<{ quiz: Quiz; message: string }>(`/quiz/${quizId}`);
	const data = response?.data;
	if (response.status > 399) {
		toast({
			title: 'Error loading quiz',
			description: response.data?.message ?? 'Failed to load quiz. Please try again.',
			variant: 'destructive',
		});
	}

	return data.quiz;
};

export const createQuizRequest = async (body: CreateQuizRequest) => {
	await apiCall.post('/quiz', body);
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

export const getQuizParticipantResultsRequest = async ({ quizId, participantId }: QuizParticipantResults) => {
	const { data } = await apiCall.get<{
		participant: Participant;
		quiz: Quiz;
		results: {
			answer: AnswerResponse;
			question: Question;
		}[];
	}>(`/quiz/${quizId}/participant/${participantId}`);

	return data;
};

export const updateAnswerReviewRequest = async (request: ReviewAnswerRequest) => {
	const { data } = await apiCall.post<ReviewAnswerRequest>(
		`/quiz/${request.quizId}/results/${request.participantId}/answer/${request.answerId}`,
		request.body
	);

	return data;
};
