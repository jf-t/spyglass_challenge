import { writable, derived } from 'svelte/store';
import type { Planet } from './types';

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/

export interface PlanetInitialState {
  [page: number]: Planet[]
}


const planetsInitialState: PlanetInitialState = {
  1: []
}

export const planets = writable<PlanetInitialState>({});
export const currentPlanet = writable<Planet>();
export const paginationPage = writable(1);


export const planetInfoKeys: Array<keyof Planet> = [
  'climate',
  'diameter',
  'gravity',
  'orbital_period',
  'population',
  'rotation_period',
  'surface_water',
  'terrain'
];

// TODO: 
//  - filter out key details from planet
// -  cache all data in indexedDB
// -  add a loading state
// -  add a error state
// -  pagination