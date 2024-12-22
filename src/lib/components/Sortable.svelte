<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	const FLIP_DURATION = 100;
	type Item = {
		id: number;
		name: string;
	};
	let { items }: { items: Item[] } = $props();

	let currentOrder = $state(items);

	const handleConsider = (e: CustomEvent<DndEvent<Item>>) => {
		currentOrder = [...e.detail.items];
		items = currentOrder;
	};

	const handleFinalize = (e: CustomEvent<DndEvent<Item>>) => {
		currentOrder = [...e.detail.items];
		items = currentOrder;
	};

	$effect(() => {
		if (items) {
			const newItems = items.filter(
				(item) => !currentOrder.find((existing) => existing.id === item.id)
			);
			items = [...newItems, ...currentOrder];
		}
	});
</script>

<ul
	class="mt-2 flex flex-col gap-2"
	use:dndzone={{ items: items, flipDurationMs: FLIP_DURATION, dropTargetStyle: {} }}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
>
	{#each items as item (item.id)}
		<li class="rounded-lg bg-slate-100 px-2 py-1 ring-1" animate:flip={{ duration: FLIP_DURATION }}>
			{item.name}
		</li>
	{/each}
</ul>
