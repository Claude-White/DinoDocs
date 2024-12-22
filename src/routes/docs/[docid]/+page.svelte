<script lang="ts">
	import type { PageData } from './$types';
	import { Plus } from 'lucide-svelte';
	import Sortable from '$lib/components/Sortable.svelte';

	type Item = {
		id: number;
		name: string;
		isNew?: boolean;
	};

	let { data }: { data: PageData } = $props();
	let items: Item[] = $state([]);
	let showAddGroupForm: boolean = $state(false);
	let newGroupInput: HTMLElement | undefined = $state();

	function handleAddGroupSubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const groupName = formData.get('new-group-name');
		if (groupName) {
			showAddGroupForm = false;
			let nextItemId = 0;
			const highestIdItem = items.reduce((max, obj) => (obj.id > max.id ? obj : max), items[0]);
			if (highestIdItem) {
				nextItemId = highestIdItem.id + 1;
			}
			items = [{ id: nextItemId, name: groupName.toString() }, ...items];
		}
	}
</script>

<!-- Breadcrumb -->
<div
	class="sticky inset-x-0 top-0 z-20 border-y bg-white px-4 dark:border-neutral-700 dark:bg-neutral-800 sm:px-6 lg:hidden lg:px-8"
>
	<div class="flex items-center py-2">
		<!-- Navigation Toggle -->
		<button
			type="button"
			class="flex size-8 items-center justify-center gap-x-2 rounded-lg border border-gray-200 text-gray-800 hover:text-gray-500 focus:text-gray-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
			aria-haspopup="dialog"
			aria-expanded="false"
			aria-controls="hs-application-sidebar"
			aria-label="Toggle navigation"
			data-hs-overlay="#hs-application-sidebar"
		>
			<span class="sr-only">Toggle Navigation</span>
			<svg
				class="size-4 shrink-0"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /><path
					d="m8 9 3 3-3 3"
				/></svg
			>
		</button>
		<!-- End Navigation Toggle -->
	</div>
</div>

<!-- Sidebar -->
<div
	id="hs-application-sidebar"
	class="hs-overlay fixed
    inset-y-0
    start-0 z-[60] hidden h-full
    w-[260px] -translate-x-full
    transform
    border-e border-gray-200 bg-white transition-all
    duration-300 [--auto-close:lg] hs-overlay-open:translate-x-0
    dark:border-neutral-700 dark:bg-neutral-800 lg:bottom-0 lg:end-auto
    lg:block lg:translate-x-0"
	role="dialog"
	tabindex="-1"
	aria-label="Sidebar"
>
	<div class="relative flex h-full max-h-full flex-col">
		<!-- Content -->
		<div
			class="h-full overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2"
		>
			<nav
				class="hs-accordion-group flex w-full flex-col flex-wrap p-3"
				data-hs-accordion-always-open
			>
				<ul>
					<li>
						<button
							onclick={() => (showAddGroupForm = true)}
							id="add-group"
							class="flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none active:animate-bounce-in disabled:pointer-events-none disabled:opacity-50"
						>
							Add Group
							<Plus size={20} />
						</button>
					</li>
					{#if showAddGroupForm}
						{newGroupInput?.focus()}
						<li class="mt-2">
							<form method="post" onsubmit={handleAddGroupSubmit} class="flex items-center gap-2">
								<input
									type="text"
									class="block w-full rounded-lg border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:focus:ring-neutral-600"
									placeholder="Enter group name"
									name="new-group-name"
									required
									bind:this={newGroupInput}
									onblur={() => (showAddGroupForm = false)}
								/>
							</form>
						</li>
					{/if}
					<Sortable {items} />
				</ul>
			</nav>
		</div>
		<!-- End Content -->
	</div>
</div>
<!-- End Sidebar -->

<!-- Content -->
<div class="h-full w-full px-4 pt-10 sm:px-6 md:px-8 lg:ps-72">
	<h1>Testing</h1>
</div>
<!-- End Content -->
