<script>
  import { page } from '$app/stores';
  import { planets, currentPlanet } from '../../store.js';
  import { onMount } from "svelte";

  const setCurrentPlanet = (planet) => {
    let residents = [];
    planet.residents.map(residentUrl => {
      fetch(residentUrl)
      .then(response => response.json())
      .then(data => {
        residents.push(data.name);
        currentPlanet.set({
          ...planet,
          residents
        })
      }).catch(error => {
        console.log(error);
        return [];
      });
    });
  }
  
  onMount(async () => {
    if (!planets.length) {
      fetch("https://swapi.dev/api/planets")
      .then(response => response.json())
      .then(data => {
        planets.set(data.results);
        setCurrentPlanet(data.results.filter(planet => planet.name === $page.params.slug)[0])
      }).catch(error => {
        console.log(error);
        return [];
      });
    } else {
      setCurrentPlanet(planets.filter(planet => planet.name === $page.params.slug)[0]);
    }
  })
</script>


<h1>Planet {$currentPlanet.name}</h1>
{#each Object.keys($currentPlanet) as key}
  <p>{key}: {$currentPlanet[key]}</p>
{/each}
{#each $currentPlanet?.residents as resident}
  <p>{resident}</p>
{/each}