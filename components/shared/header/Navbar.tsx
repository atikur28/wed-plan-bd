import MainBar from "./MainBar";
import TopBar from "./TopBar";

export default function Navbar() {
  return (
    <header className="w-full bg-background">
      <TopBar />
      <MainBar />
    </header>
  );
}
