/*import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signupUser } from '../api/auth'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    location: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await signupUser(formData)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'student') {
        navigate('/dashboard/student')
      } else {
        navigate('/dashboard/tutor')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">ConnectTutor Signup</h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="student">I'm a Student/Parent</option>
          <option value="tutor">I'm a Tutor</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup*/ 
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signupUser } from '../api/auth'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    location: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await signupUser(formData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'student') {
        navigate('/dashboard/student')
      } else {
        navigate('/dashboard/tutor')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const inputClass = "w-full p-3 border border-navy/10 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
  const labelClass = "block text-xs font-medium text-charcoal/60 mb-1 uppercase tracking-wide"

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold text-navy tracking-tight">
            ConnectTutor
          </h1>
          <p className="text-charcoal/60 text-sm mt-2">Create your account to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg shadow-navy/5 border border-navy/5">
          {error && (
            <p className="text-brick text-sm mb-4 text-center bg-brick/10 py-2 rounded-lg">{error}</p>
          )}

          <label className={labelClass}>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />

          <label className={labelClass}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />

          <label className={labelClass}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} required />

          <label className={labelClass}>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />

          <label className={labelClass}>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} />

          <label className={labelClass}>I am a...</label>
          <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
            <option value="student">Student / Parent</option>
            <option value="tutor">Tutor</option>
          </select>

          <button
            type="submit"
            className="w-full bg-navy text-cream p-3 rounded-lg font-semibold hover:bg-navy-dark transition-colors mt-2"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-5 text-charcoal/60">
            Already have an account?{' '}
            <Link to="/" className="text-navy font-medium hover:text-amber transition-colors">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
