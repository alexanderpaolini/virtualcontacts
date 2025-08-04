"use client";

import type { PropertyParameter, PropertyParameterType } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@vc/components/ui/tooltip";
import { Badge } from "@vc/components/ui/badge";
import { Skeleton } from "@vc/components/ui/skeleton";
import { Calendar, CircleAlert, File, Globe, Globe2 } from "lucide-react";
import { toast } from "sonner";

function ParamaterIcon({ type }: { type: PropertyParameterType }) {
  switch (type) {
    case "LANGUAGE":
      return <Globe size={16} />;
    case "GEO":
      return <Globe2 size={16} />;
    case "MEDIATYPE":
      return <File size={16} />;
    case "CALSCALE":
      return <Calendar size={16} />;
    case "ALTID":
    case "PID":
    case "PREF":
    case "SORT_AS":
    case "TYPE":
    case "TZ":
    case "VALUE":
    default:
      toast(
        "Hey, for some reason one of your paramater types isn't supported.",
        {
          id: "unsupported-paramater",
        },
      );
      return <CircleAlert size={16} />;
  }
}

export function ParamaterBadge({
  paramater,
}: {
  paramater: PropertyParameter;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center text-xs">
          <Badge asChild variant={"outline"}>
            <ParamaterIcon type={paramater.key} />
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{paramater.value}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function ParamaterBadgeSkeleton() {
  return (
    <Badge asChild variant={"outline"}>
      <Skeleton className="h-5 w-10" />
    </Badge>
  );
}

// export function AddParamaterButton({ propertyId }: { propertyId: string }) {
//   const handleAddParamater = () => {
//     console.log("add paramater", propertyId);
//   };

//   return (
//     <Badge asChild variant="outline" onClick={handleAddParamater}>
//       <Button variant="ghost">add paramater</Button>
//     </Badge>
//   );
// }

// export function AddParamaterButtonSkeleton() {
//   return (
//     <Badge asChild variant={"outline"}>
//       <Skeleton className="h-5 w-10" />
//     </Badge>
//   );
// }
