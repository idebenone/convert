import { useEffect, useState } from "react";
import { ReadFiles } from "../../wailsjs/go/main/App";

export function ReadImages() {
  const [images, setImages] = useState<
    { filename: string; data: string; size: number }[]
  >([]);
  function handleReadFiles() {
    ReadFiles().then((data: any) => {
      const parsedData = JSON.parse(data);
      const base64Images = parsedData.map(
        (image: { filename: string; data: string; size: number }) => ({
          ...image,
          data: `data:image/${image.filename.split(".").pop()};base64,${
            image.data
          }`,
        })
      );
      setImages(base64Images);
    });
  }

  useEffect(() => {
    handleReadFiles();
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((image) => (
        <div
          key={image.filename}
          className="cursor-pointer brightness-75 hover:brightness-100 overflow-hidden relative w-[300px] h-[300px] rounded-lg"
        >
          <img
            src={image.data}
            alt={image.filename}
            className="border object-cover w-full h-full transition-transform duration-500 hover:scale-110 absolute inset-0"
          />
          <div className="relative z-10 bg-opacity-75 bg-muted p-1 text-sm">
            <p className="truncate">{image.filename}</p>
            <p>({image.size} bytes)</p>
          </div>
        </div>
      ))}
    </div>
  );
}
