import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "./components/providers/provider";

import "./style.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider />
  </React.StrictMode>
);
