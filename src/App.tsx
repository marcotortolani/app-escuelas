import { useState, useEffect } from 'react'
import { useStore } from './store/AppStore'
import useNetworkStatus from './hooks/useNetworkStatus'
import { DataSchool } from './store/AppStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  PhoneIcon,
  School,
  RefreshCcw,
  WifiOff,
  XSquare,
  SendHorizontal,
  CalendarCheck,
} from 'lucide-react'

//import { SchoolInitialState } from './store/AppStore'

function App() {
  const { schools, setSchoolName } = useStore()
  const addNumberCollected = useStore((state) => state.addNumberCollected)
  const [newSchool, setNewSchool] = useState('')
  //const [showInputSchool, setShowInputSchool] = useState(false)
  const [schoolSelected, setSchoolSelected] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [showSyncSection, setShowSyncSection] = useState(false)
  const { isOnline } = useNetworkStatus()
  // const actualDate = new Date().toLocaleDateString('es-ES', {
  //   day: 'numeric',
  //   month: 'long',
  //   year: 'numeric',
  // })

  const handleAddNumber = (name: string, number: string) => {
    //setSchoolName(name) // Configura la escuela
    addNumberCollected(name, number) // Agrega el número
    setPhoneInput('')
  }

  const handleAddSchoolName = (name: string) => {
    setSchoolName(name)
  }

  console.log(schools[0])
  // const data = {
  //   name: 'Escuela 01',
  //   data: [
  //     {
  //       date: '01-12-2024',
  //       numbersCollected: ['123456789', '987654321'],
  //     },
  //     {
  //       date: '02-12-2024',
  //       numbersCollected: ['123456789', '987654321'],
  //     },
  //   ],
  // }
  // console.log(schools.find((school) => school.name === schoolSelected)?.data)
  //console.log(schools)
  //console.log(schoolSelected)

  // function handleSelect(value: string) {
  //   // setSchoolName(value)
  //   console.log(value)
  // }

  useEffect(() => {
    if (schools?.length) {
      setSchoolSelected(schools[0].name)
    }
  }, [])

  return (
    <main className="relative w-screen h-[100dvh] min-h-fit px-4 py-8 flex flex-col items-center justify-center gap-10 bg-neutral-800 overflow-hidden">
      <h1 className="text-3xl text-white uppercase font-medium tracking-wider">
        Escuelas
      </h1>
      <section className="w-full h-4/5 min-h-fit max-h-[500px] flex flex-col items-center justify-evenly gap-4">
        <div className=" w-full px-4 max-w-[500px]  py-6 flex flex-col items-center justify-around gap-6 bg-neutral-300 rounded-lg">
          <div className=" w-full flex flex-col items-center gap-4">
            <label htmlFor="tel" className="w-full flex items-center gap-2">
              <School className="h-4 w-4 text-neutral-800" />
              <span className=" text-neutral-800">Escuela</span>
            </label>
            <Select
              onValueChange={(value) => setSchoolSelected(value)}
              value={schoolSelected?.length ? schoolSelected : ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    schools?.length
                      ? 'Seleccione una escuela'
                      : 'No hay escuelas'
                  }
                  className="w-[180px]"
                />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school, index) => (
                  <SelectItem key={index} value={school.name}>
                    {school.name}
                  </SelectItem>
                ))}
                {schools.length > 0 && (
                  <div className=" w-full h-[1px] bg-neutral-600/50 rounded-full"></div>
                )}
                <SelectItem
                  value="new-school"
                  className="text-neutral-500"
                  // onClick={() => setShowInputSchool(true)}
                >
                  Nueva escuela
                </SelectItem>
              </SelectContent>
            </Select>
            <div
              className={`${
                schoolSelected === 'new-school'
                  ? ' scale-y-100'
                  : ' scale-y-0 hidden'
              } z-0 w-full flex items-center justify-between gap-4`}
            >
              <Input
                type="text"
                placeholder="Ingresar nueva escuela"
                className=""
                value={newSchool}
                onChange={(e) => setNewSchool(e.target.value)}
              />
              <Button
                variant="outline"
                className=" bg-lime-600 text-white disabled:bg-neutral-400 disabled:text-neutral-600"
                onClick={() => {
                  handleAddSchoolName(newSchool)
                  setSchoolSelected(newSchool)
                }}
                disabled={!newSchool}
              >
                Agregar
              </Button>
            </div>
          </div>

          <div className=" w-5/6 mx-auto h-0.5 bg-neutral-600/30 rounded-full"></div>
          <div className="w-full flex flex-col items-start gap-2">
            <label htmlFor="tel" className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-neutral-800" />
              <span className=" text-neutral-800">Teléfono</span>
            </label>
            <div className=" w-full flex items-center justify-between gap-4">
              <Input
                type="tel"
                id="tel"
                placeholder="5811234567"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className=""
              />
              <Button
                variant="default"
                className=" bg-lime-600 text-white disabled:bg-neutral-400 disabled:text-neutral-600"
                disabled={!phoneInput}
                onClick={() => handleAddNumber(schoolSelected, phoneInput)}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>

        <div className=" z-0 relative flex flex-col items-center gap-2">
          <Button
            disabled={!isOnline}
            variant="default"
            onClick={() => setShowSyncSection(true)}
            className=" z-50 w-full bg-sky-700 text-white hover:bg-sky-800 disabled:bg-neutral-400 disabled:text-neutral-600"
          >
            <RefreshCcw
              className={`${
                !isOnline ? 'text-neutral-600' : 'text-white'
              } h-4 w-4 mr-2`}
            />
            Sincronizar datos
          </Button>

          <div
            className={`${
              !isOnline
                ? ' translate-y-full -bottom-2 '
                : ' translate-y-0 bottom-1 opacity-0 '
            } z-0 absolute w-full px-2 py-1 bg-sky-300 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out rounded-sm `}
          >
            <WifiOff className="h-4 w-4 text-black" />
            <p className=" text-sm">Sin conexión WiFi</p>
          </div>
        </div>
      </section>

      <SyncSection
        {...{
          showSyncSection,
          setShowSyncSection,
          schools,
          isOnline,
        }}
      />
    </main>
  )
}

export default App

const SyncSection = ({
  showSyncSection,
  setShowSyncSection,
  schools,
  isOnline,
}: {
  showSyncSection: boolean
  setShowSyncSection: React.Dispatch<React.SetStateAction<boolean>>
  schools: DataSchool[]
  isOnline: boolean
}) => {
  const [schoolSync, setSchoolSync] = useState('')
  const [dateSync, setDateSync] = useState('')
  const [numColSync, setNumColSync] = useState<string[]>([])
  //console.log('data: ', schools[0].data)
  console.log('School Sync: ', schoolSync)
  console.log('Date Sync: ', dateSync)
  console.log('Numbers Sync: ', numColSync)

  // console.log('Escuela find:')
  // console.log(
  //   schools
  //     .filter((school) => school.name === schoolSync)
  //     .map((school) => school.data)
  //     .flat()
  //     .filter((school) => school.date === dateSync)[0]?.numbersCollected
  // )

  // console.log(schools?.filter((school) => school.name !== schoolSync))
  // // console.log(
  // //   schools
  // //     ?.filter((school) => school.name !== schoolSync)
  // //     .map((school) => school.data)
  // //     .flat()
  // //     .map((school) => school.date)
  // // )
  // console.log('Escuela find------')
  function handleSendData() {
    console.log('Send Data')
  }

  // useEffect(() => {

  // }, [isOnline]);

  return (
    <section
      className={`${
        showSyncSection ? ' translate-y-0 ' : ' translate-y-full  '
      } absolute top-0 w-full  px-4 h-full flex flex-col items-center justify-center gap-10 bg-sky-800 transition-all duration-300 ease-in-out`}
    >
      <h2 className="text-xl text-center text-white uppercase font-bold tracking-wider">
        Sincronización de datos
      </h2>

      <div className=" w-full max-w-[500px] px-4 py-6 flex flex-col items-center justify-around gap-6 bg-neutral-300 rounded-lg">
        <div className="w-full ">
          <label
            htmlFor="school"
            className="w-full mb-2 flex items-center gap-2"
          >
            <School className="h-4 w-4 text-neutral-800" />
            <span className=" text-neutral-800">Escuela</span>
          </label>
          <Select
            onValueChange={(value) => {
              setSchoolSync(value)
              setDateSync('')
              setNumColSync([])
            }}
            value={schoolSync?.length ? schoolSync : ''}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={'Seleccione una escuela'}
                className="w-[180px]"
              />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school, index) => (
                <SelectItem key={index} value={school.name}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className=" w-full">
          <label htmlFor="date" className="w-full mb-2 flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-neutral-800" />
            <span className=" text-neutral-800">Fecha cargada</span>
          </label>
          <Select
            onValueChange={(value) => {
              setDateSync(value)
              setNumColSync(
                schools
                  .filter((school) => school.name === schoolSync)
                  .map((school) => school.data)
                  .flat()
                  .filter((school) => school.date === value)[0]
                  ?.numbersCollected
              )
            }}
            value={dateSync?.length ? dateSync : ''}
            disabled={!schoolSync?.length}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={'Seleccione el día'}
                className="w-[180px]"
              />
            </SelectTrigger>
            <SelectContent>
              {schools
                ?.filter((school) => school.name === schoolSync)
                .map((school) => school.data)
                .flat()
                .map((school, index) => (
                  <SelectItem key={index} value={school.date}>
                    {school.date}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className=" w-full max-w-[500px]  flex items-center justify-between ">
        <Button
          variant="default"
          onClick={() => setShowSyncSection(false)}
          className=" z-50  bg-neutral-700 text-white "
        >
          <XSquare className={` text-white h-4 w-4 mr-2`} />
          Cerrar/Cancelar
        </Button>
        {isOnline ? (
          <Button
            variant="default"
            onClick={handleSendData}
            disabled={numColSync.length === 0}
            className=" z-50  bg-sky-200 text-neutral-800 hover:bg-sky-400 disabled:bg-neutral-400 disabled:text-neutral-600"
          >
            {numColSync.length === 0 ? 'No hay datos' : 'Enviar Datos'}
            <SendHorizontal
              className={`${
                numColSync.length === 0 && 'hidden'
              } text-neutral-800 h-4 w-4 ml-2`}
            />
          </Button>
        ) : (
          <div className=" bg-neutral-400 text-neutral-800 select-none px-6 p-2 flex items-center gap-4 rounded-md">
            <WifiOff
              className={` text-neutral-800 h-4 w-4`}
            />
            Sin internet
          </div>
        )}
      </div>
    </section>
  )
}
