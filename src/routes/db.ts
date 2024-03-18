import type { Planet, Resident } from "./types";
import type { PlanetInitialState } from "./store";

let db: IDBDatabase | null = null;

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("StarWars", 2);
    request.onerror = (err) => {
      console.error('Error opening indexedDB', err);
    }

    request.onsuccess = () => {
      
      db = request.result;
      resolve({ success: true })
    }

    request.onupgradeneeded = () => {
      db = request.result;
      db?.createObjectStore(`planets`, { keyPath: "name" });
    }
  })
}

export const storePlanetsInDatabase = async (planets: Planet[]) => {
  if (!db) return;

  const transaction = db.transaction(['planets'], 'readwrite');
  const store = transaction.objectStore('planets');
  
  return new Promise((resolve, reject) => {
    planets.map((planet) => {
      const storeAdd = store.add(planet);

      storeAdd.onsuccess = () => {
        resolve({ success: true });
      }
    });
  })
}

export const getPlanetsFromDatabase = async () => {
  if (!db) return;

  const transaction = db.transaction(['planets'], 'readwrite');
  const store = transaction.objectStore('planets');

  return new Promise((resolve, reject) => {
    let currentIdx = 0;
    const planets: PlanetInitialState = {};
    const request = store.openCursor()
    
    request.onsuccess = () => {
      const cursor = request.result;
      
      if (cursor) {
        const page = Math.floor(currentIdx / 10) + 1
        planets[page] = [...(planets[page] || []), cursor.value];
        currentIdx++;
        cursor.continue();
      } else {
        resolve(planets);
      }
    }
  })
}

export const getPlanetFromDatabase = async (name: string): Promise<Planet> => {
  const transaction = db?.transaction(['planets'], 'readwrite');
  const store = transaction?.objectStore('planets');

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

export const storeResidentDataInDatabase = (planetName: string, residents: Resident[]) => {
  const transaction = db?.transaction(['planets'], 'readwrite');
  const store = transaction?.objectStore('planets');

  return new Promise((resolve, reject) => {
    const request = store?.get(planetName);
    if (request) {
      request.onsuccess = () => {
        const planet = request?.result;
        planet.residentData = residents;

        const updateRequest = store?.put(planet);
        if (updateRequest) {
          updateRequest.onsuccess = () => {
            resolve({ success: true });
          }
        }
      }
    }
  })
}