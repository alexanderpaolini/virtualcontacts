"use client";

import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Pencil, Plus } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import type {
  CardProperty,
  CardPropertyType,
  PropertyParameter,
} from "@prisma/client";
import { api } from "@vc/trpc/react";
import { Button } from "@vc/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@vc/components/ui/dialog";
import { Input } from "@vc/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParamaterBadge, ParamaterBadgeSkeleton } from "./paramater-card";

const propertyTypeMap: Record<CardPropertyType, string> = {
  EMAIL: "Email",
  TEL: "Phone Number",
  ADR: "Address",
  FN: "Full Name",
  N: "Name",
  NICKNAME: "Nickname",
  PHOTO: "Photo",
  BDAY: "Birthday",
  ANNIVERSARY: "Anniversary",
  GENDER: "Gender",
  IMPP: "IM Address",
  LANG: "Language",
  TZ: "Time Zone",
  GEO: "Geolocation",
  ORG: "Organization",
  TITLE: "Title",
  ROLE: "Role",
  LOGO: "Logo",
  URL: "URL",
  CATEGORIES: "Categories",
  NOTE: "Note",
  RELATED: "Related",
  KEY: "Key",
  FBURL: "Facebook URL",
  CALURI: "Calendar URI",
  CALADRURI: "Calendar Address URI",
};

function propertyTypeToString(type: CardPropertyType) {
  if (propertyTypeMap[type]) {
    return propertyTypeMap[type];
  }

  toast("Hey, for some reason one of your property types isn't supported.", {
    id: "unsupported-property-type",
  });

  return "Unknown";
}

export function PropertyCard({
  property,
}: {
  property: CardProperty & { parameters: PropertyParameter[] };
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1">
          <div>
            <div className="text-xs text-gray-500">TYPE</div>
            <div className="font-semibold">
              {propertyTypeToString(property.type)}
            </div>
          </div>
          <div className="flex justify-end gap-1 self-start">
            <EditPropertyDialogButton property={property} />
          </div>
          <div className="col-span-2">
            <div className="text-xs text-gray-500">VALUE</div>
            <div className="font-semibold wrap-anywhere">{property.value}</div>
          </div>
          <div className="col-span-2 mt-2 flex gap-1">
            {property.parameters.length > 0
              ? property.parameters.map((paramater) => (
                  <ParamaterBadge key={paramater.id} paramater={paramater} />
                ))
              : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getSchema(propertyType: CardPropertyType) {
  switch (propertyType) {
    case "EMAIL":
      return z.object({
        value: z.string().email("Invalid email address"),
      });
    case "TEL":
      return z.object({
        value: z
          .string()
          .min(7, "Phone number too short")
          .max(20, "Phone number too long")
          .regex(/^[\d+\-\s().]+$/, "Invalid phone number"),
      });
    case "URL":
    case "FBURL":
    case "CALURI":
    case "CALADRURI":
      return z.object({
        value: z.string().url("Invalid URL"),
      });
    case "ANNIVERSARY":
    case "BDAY":
      return z.object({
        value: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
      });
    default:
      return z.object({
        value: z.string().max(255),
      });
  }
}

export function EditPropertyDialogButton({
  property,
}: {
  property: CardProperty & { parameters: PropertyParameter[] };
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const utils = api.useUtils();

  const schema = getSchema(property.type);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<{ value: string }>({
    defaultValues: { value: property.value },
    resolver: zodResolver(schema),
  });

  const updateProperty = api.property.update.useMutation();
  const onSubmit = async (data: { value: string }) => {
    toast.promise(
      updateProperty.mutateAsync({
        id: property.id,
        value: data.value,
      }),
      {
        success: async () => {
          // TODO: fix
          await utils.card.getProperties.refetch({ id: property.cardId });

          setOpen(false);
          reset(data);
          return "Property updated!";
        },
        error: () => {
          return "Error updating property";
        },
        loading: "loading...",
      },
    );
  };

  const deleteProperty = api.property.delete.useMutation();
  const handleDelete = () => {
    setIsDeleting(true);

    toast.promise(deleteProperty.mutateAsync({ id: property.id }), {
      success: async () => {
        // TODO: fix
        await utils.card.getProperties.refetch({ id: property.cardId });

        setOpen(false);
        setIsDeleting(false);
        return "Deleted property!";
      },
      error: () => {
        return "Error deleting property";
      },
      loading: "loading...",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              Edit {propertyTypeToString(property.type)}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-3">
              <Input
                id={`property-value-${property.id}`}
                {...register("value")}
                autoFocus
              />
              {errors.value && (
                <span className="text-xs text-red-500">
                  {errors.value.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PropertyCardSkeleton() {
  return (
    <Card className="w-full max-w-xl">
      <CardContent>
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1">
          <div>
            <div className="text-xs text-gray-500">TYPE</div>
            <div className="font-semibold">
              <Skeleton className="h-6 w-12 rounded" />
            </div>
          </div>
          <div className="flex justify-end gap-1 self-start">
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="col-span-2">
            <div className="text-xs text-gray-500">VALUE</div>
            <div>
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          </div>
          <div className="col-span-2 mt-2">
            <ParamaterBadgeSkeleton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PropertyCardList({ cardId }: { cardId: string }) {
  const { isLoading, isError, data } = api.card.getProperties.useQuery({
    id: cardId,
  });

  if (isLoading || !data) {
    return <PropertyCardListSkeleton count={3} />;
  }

  if (isError) {
    toast.error("An error occurred loading your contact.");
  }

  return (
    <Card className="w-full sm:max-w-xl md:max-w-2xl xl:max-w-4xl">
      <CardContent>
        <div className="flex flex-col gap-4">
          <h1 className="mb-2 text-lg font-bold">Your Contact</h1>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <AddPropertyDialogButton cardId={cardId} />
        </div>
      </CardContent>
    </Card>
  );
}

export function PropertyCardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Card className="w-full sm:max-w-xl md:max-w-2xl xl:max-w-4xl">
      <CardContent>
        <div className="flex flex-col gap-4">
          <Skeleton className="mb-2 h-7 w-32 rounded" />
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {Array.from({ length: count ?? 3 }).map((_, idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
          <AddPropertyButtonDialogSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}

export function AddPropertyDialogButton({ cardId }: { cardId: string }) {
  const [open, setOpen] = useState(false);

  const propertyTypes: CardPropertyType[] = Object.keys(
    propertyTypeMap,
  ) as CardPropertyType[];

  const [selectedType, setSelectedType] = useState<CardPropertyType>(
    propertyTypes[0]!,
  );

  const schema = z.object({
    value: getSchema(selectedType).shape.value,
    type: z.custom<CardPropertyType>(),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm<{ value: string; type: CardPropertyType }>({
    defaultValues: { value: "", type: selectedType },
    resolver: zodResolver(schema),
  });

  const createProperty = api.card.addProperty.useMutation();
  const utils = api.useUtils();

  React.useEffect(() => {
    setValue("type", selectedType);
    reset({ value: "", type: selectedType });
  }, [selectedType, reset, setValue]);

  const onSubmit = async ({
    value,
    type,
  }: {
    value: string;
    type: CardPropertyType;
  }) => {
    toast.promise(
      createProperty.mutateAsync({
        id: cardId,
        type,
        value,
      }),
      {
        success: async () => {
          //TODO: Fix
          await utils.card.getProperties.refetch({ id: cardId });

          setOpen(false);
          reset({ value: "", type: propertyTypes[0] });

          return "Property added!";
        },
        error: () => {
          return "Error adding property";
        },
        loading: "loading...",
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Property</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-3">
              <label htmlFor="property-type" className="text-xs text-gray-500">
                Type
              </label>
              <select
                id="property-type"
                className="rounded border px-2 py-1"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as CardPropertyType)
                }
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {propertyTypeToString(type)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3">
              <label htmlFor="property-value" className="text-xs text-gray-500">
                Value
              </label>
              <Input id="property-value" {...register("value")} autoFocus />
              {errors.value && (
                <span className="text-xs text-red-500">
                  {errors.value.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddPropertyButtonDialogSkeleton() {
  return (
    <Button variant={"outline"}>
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-25" />
    </Button>
  );
}
