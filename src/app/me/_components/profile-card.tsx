"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { useRouter } from "next/navigation";
import { api } from "@vc/trpc/react";
import { toast } from "sonner";

export function ProfileCard() {
  const router = useRouter();
  const { data, isPending, isError } = api.user.me.useQuery();

  if (isPending) {
    return <ProfileCardSkeleton />;
  }

  if (isError || !data) {
    toast.error("Something went wrong, please contact support.");
    router.push("/");
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <div className="flex flex-row items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={data.image!} alt={data.name ?? "Profile Photo"} />
            <AvatarFallback>
              {data.name
                ? data.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex h-10 flex-1 flex-col justify-between">
            <CardTitle>
              <span>{data.name}</span>
            </CardTitle>
            <CardDescription>
              <span>{data.email}</span>
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileCardSkeleton() {
  return (
    <Card className="w-full max-w-sm animate-pulse">
      <CardHeader>
        <div className="flex flex-row items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex flex-1 flex-col justify-between">
            <div className="mb-1 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-48 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
