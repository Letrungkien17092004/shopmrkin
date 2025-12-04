import React from "react";
import Router from "./routers/Router.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

export default function MyApp() {
	return (<>
		<AuthProvider>
			<Router />
		</AuthProvider>
	</>)
}
