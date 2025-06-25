import { toast } from 'react-toastify'

// Default toast configuration
const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

// Success toast with default config
export const showSuccessToast = (message, customConfig = {}) => {
  toast.success(message, { ...defaultConfig, ...customConfig })
}

// Error toast with default config (longer auto-close for errors)
export const showErrorToast = (message, customConfig = {}) => {
  toast.error(message, { 
    ...defaultConfig, 
    autoClose: 4000, // Longer display time for errors
    ...customConfig 
  })
}

// Info toast with default config
export const showInfoToast = (message, customConfig = {}) => {
  toast.info(message, { ...defaultConfig, ...customConfig })
}

// Warning toast with default config
export const showWarningToast = (message, customConfig = {}) => {
  toast.warning(message, { ...defaultConfig, ...customConfig })
}

// Loading toast with default config
export const showLoadingToast = (message, customConfig = {}) => {
  return toast.loading(message, { 
    ...defaultConfig, 
    autoClose: false, // Don't auto-close loading toasts
    ...customConfig 
  })
}

// Update loading toast
export const updateLoadingToast = (toastId, message, type = 'success') => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
  })
}

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId)
} 