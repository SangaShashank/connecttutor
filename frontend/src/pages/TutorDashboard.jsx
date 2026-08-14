import { useState, useEffect } from 'react'
import { getMyTutorProfile, getIncomingBookings, updateBookingStatus } from '../api/tutor'
import TutorProfileForm from '../components/TutorProfileForm'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SubjectChip from '../components/SubjectChip'
import ChatBox from '../components/ChatBox'
import { socket } from '../socket'

function TutorDashboard() {
  const [profile, setProfile] = useState(null)
  const [profileExists, setProfileExists] = useState(true)
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [activeChatBookingId, setActiveChatBookingId] = useState(null)
  const [unreadMap, setUnreadMap] = useState({})
  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Join rooms for all chat-eligible bookings, and listen globally for new messages
  useEffect(() => {
    const chatEligible = bookings.filter(
      (b) => b.status === 'accepted' || b.status === 'completed'
    )
    chatEligible.forEach((b) => socket.emit('join_room', b._id))

    const handleReceive = (message) => {
      const isMine = message.senderId._id === currentUser.id || message.senderId === currentUser.id
      const isOpenChat = message.bookingId === activeChatBookingId
      if (!isMine && !isOpenChat) {
        setUnreadMap((prev) => ({ ...prev, [message.bookingId]: true }))
      }
    }

    socket.on('receive_message', handleReceive)
    return () => socket.off('receive_message', handleReceive)
  }, [bookings, activeChatBookingId])

  const loadDashboardData = async () => {
    try {
      const profileData = await getMyTutorProfile()
      setProfile(profileData)
      setProfileExists(true)
      setShowForm(false)
    } catch (err) {
      setProfileExists(false)
      setShowForm(true)
    }

    try {
      const bookingsData = await getIncomingBookings()
      setBookings(bookingsData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status)
      loadDashboardData()
    } catch (err) {
      alert(err.message)
    }
  }

  const openChat = (bookingId) => {
    setActiveChatBookingId(bookingId)
    setUnreadMap((prev) => ({ ...prev, [bookingId]: false }))
  }

  const statusStyles = {
    pending: 'bg-amber/20 text-amber-900',
    accepted: 'bg-sage/15 text-sage',
    rejected: 'bg-brick/10 text-brick'
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-semibold text-navy mb-8">Tutor Dashboard</h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-semibold text-navy">My Profile</h2>
            {profileExists && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-navy text-sm font-medium hover:text-amber transition-colors"
              >
                {showForm ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>

          {!profileExists && !showForm && (
            <p className="text-charcoal/50 text-sm">No profile found. Please create one.</p>
          )}

          {showForm && (
            <TutorProfileForm existingProfile={profile} onSuccess={loadDashboardData} />
          )}

          {!showForm && profile && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((s) => <SubjectChip key={s} subject={s} />)}
              </div>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Mode:</strong> {profile.mode.join(', ')}</p>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Hourly Rate:</strong> ₹{profile.hourlyRate}</p>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Bio:</strong> {profile.bio}</p>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Rating:</strong> {profile.rating} ⭐</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
          <h2 className="font-display text-xl font-semibold text-navy mb-4">Incoming Booking Requests</h2>
          {bookings.length === 0 && <p className="text-charcoal/50 text-sm">No requests yet.</p>}

          {bookings.map((booking) => (
            <div key={booking._id} className="border-b border-navy/5 py-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-charcoal">{booking.studentId.name}</p>
                  <SubjectChip subject={booking.subject} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-charcoal/70 mt-2"><strong className="text-charcoal">Mode:</strong> {booking.preferredMode}</p>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Message:</strong> {booking.message}</p>

              {booking.status === 'pending' && (
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                    className="bg-sage text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-sage/90 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                    className="bg-brick text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-brick/90 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
              {(booking.status === 'accepted' || booking.status === 'completed') && (
                <button
                  onClick={() => openChat(booking._id)}
                  className="mt-3 text-navy text-sm font-medium hover:text-amber transition-colors flex items-center gap-1.5"
                >
                  💬 Chat
                  {unreadMap[booking._id] && (
                    <span className="w-2 h-2 rounded-full bg-brick inline-block"></span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeChatBookingId && (
        <div className="fixed bottom-6 right-6 z-50">
          <ChatBox
            bookingId={activeChatBookingId}
            currentUserId={currentUser.id}
            onClose={() => setActiveChatBookingId(null)}
          />
        </div>
      )}

      <Footer />
    </div>
  )
}

export default TutorDashboard