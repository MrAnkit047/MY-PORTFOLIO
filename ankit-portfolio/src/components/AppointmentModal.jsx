import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAppointment } from '../context/AppointmentContext'
import { sendAppointmentEmails, triggerDirectMailto, HOST_EMAIL } from '../services/emailService'

const timeSlotsGrouped = [
  {
    category: 'Morning',
    icon: '🌅',
    slots: ['09:00 AM', '10:30 AM', '11:45 AM'],
  },
  {
    category: 'Afternoon',
    icon: '☀️',
    slots: ['01:15 PM', '02:30 PM', '04:00 PM'],
  },
  {
    category: 'Evening',
    icon: '🌙',
    slots: ['05:30 PM', '07:00 PM'],
  },
]

const allSlots = timeSlotsGrouped.flatMap((g) => g.slots)

const meetingTypes = [
  { id: 'meet', label: 'Google Meet (Virtual)', icon: '🎥', location: 'Google Meet Online Video Call' },
  { id: 'phone', label: 'Phone Call', icon: '📞', location: 'Direct Phone Call' },
  { id: 'inperson', label: 'In-Person Meeting', icon: '📍', location: 'Butwal, Nepal / Agreed Location' },
]

export default function AppointmentModal({ isOpen, onClose }) {
  const { darkMode, accentHex } = useTheme()
  const { isSlotBooked, bookSlot, appointments, cancelBooking } = useAppointment()

  const [activeTab, setActiveTab] = useState('book') // 'book' | 'schedule'
  const [showKeyConfig, setShowKeyConfig] = useState(false)

  // Web3Forms or EmailJS custom key saved in localStorage
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('ankit_portfolio_email_key') || '21c99e86-54d6-425e-8fb1-b06f83f750ea'
  })

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }, [])

  const [date, setDate] = useState(() => {
    const tmr = new Date()
    tmr.setDate(tmr.getDate() + 1)
    return tmr.toISOString().split('T')[0]
  })

  const [selectedSlot, setSelectedSlot] = useState(allSlots[1])
  const [meetingType, setMeetingType] = useState('meet')
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [purpose, setPurpose] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookedDetails, setBookedDetails] = useState(null)
  const [dispatchStatus, setDispatchStatus] = useState(null) // { hostSent: boolean, visitorSent: boolean, errorMsg: string }

  // Check which slots are unavailable on chosen date
  const slotStatusMap = useMemo(() => {
    const map = {}
    allSlots.forEach((slot) => {
      map[slot] = isSlotBooked(date, slot)
    })
    return map
  }, [date, appointments, isSlotBooked])

  // Select first available slot if current selected slot is booked
  const handleDateChange = (newDate) => {
    setDate(newDate)
    const firstAvailable = allSlots.find((s) => !isSlotBooked(newDate, s))
    if (firstAvailable) {
      setSelectedSlot(firstAvailable)
    }
  }

  const handleSaveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('ankit_portfolio_email_key', key)
    setShowKeyConfig(false)
  }

  // Generate Google Calendar Link with both Host & Visitor
  const buildGoogleCalendarUrl = (booking) => {
    const b = booking || bookedDetails
    if (!b) return '#'
    
    const title = encodeURIComponent(`Meeting: ${b.visitorName} & Ankit Bashyal`)
    const details = encodeURIComponent(
      `Appointment scheduled via Ankit's Portfolio.\n\n` +
      `👤 Visitor: ${b.visitorName} (${b.visitorEmail})\n` +
      `📞 Phone: ${b.visitorPhone || 'N/A'}\n` +
      `🎥 Format: ${meetingTypes.find((m) => m.id === b.meetingType)?.label || b.meetingType}\n` +
      `📌 Purpose: ${b.purpose || 'General Discussion'}\n\n` +
      `Host Email: ${HOST_EMAIL}\n` +
      `Visitor Email: ${b.visitorEmail}`
    )
    const location = encodeURIComponent(meetingTypes.find((m) => m.id === b.meetingType)?.location || 'Online')

    try {
      const [hoursStr, minsAndPeriod] = b.timeSlot.split(':')
      const [minsStr, period] = minsAndPeriod.split(' ')
      let hours = parseInt(hoursStr, 10)
      if (period === 'PM' && hours < 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0

      const startDateObj = new Date(`${b.date}T${String(hours).padStart(2, '0')}:${minsStr}:00`)
      const endDateObj = new Date(startDateObj.getTime() + 45 * 60 * 1000)

      const formatCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
      const datesParam = `${formatCalDate(startDateObj)}/${formatCalDate(endDateObj)}`

      const addEmails = `add=${encodeURIComponent(HOST_EMAIL)}&add=${encodeURIComponent(b.visitorEmail)}`
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}&${addEmails}`
    } catch {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`
    }
  }

  // Generate downloadable .ics Calendar file
  const downloadIcsFile = (booking) => {
    const b = booking || bookedDetails
    if (!b) return

    const selectedType = meetingTypes.find((m) => m.id === b.meetingType)
    const summary = `Meeting: ${b.visitorName} & Ankit Bashyal`
    const description = `Appointment scheduled via Portfolio.\\nVisitor: ${b.visitorName} (${b.visitorEmail})\\nFormat: ${selectedType?.label}\\nPurpose: ${b.purpose || 'N/A'}`

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ankit Bashyal Portfolio//Appointment Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:apt-${b.id || Date.now()}@ankitbashyal.com`,
      `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, '')}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${selectedType?.location || 'Google Meet'}`,
      `ORGANIZER;CN=Ankit Bashyal:mailto:${HOST_EMAIL}`,
      `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${b.visitorName}:mailto:${b.visitorEmail}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Appointment_${b.date}_Ankit_Bashyal.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!visitorName || !visitorEmail || !date || !selectedSlot) return
    if (slotStatusMap[selectedSlot]) {
      alert('This slot has already been booked. Please choose another time slot.')
      return
    }

    setIsSubmitting(true)

    const selectedTypeLabel = meetingTypes.find((m) => m.id === meetingType)?.label || meetingType

    const bookingPayload = {
      date,
      timeSlot: selectedSlot,
      meetingType,
      meetingTypeLabel: selectedTypeLabel,
      visitorName: visitorName.trim(),
      visitorEmail: visitorEmail.trim(),
      visitorPhone: visitorPhone.trim(),
      purpose: purpose.trim(),
    }

    // 1. Persist in schedule context (localStorage)
    const createdBooking = bookSlot(bookingPayload)

    // 2. Dispatch automated email background API request
    const res = await sendAppointmentEmails(createdBooking, apiKey)
    setDispatchStatus(res)

    // 3. Always invoke mail client trigger to ensure guaranteed multi-recipient delivery to bashyalankit861@gmail.com & visitor email
    triggerDirectMailto(createdBooking)

    setIsSubmitting(false)
    setBookedDetails(createdBooking)
  }

  const resetForm = () => {
    setBookedDetails(null)
    setVisitorName('')
    setVisitorEmail('')
    setVisitorPhone('')
    setPurpose('')
    setDispatchStatus(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Main Container */}
        <motion.div
          className={`relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border p-5 sm:p-7 shadow-2xl backdrop-blur-2xl transition-all ${
            darkMode ? 'border-white/15 bg-slate-950/95 text-white' : 'border-gray-200 bg-white text-gray-900'
          }`}
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 rounded-full p-2 text-xs font-bold transition z-20 ${
              darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label="Close appointment modal"
          >
            ✕
          </button>

          {/* Modal Header & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl font-bold shadow-md shrink-0"
                style={{ backgroundColor: `${accentHex}25`, color: accentHex, border: `1px solid ${accentHex}44` }}
              >
                📅
              </span>
              <div>
                <h3 className="text-xl font-bold font-heading">Schedule Appointment</h3>
                <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                  Book a 1-on-1 meeting & get confirmation on your Gmail
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            {!bookedDetails && (
              <div className={`flex rounded-xl p-1 text-xs font-semibold self-start sm:self-auto border ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
              }`}>
                <button
                  onClick={() => setActiveTab('book')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === 'book'
                      ? 'text-white shadow-sm'
                      : darkMode ? 'text-white/60 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === 'book' ? { backgroundColor: accentHex } : {}}
                >
                  Book New
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'schedule'
                      ? 'text-white shadow-sm'
                      : darkMode ? 'text-white/60 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === 'schedule' ? { backgroundColor: accentHex } : {}}
                >
                  <span>My Schedule</span>
                  {appointments.filter(a => a.status !== 'cancelled').length > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-bold">
                      {appointments.filter(a => a.status !== 'cancelled').length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: BOOKING FORM OR SUCCESS CONFIRMATION */}
          {activeTab === 'book' ? (
            !bookedDetails ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Dual Gmail Notice Banner */}
                <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                  darkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">✉️</span>
                    <div>
                      <p className="font-semibold">Dual Gmail Confirmation Dispatch Enabled</p>
                      <p className="text-[11px] opacity-80">
                        Emails are sent to <strong>bashyalankit861@gmail.com</strong> & your <strong>Visitor Gmail</strong>.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowKeyConfig(!showKeyConfig)}
                    className="text-[11px] font-bold text-purple-400 hover:underline shrink-0"
                  >
                    {showKeyConfig ? 'Close Key Setup' : '⚙️ API Key Setup'}
                  </button>
                </div>

                {/* Optional Custom API Key Setup Drawer */}
                {showKeyConfig && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <p className="font-bold text-emerald-400">⚙️ Web3Forms / EmailJS Key Configuration</p>
                    <p className={`text-[11px] ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                      Paste your free Web3Forms Access Key or EmailJS Key below to enable 100% automated background email delivery directly to both inboxes:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 7b3e8395-5853-488f-8d2a-89a1fa92b3b0"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className={`flex-1 rounded-xl border px-3 py-1.5 text-xs font-mono focus:outline-none ${
                          darkMode ? 'border-white/15 bg-black/40 text-white' : 'border-gray-300 bg-white text-gray-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveApiKey(apiKey)}
                        className="rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow"
                        style={{ backgroundColor: accentHex }}
                      >
                        Save Key
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      💡 Get a free Web3Forms key in 30 seconds at <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="underline text-purple-400">web3forms.com</a> (Enter bashyalankit861@gmail.com).
                    </p>
                  </motion.div>
                )}

                {/* Step 1: Select Date */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                    1. Select Meeting Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    required
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium focus:outline-none transition ${
                      darkMode
                        ? 'border-white/15 bg-white/5 text-white focus:border-purple-500'
                        : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500'
                    }`}
                  />
                </div>

                {/* Step 2: Time Slots */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      2. Select Time Slot
                    </label>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Schedule for {date}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {timeSlotsGrouped.map((group) => (
                      <div key={group.category} className="space-y-1.5">
                        <span className={`text-[11px] font-bold flex items-center gap-1.5 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                          <span>{group.icon}</span>
                          <span>{group.category} Slots</span>
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {group.slots.map((slot) => {
                            const isBooked = slotStatusMap[slot]
                            const isSelected = selectedSlot === slot

                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedSlot(slot)}
                                className={`relative rounded-xl py-2 px-2 text-xs font-semibold border transition flex flex-col items-center justify-center ${
                                  isBooked
                                    ? 'border-red-500/20 bg-red-500/10 text-red-400/60 cursor-not-allowed line-through'
                                    : isSelected
                                    ? 'text-white shadow-md ring-2 ring-white/30'
                                    : darkMode
                                    ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                                    : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                style={isSelected && !isBooked ? { backgroundColor: accentHex, borderColor: accentHex } : {}}
                              >
                                <span>{slot}</span>
                                {isBooked ? (
                                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-tighter">Booked</span>
                                ) : (
                                  <span className={`text-[9px] font-normal ${isSelected ? 'text-white/90' : darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                    Available
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Meeting Format */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                    3. Meeting Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {meetingTypes.map((type) => {
                      const isSelected = meetingType === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setMeetingType(type.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition ${
                            isSelected
                              ? 'text-white shadow-md ring-2 ring-white/20'
                              : darkMode
                              ? 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                              : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={isSelected ? { backgroundColor: accentHex, borderColor: accentHex } : {}}
                        >
                          <span className="text-lg mb-1">{type.icon}</span>
                          <span className="text-[11px] text-center">{type.label.split(' ')[0]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 4: Visitor Details */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        required
                        className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:outline-none transition ${
                          darkMode ? 'border-white/15 bg-white/5 text-white focus:border-purple-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Your Gmail Address *
                      </label>
                      <input
                        type="email"
                        placeholder="visitor@gmail.com"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        required
                        className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:outline-none transition ${
                          darkMode ? 'border-white/15 bg-white/5 text-white focus:border-purple-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+977-9800000000"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:outline-none transition ${
                          darkMode ? 'border-white/15 bg-white/5 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Host Gmail (Destination)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={HOST_EMAIL}
                        className={`w-full rounded-xl border px-3.5 py-2 text-sm font-mono opacity-80 cursor-not-allowed ${
                          darkMode ? 'border-white/10 bg-white/5 text-emerald-400' : 'border-gray-200 bg-gray-100 text-emerald-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                      Meeting Purpose / Agenda
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g., Discuss website project scope, code review, or hiring consultation..."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:outline-none transition ${
                        darkMode ? 'border-white/15 bg-white/5 text-white focus:border-purple-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                      darkMode ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || slotStatusMap[selectedSlot]}
                    className="rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-xl transition flex items-center gap-2"
                    style={{ backgroundColor: accentHex }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Dispatching Emails to Both Inboxes...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Send Booking</span>
                        <span>🚀</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              /* SUCCESS STATE */
              <div className="py-3 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                  ✓
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading">Appointment Booked!</h3>
                  <p className={`mt-1 text-xs max-w-md mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    Your appointment has been registered in the schedule and booking notifications dispatched.
                  </p>
                </div>

                {/* Live Status Indicators */}
                <div className={`p-3.5 rounded-2xl border text-xs text-left space-y-2 font-mono ${
                  darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-400">
                    📩 Notification Status:
                  </p>
                  
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓ Host Gmail:</span>
                    <strong className="text-white">{HOST_EMAIL}</strong>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓ Visitor Gmail:</span>
                    <strong className="text-white">{bookedDetails.visitorEmail}</strong>
                  </div>

                  {dispatchStatus?.success ? (
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-sans text-[11px]">
                      🚀 Automated background email dispatched successfully to both inboxes!
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-sans text-[11px]">
                      ✉️ Mail client trigger launched addressed to both {HOST_EMAIL} & {bookedDetails.visitorEmail}.
                    </div>
                  )}
                </div>

                {/* Summary Card */}
                <div className="p-3.5 rounded-2xl border text-xs text-left space-y-1.5 bg-emerald-500/10 border-emerald-500/20">
                  <p><strong>📅 Date:</strong> {bookedDetails.date}</p>
                  <p><strong>⏰ Time Slot:</strong> {bookedDetails.timeSlot}</p>
                  <p><strong>🎥 Format:</strong> {bookedDetails.meetingTypeLabel}</p>
                  <p><strong>👤 Visitor:</strong> {bookedDetails.visitorName}</p>
                  {bookedDetails.purpose && <p><strong>📌 Agenda:</strong> {bookedDetails.purpose}</p>}
                </div>

                {/* Calendar & Email Actions */}
                <div className="pt-2 space-y-2">
                  <p className={`text-[11px] font-semibold ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    Add to Calendar & Send Mail Copy:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                    <a
                      href={buildGoogleCalendarUrl(bookedDetails)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:opacity-90"
                      style={{ backgroundColor: accentHex }}
                    >
                      <span>Add to Google Calendar</span>
                      <span>🗓️</span>
                    </a>

                    <button
                      onClick={() => downloadIcsFile(bookedDetails)}
                      className={`rounded-xl px-4 py-2.5 text-xs font-semibold border transition flex items-center justify-center gap-2 ${
                        darkMode ? 'border-white/15 bg-white/5 text-white hover:bg-white/10' : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>Download .ics Event</span>
                      <span>📥</span>
                    </button>

                    <button
                      onClick={() => triggerDirectMailto(bookedDetails)}
                      className={`rounded-xl px-4 py-2.5 text-xs font-semibold border transition flex items-center justify-center gap-2 ${
                        darkMode ? 'border-white/15 bg-white/5 text-white hover:bg-white/10' : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>Re-trigger Mail Copy</span>
                      <span>✉️</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={resetForm}
                    className={`rounded-xl px-6 py-2.5 text-xs font-semibold border transition ${
                      darkMode ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'border-gray-300 bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            )
          ) : (
            /* TAB 2: SCHEDULE MANAGER & MY BOOKINGS */
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider font-heading">
                  All Scheduled Appointments ({appointments.filter((a) => a.status !== 'cancelled').length})
                </h4>
                <button
                  onClick={() => setActiveTab('book')}
                  className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1"
                >
                  <span>+ Book New Slot</span>
                </button>
              </div>

              {appointments.filter((a) => a.status !== 'cancelled').length === 0 ? (
                <div className={`p-8 text-center rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5 text-white/60' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                  <p className="text-2xl mb-2">📅</p>
                  <p className="text-xs font-medium">No appointments currently scheduled.</p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="mt-3 px-4 py-2 text-xs font-bold text-white rounded-xl shadow"
                    style={{ backgroundColor: accentHex }}
                  >
                    Schedule First Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {appointments
                    .filter((a) => a.status !== 'cancelled')
                    .map((app) => (
                      <div
                        key={app.id}
                        className={`p-4 rounded-2xl border space-y-2 transition ${
                          darkMode ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              Confirmed Slot
                            </span>
                            <h5 className="text-sm font-bold mt-1.5">{app.visitorName}</h5>
                            <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                              ✉️ {app.visitorEmail}
                            </p>
                          </div>

                          <button
                            onClick={() => cancelBooking(app.id)}
                            className="text-xs text-red-400 hover:text-red-300 font-semibold hover:underline"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                          <p>📅 <strong>Date:</strong> {app.date}</p>
                          <p>⏰ <strong>Time:</strong> {app.timeSlot}</p>
                          <p>🎥 <strong>Format:</strong> {meetingTypes.find((m) => m.id === app.meetingType)?.label || app.meetingType}</p>
                          <p>📩 <strong>Host:</strong> {HOST_EMAIL}</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <a
                            href={buildGoogleCalendarUrl(app)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <span>🗓️ Google Calendar</span>
                          </a>
                          <button
                            onClick={() => downloadIcsFile(app)}
                            className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>📥 Download .ics</span>
                          </button>
                          <button
                            onClick={() => triggerDirectMailto(app)}
                            className="text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>✉️ Mail Copy</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
