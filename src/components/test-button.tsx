"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function TestButton() {
  const [clicks, setClicks] = React.useState(0);

  return (
    <Button
      variant={"outline"}
      onClick={() => {
        const newClicks = clicks + 1;
        setClicks(newClicks);
        toast(`${newClicks} click${newClicks !== 1 ? "s" : ""}!`);
      }}
    >
      This is a test button!
    </Button>
  );
}
