import { NavHome } from '@/components/nav-home';
import { RegisterForm } from '@/components/register-form';
import { FooterHome } from '@/components/footer-home';
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
