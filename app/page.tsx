import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import myImage from '../assets/images/quiz-abstract.jpg';
import { NavHome } from '@/components/nav-home';
import { FooterHome } from '@/components/footer-home';
export default function QuizToolsLanding() {
	return (
		<div className="min-h-screen flex flex-col bg-[#f5f5f5]">
			<NavHome />

			<main className="flex-1 container mx-auto px-4 py-12 my-16">
				<div className="max-w-4xl mx-auto text-center space-y-20">
					<h1 className="text-3xl font-bold">Quiz.Tools</h1>
					<p className="text-gray-600 my-10">
						<b>Welcome to the quiz.tools platform!</b> Here, you can create fun and exciting quizzes, challenge your
						friends, and test your knowledge in a super easy way! Whether you want to learn something new, play just for
						fun, or compete with others, this is the perfect place for you! Create, share, and enjoy endless quizzes
						anytime, anywhere!
					</p>
					<div className=" aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
						<Image src={myImage} alt="Quiz Tools Preview" className="rounded-lg" width={900} height={500} />
					</div>
				</div>
			</main>

			<FooterHome />
		</div>
	);
}
