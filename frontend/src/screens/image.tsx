import { ReadImages } from "@/components/read-images";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export default function ImageScreen() {
  return (
    <div className="relative h-full">
      <ReadImages />

      <Link to="/edit">
        <div className="rounded-full p-3 absolute bottom-4 right-4 cursor-pointer bg-primary">
          <Pencil className="h-4 w-4 text-secondary" />
        </div>
      </Link>
    </div>
  );
}
