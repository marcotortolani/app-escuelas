import { useState, useRef, useEffect } from 'react'
import { useStore } from './store/AppStore'
import { Swiper, SwiperSlide } from 'swiper/react'

import useNetworkStatus from './hooks/useNetworkStatus'
import { DataSchool } from './store/AppStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import { NumberCollected } from './store/AppStore'

import { WifiOff, XSquare, CalendarCheck, MoveRightIcon } from 'lucide-react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// @ts-expect-error
import rc4Min from 'rc4.js'
const rc4 = new rc4Min('appSchoolVenezuela')

import syncButton from './assets/img/btn-sincronizar.webp'
import noConectionImage from './assets/img/sin-conexion.webp'
import teamGamersLogo from './assets/img/logo-team-gamers.webp'
import queGuayViajesLogo from './assets/img/logo-que-guay.webp'
import locoPorLaCocinaLogo from './assets/img/logo-loco-por-la-cocina.png'
import movistarLogo from './assets/img/logo-movistar.webp'
import backgroundImage from './assets/img/landing-bg.webp'
import { Autoplay } from 'swiper/modules'

const PRODUCTS = [
  {
    value: 'que-guay-viajes',
    name: 'Que Guay Viajes',
    serviceID: 1,
  },
  {
    value: 'loco-por-la-cocina',
    name: 'Loco x la Cocina',
    serviceID: 2,
  },
  {
    value: 'team-gamers',
    name: 'Team Gamers',
    serviceID: 2,
  },
]

function App() {
  const { schools, setClientName } = useStore()
  const addDataCollected = useStore((state) => state.addNumberCollected)
  const updateStatus = useStore((state) => state.updateStatus)

  const [phoneInput, setPhoneInput] = useState('')
  const [formatedPhone, setFormatedPhone] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [productSelected, setProductSelected] = useState('')
  const [showSyncSection, setShowSyncSection] = useState(false)
  const { isOnline, hasInternet } = useNetworkStatus()

  const swiperRef = useRef<any>(null)

  function pauseSwiper() {
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop()
    }
  }

  function resumeSwiper() {
    if (swiperRef.current) {
      swiperRef.current.autoplay.start()
    }
  }

  const handleAddNumber = ({
    number,
    serviceID,
  }: {
    number: string
    serviceID: number
  }) => {
    if (number.length > 10 || number.length < 10) return
    setClientName('Movistar-Venezuela') // Configura la escuela
    const numberEncrypted = rc4.encrypt(number)
    addDataCollected('Movistar-Venezuela', {
      serviceID: serviceID,
      number: numberEncrypted,
    }) // Agrega el número

    // cargar 500 numeros consecutivos para prueba de carga masiva
    // for (let i = 0; i < 500; i++) {
    //   const numberInt = parseInt(number) + i

    //   const numberEncrypted = rc4.encrypt(numberInt.toString())
    //   addNumberCollected('Movistar-Venezuela', numberEncrypted) // Agrega el número
    // }

    setPhoneInput('')
    setFormatedPhone('')
    setProductSelected('')
    resumeSwiper()

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

  useEffect(() => {
    if (swiperRef.current) {
      const index = PRODUCTS.findIndex((p) => p.value === productSelected)

      if (index !== -1) {
        swiperRef.current.slideTo(index) // Mueve el Swiper al índice seleccionado
      }
    }
    if (productSelected === '') return
    pauseSwiper()
  }, [productSelected])

  return (
    <div className=" w-screen bg-black ">
      <main
        className="relative w-screen max-w-7xl mx-auto h-[100dvh] min-h-fit px-4 py-8 flex flex-col items-center justify-center md:justify-evenly gap-4 overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
        }}
      >
        <div className=" z-10 absolute top-12 right-4 w-16 md:w-24 p-1 flex flex-col items-center gap-2">
          {hasInternet ? (
            <button
              type="button"
              onClick={() => setShowSyncSection(true)}
              className=" z-50 w-full "
            >
              <img src={syncButton} alt="Sync Button" />
            </button>
          ) : (
            <div className={` z-0  w-full  `}>
              <img src={noConectionImage} alt="No internet conection Icon" />
            </div>
          )}
        </div>
        <div className="absolute z-0 top-10 left-0 right-0 w-screen flex flex-col items-center gap-2 lg:gap-6">
          {/* Imagenes logos en gris, se activan en color */}
          {/* <div
            className={`${
              productSelected === '' ? '' : ' '
            }  w-full max-w-[350px] grid grid-cols-3  mt-10 gap-2  `}
          >
            <button
              type="button"
              onClick={() => setProductSelected('loco-por-la-cocina')}
              className={`${
                productSelected === 'loco-por-la-cocina'
                  ? 'scale-125 z-50'
                  : ' scale-90 grayscale'
              }  w-5/6 h-full mx-auto transition-all duration-200 ease-in-out  `}
            >
              <img
                src={locoPorLaCocinaLogo}
                alt="Locos por la Cocina Logo"
                className=" w-full h-auto"
              />
            </button>
            <button
              type="button"
              onClick={() => setProductSelected('que-guay-viajes')}
              className={`${
                productSelected === 'que-guay-viajes'
                  ? ' scale-150 z-50 '
                  : ' scale-110 grayscale'
              } w-5/6 h-full  mx-auto transition-all duration-200 ease-in-out `}
            >
              <img
                src={queGuayViajesLogo}
                alt="Que Guay Viajes Logo"
                className=" w-full h-auto"
              />
            </button>
            <button
              type="button"
              onClick={() => setProductSelected('team-gamers')}
              className={`${
                productSelected === 'team-gamers'
                  ? 'scale-125 z-50'
                  : ' scale-90 grayscale brightness-75'
              } w-5/6 h-full mx-auto transition-all duration-200 ease-in-out `}
            >
              <img
                src={teamGamersLogo}
                alt="Team Gamers Logo"
                className=" w-full h-auto"
              />
            </button>
          </div> */}
          {/* <div
            className={`${
              productSelected === '' ? '' : ' '
            }  w-full max-w-[350px] grid grid-cols-2 grid-rows-2 mt-10 gap-0 `}
          >
            <button
              type="button"
              onClick={() => setProductSelected('que-guay-viajes')}
              className={`${
                productSelected === 'que-guay-viajes'
                  ? ' scale-150 z-50 '
                  : ' scale-110 grayscale'
              } w-1/2 h-full col-span-2 mx-auto transition-all duration-200 ease-in-out `}
            >
              <img
                src={queGuayViajesLogo}
                alt="Que Guay Viajes Logo"
                className=" w-full h-auto"
              />
            </button>
            <button
              type="button"
              onClick={() => setProductSelected('team-gamers')}
              className={`${
                productSelected === 'team-gamers'
                  ? 'scale-110 z-50'
                  : ' scale-90 grayscale brightness-75'
              } w-4/5 h-full col-span-1 mx-auto transition-all duration-200 ease-in-out `}
            >
              <img
                src={teamGamersLogo}
                alt="Team Gamers Logo"
                className=" w-full h-auto"
              />
            </button>

            <button
              type="button"
              onClick={() => setProductSelected('loco-por-la-cocina')}
              className={`${
                productSelected === 'loco-por-la-cocina'
                  ? 'scale-100 z-50'
                  : ' scale-90 grayscale'
              }  w-5/6 h-full mx-auto transition-all duration-200 ease-in-out `}
            >
              <img
                src={locoPorLaCocinaLogo}
                alt="Locos por la Cocina Logo"
                className=" w-full h-auto"
              />
            </button>
          </div> */}

          <Swiper
            // ref={swiperRef}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            slidesPerView={2.1}
            centeredSlides={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={30}
            // loop={true}

            pagination={{
              clickable: true,
            }}
            // navigation={true}
            modules={[Autoplay]}
            direction="horizontal"
            // dir="rtl"
            className="relative mySwiper h-40 w-full max-w-[350px] flex items-center mt-10 "
            // onSlideChange={(swiper) => {
            //   console.log(swiper.realIndex + 1)
            //   setProductSelected(PRODUCTS[swiper.realIndex].value)
            // }}
          >
            <SwiperSlide className=" w-full h-full flex items-center">
              <img
                src={queGuayViajesLogo}
                alt="Que Guay Viajes Logo"
                className={`${
                  productSelected === 'que-guay-viajes'
                    ? 'scale-100'
                    : ' scale-100 grayscale'
                } w-auto h-4/6 ml-2 mx-auto`}
                onClick={() => setProductSelected('que-guay-viajes')}
              />
            </SwiperSlide>
            <SwiperSlide className=" w-full h-full flex items-center">
              <img
                src={locoPorLaCocinaLogo}
                alt="Locos por la Cocina Logo"
                className={` ${
                  productSelected === 'loco-por-la-cocina'
                    ? 'scale-100'
                    : ' scale-100 grayscale'
                } w-auto h-full mx-auto`}
                onClick={() => setProductSelected('loco-por-la-cocina')}
              />
            </SwiperSlide>
            <SwiperSlide className=" w-full h-full flex items-center">
              <img
                src={teamGamersLogo}
                alt="Team Gamers Logo"
                className={`${
                  productSelected === 'team-gamers'
                    ? 'scale-100 '
                    : ' scale-100 grayscale brightness-75 '
                } w-auto h-4/5 mx-auto`}
                onClick={() => setProductSelected('team-gamers')}
              />
            </SwiperSlide>
          </Swiper>

          {/* <p className=" text-white uppercase font-poppinsBoldItalic md:text-2xl">
            Tu portal de gaming
          </p> */}
        </div>
        <section className="w-full mt-48 min-h-fit max-h-[500px] flex flex-col items-center gap-3">
          <p className=" w-full max-w-[500px]  px-2 font-white font-poppinsReg text-white uppercase text-[0.65rem] md:text-sm lg:text-base">
            Déjanos tu teléfono y, si eres cliente Movistar, en las próximas
            horas estarás disfrutando de 20 días sin costo de la opción de
            entretenimiento de tu elección
          </p>
          <div className=" w-full max-w-[400px] lg:max-w-[500px] px-4 py-6 lg:px-8 flex flex-col items-center justify-between gap-6 lg:gap-8 bg-[#dbdbdb] rounded-2xl">
            <div className=" relative w-full">
              <label
                htmlFor="tel"
                className=" w-full text-neutral-800 uppercase font-poppinsReg text-xs md:text-base lg:text-lg text-left"
              >
                Ingrese su número telefónico
              </label>
              <div className="relative w-full h-fit ">
                <img
                  src="/img/icono-mobile.webp"
                  alt="Phone Icon"
                  className=" absolute left-2 h-full py-1 lg:py-2"
                />
                <Input
                  type="tel"
                  id="tel"
                  value={formatedPhone}
                  onChange={(e) => handleInputNumber(e)}
                  className=" pl-10 lg:pl-14 lg:py-6 font-medium text-lg md:text-xl lg:text-2xl placeholder:font-normal placeholder:text-base"
                  minLength={11}
                  maxLength={11}
                />
                <p className=" absolute mt-1 text-sm text-red-600">
                  {inputMessage}
                </p>
              </div>
            </div>
            <div className="relative w-full h-fit ">
              <label
                htmlFor="products"
                className=" w-full text-neutral-800 uppercase font-poppinsReg text-xs md:text-base lg:text-lg text-left "
              >
                Producto a suscribirte
              </label>
              {/* <select
                name="products"
                id="products"
                className=" w-full h-8 px-1 py-2 bg-white text-neutral-800 uppercase font-poppinsReg text-xs md:text-base lg:text-lg text-left rounded-sm"
                onChange={(e) => setProductSelected(e.target.value)}
                defaultValue={''}
              >
                <option value="" disabled>
                  Seleccionar una opción
                </option>
                {PRODUCTS.map((prod) => (
                  <option key={prod.value} value={prod.value}>
                    {prod.name}
                  </option>
                ))}
              </select> */}
              <Select
                onValueChange={(value) => setProductSelected(value)}
                name="products"
                value={productSelected}
                defaultValue={''}
              >
                <SelectTrigger className=" w-full text-neutral-800 uppercase font-poppinsReg text-xs md:text-base lg:text-lg text-left">
                  <SelectValue
                    placeholder={'Seleccionar una opción'}
                    className="w-[180px]"
                  />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((prod, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={prod.value}
                        className=" my-2 cursor-pointer rounded-md text-base"
                      >
                        {prod.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              className=" px-6 py-1 bg-black text-sm md:text-base text-white uppercase disabled:bg-neutral-400 disabled:text-neutral-500 rounded-full"
              disabled={phoneInput.length !== 10 || productSelected === ''}
              onClick={() =>
                handleAddNumber({
                  number: phoneInput,
                  serviceID: PRODUCTS.find(
                    (prod) => prod.value === productSelected
                  )!.serviceID,
                })
              }
            >
              Agregar
            </button>
          </div>
        </section>

        <img
          src={movistarLogo}
          alt="Brand Logo"
          className="w-1/2 max-w-[300px]"
        />

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
    </div>
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
  //const [schoolSync, setSchoolSync] = useState('Movistar-Venezuela')
  const [dateSync, setDateSync] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [dataColSync, setDataColSync] = useState<NumberCollected[]>([])

  async function handleSendData() {
    // console.log('Send Data')
    if (!dateSync.length && !dataColSync.length) return

    setPopupMessage('Enviando datos... Por favor espere.')

    // usar un for para recorrer el array de dataColSync en bloques de 10 y enviarlos por separado
    for (let i = 0; i < dataColSync.length; i += 10) {
      const res = await pushData({
        date: dateSync,
        dataCollected: dataColSync.slice(i, i + 10),
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
    setDataColSync([])
    setShowSyncSection(false)
    setPopupMessage('')
  }

  async function pushData({
    date,
    dataCollected,
  }: {
    date: string
    dataCollected: NumberCollected[]
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
          name: 'Movistar-Venezuela',
          data: [
            {
              date,
              dataCollected,
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
      } absolute z-30 top-0 w-full px-4 h-full flex flex-col items-center justify-evenly lg:gap-20 transition-all duration-300 ease-in-out`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
      }}
    >
      <button
        type="button"
        onClick={() => setShowSyncSection(false)}
        className=" z-50 absolute top-4 right-4 bg-neutral-950 text-white rounded-sm "
      >
        <XSquare
          className={` text-white h-5 w-5 md:w-7 md:h-7 lg:w-9 lg:h-9 m-2`}
        />
      </button>
      {/* <div className=" w-full flex flex-col items-center gap-2 lg:gap-6">
        <img
          src={teamGamersLogo}
          alt="Team Gamers Logo"
          className=" w-5/6 max-w-[350px] "
        />
        <p className=" text-white uppercase font-poppinsBoldItalic md:text-2xl">
          Tu portal de gaming
        </p>
      </div> */}

      <div className=" w-full max-w-[500px] flex flex-col items-center gap-2 mt-10">
        <p className=" font-poppinsReg text-center lg:text-lg text-white uppercase font-bold tracking-wider">
          Sincronización de datos
        </p>
        <div className=" w-full px-4 py-6 flex flex-col items-center justify-around gap-6 bg-neutral-300 rounded-2xl">
          <label htmlFor="date" className="w-full flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-neutral-800" />
            <span className=" text-neutral-800">Fecha cargada</span>
          </label>
          <Select
            onValueChange={(value) => {
              setDateSync(value)
              setDataColSync(
                schools
                  .filter((school) => school.name === 'Movistar-Venezuela')
                  .map((school) => school.data)
                  .flat()
                  .filter((school) => school.date === value)[0]
                  ?.numbersCollected
              )
            }}
            value={dateSync?.length ? dateSync : ''}

            // disabled={!schoolSync?.length}
          >
            <SelectTrigger className="w-full md:text-lg lg:text-xl">
              <SelectValue
                placeholder={'Seleccione el día'}
                className="w-[180px]"
              />
            </SelectTrigger>
            <SelectContent>
              {schools
                ?.filter((school) => school.name === 'Movistar-Venezuela')
                .map((school) => school.data)
                .flat()
                .map((school, index) => {
                  return (
                    <SelectItem
                      key={index}
                      value={school.date}
                      className=" my-2 cursor-pointer rounded-md text-lg"
                      style={{
                        backgroundColor:
                          school.status === 'sended'
                            ? 'lightgreen'
                            : school.status === 'error'
                            ? 'red'
                            : 'lightgray',
                      }}
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
          <div className=" w-full flex justify-end ">
            {isOnline && hasInternet ? (
              <button
                type="button"
                onClick={handleSendData}
                disabled={dataColSync.length === 0}
                className=" z-50 px-4 py-2 text-xs md:text-sm flex items-center gap-4 bg-black text-white uppercase hover:bg-black disabled:bg-neutral-400 disabled:text-neutral-600 rounded-full"
              >
                {dataColSync.length === 0 ? 'No hay datos' : 'Enviar Datos'}
                <MoveRightIcon
                  className={`${
                    dataColSync.length === 0 && 'hidden'
                  } text-white w-6 `}
                />
              </button>
            ) : (
              <div className=" bg-neutral-400 text-neutral-800 select-none px-6 p-2 text-xs md:text-sm flex items-center gap-4 rounded-full">
                <WifiOff className={` text-neutral-800 h-4 w-4`} />
                Sin internet
              </div>
            )}
          </div>
        </div>
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

      <img
        src={movistarLogo}
        alt="Brand Logo"
        className="w-1/2 max-w-[300px]"
      />
    </section>
  )
}
