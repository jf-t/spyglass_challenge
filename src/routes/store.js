import { writable, derived } from 'svelte/store';

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/
export const planets = writable([]);
export const currentPlanet = writable({
  residents: []
});

// TODO: 
//  - filter out key details from planet
// -  cache all data in indexedDB
// -  add a loading state
// -  add a error state
// -  pagination