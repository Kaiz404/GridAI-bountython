import { ActiveGridsCard } from "@/components/ActiveGridCard";

export default function Home() {
  return (
    <div className="flex w-full min-h-[calc(100vh-81px)] items-center justify-center flex-col">
      <div className="flex w-[95%] items-center justify-center">
        <ActiveGridsCard />
      </div>
    </div>
  );
}