import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSampleVCF, getVCF } from "@/api/api";
import { toast } from "react-toastify";
import { validate } from "@/lib/utils";
import SampleModal from "./sample-modal";
import { Input } from "@/components/ui/input";
import { AlertTriangleIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export function MapModal({ headers, file }: { headers: string[]; file: File }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [active, setActive] = useState<boolean[]>([]);
  const [map, setMap] = useState<string[]>([]);
  const [removeWithoutNumber, setRemoveWithoutNumber] = useState<boolean>(true);
  const [removeLessThan10, setRemoveLessThan10] = useState<boolean>(true);
  // const [sanitizeNumber, setSanitizeNumber] = useState<boolean>(true);
  const [removeDuplicate, setRemoveDuplicate] = useState<boolean>(true);
  const [autoIncrement, setAutoIncrement] = useState<boolean>(false);
  const [splitVCF, setSplitVCF] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [details, setDetails] = useState<sample>();
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    setActive(headers.map(() => true));
  }, [headers]);

  const handleSubmit = async (sample: boolean) => {
    if (validate(map, active))
      return toast.error("Duplicate values not allowed");
    setIsGenerating(true);
    let data: {
      [key: string]: string;
    } = {};
    for (let i = 0; i < headers.length; i++) {
      if (active[i]) {
        const x = map[i];
        const y = headers[i];
        if (x && y) {
          if (
            Object.keys(data).includes(x) &&
            (x === "Phone Number" || x === "E-Mail")
          ) {
            data = { ...data, [x]: data[x] + "," + y };
          } else data = { ...data, [x]: y };
        }
      }
    }
    if (!Object.keys(data).includes("Phone Number")) {
      toast.error("Phone Number is required");
      return setIsGenerating(false);
    }
    if (!Object.keys(data).includes("First Name")) {
      toast.error("First Name is required");
      return setIsGenerating(false);
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("removeWithoutNumber", removeWithoutNumber.toString());
    formData.append("removeLessThan10", removeLessThan10.toString());
    // formData.append("sanitizeNumber", sanitizeNumber.toString());
    formData.append("removeDuplicate", removeDuplicate.toString());
    formData.append("autoIncrement", autoIncrement.toString());
    formData.append("splitVCF", splitVCF.toString());
    formData.append("headersMap", JSON.stringify(data));
    formData.append("sample", sample.toString());
    if (prefix) formData.append("Prefix", prefix);
    if (suffix) formData.append("Suffix", suffix);

    if (sample) {
      const temp = await getSampleVCF(formData);
      if (temp.status === 200) {
        setIsModalOpen(true);
        setDetails(temp.data);
      } else {
        toast.error("Something went wrong");
      }
    } else {
      const temp = await getVCF(formData);
      if (temp === 500) {
        toast.error("Something went wrong");
      }
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    for (let i = 0; i < headers.length; i++) {
      if (active[i] && map[i] === undefined) {
        return setIsGenerating(true);
      }
    }

    if (validate(map, active)) return setIsGenerating(true);

    setIsGenerating(false);
  }, [map, active]);

  return (
    <div className="flex flex-col px-[10%] pb-10">
      {isModalOpen && details && (
        <SampleModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          details={details}
          handleSubmit={handleSubmit}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      )}
      <p className="text-sm md:text-xl">
        The colored box is first row of your file. Choose correct data through
        select lists.
      </p>
      <br />
      <p className="text-sm md:text-xl">
        Make sure to have atleast one column with First Name and Phone Number
      </p>
      <table className="my-4 w-full">
        <thead>
          <tr>
            <th></th>
            <th className="px-4 py-2 text-left text-primary">Column Header</th>
            <th className="w-2/5 py-2 text-center text-primary">Data</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, index) => (
            <tr>
              <td>
                <Checkbox
                  id={`${index}`}
                  defaultChecked={true}
                  onCheckedChange={() => {
                    const temp = active;
                    temp[index] = !temp[index];
                    setActive([...temp]);
                  }}
                />
              </td>
              <td
                key={index}
                className={`px-4 py-2 text-primary${
                  active[index] ? "" : "/40"
                }`}
              >
                <Label htmlFor={`${index}`} className="text-lg">
                  {header}
                </Label>
              </td>
              <td>
                <Select
                  disabled={!active[index]}
                  onValueChange={(e) => {
                    const temp = map;
                    temp[index] = e;
                    if (!validate(temp, active)) setMap([...temp]);
                    else toast.error("Duplicate values not allowed");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Name">First Name</SelectItem>
                    <SelectItem value="Middle Name">Middle Name</SelectItem>
                    <SelectItem value="Last Name">Last Name</SelectItem>
                    <SelectItem value="Phone Number">Phone Number</SelectItem>
                    <SelectItem value="E-Mail">E-Mail</SelectItem>
                    <SelectItem value="Gender">Gender</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              {active[index] && !map[index] && (
                <td className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-1/2 -translate-y-1/2">
                        <AlertTriangleIcon className="ml-5 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Please Map/Deselect this field</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td></td>
            <td className={`px-4 py-2 text-primary`}>
              <Label htmlFor="prefix" className="text-lg">
                Prefix
              </Label>
            </td>
            <td>
              <Input
                name="prefix"
                id="prefix"
                placeholder="Prefix"
                maxLength={20}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="text-white"
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td className={`px-4 py-2 text-primary`}>
              <Label htmlFor="suffix" className="text-lg">
                Suffix
              </Label>
            </td>
            <td>
              <Input
                name="suffix"
                id="suffix"
                placeholder="Suffix"
                maxLength={20}
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                className="text-white"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p>More Settings</p>
      <Separator />
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex items-center">
          <Checkbox
            id="m1"
            defaultChecked={true}
            onCheckedChange={() => setRemoveWithoutNumber((prev) => !prev)}
          />
          <Label htmlFor="m1" className="ml-4 text-base">
            Remove rows without mobile number
          </Label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="m2"
            defaultChecked={true}
            onCheckedChange={() => setRemoveLessThan10((prev) => !prev)}
          />
          <Label htmlFor="m2" className="ml-4 text-base">
            Remove rows with mobile number less than 10 digits
          </Label>
        </div>
        {/* <div className="flex items-center">
          <Checkbox
            id="m3"
            defaultChecked={true}
            onCheckedChange={() => setSanitizeNumber((prev) => !prev)}
          />
          <Label htmlFor="m3" className="ml-4 text-base">
            Remove extra characters like Star,Dash,Space and ... from mobile
            numbers
          </Label>
        </div> */}
        <div className="flex items-center">
          <Checkbox
            id="m4"
            defaultChecked={true}
            onCheckedChange={() => setRemoveDuplicate((prev) => !prev)}
          />
          <Label htmlFor="m4" className="ml-4 text-base">
            Remove duplicate Phone Numbers.
          </Label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="m6"
            defaultChecked={false}
            onCheckedChange={() => setAutoIncrement((prev) => !prev)}
          />
          <Label htmlFor="m6" className="ml-4 text-base">
            Add auto incrementing number as suffix.
          </Label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="m5"
            defaultChecked={false}
            onCheckedChange={() => setSplitVCF((prev) => !prev)}
          />
          <Label htmlFor="m5" className="ml-4 text-base">
            Generate separate VCF for each entry.
          </Label>
        </div>
      </div>
      <Button
        className="mx-auto mt-4 w-1/2"
        onClick={() => handleSubmit(true)}
        disabled={isGenerating}
      >
        Generate VCF
      </Button>
    </div>
  );
}
