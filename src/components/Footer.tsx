import Link from "next/link";
import { NAV_LINKS } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-2">
          <p>&copy; 2026 Healthy Meals</p>
          <p>Made with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
