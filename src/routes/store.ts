import { writable, derived } from 'svelte/store';
import type { Planet } from './types';

export interface PlanetInitialState {
  [page: number]: Planet[]
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