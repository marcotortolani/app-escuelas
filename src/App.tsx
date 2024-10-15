import { useState } from 'react'
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
  //School,
  RefreshCcw,
  WifiOff,
  XSquare,
  SendHorizontal,
  CalendarCheck,
} from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import rc4Min from 'rc4.js'
const rc4 = new rc4Min('appSchoolVenezuela')

function App() {
  const { schools, setSchoolName } = useStore()
  const addNumberCollected = useStore((state) => state.addNumberCollected)
  const updateStatus = useStore((state) => state.updateStatus)

  const [phoneInput, setPhoneInput] = useState('')
  const [formatedPhone, setFormatedPhone] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [showSyncSection, setShowSyncSection] = useState(false)
  const { isOnline, hasInternet } = useNetworkStatus()

  const handleAddNumber = (number: string) => {
    if (number.length > 10 || number.length < 10) return
    setSchoolName('Escuela') // Configura la escuela
    const numberEncrypted = rc4.encrypt(number)
    addNumberCollected('Escuela', numberEncrypted) // Agrega el número
    
    // cargar 500 numeros consecutoivos para prueba de carga masiva
    // for (let i = 0; i < 500; i++) {
    //   const numberInt = parseInt(number) + i

    //   const numberEncrypted = rc4.encrypt(numberInt.toString())
    //   addNumberCollected('Escuela', numberEncrypted) // Agrega el número
    // }

    setPhoneInput('')
    setFormatedPhone('')

    const actualDate = new Date().toLocaleDateString('es-ES')
    updateStatus(actualDate, 'unsended')
  }

  const removeFormatting = (value: string) => {
    return value.replace(/\D/g, '')
  }

  const formatPhoneNumber = (value: string) => {
    if (value.length > 3) {
      return `${value.slice(0, 3)}-${value.slice(3, 10)}`
    }
    return value
  }

  function handleInputNumber(event: React.ChangeEvent<HTMLInputElement>) {
    const numberInput = event.target.value
    const rawValue = removeFormatting(numberInput)
    setPhoneInput(rawValue)
    setFormatedPhone(formatPhoneNumber(rawValue))

    if (rawValue.length > 10) {
      setInputMessage('El número tiene más de 10 dígitos')
    }

    if (rawValue.length < 10) {
      setInputMessage('El número debe tener 10 dígitos')
    }

    if (rawValue.length === 10) {
      setInputMessage('')
    }
  }

  return (
    <main className="relative w-screen h-[100dvh] min-h-fit px-4 py-8 flex flex-col items-center justify-center gap-10 bg-neutral-800 overflow-hidden">
      <h1 className="text-3xl text-white uppercase font-medium tracking-wider">
        Escuela
      </h1>
      <section className="w-full h-4/5 min-h-fit max-h-[500px] flex flex-col items-center justify-evenly gap-4">
        <div className=" w-full px-4 max-w-[400px]  py-6 flex flex-col items-center justify-around gap-6 bg-neutral-300 rounded-lg">
          <div className="w-full flex flex-col items-start gap-2">
            <label htmlFor="tel" className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-neutral-800" />
              <span className=" text-neutral-800">Teléfono</span>
            </label>
            <div className=" w-full flex flex-col gap-10  items-center justify-between ">
              <div className="relative w-full h-fit">
                <Input
                  type="tel"
                  id="tel"
                  placeholder="Ingrese nuevo Teléfono"
                  value={formatedPhone}
                  onChange={(e) => handleInputNumber(e)}
                  className=" font-medium text-lg placeholder:font-normal placeholder:text-base"
                  minLength={11}
                  maxLength={11}
                />
                <p className=" absolute mt-1 text-sm text-red-600">
                  {inputMessage}
                </p>
              </div>
              <Button
                variant="default"
                className="w-1/2 bg-lime-600 text-white disabled:bg-neutral-400 disabled:text-neutral-600"
                disabled={phoneInput.length !== 10}
                onClick={() => handleAddNumber(phoneInput)}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>

        <div className=" z-0 relative flex flex-col items-center gap-2">
          <Button
            disabled={!isOnline || !hasInternet}
            variant="default"
            onClick={() => setShowSyncSection(true)}
            className=" z-50 w-full bg-sky-700 text-white hover:bg-sky-800 disabled:bg-neutral-400 disabled:text-neutral-600"
          >
            <RefreshCcw
              className={`${
                !hasInternet || !hasInternet ? 'text-neutral-600' : 'text-white'
              } h-4 w-4 mr-2`}
            />
            Sincronizar datos
          </Button>

          <div
            className={`${
              !isOnline || !hasInternet
                ? ' translate-y-full -bottom-2 '
                : ' translate-y-0 bottom-1 opacity-0 '
            } z-0 absolute w-full px-2 py-1 bg-sky-300 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out rounded-sm `}
          >
            <WifiOff className="h-4 w-4 text-black" />
            <p className=" text-sm">Sin conexión</p>
          </div>
        </div>
      </section>

      <SyncSection
        {...{
          showSyncSection,
          setShowSyncSection,
          updateStatus,
          schools,
          isOnline,
          hasInternet,
        }}
      />
    </main>
  )
}

export default App

const SyncSection = ({
  showSyncSection,
  setShowSyncSection,
  updateStatus,
  schools,
  isOnline,
  hasInternet,
}: {
  showSyncSection: boolean
  setShowSyncSection: React.Dispatch<React.SetStateAction<boolean>>
  updateStatus: (date: string, status: 'unsended' | 'sended' | 'error') => void
  schools: DataSchool[]
  isOnline: boolean
  hasInternet: boolean
}) => {
  //const [schoolSync, setSchoolSync] = useState('Escuela')
  const [dateSync, setDateSync] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [numColSync, setNumColSync] = useState<string[]>([])

  async function handleSendData() {
    // console.log('Send Data')
    if (!dateSync.length && !numColSync.length) return

    setPopupMessage('Enviando datos... Por favor espere.')

    // usar un for para recorrer el array de numColSync en bloques de 10 y enviarlos por separado
    for (let i = 0; i < numColSync.length; i += 10) {
      const res = await pushData({
        date: dateSync,
        numbersCollected: numColSync.slice(i, i + 10),
      })

      if (!res.ok) {
        updateStatus(dateSync, 'error')
        console.error('Error')

        break
      }
      if (res.ok) {
        updateStatus(dateSync, 'sended')
        console.log('Paquete de datos enviado')
      }
    }

    setDateSync('')
    setNumColSync([])
    setShowSyncSection(false)
    setPopupMessage('')
  }

  async function pushData({
    date,
    numbersCollected,
  }: {
    date: string
    numbersCollected: string[]
  }) {
    const ENDPOINT =
      'https://test.moob.club:8005/movistar/venezuela/app-escuelas/'

    // let res, data

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Escuela',
          data: [
            {
              date,
              numbersCollected,
            },
          ],
        }),
        redirect: 'follow',
      })

      const data = await res.json()
      console.log(data)

      // data = await res.json()
      // console.log('---- Data enviada: ----')
      // console.log(data)
      return { ok: true }
    } catch (error) {
      console.log('Error al enviar los datos: ', error)
      // console.log(error)
      return { ok: false, error: error }
    }
  }

  return (
    <section
      className={`${
        showSyncSection ? ' translate-y-0 ' : ' translate-y-full  '
      } absolute top-0 w-full  px-4 h-full flex flex-col items-center justify-center gap-10 bg-sky-800 transition-all duration-300 ease-in-out`}
    >
      <h2 className="text-xl text-center text-white uppercase font-bold tracking-wider">
        Sincronización de datos
      </h2>

      <div className=" w-full max-w-[400px] px-4 py-6 flex flex-col items-center justify-around gap-6 bg-neutral-300 rounded-lg">
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
                  .filter((school) => school.name === 'Escuela')
                  .map((school) => school.data)
                  .flat()
                  .filter((school) => school.date === value)[0]
                  ?.numbersCollected
              )
            }}
            value={dateSync?.length ? dateSync : ''}
            // disabled={!schoolSync?.length}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={'Seleccione el día'}
                className="w-[180px]"
              />
            </SelectTrigger>
            <SelectContent>
              {schools
                ?.filter((school) => school.name === 'Escuela')
                .map((school) => school.data)
                .flat()
                .map((school, index) => {
                  return (
                    <SelectItem
                      key={index}
                      value={school.date}
                      className=" my-2"
                      style={{
                        backgroundColor:
                          school.status === 'sended'
                            ? 'lightgreen'
                            : school.status === 'error'
                            ? 'red'
                            : 'lightblue',
                      }}
                      // disabled={school.status === 'sended'}
                    >
                      {school.date} -{' '}
                      {school.status === 'sended'
                        ? 'Enviado'
                        : school.status === 'error'
                        ? 'Error'
                        : 'Sin enviar'}
                    </SelectItem>
                  )
                })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className=" w-full max-w-[400px]  flex items-center justify-between ">
        <Button
          variant="default"
          onClick={() => setShowSyncSection(false)}
          className=" z-50  bg-neutral-700 text-white "
        >
          <XSquare className={` text-white h-4 w-4 mr-2`} />
          Cerrar/Cancelar
        </Button>
        {isOnline && hasInternet ? (
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
            <WifiOff className={` text-neutral-800 h-4 w-4`} />
            Sin internet
          </div>
        )}
      </div>

      <div
        className={` ${
          popupMessage.length ? 'block' : 'hidden'
        } absolute z-50 w-full h-full flex items-center justify-center bg-black/80 pointer-events-none`}
      >
        <p className=" w-full max-w-[360px] bg-sky-700 text-white uppercase font-semibold animate-pulse text-center px-20 py-6 sm:rounded-lg">
          {popupMessage}
        </p>
      </div>
    </section>
  )
}
