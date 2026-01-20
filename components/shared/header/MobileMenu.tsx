"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menus } from "@/lib/actions/menu.data";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Menu className="w-8 h-8" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-72 px-4 font-inter transition-all duration-300 ease-in-out overflow-y-auto max-h-screen pb-10"
      >
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

        {/* Drawer Menus */}
        <nav className="flex flex-col gap-4 mt-14">
          {menus.map((menu) => {
            const isActive = pathname === menu.path;
            return (
              <Link
                key={menu.path}
                href={menu.path}
                onClick={handleClose}
                className={`block w-full text-base rounded-md px-3 py-2
            ${
              isActive
                ? "font-semibold underline underline-offset-4 bg-gray-100"
                : "font-normal hover:bg-gray-50"
            }`}
              >
                {menu.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="mt-6 flex flex-col gap-3 text-center">
          <Link
            href="/login"
            onClick={handleClose}
            className="bg-background text-foreground font-semibold hover:underline border rounded-xs px-5 py-1.5"
          >
            LOGIN
          </Link>
          <Link
            href="/signup"
            onClick={handleClose}
            className="bg-[#C4C4C4] hover:bg-[#ADADAD] text-foreground font-semibold rounded-xs px-5 py-1.5"
          >
            SIGN UP
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
