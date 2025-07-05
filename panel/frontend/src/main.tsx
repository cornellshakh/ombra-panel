import App from "@/App";
import React from "react";
import ReactDOM from "react-dom/client";

import "@/globals.css";
import "@/i18n";

// Function to remove the initial loader
const removeInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.remove(); // Completely remove the loader from the DOM
  }
};

// Render the React application
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Ensure the loader is removed after the app is rendered
removeInitialLoader();
