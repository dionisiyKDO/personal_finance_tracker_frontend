<script>
    import { count } from '$lib/auth';

    let countValue = $count;

    function increment() {
        countValue += 1;
        count.set(countValue);
    }
</script>

<p>{$count}</p>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<button onclick={increment}>
    Click me
</button>