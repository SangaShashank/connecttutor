/*import { useState, useEffect } from 'react'
import { getMyBookingRequests } from '../api/tutor'
import { createReview } from '../api/review'
import Navbar from '../components/Navbar'

function StudentDashboard() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [reviewingId, setReviewingId] = useState(null) // which booking is being reviewed right now
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [reviewedBookings, setReviewedBookings] = useState([]) // track which ones already got reviewed this session

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const data = await getMyBookingRequests()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    }
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">My Booking Requests</h2>
        {error && <p className="text-red-600">{error}</p>}
        {bookings.length === 0 && <p className="text-gray-500">No booking requests sent yet.</p>}

        {bookings.map((booking) => (
          <div key={booking._id} className="border-b py-4 last:border-0">
            <p><strong>Tutor:</strong> {booking.tutorId.name}</p>
            <p><strong>Subject:</strong> {booking.subject}</p>
            <p><strong>Mode:</strong> {booking.preferredMode}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={
                booking.status === 'pending' ? 'text-yellow-600' :
                booking.status === 'accepted' ? 'text-green-600' :
                'text-red-600'
              }>
                {booking.status}
              </span>
            </p>

            {booking.status === 'accepted' && !reviewedBookings.includes(booking._id) && (
              <div className="mt-2">
                {reviewingId !== booking._id ? (
                  <button
                    onClick={() => setReviewingId(booking._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Leave a Review
                  </button>
                ) : (
                  <form onSubmit={(e) => handleReviewSubmit(e, booking._id)} className="mt-2 space-y-2">
                    <select
                      name="rating"
                      value={reviewData.rating}
                      onChange={handleReviewChange}
                      className="p-2 border rounded"
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
                      className="w-full p-2 border rounded"
                      rows="2"
                    />
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            )}

            {reviewedBookings.includes(booking._id) && (
              <p className="text-green-600 text-sm mt-2">✓ Review submitted</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default StudentDashboard*/
import { useState, useEffect } from 'react'
import { getMyBookingRequests } from '../api/tutor'
import { createReview } from '../api/review'
import Navbar from '../components/Navbar'
import SubjectChip from '../components/SubjectChip'
import Footer from '../components/Footer'

function StudentDashboard() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [reviewingId, setReviewingId] = useState(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [reviewedBookings, setReviewedBookings] = useState([])

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const data = await getMyBookingRequests()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    }
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
      <Footer />
    </div>
  )
}

export default StudentDashboard