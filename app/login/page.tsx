import { LoginForm } from '@/components/login-form';
import { NavHome } from '@/components/nav-home';
import { FooterHome } from '@/components/footer-home';
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
