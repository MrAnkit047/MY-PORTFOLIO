/**
 * Email Dispatcher Service for Portfolio Appointment Booking
 * Sends automated confirmation emails to both Host (bashyalankit861@gmail.com) and Visitor Gmail addresses.
 */

export const HOST_EMAIL = 'bashyalankit861@gmail.com'

/**
 * Dispatch booking emails using Web3Forms or EmailJS background API endpoints,
 * with fail-safe multi-recipient mailto client trigger.
 */
export async function sendAppointmentEmails(booking, customApiKey = '') {
  const selectedType = booking.meetingTypeLabel || booking.meetingType
  const apiKey = customApiKey || import.meta.env.VITE_WEB3FORMS_KEY || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

  const emailSummary = `
📅 APPOINTMENT DETAILS
----------------------------------------
Date: ${booking.date}
Time Slot: ${booking.timeSlot}
Meeting Format: ${selectedType}
Visitor Name: ${booking.visitorName}
Visitor Email: ${booking.visitorEmail}
Visitor Phone: ${booking.visitorPhone || 'Not provided'}
Meeting Purpose: ${booking.purpose || 'General Discussion / Project Collaboration'}
----------------------------------------
Host: ${HOST_EMAIL}
Confirmation copy sent to: ${booking.visitorEmail}
`

  let hostSent = false
  let visitorSent = false
  let errorMsg = ''

  // Method 1: Web3Forms API (Using configured key)
  try {
    const web3Key = apiKey || import.meta.env.VITE_WEB3FORMS_KEY || '21c99e86-54d6-425e-8fb1-b06f83f750ea'
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: web3Key,
        subject: `📅 New Appointment Booking: ${booking.visitorName} & Ankit Bashyal`,
        from_name: 'Ankit Bashyal Portfolio Booking',
        email: booking.visitorEmail,
        to_email: HOST_EMAIL,
        replyto: booking.visitorEmail,
        message: emailSummary,
        // Send autoresponder copy to visitor
        autoresponder: `Hello ${booking.visitorName},\n\nYour appointment with Ankit Bashyal has been confirmed for ${booking.date} at ${booking.timeSlot}.\n\nMeeting Format: ${selectedType}\n\nThank you!\nAnkit Bashyal`,
      }),
    })

    const data = await res.json()
    if (data.success) {
      hostSent = true
      visitorSent = true
    } else {
      errorMsg = data.message || 'Web3Forms API key needed'
    }
  } catch (err) {
    errorMsg = err.message
  }

  // Method 2: EmailJS API fallback if EmailJS keys present
  if (!hostSent && import.meta.env.VITE_EMAILJS_SERVICE_ID) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
          template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: {
            host_email: HOST_EMAIL,
            visitor_email: booking.visitorEmail,
            visitor_name: booking.visitorName,
            date: booking.date,
            time_slot: booking.timeSlot,
            meeting_type: selectedType,
            purpose: booking.purpose || 'General Discussion',
          },
        }),
      })

      if (res.ok) {
        hostSent = true
        visitorSent = true
      }
    } catch {
      // Ignore
    }
  }

  return {
    success: hostSent && visitorSent,
    hostSent,
    visitorSent,
    errorMsg,
  }
}

/**
 * Generate multi-recipient mailto link to open native desktop or web Gmail client
 * addressing BOTH bashyalankit861@gmail.com and visitorEmail
 */
export function triggerDirectMailto(booking) {
  const selectedType = booking.meetingTypeLabel || booking.meetingType
  const subject = encodeURIComponent(`📅 Appointment Confirmation: ${booking.visitorName} & Ankit Bashyal (${booking.date} @ ${booking.timeSlot})`)
  const body = encodeURIComponent(
    `Hello Ankit & ${booking.visitorName},\n\n` +
    `An appointment has been scheduled via Portfolio.\n\n` +
    `📅 Date: ${booking.date}\n` +
    `⏰ Time Slot: ${booking.timeSlot}\n` +
    `🎥 Format: ${selectedType}\n` +
    `👤 Visitor: ${booking.visitorName} (${booking.visitorEmail})\n` +
    `📞 Phone: ${booking.visitorPhone || 'Not provided'}\n` +
    `📌 Agenda:\n${booking.purpose || 'General Discussion / Project Collaboration'}\n\n` +
    `Host Email: ${HOST_EMAIL}\n` +
    `Visitor Email: ${booking.visitorEmail}\n\n` +
    `Best regards,\nAnkit Bashyal Portfolio`
  )

  const mailtoUrl = `mailto:${HOST_EMAIL}?cc=${encodeURIComponent(booking.visitorEmail)}&subject=${subject}&body=${body}`
  window.open(mailtoUrl, '_blank')
  return mailtoUrl
}
