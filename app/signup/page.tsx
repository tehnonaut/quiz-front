import { NavHome } from '@/components/guest-nav';
import { RegisterForm } from '@/components/guest-signup-form';
import { FooterHome } from '@/components/guest-footer';

export const metadata = {
	title: 'Quiz Tools - Register',
	description: 'Register to the quiz.tools platform! Create, share, and enjoy endless quizzes anytime, anywhere!',
};

export default function Page() {
	return (
		<div className="bg-gray-100 min-h-screen flex flex-col">
			<NavHome />
			<div className="flex w-full items-center justify-center p-6 my-16 md:p-10">
				<div className="w-full max-w-sm">
					<RegisterForm />
				</div>
			</div>
			<FooterHome />
		</div>
	);
}
