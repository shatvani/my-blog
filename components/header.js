import Link from "next/link";
import Navigation from "./navigation";
import DarkMode from "./dark-mode";
import useServerDarkMode from "@/hooks/use-server-dark-mode";

function Header() {
  const theme = useServerDarkMode();

  return (
    <header className="flex justify-between md:items-center mt-4">
      <div className="flex items-center md:space-x-12">
        <div className="hidden md:block">
          <Link href="/" className="text-xl font-mono">Hatvani Sándor</Link>
        </div>
      <Navigation />
      </div>
      <div>
        <DarkMode defaultTheme={theme} />
      </div>
    </header>
  );
}

export default Header;
