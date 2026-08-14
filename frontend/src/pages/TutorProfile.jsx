import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTutorById, createBooking } from '../api/tutor'
import { getTutorReviews } from '../api/review'
import Navbar from '../components/Navbar'
import SubjectChip from '../components/SubjectChip'
import Footer from '../components/Footer'

function TutorProfile() {
  const { id } = useParams()
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
      await createBooking({ tutorId: tutor.userId._id, ...bookingData })
      setBookingSuccess(true)
      setShowBookingForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && !tutor) {
    return <div className="min-h-screen flex items-center justify-center text-charcoal">{error}</div>
  }
  if (!tutor) {
    return <div className="min-h-screen flex items-center justify-center text-charcoal">Loading...</div>
  }

  const inputClass = "w-full p-2.5 border border-navy/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="p-6 md:p-10 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 mb-6">
         <div className="flex items-center gap-4 mb-1">
            {tutor.userId.profilePhoto ? (
              <img src={tutor.userId.profilePhoto} alt={tutor.userId.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center text-navy font-display text-xl font-semibold">
                {tutor.userId.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="font-display text-2xl font-semibold text-navy">{tutor.userId.name}</h1>
          </div>
          <p className="text-charcoal/50 text-sm mb-4">{tutor.userId.location}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {tutor.subjects.map((s) => <SubjectChip key={s} subject={s} />)}
          </div>

          <div className="space-y-1.5 text-sm text-charcoal/70">
            <p><strong className="text-charcoal">Mode:</strong> {tutor.mode.join(', ')}</p>
            <p><strong className="text-charcoal">Hourly Rate:</strong> ₹{tutor.hourlyRate}/hr</p>
            <p><strong className="text-charcoal">Rating:</strong> {tutor.rating} ⭐ ({reviews.length} reviews)</p>
            <p className="pt-2"><strong className="text-charcoal">Bio:</strong> {tutor.bio}</p>
            <p><strong className="text-charcoal">Qualifications:</strong> {tutor.qualifications}</p>
            <p><strong className="text-charcoal">Availability:</strong> {tutor.availability}</p>
          </div>

          {bookingSuccess && (
            <p className="mt-4 text-sage font-medium text-sm bg-sage/10 py-2 px-3 rounded-lg">
              Booking request sent successfully!
            </p>
          )}

          {!bookingSuccess && (
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="mt-5 bg-navy text-cream px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-navy-dark transition-colors"
            >
              {showBookingForm ? 'Cancel' : 'Request Booking'}
            </button>
          )}

          {error && <p className="text-brick text-sm mt-3">{error}</p>}

          {showBookingForm && (
            <form onSubmit={handleBookingSubmit} className="mt-5 space-y-3 border-t border-navy/5 pt-5">
              <select name="subject" value={bookingData.subject} onChange={handleBookingChange} className={inputClass} required>
                <option value="">Select a subject</option>
                {tutor.subjects.map((subj) => <option key={subj} value={subj}>{subj}</option>)}
              </select>

              <select name="preferredMode" value={bookingData.preferredMode} onChange={handleBookingChange} className={inputClass} required>
                <option value="">Select a mode</option>
                {tutor.mode.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>

              <textarea
                name="message"
                placeholder="Message (optional)"
                value={bookingData.message}
                onChange={handleBookingChange}
                className={inputClass}
                rows="3"
              />

              <button
                type="submit"
                className="bg-sage text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-sage/90 transition-colors"
              >
                Send Request
              </button>
            </form>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
          <h2 className="font-display text-xl font-semibold text-navy mb-4">Reviews</h2>
          {reviews.length === 0 && <p className="text-charcoal/50 text-sm">No reviews yet.</p>}
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-navy/5 py-3 last:border-0">
              <p className="font-medium text-charcoal text-sm">{review.studentId.name} — {review.rating} ⭐</p>
              <p className="text-charcoal/60 text-sm mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer /> 
    </div>
  )
}

export default TutorProfile