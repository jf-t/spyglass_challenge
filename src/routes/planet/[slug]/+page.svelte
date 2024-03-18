<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from "svelte";

  import { planets, currentPlanet, planetInfoKeys } from '../../store';
  import type { Planet, Resident } from '../../types';
  import { 
    getPlanetsFromDatabase, 
    getPlanetFromDatabase, 
    initializeDatabase, 
    storeResidentDataInDatabase 
  } from '../../db';


  const setCurrentPlanet = (planet: Planet) => {
    let residents: Resident[] = [];
  
    if (!planet.residentData) {
      currentPlanet.set({
        ...planet,
        residentData: residents
      });
      planet.residents.map(residentUrl => {
        fetch(residentUrl)
        .then(response => response.json())
        .then((data: Resident) => {
          residents.push(data);
          currentPlanet.set({
            ...planet,
            residentData: residents
          });
          storeResidentDataInDatabase(planet.name, residents);
        }).catch(error => {
          console.log(error);
          return [];
        });
      });
    } else {
      currentPlanet.set(planet);
    }
  }

  const fetchPlanetData = () => {
    getPlanetFromDatabase($page.params.slug).then((data: Planet) => {
      if (data) {
        setCurrentPlanet(data);
      } else {
        fetch(`https://swapi.dev/api/planets?search=${$page.params.slug}`)
        .then(response => response.json())
        .then(data => {
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
        planets.set(data);
        fetchPlanetData();
      });
    });
  });

  const capitalCase = (key: string): string => {
    return key.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
  }
</script>

<a href="/">Home</a>
{#if !$currentPlanet}
  <p>Loading...</p>
{:else}
  <h1>Planet {$currentPlanet.name}</h1>
  {#each planetInfoKeys as key}
    <div class="planet-data">
      <span class="planet-key">{capitalCase(key)}</span>
      <span class="planet-value">{$currentPlanet[key]}</span>
    </div>
  {/each}
  <h2>Residents:</h2>
  {#if !$currentPlanet.residentData.length}
    <p>No residents</p>
  {:else}
    {#each $currentPlanet?.residentData as resident}
      <p>{resident.name}</p>
    {/each}
  {/if}
{/if}