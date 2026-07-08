import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchTutors } from '../api/tutor'
import Navbar from '../components/Navbar'

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

 return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Find a Tutor</h1>
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={filters.subject}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <select name="mode" value={filters.mode} onChange={handleChange} className="p-2 border rounded">
          <option value="">Any Mode</option>
          <option value="home">Home</option>
          <option value="online">Online</option>
          <option value="group">Group</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min ₹/hr"
          value={filters.minPrice}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max ₹/hr"
          value={filters.maxPrice}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="col-span-2 md:col-span-5 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tutors.length === 0 && <p className="text-gray-500">No tutors found.</p>}

        {tutors.map((tutor) => (
          <div key={tutor._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{tutor.userId.name}</h3>
            <p className="text-sm text-gray-600">{tutor.userId.location}</p>
            <p><strong>Subjects:</strong> {tutor.subjects.join(', ')}</p>
            <p><strong>Mode:</strong> {tutor.mode.join(', ')}</p>
            <p><strong>Rate:</strong> ₹{tutor.hourlyRate}/hr</p>
            <p><strong>Rating:</strong> {tutor.rating} ⭐</p>
            <Link
              to={`/tutor/${tutor._id}`}
              className="inline-block mt-2 text-blue-600 hover:underline text-sm"
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
