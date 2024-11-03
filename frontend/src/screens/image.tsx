import ConvertImage from "@/components/convert-image";
import { ReadImages } from "@/components/read-images";

export default function ImageScreen() {
  return (
    <div>
      <ReadImages />
      <div className="fixed left-1/2 bottom-2 w-full -translate-x-1/4 flex gap-4">
        <ConvertImage />
      </div>
    </div>
  );
}
