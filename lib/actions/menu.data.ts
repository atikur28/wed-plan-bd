export type MenuItem = {
  name: string;
  path: string;
};

export const menus: MenuItem[] = [
  { name: "Home", path: "/" },
  { name: "Venue", path: "/venue" },
  { name: "Suppliers", path: "/suppliers" },
  { name: "About", path: "/about" },
  { name: "Media", path: "/media" },
  { name: "Contact Us", path: "/contact" },
];
