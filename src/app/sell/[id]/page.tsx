"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import KycForm from '@/components/KycSellerForm/KycForm'
import SellForm from '@/components/KycSellerForm/SellForm'
import Navbar from '@/components/Hero/Navbar'
import PopupMessage from '@/components/global/Popup'
import { hasUserCompletedKyc } from '@/lib/supabase/queries/kyc'
import { IPopupMessage } from '@/lib/types'

export default function Sell() {
  const [hasUserDoneKyc, setHasUserDoneKyc] = useState(true) // MUST BE SET TO NULL EXCEPT ON TESTING
  const [kycStatus, setKycStatus] = useState('yes') // MUST BE SET TO NULL EXCEPT ON TESTING
  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false })
  const [userId, setUserId] = useState(null)

  const { id } = useParams()

  useEffect(() => {
    const confirmIfKyc = async () => {
      try {
        console.log(id)
        setUserId(id)
        const { data: kycData, error: kycError } = await hasUserCompletedKyc(id)
        if (kycError) {
          console.log(kycError)
          setPopup({ message: kycError.message, mode: "error", show: true })
        }
        console.log(kycData)
        if (kycData && kycData.length > 0) {
          setKycStatus(kycData[0].kyc_status)
          setHasUserDoneKyc(kycData[0].kyc_status === 'yes')
        } else {
          setKycStatus(false) // Explicitly set to false when the list is empty
          setHasUserDoneKyc('no')
        }
      } catch (error) {
        console.log(error)
        setPopup({ message: "Whoops something went wrong please refresh", mode: "error", show: true })
      }
    }
    //confirmIfKyc()
  }, [id])

  const showPopup = (message, mode) => {
    setPopup({ show: true, message, mode })
  }

  const hidePopup = () => {
    setPopup({ show: false, message: '', mode: '' })
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <div>
        {popup.show && (
          <PopupMessage
            message={popup.message}
            mode={popup.mode}
            onClose={hidePopup}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              backgroundColor: 'red',
              color: 'white',
              padding: '10px',
            }}
          />
        )}
      </div>
      <div>
        {kycStatus === null ? (
          <span>Loading</span>
        ) : !hasUserDoneKyc || kycStatus === false ? (
          <KycForm />
        ) : kycStatus === 'yes' ? (
          <SellForm />
        ) : (
          <span>your kyc is pending please wait</span>
        )}
      </div>
    </div>
  )
}
