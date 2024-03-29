import Modal from "@/components/common/Modal"
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import PlanetConfirmModal from './PlanetConfirmModal'
import Conquer from '@/publics/conquer.png'
import Battle from '@/publics/battle.png'
import Image from "next/image"
import { useState, useRef, useEffect } from 'react'
import fetchAPI from '@/utils/fetch'
import InputBox from "@/components/common/InputBox"
import * as Util from '@/utils/common'
import AlertNotification from "@/components/common/AlertNotification"

export default function PlanetModal({ user, clan, planet, image, isModalOpen, close, conquerColor }) {
  const [isClick, setIsClick] = useState(false)
  const [planetQuest, setPlanetQuest] = useState('')
  const [redeemInput, setRedeemInput] = useState ('')
  const isBattle = planet.owner != 0
  const [error, setError] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [showInfo, setShowInfo] = useState(true)

  let initialFocus = useRef()

  useEffect(() => {
    if (clan.position == planet._id && clan._id != planet.owner) {
      fetchAPI('GET', `/api/planets/${planet._id}/quest`)
        .then(res => res.json())
        .then(data => {
          setPlanetQuest(data.data.quest)
        })
      }
  }, [planet.visitor, clan._id, clan.position, planet._id, planet.owner])

  useEffect(() => {
    setError('')
    setRedeemInput('')
    return () => {
      setError('')
      setRedeemInput('')
    }
  }, [isModalOpen])

  useEffect(() => {
    if (planet._id != clan.position || planet.tier == 'HOME') {
      setShowInfo(true)
    } 
    if ((user.role == 'admin' && planet.visitor != 0 && planet.owner == 0) || planet._id == clan.position && planet.tier != 'HOME' && planet.tier != 'X' && planet.owner == 0) {
      setShowInfo(false)
    } else {
      setShowInfo(true)
    }
  }, [isModalOpen, planet.owner, planet.visitor, clan.position, planet._id, planet.tier, user.role])

  const openConfirmModal = () => setIsClick(true)
  const closeConfirmModal = () => setIsClick(false)

  const handleRedeemChange = (e) => {
    setRedeemInput(e.target.value)
    setError('')
  }

  const handleConquer = async () => {
    setIsDisabled(true)
    if (redeemInput == '') {
      setError('Cannot redeem empty code')
      setIsDisabled(false)
      return
    }
    return fetchAPI('POST', `/api/clans/${clan._id}/transfer/redeem`, {
      planet_id: planet._id,
      code: redeemInput
    }).then(async response => {
      if (response.status == 200) {
        close()
      } else {
        setError((await response.json()).message)
        close()
      }
      setIsDisabled(false)
    })
  }

  const handleAbort = async () => {
    setIsDisabled(true)
    return fetchAPI('POST', `/api/clans/${planet.visitor}/transfer/redeem`, {
      planet_id: planet._id,
      code: 'getRektyouFuck'
    }).then(async response => {
      setIsDisabled(false)
      close()
    })
  }

  return (
    <Modal
      open={isModalOpen}
      close={close}
      initialFocus={initialFocus}
    >
      <div className="transition-all transform flex flex-col py-8 px-9 max-w-xl mx-6 md:mx-0 bg-white rounded-3xl shadow-xl scale-75 md:scale-100">
        {showInfo ?
          <>
            <div className="flex flex-row w-full justify-center">

              <div className="flex flex-row items-center justify-center w-full">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-14 mx-auto w-24 h-24 z-20">
                  <Image src={image} alt="" />
                </div>

                <div className="bg-white w-28 h-28 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 z-10" />

                <Dialog.Title as="h3">
                  <div className="font-bold text-xl z-20 mt-6 text-indigo-800 tracking-wider">
                    PLANET INFO
                  </div>
                </Dialog.Title>
              </div>

              <button
                type="button"
                className="absolute top-0 right-0 m-4 focus:outline-none"
                onClick={close}
                ref={initialFocus} 
              >
                <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
              </button>
            </div>

            <div className="flex flex-col my-4 text-center px-4">
              <div className="flex flex-row space-x-6 divide-x-2">
                <div className="">
                  <div className="text-gray-500 text-lg">Name</div>
                  <div className="font-semibold text-xl">{planet.name}</div>
                </div>

                <div className="">
                  <div className="text-gray-500 text-lg ml-6">ID</div>
                  <div className="font-semibold text-xl ml-6">{planet._id}</div>
                </div>

                <div className="">
                  <div className="text-gray-500 text-lg ml-6">Point</div>
                  <div className="font-semibold text-xl ml-6">{planet.point}</div>
                </div>

                <div className="">
                  <div className="text-gray-500 text-lg ml-6">Travel Cost</div>
                  <div className="font-semibold text-xl ml-6">{planet.travel_cost}</div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <div className="">
                  <div className="text-gray-500 text-lg">Owner</div>
                  <div className="font-semibold text-xl">{isBattle ? Util.getClanName(planet.owner) : (planet.point == 0) ? 'กลุ่มพันธมิตรโจรสลัด' : 'None'}</div>
                </div>
              </div>

              {planet.visitor != 0 &&
                <div className="flex justify-center mt-2">
                  <div className="">
                    <div className="text-gray-500 text-lg">Visitor</div>
                    <div className="font-semibold text-xl">{Util.getClanName(planet.visitor)}</div>
                  </div>
                </div>
              }
            </div>

            {(planet.owner != clan._id && planet.tier != 'HOME' && planet.tier != 'X' && clan.position != planet._id && planet.visitor == 0) &&
              <div className="flex justify-center mt-4">
                <div onClick={openConfirmModal} className="animate-pulse transition duration-150 ease-in-out hover:animate-none hover:scale-110 w-20 h-20 hover:cursor-pointer drop-shadow-md">
                  <Image src={isBattle ? Battle : Conquer} alt="" />
                </div>
              </div>
            }
            <PlanetConfirmModal planet={planet} closeAll={close} close={closeConfirmModal} isConfirmOpen={isClick} clan={clan} isBattle={isBattle} />
          </>
          :
          <>
            <div className="flex flex-row w-full justify-center">

              <div className="flex flex-row items-center justify-center w-full">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-14 mx-auto w-24 h-24 z-20">
                  <Image src={image} alt="" />
                </div>

                <div className="bg-white w-28 h-28 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 z-10" />

                <Dialog.Title as="h3">
                  <div className="font-bold text-xl z-20 mt-4 text-indigo-800 tracking-wider">
                    CONQUER PLANET
                  </div>
                </Dialog.Title>
              </div>

              <button
                type="button"
                className="absolute top-0 right-0 m-4 focus:outline-none"
                onClick={close}
              >
                <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
              </button>
            </div>

            <div className="flex flex-col text-center px-4 mt-3">
              <div className="flex justify-center">
                <div className="">
                  <div className="text-gray-500 text-lg">Quest</div>
                  <div className="font-semibold text-xl">{planetQuest}</div>
                </div>
              </div>
              <div className="flex flex-col justify-center mt-3">
                <div className="mb-2">
                  <div className="text-gray-500 text-lg">Redeem Code</div>
                  <InputBox 
                    placeholder="This is not an answer"
                    type="text"
                    style="rounded-lg ring-gray-500 text-center"
                    onChange={handleRedeemChange}
                    value={redeemInput}
                  />
                </div>
                <div className="font-bold text-sm text-red-400 uppercase">You have only one chance</div>
              </div>
              <div className="mt-4">
                <button
                  ref={initialFocus}
                  onClick={async () => await handleConquer()}
                  className={Util.concatClasses(conquerColor, "hover:bg-pink-300 hover:text-red-400 bg-pink-400 font-bold text-red-300 py-1 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed")}
                  disabled={isDisabled}
                >
                  CONQUER
                </button>
              </div>
              {(user.role == 'admin' || (user.role == 'mod' && user.clan_id == clan._id)) &&
                <div className="mt-4">
                  <button
                  disabled={isDisabled}
                  className="text-red-200 bg-red-600 hover:bg-red-700 py-1 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed"
                  onClick={async () => await handleAbort()}
                  >
                    Abort Mission
                  </button>
                </div>
              }
              <AlertNotification
                type="error"
                style="mt-3"
                info={error}
              />
            </div>
          </>
        }
      </div>
    </Modal>
  )
}