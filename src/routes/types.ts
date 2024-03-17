export interface Planet {
  climate: string
  created: string
  diameter: string
  edited: string
  films: string[]
  gravity: string
  name: string
  orbital_period: string
  population: string
  residents: string[]
  rotation_period: string
  surface_water: string
  terrain: string
  url: string

  residentData: Resident[]
}

export interface Resident {
  birth_year: string
  created: string
  edited: string
  eye_color: string
  films: string[]
  gender: string
  hair_color: string
  height: string
  homeworld: string
  mass: string
  name: string
  skin_color: string
  species: string[]
  starships: []
  url: string
  vehicles: []

}
