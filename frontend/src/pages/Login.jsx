/*import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault() // stops the page from refreshing on form submit

    try {
      const data = await loginUser(email, password)

      // Store token and user info in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect based on role
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
        <h1 className="text-2xl font-bold mb-6 text-center">ConnectTutor Login</h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login*/
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/auth'
import Footer from '../components/Footer'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await loginUser(email, password)
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
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold text-navy tracking-tight">
            ConnectTutor
          </h1>
          <p className="text-charcoal/60 text-sm mt-2">Find the right tutor. Learn your way.</p>
          <p className="font-display text-amber/75 text-lg mt-4 italic">
            गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः
          </p>
          <p className="text-charcoal/40 text-xs mt-1">
            The teacher is Brahma, Vishnu, and Shiva — creation, sustenance, and transformation
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg shadow-navy/5 border border-navy/5">
          {error && (
            <p className="text-brick text-sm mb-4 text-center bg-brick/10 py-2 rounded-lg">{error}</p>
          )}

          <label className="block text-xs font-medium text-charcoal/60 mb-1 uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-navy/10 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
            required
          />

          <label className="block text-xs font-medium text-charcoal/60 mb-1 uppercase tracking-wide">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-navy/10 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
            required
          />

          <button
            type="submit"
            className="w-full bg-navy text-cream p-3 rounded-lg font-semibold hover:bg-navy-dark transition-colors"
          >
            Login
          </button>

          <p className="text-sm text-center mt-5 text-charcoal/60">
            Don't have an account?{' '}
            <Link to="/signup" className="text-navy font-medium hover:text-amber transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Login