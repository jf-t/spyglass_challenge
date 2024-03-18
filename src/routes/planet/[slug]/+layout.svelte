<script>
  import { page } from '$app/stores';
</script>
<svelte:head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>{$page.params.slug}</title>
</svelte:head>

<div class="app">
	<main>
		<slot />
	</main>

</div>
