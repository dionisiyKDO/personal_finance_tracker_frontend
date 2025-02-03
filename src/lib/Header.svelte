<script lang="ts">
    import { user, logout } from '$lib/auth';

    const links = [
        { name: 'Link', href: '/' },
        { name: 'Link', href: '/' },
        { name: 'Link', href: '/' },
    ];
</script>

<header class="p-6 pb-4 mb-6 border-b border-[--border]">
    <nav class="flex items-center justify-between">
        <a href="/" class="text-xl font-bold">Personal Finance Tracker</a>
        {#if $user}
            <p>{$user?.username}</p>
        {/if}
        <div class="flex items-center gap-4">
            
            {#each links as link}
                <a href={link.href}>{link.name}</a>
            {/each}

            <!-- vertical border -->
            <div class="border-l border-[--border]">
                {#if $user} <!-- Logut -->
                    <button onclick={logout} class="min-w-16 ml-4">Logout</button>
                {:else} <!-- Login -->
                    <a href="/auth" class="min-w-16 inline-block ml-4">Login</a>
                {/if}
            </div>
        </div>
    </nav>
</header>
