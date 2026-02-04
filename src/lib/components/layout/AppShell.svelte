<script lang="ts">
  import { navigationStore } from '$lib/stores';
  import TopBar from './TopBar.svelte';
  import Sidebar from './Sidebar.svelte';

  let { children } = $props();

  const navState = navigationStore.state;
</script>

<div class="app-shell h-screen flex flex-col overflow-hidden bg-background">
  <!-- Top Bar -->
  <TopBar />

  <!-- Main Content Area -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar -->
    {#if navState.isSidebarVisible}
      <Sidebar />
    {/if}

    <!-- Main Content -->
    <main
      class="flex-1 overflow-auto bg-background transition-all duration-300"
      class:ml-0={navState.isSidebarCollapsed || !navState.isSidebarVisible}
    >
      <div class="p-6">
        {@render children()}
      </div>
    </main>
  </div>
</div>

<style>
  .app-shell {
    font-family: var(--font-sans, 'Segoe UI', system-ui, sans-serif);
  }
</style>
