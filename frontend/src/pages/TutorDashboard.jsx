import { useState, useEffect } from 'react'
import { getMyTutorProfile, getIncomingBookings, updateBookingStatus } from '../api/tutor'
import TutorProfileForm from '../components/TutorProfileForm'
import Navbar from '../components/Navbar'

function TutorDashboard() {
  const [profile, setProfile] = useState(null)
  const [profileExists, setProfileExists] = useState(true) // assume true until proven false
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const profileData = await getMyTutorProfile()
      setProfile(profileData)
      setProfileExists(true)
      setShowForm(false)
    } catch (err) {
      setProfileExists(false)
      setShowForm(true) // no profile yet, show the form immediately
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

 return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tutor Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Profile</h2>
          {profileExists && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-blue-600 hover:underline text-sm"
            >
              {showForm ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        {!profileExists && !showForm && (
          <p className="text-gray-500">No profile found. Please create one.</p>
        )}

        {showForm && (
          <TutorProfileForm
            existingProfile={profile}
            onSuccess={loadDashboardData}
          />
        )}

        {!showForm && profile && (
          <div>
            <p><strong>Subjects:</strong> {profile.subjects.join(', ')}</p>
            <p><strong>Mode:</strong> {profile.mode.join(', ')}</p>
            <p><strong>Hourly Rate:</strong> ₹{profile.hourlyRate}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>Rating:</strong> {profile.rating} ⭐</p>
          </div>
        )}
      </div>

      {/* Bookings Section (unchanged) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Incoming Booking Requests</h2>
        {bookings.length === 0 && <p className="text-gray-500">No requests yet.</p>}
        {bookings.map((booking) => (
          <div key={booking._id} className="border-b py-4 last:border-0">
            <p><strong>Student:</strong> {booking.studentId.name}</p>
            <p><strong>Subject:</strong> {booking.subject}</p>
            <p><strong>Mode:</strong> {booking.preferredMode}</p>
            <p><strong>Message:</strong> {booking.message}</p>
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
            {booking.status === 'pending' && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default TutorDashboard