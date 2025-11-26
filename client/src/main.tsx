import { createRoot } from "react-dom/client"; // Imports the new React 18+ API for concurrent mode rendering.
import App from "./App"; // Imports the root component of your application (where routing, providers, and layout are defined).
import "./index.css"; // Imports the global CSS styles (likely including Tailwind CSS setup).

// Finds the root DOM element where the React application will be mounted.
// In most projects, this is a div with id="root" in your public/index.html file.
const container = document.getElementById("root")!;

// Uses the React 18+ API (createRoot) to create a root concurrent renderer.
createRoot(container).render(
  // Renders the main App component into the root container.
  <App />
);