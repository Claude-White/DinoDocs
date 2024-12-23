<script lang="ts">
	import { dragHandle, dragHandleZone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { GripVertical, Ellipsis, Trash2, Pen } from 'lucide-svelte';
	import { createPopperActions } from 'svelte-popperjs';

	const FLIP_DURATION = 100;
	type Item = {
		id: number;
		name: string;
		isNew?: boolean;
	};
	let { items }: { items: Item[] } = $props();

	let currentOrder = $state(items);
	let openDropdownId = $state<number | null>(null);
	let isDragDisabled = $derived(openDropdownId != null);
	const handleConsider = (e: CustomEvent<DndEvent<Item>>) => {
		currentOrder = [...e.detail.items];
		items = currentOrder;
	};

	const handleFinalize = (e: CustomEvent<DndEvent<Item>>) => {
		currentOrder = [...e.detail.items];
		items = currentOrder;
	};

	const toggleDropdown = (itemId: number) => {
		openDropdownId = openDropdownId === itemId ? null : itemId;
	};

	// Close dropdown when clicking outside
	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			openDropdownId = null;
		}
	};

	$effect(() => {
		if (items) {
			const newItems = items.filter(
				(item) => !currentOrder.find((existing) => existing.id === item.id)
			);
			items = [...currentOrder, ...newItems];
			setTimeout(() => {
				items = items.map((item) => ({ ...item, isNew: false }));
			}, 0);
		}
	});
</script>

<svelte:window on:click={handleClickOutside} />

<ul
	use:dragHandleZone={{
		items: items,
		flipDurationMs: FLIP_DURATION,
		dropTargetStyle: {}
	}}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
>
	{#each items as item (item.id)}
		{@const [popperRef, popperContent] = createPopperActions({
			placement: 'right',
			strategy: 'fixed'
		})}
		{@const extraOpts = {
			modifiers: [{ name: 'offset', options: { offset: [50, -15] } }]
		}}
		<li
			class="mt-2 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-100 px-2.5 py-2 text-start text-sm text-gray-800 shadow-sm hover:bg-gray-200 focus:bg-gray-100 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
			animate:flip={item.isNew ? undefined : { duration: FLIP_DURATION }}
		>
			<div class="flex items-center gap-2">
				{#if isDragDisabled}
					<span class="drag-handle" aria-label="Drag handle">
						<GripVertical class="opacity-50" size={16} />
					</span>
				{:else}
					<span use:dragHandle class="drag-handle" aria-label="Drag handle">
						<GripVertical class="opacity-50" size={16} />
					</span>
				{/if}
				{item.name}
			</div>
			<div class="dropdown-container relative inline-flex">
				<button
					use:popperRef
					onclick={() => toggleDropdown(item.id)}
					type="button"
					class="text-sm font-semibold text-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
					aria-haspopup="menu"
					aria-expanded={openDropdownId === item.id}
					aria-label="Dropdown"
				>
					<Ellipsis size={16} />
				</button>

				{#if openDropdownId === item.id}
					<div
						use:popperContent={extraOpts}
						class="border relative z-40 border-gray-300 shadow-sm overflow-hidden rounded-lg bg-gray-100 dark:border dark:border-neutral-700 dark:bg-neutral-800"
						role="menu"
						aria-orientation="vertical"
					>
						<div class="space-y-0.5">
							<a
								class="flex items-center gap-x-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
								href="#"
							>
								<Pen size={16} />
								Rename
							</a>
							<a
								class="flex items-center gap-x-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-200 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
								href="#"
							>
								<Trash2 size={16} />
								Delete
							</a>
						</div>
					</div>
				{/if}
			</div>
		</li>
	{/each}
</ul>
