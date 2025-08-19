import App from "./App.tsx";
import React from "react";
import { createRoot } from "react-dom/client";
const rootDOM = document.getElementById("root")
console.log(rootDOM)
if (rootDOM) {
	const root = createRoot(rootDOM)
	root.render(<App/>)
} else {
	window.alert("Error: Root not found")
}




