import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, useState } from "react";

import { ConvertImageFormat, OpenFileDialog } from "../../wailsjs/go/main/App";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function ConvertImage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("");

  async function handleOpenFileDailog() {
    try {
      const response = await OpenFileDialog();
      setSelectedFile(response);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSelectFormat(e: string) {
    setFormat(e);
  }

  function handleConvertImage() {
    if (selectedFile && format) {
      ConvertImageFormat({
        input_file: selectedFile,
        format,
      }).then((response) => toast(response));
    }
  }

  return (
    <div className="flex justify-between items-center gap-2 w-1/2 border border-muted p-3 rounded-lg">
      {!selectedFile ? (
        <label
          htmlFor="file"
          className="flex items-center justify-center gap-3 cursor-pointer rounded-md py-1.5 px-3 border border-dashed w-full"
          onClick={handleOpenFileDailog}
        >
          <p>Select Image</p>
          <PlusCircle className="h-4 w-4" />
        </label>
      ) : (
        <div className="flex justify-between items-center gap-2 border border-dashed rounded-md py-1.5 px-3">
          <p className="truncate">{selectedFile}</p>
          <X className="h-4 w-4" onClick={() => setSelectedFile(null)} />
        </div>
      )}

      <div className="flex gap-2 items-center">
        <Select onValueChange={handleSelectFormat}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="webp">WEBP</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleConvertImage}>Convert</Button>
      </div>
    </div>
  );
}
