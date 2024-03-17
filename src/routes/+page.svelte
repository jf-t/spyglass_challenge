<script lang="ts">
import { page } from '$app/stores';
import { onMount } from "svelte";
import { planets, paginationPage } from './store';
import { initializeDatabase, getPlanetsFromDatabase, storePlanetsInDatabase } from './db';

const fetchPlanetsData = (fetchPage: number) => {
	if ($planets[fetchPage]) return;

	fetch(`https://swapi.dev/api/planets?page=${fetchPage || 1}`)
		.then(response => response.json())
		.then(data => {
			storePlanetsInDatabase(data.results);
			planets.set({
				...$planets,
				[fetchPage]: data.results
			});
		}).catch(error => {
			console.log(error);
			return [];
		});
}

onMount(async () => {
	initializeDatabase().then(() => {
		getPlanetsFromDatabase().then((data) => {
			console.log(data);
			planets.set(data);
			fetchPlanetsData(1);
		});
	});
});

const nextPage = () => {
	planets.set({
		...$planets
	});
	
	const currentPage = $paginationPage || 1;
	const nextPage = currentPage + 1;
	paginationPage.set(nextPage);
	fetchPlanetsData(nextPage);
}

const prevPage = () => {
	const currentPage = $paginationPage || 1;
	const prevPage = currentPage - 1;
	paginationPage.set(prevPage);
	fetchPlanetsData(prevPage);
}

</script>

<main>
	<h1>Planets</h1>
	{#if !$planets[$paginationPage]}
		<p>Loading...</p>
	{:else}
		{#each $planets[$paginationPage] as planet}
			<a href={`/planet/${planet.name}`}>{planet.name}</a>
		{/each}
	{/if}
	<button on:click={prevPage}>Previous</button>
	<span>{$paginationPage}</span>
	<button on:click={nextPage}>Next</button>
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