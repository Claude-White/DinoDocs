<script lang="ts">
    import { onMount } from 'svelte';
    import Sortable from 'sortablejs';
  
    // Define props directly rather than using $props()
    export let items: string[];
    export let options: any = {};
    export let onUpdate: (newOrder: string[]) => void;
  
    let container: HTMLElement;
  
    onMount(() => {
      const sortable = Sortable.create(container, {
        ...options,
        onEnd: (event: { newIndex: number; oldIndex: number }) => {
          const { newIndex, oldIndex } = event;
  
          if (newIndex !== oldIndex) {
            // Update the items array based on the new order
            const updatedItems = [...items];
            const [movedItem] = updatedItems.splice(oldIndex, 1);
            updatedItems.splice(newIndex, 0, movedItem);
  
            // Trigger callback with updated order
            onUpdate(updatedItems);
          }
        }
      });
  
      // Cleanup on component destruction
      return () => sortable.destroy();
    });
  </script>
  
  <ul class="flex flex-col space-y-1" bind:this={container}>
    {#each items as item}
      <li>{item}</li>
    {/each}
  </ul>