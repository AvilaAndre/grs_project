import TaskBar from "../shared/components/actions/taskbar"

export default function ActionsPage(props: any) {
	const config_name = props.params.id

	return (
		<>
			<h1 class="text-lg"> {props.params.id} </h1>

			<TaskBar config_name={config_name} />
		</>
	)
}
