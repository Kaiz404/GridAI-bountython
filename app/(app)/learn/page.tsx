import LearnMoreCard from "@/components/LearnMoreCard";

export default function Home() {
  return (
    <div className="flex w-full min-h-[calc(100vh-81px)] items-center justify-center flex-col">
      <div className="flex w-[90%] items-center justify-center p-8">
        <LearnMoreCard />
      </div>
    </div>
  );
}
