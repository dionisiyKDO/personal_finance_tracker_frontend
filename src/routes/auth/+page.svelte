<script>
	import { goto } from '$app/navigation';

    import { user, login } from '$lib/auth';

	let username = '';
	let password = '';

	function handleSubmit() {
        login(username, password).then(success => {
            if (success) {
                goto('/');
            }
        });
    }
</script>


<div class="flex flex-col items-center justify-center gap-4">
	<h1 class="text-center text-3xl font-bold">Login</h1>
	
	<div class="min-w-96 max-w-md">
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-2">
			<input class="form-input" type="text" placeholder="username" bind:value={username} required />
			<br />
			<input class="form-input" type="password" placeholder="password" bind:value={password} required />
			<br />
			<button class="form-button" type="submit">Login</button>
		</form>
	</div>
</div>
