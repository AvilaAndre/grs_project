export default function InstanceInfoCard(props: any) {
	const instance = props.instance;

	return (
		<div class="card w-full bg-primary text-primary-content shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{instance.name}</h2>
				<h5> {instance.type} </h5>
				<div class="card-actions justify-end">
					<button class="btn btn-primary">Close</button>
				</div>
			</div>
		</div>
	);
}
