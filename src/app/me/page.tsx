import { auth } from "@vc/server/auth";
import { ProfileCard } from "./_components/profile-card";
import { redirect } from "next/navigation";
import { api } from "@vc/trpc/server";
import {
  AddPropertyButtonDialogSkeleton,
  PropertyCardList,
  PropertyCardListSkeleton,
  PropertyCardSkeleton,
} from "./_components/property-card";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/?error=Please login!");
  }

  const cards = await api.card.list();
  let card;
  if (cards.length === 0) {
    const created = await api.card.create();
    card = await api.card.getById({ id: created.data.id });
  } else {
    card = await api.card.getById({ id: cards[0]!.id });
  }

  return (
    <main className="mx-auto my-[10vh] flex w-full flex-col items-center justify-center gap-5 px-2 sm:flex-row">
      <div className="flex w-full max-w-7xl flex-col justify-center gap-2 sm:flex-row md:mx-0">
        <div className="flex flex-3 flex-col gap-3">
          <ProfileCard />
        </div>
        <div className="flex-5">
          {card && <PropertyCardList cardId={card.id} />}
        </div>
        <div className="flex flex-3 flex-col gap-3">
          <PropertyCardSkeleton />
        </div>
      </div>
    </main>
  );
}
