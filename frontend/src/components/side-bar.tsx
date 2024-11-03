import { Image, Settings, Video } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { label: "Image", icon: Image, path: "/" },
  { label: "Video", icon: Video, path: "/video" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function SideBar() {
  const { path } = useParams();
  return (
    <div className="w-[300px] h-full bg-neutral-900 p-4">
      <p className="text-4xl font-bold py-4">convert .</p>
      <div className="flex flex-col gap-2 mt-6">
        {SIDEBAR_ITEMS.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive, isPending }) =>
              `cursor-pointer px-4 py-2 flex items-center gap-4 hover:bg-muted rounded-lg ${
                isPending
                  ? "text-muted-foreground bg-muted"
                  : isActive
                  ? "bg-muted"
                  : ""
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <p>{item.label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
