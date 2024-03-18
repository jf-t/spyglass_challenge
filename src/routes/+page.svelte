<script lang="ts">
import { onMount } from "svelte";
import { planets, paginationPage } from './store';
import { 
	initializeDatabase, 
	getPlanetsFromDatabase, 
	storePlanetsInDatabase 
} from './db';

const fetchPlanetsData = (page: number) => {
	if ($planets[page]) return;

	fetch(`https://swapi.dev/api/planets?page=${page || 1}`)
		.then(response => response.json())
		.then(data => {
			storePlanetsInDatabase(data.results);
			planets.set({
				...$planets,
				[page]: data.results
			});
		}).catch(error => {
			console.log(error);
			return [];
		});
}

onMount(async () => {
	initializeDatabase().then(() => {
		getPlanetsFromDatabase().then((data) => {
			planets.set(data);
			fetchPlanetsData(1);
		});
	});
});

const nextPage = () => {
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
	<h1>Planets of Star Wars</h1>
	{#if !$planets[$paginationPage]}
		<p>Loading...</p>
	{:else}
		{#each $planets[$paginationPage] as planet}
			<a href={`/planet/${planet.name}`}>{planet.name}</a>
		{/each}
	{/if}
	<div class="flex">
		<button class="prev-next" on:click={prevPage}>Previous</button>
		<span class="page-num">{$paginationPage}</span>
		<button class="prev-next" on:click={nextPage}>Next</button>
	</div>
</main>
