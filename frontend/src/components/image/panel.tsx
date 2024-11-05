import _ from "lodash";

import { Slider } from "@/components/ui/slider";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { useAtom } from "jotai";
import { ImageAttributesAtom } from "@/lib/atoms";

interface PanelInterface {
  saveImage: () => void;
}

export default function Panel({ saveImage }: PanelInterface) {
  const [imageAttributes, setImageAttributes] = useAtom(ImageAttributesAtom);

  return (
    <div className="h-full flex flex-col justify-between bg-muted p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-bold">
              Brightness
            </p>
            <p className="text-muted-foreground text-xs text-end">
              {imageAttributes.brightness}
            </p>
          </div>
          <Slider
            defaultValue={[100]}
            max={200}
            min={0}
            step={1}
            value={[imageAttributes.brightness]}
            onValueChange={(value) =>
              setImageAttributes((prev) => ({ ...prev, brightness: value[0] }))
            }
            onDoubleClick={() =>
              setImageAttributes((prev) => ({ ...prev, brightness: 100 }))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-bold">Contrast</p>
            <p className="text-muted-foreground text-xs text-end">
              {imageAttributes.contrast}
            </p>
          </div>
          <Slider
            defaultValue={[100]}
            max={200}
            min={0}
            step={1}
            value={[imageAttributes.contrast]}
            onValueChange={(value) =>
              setImageAttributes((prev) => ({ ...prev, contrast: value[0] }))
            }
            onDoubleClick={() =>
              setImageAttributes((prev) => ({ ...prev, contrast: 100 }))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-bold">Rotate</p>
            <p className="text-muted-foreground text-xs text-end">
              {imageAttributes.rotate}
            </p>
          </div>
          <Slider
            defaultValue={[0]}
            max={360}
            min={-360}
            step={1}
            value={[imageAttributes.rotate]}
            onValueChange={(value) =>
              setImageAttributes((prev) => ({ ...prev, rotate: value[0] }))
            }
            onDoubleClick={() =>
              setImageAttributes((prev) => ({ ...prev, rotate: 0 }))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-bold">
              Saturation
            </p>
            <p className="text-muted-foreground text-xs text-end">
              {imageAttributes.saturation}
            </p>
          </div>
          <Slider
            defaultValue={[100]}
            max={200}
            min={0}
            step={1}
            value={[imageAttributes.saturation]}
            onValueChange={(value) =>
              setImageAttributes((prev) => ({ ...prev, saturation: value[0] }))
            }
            onDoubleClick={() =>
              setImageAttributes((prev) => ({ ...prev, saturation: 100 }))
            }
          />
        </div>
      </div>
      <Button className="flex items-center gap-4" onClick={saveImage}>
        <p>Save</p>
        <Save className="h-4 w-4" />
      </Button>
    </div>
  );
}
