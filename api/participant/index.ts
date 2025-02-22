import { toast } from '@/hooks/use-toast';
import apiCall from '../api';
import { CreateParticipant, FinishParticipant, Participant, ParticipantAnswer, SaveParticipantAnswer } from './types';

export const createParticipant = async (body: CreateParticipant) => {
	const { data } = await apiCall.post<{ participant: Participant }>('participant', body);

	return data.participant;
};

export const markParticipantAsFinished = async ({ participantId }: FinishParticipant) => {
	await apiCall.get(`participant/${participantId}/finish`);
};

export const saveParticipantAnswer = async ({ participantId, questionId, body }: SaveParticipantAnswer) => {
	return await apiCall.post(`/participant/${participantId}/question/${questionId}`, body);
};

export const getParticipantAnswers = async (participantId: string) => {
	try {
		const response = await apiCall.get<{ answers: ParticipantAnswer[] }>(`/participant/${participantId}/answers`);
		// Ensure data is not undefined
		return response.data.answers || [];
	} catch (error) {
		console.error('Error fetching participant answers:', error);
		// Return a default value in case of error
		return [];
	}
};

export const getParticipant = async (participantId: string) => {
	try {
		const response = await apiCall.get<{ participant: Participant }>(`/participant/${participantId}`);
		return response.data.participant;
	} catch (error) {
		//remove participantId from local storage
		localStorage.removeItem('participantId');
		toast({
			title: 'Error fetching participant',
			description: 'Please try again',
			variant: 'destructive',
		});
		return null;
	}
};
