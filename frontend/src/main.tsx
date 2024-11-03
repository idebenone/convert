import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./style.css";

import { ThemeProvider } from "./components/providers/theme-provider";
import ImageScreen from "./screens/image";
import VideoScreen from "./screens/video";
import SettingsScreen from "./screens/settings";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

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

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
