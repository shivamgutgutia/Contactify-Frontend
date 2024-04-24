"use client";

import { Footer } from "@/components/footer";
import { MapModal } from "@/components/map-modal";
import { Navbar } from "@/components/navbar";
import SampleModal from "@/components/sample-modal";
import { UploadModal } from "@/components/upload-modal";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [state, setState] = useState<"upload" | "map" | "download">("upload");
  const [headers, setHeaders] = useState<string[]>([]);

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <ToastContainer />
      <div className="flex flex-col items-center text-lg text-muted-foreground">
        {state === "upload" && (
          <UploadModal
            file={file}
            setFile={setFile}
            setState={setState}
            setHeaders={setHeaders}
          />
        )}
        {state === "map" && file && <MapModal file={file} headers={headers} />}
      </div>
      <Footer />
    </main>
  );
}
