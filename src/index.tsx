/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { A, Route, Router } from "@solidjs/router";
import ConfigsPage from "./pages/ConfigsPage";
import HomePage from "./pages/HomePage";

const App = (props: any) => (
	<div class="w-screen min-h-screen grid grid-rows-[4rem_1fr] justify-center">
		<A href="/" class="flex justify-center items-center">
			<h1 class="text-5xl">NetKing</h1>
		</A>
		{props.children}
	</div>
);



render(() => (
	<Router root={App}>
		<Route path="/" component={HomePage} />
		<Route path="/configs" component={ConfigsPage} />
	</Router>
), document.getElementById("root") as HTMLElement);
