<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { GripVertical } from 'lucide-svelte';
	const FLIP_DURATION = 100;
	type Item = {
		id: number;
		name: string;
		isNew?: boolean;
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
			setTimeout(() => {
				items = items.map((item) => ({ ...item, isNew: false }));
			}, 0);
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
		<li
			class="hs-accordion-toggle flex w-full items-center gap-x-2 rounded-lg border border-gray-300 bg-gray-100 px-2.5 py-2 text-start text-sm text-gray-800 shadow-sm hover:bg-gray-200 focus:bg-gray-100 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
			animate:flip={item.isNew ? undefined : { duration: FLIP_DURATION }}
		>
			<GripVertical class="opacity-50" size={16} />
			{item.name}
		</li>
	{/each}
</ul>
