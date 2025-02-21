import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function QuizToolsLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Quiz.Tools
          </Link>
          <div className="flex items-center gap-4">
            <a href="/login">
              <Button variant="ghost" className="text-gray-600">
                Login
              </Button>
            </a>
            <a href="/register">
              <Button
                variant="default"
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Register
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-3xl font-bold">Quiz.Tools</h1>
          <p className="text-gray-600">
          <b>Welcome to the ultimate quiz platform!</b> Here, you can create fun and exciting quizzes, challenge your friends, and test your knowledge in a super easy way! Whether you want to learn something new, play just for fun, or compete with others, this is the perfect place for you! Create, share, and enjoy endless quizzes anytime, anywhere!
          </p>
          <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            <Image
              src="./assets/images/quiz-abstract.jpg"
              alt="Quiz Tools Preview"
              className="rounded-lg"
              width={700}
              height={400}
            />
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-gray-100">
        <div className="container mx-auto px-4 py-8 text-center space-y-2">
          <p className="font-semibold">Quiz.Tools</p>
          <p className="text-gray-600">Igor Miladinovic - Master Rad - Singidunum</p>
        </div>
      </footer>
    </div>
  );
}
