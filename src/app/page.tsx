import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { MultiStepConsultationForm } from "../components/consultation/multi-step-form";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return <MultiStepConsultationForm></MultiStepConsultationForm>;
}
