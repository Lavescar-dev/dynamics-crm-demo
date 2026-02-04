<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLSpanElement> & {
		ref?: HTMLSpanElement | null;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: $$Props = $props();
</script>

<span
	bind:this={ref}
	data-slot="dropdown-menu-shortcut"
	class={cn("text-muted-foreground ms-auto text-xs tracking-widest", className)}
	{...restProps}
>
	{@render children?.()}
</span>
