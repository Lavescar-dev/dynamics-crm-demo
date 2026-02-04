<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppShell from '$lib/components/layout/AppShell.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Vertex CRM Demo</title>
</svelte:head>

<AppShell>
	{@render children()}
</AppShell>

<div style="position:fixed;bottom:8px;right:8px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 12px;border-radius:4px;font-size:11px;z-index:9999;pointer-events:none;">DEMO | lavescar.com.tr</div>
