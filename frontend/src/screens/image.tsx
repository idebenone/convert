import ConvertImage from "@/components/convert-image";
import { ReadImages } from "@/components/read-images";
import { useState } from "react";

export default function ImageScreen() {
  const [dialogState, setDialogState] = useState<boolean>(false);
  return (
    <div>
      <ConvertImage
        dialogState={dialogState}
        setDtialogState={() => setDialogState(!dialogState)}
      />
      <ReadImages />
    </div>
  );
}
