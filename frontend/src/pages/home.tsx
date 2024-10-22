import ConvertImage from "@/components/convert-image";
// import { ConvertImageFormat } from "../wailsjs/go/main/App";

export default function Home() {
  return (
    <div className="h-full w-full flex justify-center items-end pb-4">
      <ConvertImage />
    </div>
  );
}
