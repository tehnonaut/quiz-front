'use client';

import { Check } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export default function QuizSuccessPage() {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
			<Card className="w-full max-w-md">
				<CardContent className="pt-6 text-center space-y-6">
					<div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center">
						<Check className="w-8 h-8 text-green-500" />
					</div>
					<div className="space-y-2">
						<h1 className="text-3xl font-semibold">Success!</h1>
						<p className="text-gray-500">
							Your quiz has been submitted successfully.
							<br />
							Your results will be available soon. Thank you for participating!
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
