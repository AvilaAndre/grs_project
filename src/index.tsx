/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import { A, Route, Router } from "@solidjs/router";
import ConfigsPage from "./pages/ConfigsPage";
import HomePage from "./pages/HomePage";

const App = (props: any) => (
	<>
		<A href="/">
			<h1>NetKing</h1>
		</A>
		{props.children}
	</>
);



render(() => (
	<Router root={App}>
		<Route path="/" component={HomePage} />
		<Route path="/configs" component={ConfigsPage} />
	</Router>
), document.getElementById("root") as HTMLElement);
