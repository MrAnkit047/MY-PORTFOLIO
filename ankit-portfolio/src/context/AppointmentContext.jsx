import { createContext, useContext, useState, useEffect } from 'react'
import AppointmentModal from '../components/AppointmentModal'

const AppointmentContext = createContext()

const STORAGE_KEY = 'ankit_portfolio_appointments'

export function AppointmentProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
    } catch (err) {
      console.error('Failed to save appointments to localStorage', err)
    }
  }, [appointments])

  const openAppointmentModal = () => setIsOpen(true)
  const closeAppointmentModal = () => setIsOpen(false)

  const isSlotBooked = (dateStr, timeSlot) => {
    return appointments.some(
      (app) => app.date === dateStr && app.timeSlot === timeSlot && app.status !== 'cancelled'
    )
  }

  const bookSlot = (newBooking) => {
    const bookingEntry = {
      id: 'apt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      hostEmail: 'bashyalankit861@gmail.com',
      ...newBooking,
    }

    setAppointments((prev) => [bookingEntry, ...prev])
    return bookingEntry
  }

  const cancelBooking = (id) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'cancelled' } : app))
    )
  }

  const getAppointmentsForDate = (dateStr) => {
    return appointments.filter((app) => app.date === dateStr && app.status !== 'cancelled')
  }

  return (
    <AppointmentContext.Provider
      value={{
        isOpen,
        openAppointmentModal,
        closeAppointmentModal,
        appointments,
        isSlotBooked,
        bookSlot,
        cancelBooking,
        getAppointmentsForDate,
      }}
    >
      {children}
      <AppointmentModal isOpen={isOpen} onClose={closeAppointmentModal} />
    </AppointmentContext.Provider>
  )
}

export function useAppointment() {
  const ctx = useContext(AppointmentContext)
  if (!ctx) throw new Error('useAppointment must be used within AppointmentProvider')
  return ctx
}

