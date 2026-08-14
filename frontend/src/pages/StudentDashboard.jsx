import { useState, useEffect } from 'react'
import { getMyBookingRequests } from '../api/tutor'
import { createReview } from '../api/review'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SubjectChip from '../components/SubjectChip'
import ChatBox from '../components/ChatBox'
import { socket } from '../socket'

function StudentDashboard() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [reviewingId, setReviewingId] = useState(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [reviewedBookings, setReviewedBookings] = useState([])
  const [activeChatBookingId, setActiveChatBookingId] = useState(null)
  const [unreadMap, setUnreadMap] = useState({})
  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    loadBookings()
  }, [])

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

  const loadBookings = async () => {
    try {
      const data = await getMyBookingRequests()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const openChat = (bookingId) => {
    setActiveChatBookingId(bookingId)
    setUnreadMap((prev) => ({ ...prev, [bookingId]: false }))
  }

  const handleReviewChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value })
  }

  const handleReviewSubmit = async (e, bookingId) => {
    e.preventDefault()
    try {
      await createReview({
        bookingId,
        rating: Number(reviewData.rating),
        comment: reviewData.comment
      })
      setReviewedBookings([...reviewedBookings, bookingId])
      setReviewingId(null)
      setReviewData({ rating: 5, comment: '' })
    } catch (err) {
      alert(err.message)
    }
  }

  const statusStyles = {
    pending: 'bg-amber/20 text-amber-900',
    accepted: 'bg-sage/15 text-sage',
    rejected: 'bg-brick/10 text-brick'
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-semibold text-navy mb-8">Student Dashboard</h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
          <h2 className="font-display text-xl font-semibold text-navy mb-4">My Booking Requests</h2>
          {error && <p className="text-brick text-sm">{error}</p>}
          {bookings.length === 0 && <p className="text-charcoal/50 text-sm">No booking requests sent yet.</p>}

          {bookings.map((booking) => (
            <div key={booking._id} className="border-b border-navy/5 py-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-charcoal">{booking.tutorId.name}</p>
                  <SubjectChip subject={booking.subject} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Mode:</strong> {booking.preferredMode}</p>

              {(booking.status === 'accepted' || booking.status === 'completed') && (
                <button
                  onClick={() => openChat(booking._id)}
                  className="mt-2 text-navy text-sm font-medium hover:text-amber transition-colors flex items-center gap-1.5"
                >
                  💬 Chat
                  {unreadMap[booking._id] && (
                    <span className="w-2 h-2 rounded-full bg-brick inline-block"></span>
                  )}
                </button>
              )}

              {booking.status === 'accepted' && !reviewedBookings.includes(booking._id) && (
                <div className="mt-3">
                  {reviewingId !== booking._id ? (
                    <button
                      onClick={() => setReviewingId(booking._id)}
                      className="text-navy text-sm font-medium hover:text-amber transition-colors"
                    >
                      Leave a Review
                    </button>
                  ) : (
                    <form onSubmit={(e) => handleReviewSubmit(e, booking._id)} className="mt-2 space-y-3 bg-cream p-4 rounded-xl">
                      <select
                        name="rating"
                        value={reviewData.rating}
                        onChange={handleReviewChange}
                        className="p-2 border border-navy/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very Poor</option>
                      </select>
                      <textarea
                        name="comment"
                        placeholder="Write a comment..."
                        value={reviewData.comment}
                        onChange={handleReviewChange}
                        className="w-full p-2 border border-navy/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                        rows="2"
                      />
                      <button
                        type="submit"
                        className="bg-sage text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-sage/90 transition-colors"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>
              )}

              {reviewedBookings.includes(booking._id) && (
                <p className="text-sage text-sm mt-2 font-medium">✓ Review submitted</p>
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

export default StudentDashboard
