import React from "react";
import Router from "./Routers/Router.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

export default function MyApp() {
	return (<>
		<AuthProvider>
			<Router />
		</AuthProvider>
	</>)
}
