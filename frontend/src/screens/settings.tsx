import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  OpenDirectoryDialog,
  ReadConfigFile,
  UpdateConfigFile,
} from "../../wailsjs/go/main/App";

export default function SettingsScreen() {
  const [imageDirPath, setImageDirPath] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("image");

  async function handleReadConfigFile() {
    try {
      const response: any = await ReadConfigFile();
      setImageDirPath(response.image_dir);
    } catch (error) {
      toast("Something went wrong while reading config file!");
    }
  }

  async function handleOpenFileDirectory() {
    try {
      const response = await OpenDirectoryDialog();
      setImageDirPath(response);
    } catch (error) {
      toast("Something went wrong while opening file directory!");
    }
  }

  async function handleUpdateConfig() {
    try {
      await UpdateConfigFile("image_dir", imageDirPath);
      toast("Configuration has been updated!");
    } catch (error) {
      toast("Sommething went wrong while updating!");
    }
  }

  useEffect(() => {
    handleReadConfigFile();
  }, []);
  return (
    <div className="w-full h-full flex justify-center">
      <div className="flex gap-8 w-full max-w-5xl my-12">
        <div className="flex flex-col gap-2 w-1/3 border-r border-muted pr-4">
          <p
            className={`px-4 py-1 rounded-lg hover:bg-muted cursor-pointer ${
              activeTab === "image" ? "bg-muted" : ""
            }`}
            onClick={() => setActiveTab("image")}
          >
            Image
          </p>
          <p
            className={`px-4 py-1 rounded-lg hover:bg-muted cursor-pointer ${
              activeTab === "video" ? "bg-muted" : ""
            }`}
            onClick={() => setActiveTab("video")}
          >
            Video
          </p>
        </div>

        {activeTab === "image" && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <p>Output directory</p>
              <Input onClick={handleOpenFileDirectory} value={imageDirPath} />
            </div>

            <div className="text-end">
              <Button onClick={handleUpdateConfig}>Save</Button>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="flex flex-col gap-4 w-full">Videos view</div>
        )}
      </div>
    </div>
  );
}
