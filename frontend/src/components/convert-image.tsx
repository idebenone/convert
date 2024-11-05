import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ConvertImageFormat, OpenFileDialog } from "../../wailsjs/go/main/App";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { editImage } from "@/lib/image-magick-service";

interface ConvertImageProps {
  dialogState: boolean;
  setDtialogState: () => void;
}

export default function ConvertImage({
  dialogState,
  setDtialogState,
}: ConvertImageProps) {
  const [selectedFile, setSelectedFile] = useState<{
    filePath: string;
    dataURL: string;
  } | null>(null);
  const [format, setFormat] = useState<string>("");
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);

  function dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  async function handleOpenFileDailog() {
    try {
      const response = await OpenFileDialog();
      if (!response) {
        toast("No file selected.");
        return;
      }
      setSelectedFile(response);
      setProcessedFile(dataURLtoBlob(selectedFile?.dataURL!));
    } catch (error) {
      console.error("Error opening file dialog:", error);
      toast("Failed to open file dialog.");
    }
  }

  function handleSelectFormat(e: string) {
    setFormat(e);
  }

  async function handleConvertImage() {
    try {
      if (selectedFile && format) {
        const response = await ConvertImageFormat(
          selectedFile.filePath,
          format
        );
        toast(response);
      } else {
        toast("Please select a valid image or format!");
      }
    } catch (error) {
      console.error("Conversion Error:", error);
      toast("Something went wrong while converting the image!");
    }
  }

  async function handleEditImage() {
    try {
      const response = await editImage(dataURLtoBlob(selectedFile?.dataURL!), {
        brightness: 120,
        contrast: 20,
      });

      setProcessedFile(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={dialogState} onOpenChange={setDtialogState}>
      <DialogTrigger>
        <Button>Convert</Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 h-1/2">
        <DialogHeader>
          <DialogTitle>Convert Your Image</DialogTitle>
          <DialogDescription>
            Select an image to convert to another format.
          </DialogDescription>

          <div className="flex gap-4 pt-6 h-full">
            <div className="w-1/2 flex flex-col justify-between gap-2">
              <div className="h-full">
                {!selectedFile ? (
                  <label
                    htmlFor="file"
                    className="flex items-center justify-center gap-3 cursor-pointer rounded-md py-1.5 px-3 border border-dashed w-full h-full"
                    onClick={handleOpenFileDailog}
                  >
                    <p>Select Image</p>
                    <PlusCircle className="h-4 w-4" />
                  </label>
                ) : (
                  <div className="h-full flex justify-between items-center gap-2 border border-dashed rounded-md">
                    {processedFile ? (
                      <img
                        src={URL.createObjectURL(processedFile)}
                        alt="Processed file preview"
                        className="w-full rounded-md object-center"
                      />
                    ) : (
                      <p>Processing failed.</p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {selectedFile?.filePath}
              </p>

              <Button
                onClick={() => {
                  setSelectedFile(null);
                  setProcessedFile(null);
                }}
                variant="outline"
              >
                Clear
              </Button>
            </div>
            <div className="w-1/2 flex flex-col gap-2 justify-between">
              <Select onValueChange={handleSelectFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleConvertImage}>Convert</Button>
              <Button onClick={handleEditImage}>Test</Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
