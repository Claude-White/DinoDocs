<script lang="ts">
	import type { PageData } from './$types';
	import { Plus } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let formSubmitHandler: ((e: Event) => boolean) | null = null;
	let documentClickHandler: ((e: MouseEvent) => void) | null = null;

	function addGroup() {
		const groupList = document.getElementById('group-list');
		if (!groupList) return;

		// Remove existing form if present
		const existingForm = document.getElementById('new-group-form');
		if (existingForm) {
			cleanupForm();
			return;
		}

		const formElement = document.createElement('li');
		formElement.id = 'new-group-form';
		formElement.className = 'py-2';

		// Create the form submit handler
		formSubmitHandler = function (event: Event) {
			event.preventDefault();

			const input = document.getElementById('new-group-name') as HTMLInputElement;
			if (!input || !input.value.trim()) return false;

			const groupName = input.value.trim();
			const newId = `accordion-${Date.now()}`;

			const newAccordion = document.createElement('li');
			newAccordion.className = 'hs-accordion';
			newAccordion.id = newId;

			newAccordion.innerHTML = `
            <button
                type="button"
                class="hs-accordion-toggle flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                aria-expanded="true"
                aria-controls="${newId}-child"
            >
                ${groupName}

                <svg
                    class="ms-auto hidden size-4 hs-accordion-active:block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg>

                <svg
                    class="ms-auto block size-4 hs-accordion-active:hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>

            <div
                id="${newId}-child"
                class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="${newId}"
            >
                <ul class="space-y-1 ps-8 pt-1">
                    <li>
                        <a
                            class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200"
                            href="#"
                        >
                            Link 1
                        </a>
                    </li>
                    <li>
                        <a
                            class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200"
                            href="#"
                        >
                            Link 2
                        </a>
                    </li>
                    <li>
                        <a
                            class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200"
                            href="#"
                        >
                            Link 3
                        </a>
                    </li>
                </ul>
            </div>
        `;

			cleanupForm();

			// Insert the new accordion after the "Add Group" button
			const addButton = document.getElementById('add-group');
			if (addButton && addButton.parentNode) {
				addButton.parentNode.after(newAccordion);
			}

			// Initialize the new accordion with Preline's HS library
			// @ts-ignore
			if (window.HSAccordion) {
				// @ts-ignore
				new window.HSAccordion(newAccordion);
			}

			return false;
		};

		// Create document click handler for clicking outside
		documentClickHandler = function (event: MouseEvent) {
			const form = document.getElementById('new-group-form');
			const addButton = document.getElementById('add-group');

			if (!form || !addButton) return;

			const target = event.target as HTMLElement;

			// Check if the click is outside both the form and the add button
			if (!form.contains(target) && !addButton.contains(target)) {
				cleanupForm();
			}
		};

		formElement.innerHTML = `
        <form class="flex items-center gap-2">
            <input
                type="text"
                class="block w-full rounded-lg border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:focus:ring-neutral-600"
                placeholder="Enter group name"
                id="new-group-name"
                required
            >
        </form>
    `;

		// Insert the form after the "Add Group" button
		const addButton = document.getElementById('add-group');
		if (addButton && addButton.parentNode) {
			addButton.parentNode.after(formElement);

			// Add event listeners
			const form = formElement.querySelector('form');
			if (form && formSubmitHandler) {
				form.addEventListener('submit', formSubmitHandler);
			}

			// Add document click listener
			if (documentClickHandler) {
				// Wait for next tick to add click listener to prevent immediate trigger
				setTimeout(() => {
					document.addEventListener('click', documentClickHandler!);
				}, 0);
			}

			// Focus the input
			const input = document.getElementById('new-group-name');
			if (input) {
				input.focus();
			}
		}
	}

	function cleanupForm() {
		const form = document.getElementById('new-group-form');
		if (form) {
			// Remove event listeners
			if (formSubmitHandler) {
				const formElement = form.querySelector('form');
				formElement?.removeEventListener('submit', formSubmitHandler);
			}
			if (documentClickHandler) {
				document.removeEventListener('click', documentClickHandler);
			}

			// Remove the form
			form.remove();
		}

		// Reset handlers
		formSubmitHandler = null;
		documentClickHandler = null;
	}

	// Add type declaration for HSAccordion
	declare global {
		interface Window {
			HSAccordion: any;
		}
	}
</script>

<!-- ========== MAIN CONTENT ========== -->
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
<!-- End Breadcrumb -->

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
				<ul id="group-list" class="flex flex-col space-y-1">
					<li>
						<button
							onclick={addGroup}
							id="add-group"
							class="active:animate-bounce-in flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
						>
							Add Group
							<Plus size={20} />
						</button>
					</li>
				</ul>
			</nav>
		</div>
		<!-- End Content -->
	</div>
</div>
<!-- End Sidebar -->

<!-- Content -->
<div class="w-full px-4 pt-10 sm:px-6 md:px-8 lg:ps-72">
	<!-- your content goes here ... -->
</div>
<!-- End Content -->
<!-- ========== END MAIN CONTENT ========== -->
