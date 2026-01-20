import { menus } from "@/lib/actions/menu.data";
import Image from "next/image";
import Link from "next/link";
import ActiveLink from "./ActiveLink";

export default function MainBar() {
  return (
    <div className="max-w-450 mx-auto hidden md:flex items-center justify-between py-4 px-4 font-inter">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icons/logo.svg" alt="WedPlan BD" width={40} height={40} />
        <span className="text-2xl font-bold text-foreground">WedPlan BD</span>
      </Link>

      {/* Desktop Menu */}
      <nav className="flex items-center gap-10 xl:gap-15">
        {menus.map((menu) => (
          <ActiveLink key={menu.path} menu={menu} />
        ))}
      </nav>
    </div>
  );
}
