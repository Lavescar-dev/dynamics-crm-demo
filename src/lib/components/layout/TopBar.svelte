<script lang="ts">
  import { Menu, Search, Bell, HelpCircle, Settings, User, ChevronDown } from 'lucide-svelte';
  import { navigationStore } from '$lib/stores';

  let searchQuery = $state('');
  let showUserMenu = $state(false);
  let showNotifications = $state(false);

  function toggleSidebar() {
    navigationStore.toggleSidebar();
  }

  function handleSearch(e: Event) {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  }
</script>

<header class="top-bar h-12 bg-primary flex items-center justify-between px-4 text-white shadow-md z-50">
  <!-- Left Section -->
  <div class="flex items-center gap-4">
    <!-- Menu Toggle -->
    <button
      onclick={toggleSidebar}
      class="p-2 hover:bg-primary-hover rounded transition-colors"
      aria-label="Toggle sidebar"
    >
      <Menu class="w-5 h-5" />
    </button>

    <!-- Logo/Title -->
    <div class="flex items-center gap-2">
      <span class="font-semibold text-lg">Vertex CRM</span>
    </div>

    <!-- Global Search -->
    <form onsubmit={handleSearch} class="hidden md:flex items-center">
      <div class="relative">
        <Search class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search..."
          class="pl-10 pr-4 py-1.5 w-64 bg-primary-hover rounded text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>
    </form>
  </div>

  <!-- Right Section -->
  <div class="flex items-center gap-2">
    <!-- Search Icon (Mobile) -->
    <button class="md:hidden p-2 hover:bg-primary-hover rounded transition-colors">
      <Search class="w-5 h-5" />
    </button>

    <!-- Help -->
    <button class="p-2 hover:bg-primary-hover rounded transition-colors" title="Help">
      <HelpCircle class="w-5 h-5" />
    </button>

    <!-- Settings -->
    <button class="p-2 hover:bg-primary-hover rounded transition-colors" title="Settings">
      <Settings class="w-5 h-5" />
    </button>

    <!-- Notifications -->
    <div class="relative">
      <button
        onclick={() => showNotifications = !showNotifications}
        class="p-2 hover:bg-primary-hover rounded transition-colors relative"
        title="Notifications"
      >
        <Bell class="w-5 h-5" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
      </button>

      {#if showNotifications}
        <div class="absolute right-0 mt-2 w-80 bg-white rounded shadow-xl text-gray-800 max-h-96 overflow-auto">
          <div class="p-4 border-b">
            <h3 class="font-semibold">Notifications</h3>
          </div>
          <div class="p-4">
            <p class="text-sm text-gray-500">No new notifications</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- User Menu -->
    <div class="relative">
      <button
        onclick={() => showUserMenu = !showUserMenu}
        class="flex items-center gap-2 p-2 hover:bg-primary-hover rounded transition-colors"
      >
        <div class="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
          <User class="w-4 h-4" />
        </div>
        <span class="hidden lg:inline text-sm">John Smith</span>
        <ChevronDown class="w-4 h-4 hidden lg:inline" />
      </button>

      {#if showUserMenu}
        <div class="absolute right-0 mt-2 w-48 bg-white rounded shadow-xl text-gray-800">
          <div class="p-4 border-b">
            <p class="font-semibold">John Smith</p>
            <p class="text-sm text-gray-500">Sales Manager</p>
          </div>
          <div class="py-2">
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
              My Profile
            </button>
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
              Settings
            </button>
            <hr class="my-2" />
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600">
              Sign Out
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .top-bar {
    min-height: 48px;
  }
</style>
