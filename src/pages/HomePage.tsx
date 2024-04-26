import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { A } from "@solidjs/router";

export default function HomePage() {
	const [greetMsg, setGreetMsg] = createSignal("");
	const [name, setName] = createSignal("");

	async function greet() {
		// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
		setGreetMsg(await invoke("greet", { name: name() }));
	}


	return (
		<div class="container">
			<h1>Welcome to Tauri!</h1>

			<form
				class="row"
				onSubmit={(e) => {
					e.preventDefault();
					greet();
				}}
			>
				<input
					id="greet-input"
					onChange={(e) => setName(e.currentTarget.value)}
					placeholder="Enter a name..."
				/>
				<button type="submit">Greet</button>
			</form>

			<p>{greetMsg()}</p>

			<A href="/configs" class="btn">
				Go To Configs Page
			</A>
		</div>
	);
}
