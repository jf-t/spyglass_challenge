import type { Planet } from "./types";
import type { PlanetInitialState } from "./store";

let db: IDBDatabase | null = null;

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("StarWars", 1);
    request.onerror = (event) => {
      console.error('Error opening indexedDB', event);
    }

    request.onsuccess = (event: Event) => {
      db = event?.target?.result;
      console.log("Connected to DB")
      resolve({ success: true })
    }

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      if (!event?.target?.result) {
        console.error('No result from upgrade needed event');
        return;
      }

      db = event.target.result;
      db?.createObjectStore(`planets`, { autoIncrement: true });
    }
  })
}

export const storePlanetsInDatabase = async (planets: Planet[]) => {
  const transaction = db?.transaction(['planets'], 'readwrite');
  const store = transaction?.objectStore('planets');

  console.log(planets.length);
  
  planets.map((planet) => {
    const storeAdd = store.add(planet);

    storeAdd.onsuccess = () => {
      console.log('added planet to db')
    }
  });
}

export const getPlanetsFromDatabase = async () => {
  const transaction = db?.transaction(['planets'], 'readwrite');
  const store = transaction?.objectStore('planets');

  return new Promise((resolve, reject) => {
    if (!store) {
      console.log('no store')
    } else {
      let currentIdx = 0;
      const planets: PlanetInitialState = {};
      store.openCursor().onsuccess = (event) => {
        const cursor = event?.target?.result;
        if (cursor) {
          planets[Math.floor(currentIdx / 10) + 1] = [...(planets[Math.floor(currentIdx / 10) + 1] || []), cursor.value];
          currentIdx++;
          cursor.continue();
        } else {
          resolve(planets);
        }
      }
    }
  })
}

export const getPlanetFromDatabase = async (name: string) => {
  const transaction = db?.transaction(['planets'], 'readwrite');
  const store = transaction?.objectStore('planets');

  console.log("get planet", name)

  return new Promise((resolve, reject) => {
    const request = store?.get(name);
    if (!request) {

    } else {
      request.onsuccess = () => {
        resolve(request?.result);
      }
      request.onerror = () => {
        reject(request?.error);
      }
    }
  })
}