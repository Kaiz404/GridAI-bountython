import ConnectCard from "@/components/ConnectCard";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex w-screen min-h-[calc(100vh-81px)] items-center justify-center flex-col">
      <ConnectCard />
    </div>
  );
}