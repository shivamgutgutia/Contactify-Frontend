import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCircle, UserCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface sample {
  "E-Mail": string;
  "First Name": string;
  "Last Name": string;
  "Middle Name": string;
  "Phone Number(s)": string;
  Gender: string;
  Prefix: string;
  Suffix: string;
}

export default function SampleModal({
  isOpen,
  setIsOpen,
  details,
  handleSubmit,
  isGenerating,
  setIsGenerating,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  details: sample;
  handleSubmit: (sample: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        setIsGenerating(false);
      }}
    >
      <DialogContent className="flex w-full flex-col bg-white text-black">
        <DialogHeader>
          <DialogTitle>Sample Contact</DialogTitle>
          <DialogDescription>
            This is a sample contact. Click "Generate" to generate the VCF.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-evenly break-all rounded-lg border shadow-xl">
          <UserCircle2 size={64} className="mx-8 min-w-[64px]" />
          <div className="ml-4 flex flex-col p-4">
            <p className="text-lg">
              {details["Prefix"]} {details["First Name"]}{" "}
              {details["Middle Name"]} {details["Last Name"]}{" "}
              {details["Suffix"]}
            </p>
            <br />
            <Label className="text-sm font-bold">Gender: </Label>
            <p className="text-lg">
              {details["Gender"] === "M"
                ? "Male"
                : details["Gender"] === "F"
                ? "Female"
                : details["Gender"] === "O"
                ? "Other"
                : "Unknown"}
            </p>
            <br />
            <Label className="text-sm font-bold">Phone Number(s): </Label>
            <div className="flex flex-wrap gap-2">
              {details["Phone Number(s)"]
                .split("/")
                .slice(0, 4)
                .map((number, key) => (
                  <p key={key} className="">
                    {number}
                  </p>
                ))}
            </div>
            <br />
            <Label className="text-sm font-bold">Email(s): </Label>
            <div className="flex flex-col gap-1 leading-4">
              {details["E-Mail"]
                .split("/")
                .slice(0, 4)
                .map((email, key) => (
                  <p key={key} className="">
                    {email}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            disabled={isGenerating}
            className="mx-auto hover:border hover:bg-white hover:text-black"
            onClick={() => {
              void handleSubmit(false);
            }}
          >
            {isGenerating ? "Generating..." : "Generate VCF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
