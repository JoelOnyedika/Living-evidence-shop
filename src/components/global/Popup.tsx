import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

const PopupMessage = ({ message, mode, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 15000) // Auto-close after 5 seconds

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-fade shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform translate-x-0">
      <div className={`flex items-center p-4 ${
        mode === 'error' ? 'bg-red-500' : 
        mode === 'success' ? 'bg-green-500' : 
        mode === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
      }`}>
        <div className="flex-grow mr-3">
          <p className="text-white font-medium font-bold">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="text-white hover:text-gray-200 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default PopupMessage