import Link from 'next/link';
import { Button } from './ui/button';

export function NavHome() {
	return (
		<header className="border-b bg-white">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href={'/'} className="text-xl font-semibold">
					Quiz.Tools
				</Link>
				<div className="flex items-center gap-4">
					<Link href={'/signin'}>
						<Button variant="ghost" className="text-gray-600">
							Login
						</Button>
					</Link>
					<Link href={'/signup'}>
						<Button variant="default" className="bg-gray-900 text-white hover:bg-gray-800">
							Register
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
}
