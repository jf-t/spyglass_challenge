import type { Planet, Resident } from "./types";
import type { PlanetInitialState } from "./store";

let db: IDBDatabase | null = null;

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("StarWars", 2);
    request.onerror = () => {
      reject(request.error);
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
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized");
      return;
    }

    const transaction = db.transaction(['planets'], 'readwrite');
    const store = transaction.objectStore('planets');
  
    planets.map((planet) => {
      const storeAdd = store.add(planet);

      storeAdd.onerror = () => {
        reject(storeAdd.error);
      }
      
      storeAdd.onsuccess = () => {
        resolve({ success: true });
      }
    });
  })
}

export const storeResidentDataInDatabase = (planetName: string, residents: Resident[]): Promise<Planet> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized");
      return;
    }

    const transaction = db.transaction(['planets'], 'readwrite');
    const store = transaction.objectStore('planets');
    const request = store.get(planetName);

    request.onerror = () => {
      reject(request.error);
    }

    request.onsuccess = () => {
      const planet = request.result;
      planet.residentData = residents;

      const updateRequest = store.put(planet);
      updateRequest.onsuccess = () => {
        resolve(planet);
      }
    }
  })
}

export const getPlanetsFromDatabase = async (): Promise<PlanetInitialState> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized");
      return;
    }

    const transaction = db.transaction(['planets'], 'readwrite');
    const store = transaction.objectStore('planets');

    let currentIdx = 0;
    const planets: PlanetInitialState = {};
    const request = store.openCursor()

    request.onerror = () => {
      reject(request.error);
    }
    
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
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized");
      return;
    }
    
    const transaction = db.transaction(['planets'], 'readwrite');
    const store = transaction.objectStore('planets');
    const request = store.get(name);

    request.onerror = () => {
      reject(request.error);
    }
    
    request.onsuccess = () => {
      resolve(request.result);
    }
  })
}