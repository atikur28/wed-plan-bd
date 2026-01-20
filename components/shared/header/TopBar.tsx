import { ModeToggle } from "@/components/theme-provider/ToogleTheme";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function TopBar() {
  return (
    <div className="max-w-450 mx-auto flex justify-end gap-3 py-2 px-4">
      {/* Toggle Theme */}
      <ModeToggle />

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center gap-3 font-inter">
        <Link
          href="/login"
          className="bg-background text-foreground font-semibold hover:underline px-5 py-1.5"
        >
          LOGIN
        </Link>
        <Link
          href="/signup"
          className="bg-[#C4C4C4] hover:bg-[#ADADAD] text-second-foreground font-semibold rounded-xs px-5 py-1.5"
        >
          SIGN UP
        </Link>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </div>
  );
}
