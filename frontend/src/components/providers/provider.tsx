"use client";

import { Provider as JotaiProvider } from "jotai";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "./theme-provider";
import App from "@/App";
import EditScreen from "@/screens/edit";
import ImageScreen from "@/screens/image";
import SettingsScreen from "@/screens/settings";
import VideoScreen from "@/screens/video";

// import { TooltipProvider } from "@/components/ui/tooltip";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ImageScreen />,
      },
      {
        path: "/edit",
        element: <EditScreen />,
      },
      {
        path: "/video",
        element: <VideoScreen />,
      },
      {
        path: "/settings",
        element: <SettingsScreen />,
      },
    ],
  },
]);

export function Provider() {
  return (
    <JotaiProvider>
      <ThemeProvider>
        {/* <TooltipProvider delayDuration={0}>{children}</TooltipProvider> */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </JotaiProvider>
  );
}
