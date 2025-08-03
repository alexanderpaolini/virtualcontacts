import { auth } from "@vc/server/auth";
import { ProfileCard } from "./_components/profile-card";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/?error=Please login!");
  }
  return (
    <main className="mx-auto mt-[10vh] flex flex-row items-center justify-center gap-5">
      <div className="flex w-full max-w-md flex-col gap-2">
        <ProfileCard />
      </div>
    </main>
  );
}
