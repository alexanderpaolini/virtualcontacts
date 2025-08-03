import { TestButton } from "@vc/components/test-button";
import { auth } from "@vc/server/auth";
import { api } from "@vc/trpc/server";

export default async function HomePage() {
  const session = await auth();

  const { message } = session
    ? await api.example.secretHello()
    : await api.example.helloWorld({ name: "USER" });

  return (
    <main className="mt-[33vh] flex flex-col items-center justify-start gap-5">
      <h1 className="text-5xl font-extrabold">Hello World</h1>
      <p>{message}</p>
      <TestButton />
    </main>
  );
}
