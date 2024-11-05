import { Outlet } from "react-router-dom";
import SideBar from "./components/side-bar";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="flex h-full">
      {/* <SideBar /> */}
      <div className="p-4 w-full">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}
