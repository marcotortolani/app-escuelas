import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Define el tipo de datos recolectados
type DataColected = {
  date: string
  numbersCollected: string[]
}

// Define el tipo de datos de cada escuela
export type DataSchool = {
  name: string
  data: DataColected[]
}

// Define el estado inicial para los datos recolectados
const DataCollectedInitial: DataColected = {
  date: '',
  numbersCollected: [],
}

// Define el estado inicial para las escuelas
export const SchoolInitialState: DataSchool = {
  name: '',
  data: [DataCollectedInitial],
}

// Tipo del estado global de la aplicación
type State = {
  schools: DataSchool[]
  selectedSchool: string
}

// Define las acciones que mutarán el estado
type Action = {
  setSchoolName: (name: string) => void
  addNumberCollected: (name: string, number: string) => void
}

export const useStore = create(
  persist<State & Action>(
    (set) => ({
      // Estado inicial
      schools: [],
      selectedSchool: '',

      // Acción para establecer el nombre de la escuela
      setSchoolName: (name: string) => {
        set((state) => {
          const schoolExists = state.schools.some(
            (school) => school.name === name
          )

          // Solo añade la escuela si no existe
          if (!schoolExists) {
            return {
              ...state,
              schools: [
                ...state.schools,
                { name, data: [] },
              ],
            }
          }

          return {
            ...state,
            selectedSchool: name,
          }
        })
      },

      // Acción para agregar un número a la lista de números recolectados
      addNumberCollected: (name: string, number: string) => {
        set((state) => {
          return {
            ...state,
            schools: state.schools.map((school) => {
              if (school.name === name) {
                let lastEntry = school.data[school.data.length - 1]

                // Si no hay fecha, crea una nueva entrada con la fecha actual
                if (
                  !lastEntry ||
                  lastEntry.date !== new Date().toLocaleDateString('es-ES')
                ) {
                  lastEntry = {
                    date: new Date().toLocaleDateString('es-ES'),
                    numbersCollected: [],
                  }
                  school.data = [...school.data, lastEntry]
                }

                // Agrega el número recolectado a la última entrada
                lastEntry.numbersCollected.push(number)

                return {
                  ...school,
                  data: [...school.data],
                }
              }
              return school
            }),
          }
        })
      },
    }),
    {
      name: 'escuelas-store', // Nombre del almacenamiento en localStorage
      storage: createJSONStorage(() => localStorage), // Usa localStorage
    }
  )
)
