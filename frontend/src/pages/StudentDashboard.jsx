import { useState, useEffect } from 'react'
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

export default StudentDashboard