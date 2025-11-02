import App from "./App.tsx";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";

const rootDOM = document.getElementById("root")

if (rootDOM) {
	const root = createRoot(rootDOM)
	root.render(
		// (<StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		// </StrictMode>)
	)
} else {
	window.alert("Error: Root not found")
}




