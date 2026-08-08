import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchTutors } from '../api/tutor'
import Navbar from '../components/Navbar'
import SubjectChip from '../components/SubjectChip'

function SearchTutors() {
  const [tutors, setTutors] = useState([])
  const [filters, setFilters] = useState({
    subject: '',
    mode: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  })

  const loadTutorsWithFilters = async (filterValues) => {
    try {
      const data = await searchTutors(filterValues)
      setTutors(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadTutorsWithFilters(filters)
  }, [])

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedFilters = {
      ...filters,
      subject: filters.subject.trim(),
      location: filters.location.trim()
    }
    setFilters(trimmedFilters)
    loadTutorsWithFilters(trimmedFilters)
  }

  const inputClass = "p-2.5 border border-navy/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <h1 className="font-display text-3xl font-semibold text-navy mb-8">Find a Tutor</h1>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 mb-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          <input type="text" name="subject" placeholder="Subject" value={filters.subject} onChange={handleChange} className={inputClass} />
          <select name="mode" value={filters.mode} onChange={handleChange} className={inputClass}>
            <option value="">Any Mode</option>
            <option value="home">Home</option>
            <option value="online">Online</option>
            <option value="group">Group</option>
          </select>
          <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleChange} className={inputClass} />
          <input type="number" name="minPrice" placeholder="Min ₹/hr" value={filters.minPrice} onChange={handleChange} className={inputClass} />
          <input type="number" name="maxPrice" placeholder="Max ₹/hr" value={filters.maxPrice} onChange={handleChange} className={inputClass} />
          <button
            type="submit"
            className="col-span-2 md:col-span-5 bg-navy text-cream p-2.5 rounded-lg font-semibold hover:bg-navy-dark transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tutors.length === 0 && <p className="text-charcoal/50 text-sm col-span-full">No tutors found.</p>}

          {tutors.map((tutor) => (
            <div key={tutor._id} className="bg-white p-5 rounded-2xl shadow-sm border border-navy/5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-1">
                {tutor.userId.profilePhoto ? (
                  <img src={tutor.userId.profilePhoto} alt={tutor.userId.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold">
                    {tutor.userId.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="font-display text-lg font-semibold text-navy">{tutor.userId.name}</h3>
              </div>
              <p className="text-xs text-charcoal/50 mb-3">{tutor.userId.location}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tutor.subjects.map((s) => <SubjectChip key={s} subject={s} />)}
              </div>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Mode:</strong> {tutor.mode.join(', ')}</p>
              <p className="text-sm text-charcoal/70"><strong className="text-charcoal">Rate:</strong> ₹{tutor.hourlyRate}/hr</p>
              <p className="text-sm text-charcoal/70 mb-3"><strong className="text-charcoal">Rating:</strong> {tutor.rating} ⭐</p>
              <Link
                to={`/tutor/${tutor._id}`}
                className="inline-block text-navy text-sm font-medium hover:text-amber transition-colors"
              >
                View Profile →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchTutors