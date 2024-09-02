import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { StateContextProvider } from "./context";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary"; // Import the ErrorBoundary
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <StateContextProvider>
      <ErrorBoundary> {/* Wrap App with ErrorBoundary */}
        <App />
      </ErrorBoundary>
    </StateContextProvider>
  </Router>,
);
