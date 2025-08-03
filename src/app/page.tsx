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
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 text-white">
      <h1 className="text-5xl font-extrabold">Hello World</h1>
      <p>{test.message}</p>
      <p>{test2?.message}</p>
    </main>
  );
}
