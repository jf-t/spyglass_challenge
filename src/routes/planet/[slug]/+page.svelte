<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from "svelte";

  import { planets, paginationPage, currentPlanet, planetInfoKeys } from '../../store';
  import type { Planet, Resident } from '../../types';


  const setCurrentPlanet = (planet: Planet) => {
    let residents: Resident[] = [];
    currentPlanet.set({
      ...planet,
      residentData: residents
    });

    planet.residents.map(residentUrl => {
      fetch(residentUrl)
      .then(response => response.json())
      .then(data => {
        residents.push(data.name);
        currentPlanet.set({
          ...planet,
          residentData: residents
        })
      }).catch(error => {
        console.log(error);
        return [];
      });
    });
  }
  
  onMount(async () => {
    if (!$planets[$paginationPage]?.length) {
      fetch(`https://swapi.dev/api/planets?page=${$paginationPage}`)
      .then(response => response.json())
      .then(data => {
        planets.set({
          ...$planets,
          [$paginationPage]: data.results
        });
        setCurrentPlanet(data.results.filter((planet: Planet) => planet.name === $page.params.slug)[0])
      }).catch(error => {
        console.log(error);
        return [];
      });
    } else {
      console.log($planets[$paginationPage].filter((planet: Planet) => planet.name === $page.params.slug)[0])
      setCurrentPlanet($planets[$paginationPage].filter((planet: Planet) => planet.name === $page.params.slug)[0]);
    }
  })
</script>

{#if !$currentPlanet}
  <p>Loading...</p>
{:else}
  <h1>Planet {$currentPlanet.name}</h1>
  {#each planetInfoKeys as key}
    <p>{key}: {$currentPlanet[key]}</p>
  {/each}
  <h2>Residents:</h2>
  {#each $currentPlanet?.residentData as resident}
    <p>{resident}</p>
  {/each}
{/if}