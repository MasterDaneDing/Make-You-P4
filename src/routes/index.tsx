import { createFileRoute } from "@tanstack/react-router";
import { DressUp } from "@/components/dress-up";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <DressUp />;
}
