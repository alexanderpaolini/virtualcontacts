import { TestButton } from "@vc/components/test-button";
import { api } from "@vc/trpc/server";

export default async function HomePage() {
  const test = await api.example.helloWorld({ name: "test" });

  let test2: { message: string } | null = null;
  try {
    test2 = await api.example.secretHello();
  } catch (err) {
    console.log(err);
  }

  return (
    <main className="mt-[33vh] flex flex-col items-center justify-start gap-5">
      <h1 className="text-5xl font-extrabold">Hello World</h1>
      <p>{test.message}</p>
      {test2 && <p>{test2?.message}</p>}
      <TestButton />
    </main>
  );
}
