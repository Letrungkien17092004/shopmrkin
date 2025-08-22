import App from "./App.tsx";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
const rootDOM = document.getElementById("root")
if (rootDOM) {
	const root = createRoot(rootDOM)
	root.render(
		// (<StrictMode>
			<App />
		// </StrictMode>)
	)
} else {
	window.alert("Error: Root not found")
}




