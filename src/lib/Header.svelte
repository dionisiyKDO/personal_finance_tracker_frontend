<script lang="ts">
    import { user, logout } from '$lib/auth';
</script>

<header class="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 ">
    <nav>
        <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-white">
                Personal Finance Tracker
            </a>
            {#if $user}
                <button onclick={logout} class="ml-8 text-xl font-bold text-white">Logout</button>
            {:else}
                <a href="/auth" class="ml-8 text-xl font-bold text-white">Login</a>
            {/if}
        </div>
        
    </nav>
</header>

