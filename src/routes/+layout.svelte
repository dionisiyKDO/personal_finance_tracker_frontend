<script lang="ts">
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import '../app.css';

	import { initializeToken } from '$lib/auth';
	
	let { children } = $props();

	initializeToken();
</script>


<div class="flex flex-col min-h-screen">
	<Header />

	<main class="flex-1 flex mx-auto w-full flex-col p-4 max-w-7xl">
		{@render children()}
	</main>

	<Footer />
</div>

