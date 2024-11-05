import { useRef, useState } from "react";
import { OpenFileDialog } from "../../wailsjs/go/main/App";

import Canvas from "@/components/image/canvas";
import Panel from "@/components/image/panel";

import { dataURLtoBlob } from "@/lib/utils";

import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function EditScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<{
    path: string;
    image: Blob;
  } | null>(null);

  async function handleOpenFileDailog() {
    try {
      const response = await OpenFileDialog();
      if (!response) {
        toast("No file selected.");
        return;
      }
      setImage({
        path: response.filePath,
        image: dataURLtoBlob(response.dataURL),
      });
      toast.success("Image has been imported successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to open file dialog.");
    }
  }

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "styled-image.png";
        link.click();
      } else {
        console.error("Failed to create blob from canvas");
      }
    }, "image/png");
  };

  return (
    <div className="h-full w-full flex gap-4">
      <div
        className={`h-full ${
          image ? "w-3/4" : "w-full"
        } flex flex-col justify-between gap-2 relative border border-dashed rounded-lg overflow-hidden`}
      >
        <div className="flex-grow h-0">
          {!image ? (
            <label
              htmlFor="file"
              className="w-full h-full flex items-center justify-center gap-3 cursor-pointer rounded-md py-1.5 px-3 text-muted-foreground"
              onClick={handleOpenFileDailog}
            >
              <p>Select Image</p>
              <PlusCircle className="h-4 w-4" />
            </label>
          ) : (
            <div className="h-full w-full overflow-hidden">
              {image ? (
                <Canvas image={image.image} />
              ) : (
                <p className="text-center">Processing failed.</p>
              )}
            </div>
          )}
        </div>
        <p className="absolute top-2 left-2 text-xs font-bold text-muted-foreground p-1 bg-muted rounded">
          {image?.path}
        </p>
      </div>

      <div
        className={`${
          image ? "block" : "hidden"
        } w-1/4 flex flex-col gap-2 justify-between`}
      >
        {image && <Panel saveImage={saveImage} />}
      </div>
    </div>
  );
}
