import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  return (
    <div className="flex h-[10vh] w-full items-center justify-between px-8 py-8">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={150} height={150} />
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <InfoIcon size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex w-full flex-col bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-xl">How To Use</DialogTitle>
          </DialogHeader>
          <div>
            <p>Upload a file in the specified formats.</p>
            <p>Map your column headers to pre-defined options.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="mx-auto mt-4 w-1/2 border-black bg-white text-black hover:bg-black hover:text-white"
            >
              Get Started
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="mx-auto mt-4 w-1/2 border-black bg-white text-black hover:bg-black hover:text-white"
                >
                  Download Sample Files
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black">
                <DropdownMenuItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/template?filetype=xlsx`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Excel Workbook(.xlsx)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/template?filetype=xls`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Excel 97-2003 Workbook(.xls)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/template?filetype=csv`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Comma Separated Values(.csv)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/template?filetype=ods`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    OpenDocument Spreadsheet(.ods)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/template`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    All File Types(.xlsx, .xls, .csv, .ods)
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
