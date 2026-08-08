import { useState } from 'react'
import { createTutorProfile, updateTutorProfile } from '../api/tutor'
import { uploadProfilePhoto } from '../api/auth'

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
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')

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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPhotoUploading(true)
    setPhotoError('')
    try {
      const updatedUser = await uploadProfilePhoto(file)
      const currentUser = JSON.parse(localStorage.getItem('user'))
      localStorage.setItem('user', JSON.stringify({ ...currentUser, profilePhoto: updatedUser.profilePhoto }))
      onSuccess()
    } catch (err) {
      setPhotoError(err.message)
    } finally {
      setPhotoUploading(false)
    }
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
      onSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  const inputClass = "w-full p-2.5 border border-navy/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
  const labelClass = "block text-xs font-medium text-charcoal/60 mb-1 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4 pb-2">
        <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center overflow-hidden text-navy font-display text-xl">
          {existingProfile?.profilePhoto
            ? <img src={existingProfile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            : (photoUploading ? '...' : '📷')}
        </div>
        <div>
          <label className="text-sm font-medium text-navy cursor-pointer hover:text-amber transition-colors">
            {photoUploading ? 'Uploading...' : 'Change Photo'}
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={photoUploading}
            />
          </label>
          {photoError && <p className="text-brick text-xs mt-1">{photoError}</p>}
        </div>
      </div>

      {error && <p className="text-brick text-sm bg-brick/10 py-2 px-3 rounded-lg">{error}</p>}

      <div>
        <label className={labelClass}>Subjects (comma-separated)</label>
        <input
          type="text"
          name="subjects"
          placeholder="Mathematics, Physics"
          value={formData.subjects}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Teaching Mode</label>
        <div className="space-x-4">
          {['home', 'online', 'group'].map((option) => (
            <label key={option} className="inline-flex items-center text-sm text-charcoal">
              <input
                type="checkbox"
                checked={formData.mode.includes(option)}
                onChange={() => handleModeToggle(option)}
                className="mr-1.5 accent-navy"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Hourly Rate (₹)</label>
        <input
          type="number"
          name="hourlyRate"
          value={formData.hourlyRate}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className={inputClass}
          rows="3"
        />
      </div>

      <div>
        <label className={labelClass}>Qualifications</label>
        <input
          type="text"
          name="qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Availability</label>
        <input
          type="text"
          name="availability"
          placeholder="Weekdays 4-8 PM"
          value={formData.availability}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="bg-navy text-cream px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-navy-dark transition-colors"
      >
        {existingProfile ? 'Update Profile' : 'Create Profile'}
      </button>
    </form>
  )
}

export default TutorProfileForm