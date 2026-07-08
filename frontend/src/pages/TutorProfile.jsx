import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTutorById, createBooking } from '../api/tutor'
import { getTutorReviews } from '../api/review'
import Navbar from '../components/Navbar'

function TutorProfile() {
  const { id } = useParams() // gets the :id from the URL
  const [tutor, setTutor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showBookingForm, setShowBookingForm] = useState(false)
 const [bookingData, setBookingData] = useState({
  subject: '',
  preferredMode: '',
  message: ''
})
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTutorData()
  }, [id])

  const loadTutorData = async () => {
    try {
      const tutorData = await getTutorById(id)
      setTutor(tutorData)

      const reviewsData = await getTutorReviews(tutorData.userId._id)
      setReviews(reviewsData)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value })
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    try {
      await createBooking({
        tutorId: tutor.userId._id,
        ...bookingData
      })
      setBookingSuccess(true)
      setShowBookingForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && !tutor) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>
  }

  if (!tutor) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

 return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold">{tutor.userId.name}</h1>
          <p className="text-gray-600">{tutor.userId.location}</p>
          <p className="mt-4"><strong>Subjects:</strong> {tutor.subjects.join(', ')}</p>
          <p><strong>Mode:</strong> {tutor.mode.join(', ')}</p>
          <p><strong>Hourly Rate:</strong> ₹{tutor.hourlyRate}/hr</p>
          <p><strong>Rating:</strong> {tutor.rating} ⭐ ({reviews.length} reviews)</p>
          <p className="mt-4"><strong>Bio:</strong> {tutor.bio}</p>
          <p><strong>Qualifications:</strong> {tutor.qualifications}</p>
          <p><strong>Availability:</strong> {tutor.availability}</p>

          {bookingSuccess && (
            <p className="mt-4 text-green-600 font-medium">
              Booking request sent successfully!
            </p>
          )}

          {!bookingSuccess && (
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showBookingForm ? 'Cancel' : 'Request Booking'}
            </button>
          )}

          {error && <p className="text-red-600 mt-2">{error}</p>}

          {showBookingForm && (
            <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3 border-t pt-4">
              <select
  name="subject"
  value={bookingData.subject}
  onChange={handleBookingChange}
  className="w-full p-2 border rounded"
  required
>
  <option value="">Select a subject</option>
  {tutor.subjects.map((subj) => (
    <option key={subj} value={subj}>{subj}</option>
  ))}
</select>
              <select
  name="preferredMode"
  value={bookingData.preferredMode}
  onChange={handleBookingChange}
  className="w-full p-2 border rounded"
  required
>
  <option value="">Select a mode</option>
  {tutor.mode.map((m) => (
    <option key={m} value={m}>{m}</option>
  ))}
</select>
              <textarea
                name="message"
                placeholder="Message (optional)"
                value={bookingData.message}
                onChange={handleBookingChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Send Request
              </button>
            </form>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          {reviews.map((review) => (
            <div key={review._id} className="border-b py-3 last:border-0">
              <p className="font-medium">{review.studentId.name} — {review.rating} ⭐</p>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

export default TutorProfile