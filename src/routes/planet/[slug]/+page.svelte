<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from "svelte";

  import { planets, paginationPage, currentPlanet, planetInfoKeys } from '../../store';
  import type { Planet, Resident } from '../../types';
  import { getPlanetsFromDatabase, getPlanetFromDatabase, initializeDatabase, storePlanetsInDatabase } from '../../db';


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

  const fetchPlanetData = () => {
    getPlanetFromDatabase($page.params.slug).then((data) => {
      console.log("specirfic planet")
      console.log(data)
      if (data) {
        setCurrentPlanet(data);
      } else {
        fetch(`https://swapi.dev/api/planets?search=${$page.params.slug}`)
        .then(response => response.json())
        .then(data => {
          storePlanetsInDatabase(data.results);
          if (data.results.length > 0) {
            setCurrentPlanet(data.results[0]);
          } else {
            console.log('Planet not found');
          }
        }).catch(error => {
          console.log(error);
          return [];
        });
      }
    });
  }
  
  onMount(async () => {
    initializeDatabase().then(() => {
      getPlanetsFromDatabase().then((data) => {
        console.log(data);
        planets.set(data);
        fetchPlanetData();
      });
    });
  });
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