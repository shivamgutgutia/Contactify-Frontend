"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, createRef, useState } from "react";
import { toast } from "react-toastify";
import { getHeaders } from "@/api/api";
import icon from "@/assets/folder.svg";
import Image, { StaticImageData } from "next/image";

export function UploadModal({
  file,
  setFile,
  setState,
  setHeaders,
}: {
  file: File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  setState: Dispatch<SetStateAction<"upload" | "map" | "download">>;
  setHeaders: Dispatch<SetStateAction<string[]>>;
}) {
  const fileRef = createRef<HTMLInputElement>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    for (const i of e.target.files) {
      const type = i.name.split(".").pop();

      if (
        type !== "xlsx" &&
        type !== "xls" &&
        type !== "csv" &&
        type !== "ods"
      ) {
        toast.error("Please upload appropriate file!");
        continue;
      } else setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;

    for (const i of droppedFiles) {
      const type = i.name.split(".").pop();
      if (
        type !== "xlsx" &&
        type !== "xls" &&
        type !== "csv" &&
        type !== "ods"
      ) {
        toast.error("Please upload appropriate file!");
        continue;
      } else setFile(droppedFiles[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setIsSubmitting(true);
    const res = await getHeaders(file);
    if (res.status === 200) {
      toast.success("File uploaded successfully!");
      setTimeout(() => {
        setState("map");
        setHeaders(res.data);
      }, 2000);
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full pt-8 md:pt-12">
      <p className="mx-auto w-3/4 text-center text-xl font-medium text-white md:text-3xl">
        Excels drop, contacts rise - effortless wizardry!
      </p>

      <div
        className={`modal relative mx-auto mt-10 flex w-3/4 flex-col items-center justify-center rounded-lg border-4 border-transparent bg-background bg-clip-padding px-4 py-10 ${
          isSubmitting ? "" : "cursor-pointer"
        }`}
        onClick={() => {
          if (fileRef.current) fileRef.current.click();
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <button disabled={isSubmitting}>
          <Image
            src={icon as StaticImageData}
            alt=""
            width={100}
            height={100}
            className={file ? "opacity-50" : "animate-pulse"}
          />
        </button>
        <p className="text-center leading-5 text-white">
          Drag and drop your
          <br /> .xlsx | .xls | .ods | .csv file or browse it!
        </p>
        {file && (
          <p className="py-4 text-sm text-muted-foreground">{file.name}</p>
        )}

        {file && (
          <Button
            className="mt-4 items-center border text-base hover:border-primary hover:bg-secondary hover:text-primary"
            disabled={isSubmitting}
            onClick={(e) => {
              e.stopPropagation();
              handleFileUpload();
            }}
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        )}

        <Input
          ref={fileRef}
          id="file"
          name="file"
          type="file"
          accept=".xlsx, .xls, .csv, .ods"
          className="hidden"
          disabled={isSubmitting}
          onChange={(e) => changeHandler(e)}
        />
      </div>
      <p className="mx-auto mt-16 w-3/4 text-center text-lg font-medium text-white md:text-2xl">
        Instantly convert your spreadsheet of contacts into shareable contact
        files with just a few clicks.
      </p>
    </div>
  );
}
