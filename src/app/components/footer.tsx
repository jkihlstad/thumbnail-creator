import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-white/60 text-sm">
          © {currentYear} Thumbnail Generator. All rights reserved.
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/privacy" className="text-white/60 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-white/60 hover:text-white">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-white/60 hover:text-white">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
