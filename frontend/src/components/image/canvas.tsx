import { ImageAttributesAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

interface CanvasInterface {
  image: Blob;
}

export default function Canvas({ image }: CanvasInterface) {
  const imageAttributes = useAtomValue(ImageAttributesAtom);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDragging || !startPos) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    setStartPos({ x: e.clientX, y: e.clientY });
  }

  function handleMouseUp() {
    setIsDragging(false);
    setStartPos(null);
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const zoomAmount = e.deltaY < 0 ? 0.025 : -0.025;
    setScale((prev) => Math.max(0.01, prev + zoomAmount));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && image) {
      const img = new Image();
      img.src = URL.createObjectURL(image);

      img.onload = () => {
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.translate(offset.x, offset.y);
          ctx.scale(scale, scale);
          ctx.filter = `brightness(${imageAttributes.brightness}%) contrast(${imageAttributes.contrast}%) saturate(${imageAttributes.saturation}%)`;
          ctx.rotate((imageAttributes.rotate * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();
        }
      };
    }
  }, [image, imageAttributes, scale, offset]);

  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleGlobalWheel);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleGlobalWheel);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-auto h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}
