import { useState } from 'react'
import { createTutorProfile, updateTutorProfile } from '../api/tutor'

function TutorProfileForm({ existingProfile, onSuccess }) {
  const [formData, setFormData] = useState({
    subjects: existingProfile?.subjects?.join(', ') || '',
    mode: existingProfile?.mode || [],
    hourlyRate: existingProfile?.hourlyRate || '',
    bio: existingProfile?.bio || '',
    qualifications: existingProfile?.qualifications || '',
    availability: existingProfile?.availability || ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleModeToggle = (modeOption) => {
    setFormData((prev) => {
      const alreadySelected = prev.mode.includes(modeOption)
      return {
        ...prev,
        mode: alreadySelected
          ? prev.mode.filter((m) => m !== modeOption)
          : [...prev.mode, modeOption]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      ...formData,
      subjects: formData.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      hourlyRate: Number(formData.hourlyRate)
    }

    try {
      if (existingProfile) {
        await updateTutorProfile(payload)
      } else {
        await createTutorProfile(payload)
      }
      onSuccess() // tell the parent component to refresh data
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Subjects (comma-separated)</label>
        <input
          type="text"
          name="subjects"
          placeholder="Mathematics, Physics"
          value={formData.subjects}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Teaching Mode</label>
        <div className="space-x-4">
          {['home', 'online', 'group'].map((option) => (
            <label key={option} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.mode.includes(option)}
                onChange={() => handleModeToggle(option)}
                className="mr-1"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Hourly Rate (₹)</label>
        <input
          type="number"
          name="hourlyRate"
          value={formData.hourlyRate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Qualifications</label>
        <input
          type="text"
          name="qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Availability</label>
        <input
          type="text"
          name="availability"
          placeholder="Weekdays 4-8 PM"
          value={formData.availability}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {existingProfile ? 'Update Profile' : 'Create Profile'}
      </button>
    </form>
  )
}

export default TutorProfileForm