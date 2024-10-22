import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function ConvertImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState("");

  return (
    <div className="p-4 rounded-md border flex justify-between items-center w-1/2">
      <label
        htmlFor="file"
        className="flex items-center gap-2 cursor-pointer rounded-md bg-primary text-secondary p-2.5 font-semibold"
      >
        <p>Convert Image</p>
        <PlusCircle className="h-4 w-4" />
      </label>

      <label htmlFor="file">asdasd</label>

      <input id="file" type="file" className="hidden" />

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="jpg">JPG</SelectItem>
          <SelectItem value="webp">WEBP</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
