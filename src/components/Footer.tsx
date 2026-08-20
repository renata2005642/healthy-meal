export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Healthy Meals. Built for students who cook.</p>
        <p>Made with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
