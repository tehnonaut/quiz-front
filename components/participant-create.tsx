'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FooterHome } from './guest-footer';

interface QuizFormProps {
	onStart: (details: { name: string; studentId: string }) => void;
	quiz?: {
		title: string;
		description: string;
		isActive?: boolean;
	};
}

export default function QuizForm({ onStart, quiz }: QuizFormProps) {
	const [values, setValues] = useState({
		name: '',
		studentId: '',
	});
	const [isCheckingAgain, setIsCheckingAgain] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsCheckingAgain(false);
		}, 3000);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onStart({ ...values });
	};

	const handleCheckAgain = () => {
		window.location.reload();
	};

	return (
		<>
			<div className="flex-1 flex items-center justify-center mb-24">
				<form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto border p-6 rounded-lg">
					<div>
						<h1 className="text-2xl font-bold mb-1">Welcome to the Quiz!</h1>
						<p className="text-gray-500 text-sm">Please enter your full name and student ID to start.</p>
					</div>
					<div className="mb-6">
						<h1 className="text-xl font-bold mb-1">{quiz?.title || `Quiz Title`}</h1>
						<p className="text-gray-500 text-sm">{quiz?.description || ''}</p>
					</div>
					<div>
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							value={values.name}
							onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
							required
						/>
					</div>
					<div>
						<Label htmlFor="studentId">Student ID</Label>
						<Input
							id="studentId"
							value={values.studentId}
							onChange={(e) => setValues((p) => ({ ...p, studentId: e.target.value }))}
							required
						/>
					</div>
					<Button type="submit" className="w-full" disabled={quiz?.isActive === false}>
						{quiz === undefined ? (
							<span className="animate-pulse">Loading...</span>
						) : quiz.isActive === false ? (
							'Quiz is not active'
						) : (
							'Start Quiz'
						)}
					</Button>

					{quiz?.isActive === false && (
						<Button
							type="button"
							variant="outline"
							className="w-full"
							onClick={handleCheckAgain}
							disabled={isCheckingAgain}
						>
							{isCheckingAgain ? 'Please wait...' : 'Click to check again'}
						</Button>
					)}
				</form>
			</div>
			<FooterHome />
		</>
	);
}
