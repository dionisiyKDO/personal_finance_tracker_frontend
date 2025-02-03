<script>
	import { goto } from '$app/navigation';

    import { count, user, login } from '$lib/auth';

	let username = '';
	let password = '';
	let errorMessage = '';

	function handleSubmit() {
        login(username, password).then(success => {
            if (success) {
                goto('/');
            }
        });
    }
</script>

<p>{$count}</p>
<h1>Login</h1>

{#if errorMessage}
	<p style="color: red;">{errorMessage}</p>
{/if}
<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
	<label>
		<div class="min-w-24 inline-block">Username:</div>
		<input type="text" bind:value={username} required />
	</label>
	<br />
	<label>
		<div class="min-w-24 inline-block">Password:</div>
		<input type="password" bind:value={password} required />
	</label>
	<br />
	<button type="submit">Login</button>
</form>


