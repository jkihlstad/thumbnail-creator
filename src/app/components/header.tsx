import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="p-4 flex justify-between items-center border-b border-white/10 bg-black/50 backdrop-blur-md">
      <Link href="/" className="text-2xl font-bold text-white">
        Thumbnail Generator
      </Link>
      <nav className="flex gap-4 items-center">
        <Link href="/sign-in">
          <Button variant="ghost" className="text-white hover:text-white/80">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-white text-black hover:bg-gray-200">
            Get Started
          </Button>
        </Link>
      </nav>
    </header>
  );
}
