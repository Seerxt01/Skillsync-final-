import "./index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

// This is the entry point of the React app.
// It mounts the entire App component into the <div id="root"> in index.html.
// StrictMode helps catch bugs during development — it has no effect in production.


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)