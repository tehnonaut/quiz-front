import { LoginForm } from '@/components/guest-signin-form';
import { NavHome } from '@/components/guest-nav';
import { FooterHome } from '@/components/guest-footer';

export const metadata = {
	title: 'Quiz Tools - Login',
	description: 'Login to the quiz.tools platform! Create, share, and enjoy endless quizzes anytime, anywhere!',
};

export default function Page() {
	return (
		<div className="bg-gray-100 min-h-screen flex flex-col">
			<NavHome />
			<div className="flex w-full items-center justify-center p-6 my-16 md:p-10">
				<div className="w-full max-w-sm">
					<LoginForm />
				</div>
			</div>
			<FooterHome />
		</div>
	);
}
