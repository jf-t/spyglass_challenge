<script>
import { onMount } from "svelte";
import { planets } from './store.js';

onMount(async () => {
  fetch("https://swapi.dev/api/planets")
  .then(response => response.json())
  .then(data => {
    planets.set(data.results);
  }).catch(error => {
    console.log(error);
    return [];
  });
});

</script>

<main>
	<h1>Planets</h1>
	{#each $planets as planet}
		<a href={`/planet/${planet.name}`}>{planet.name}</a>
	{/each}
</main>

<style>
a {
	display: block;
	margin: 10px;
	padding: 10px;
	width: 200px;
	background-color: #f0f0f0;
	border: 1px solid #ccc;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s;
}

a:hover {
	background-color: #e0e0e0;
}
</style>