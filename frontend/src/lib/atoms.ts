import { ImageAttributes } from "@/types/image";
import { atom } from "jotai";

export const ImageAttributesAtom = atom<ImageAttributes>({
    brightness: 100,
    contrast: 100,
    rotate: 0,
    saturation: 100
})