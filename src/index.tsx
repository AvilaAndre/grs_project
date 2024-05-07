/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { Route, Router } from "@solidjs/router";
import ConfigsPage from "./pages/ConfigsPage";
import HomePage from "./pages/HomePage";
import ActionsPage from "./pages/ActionsPage";
import { Toaster } from "solid-toast";


const App = (props: any) => (
	<div class="w-screen min-h-screen grid grid-rows-[1fr] justify-center">
		{props.children}
		<Toaster position="top-center" />
	</div>
);



render(() => (
	<Router root={App}>
		<Route path="/" component={HomePage} />
		<Route path="/configs" component={ConfigsPage} />
		<Route path="/actions/:id" component={ActionsPage} />
	</Router>
), document.getElementById("root") as HTMLElement);
