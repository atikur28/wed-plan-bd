"use client";

import { MenuItem } from "@/lib/actions/menu.data";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ActiveLinkProps = {
  menu: MenuItem;
};

export default function ActiveLink({ menu }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === menu.path;

  return (
    <Link
      href={menu.path}
      className={`text-sm transition hover:underline underline-offset-8
        ${
          isActive
            ? "font-semibold underline underline-offset-8"
            : "font-normal"
        }`}
    >
      {menu.name}
    </Link>
  );
}
