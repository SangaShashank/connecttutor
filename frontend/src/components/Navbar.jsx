/*import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (!user) return null // don't show navbar if not logged in

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to={user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor'} className="font-bold text-lg">
        ConnectTutor 🎓
      </Link>

      <div className="space-x-6 flex items-center">
        <Link to={user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor'} className="hover:underline">
          Dashboard
        </Link>

        {user.role === 'student' && (
          <Link to="/search" className="hover:underline">
            Find Tutors
          </Link>
        )}

        <span className="text-sm">Hi, {user.name}</span>

        <button onClick={handleLogout} className="bg-blue-800 px-3 py-1 rounded hover:bg-blue-900 text-sm">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar */
/*import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (!user) return null

  return (
    <nav className="bg-navy text-cream px-6 py-4 flex justify-between items-center shadow-md">
      <Link
        to={user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor'}
        className="font-display text-2xl font-semibold tracking-tight"
      >
        ConnectTutor
      </Link>

      <div className="space-x-6 flex items-center font-body">
        <Link
          to={user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor'}
          className="hover:text-amber transition-colors text-sm font-medium"
        >
          Dashboard
        </Link>

        {user.role === 'student' && (
          <Link to="/search" className="hover:text-amber transition-colors text-sm font-medium">
            Find Tutors
          </Link>
        )}

        <span className="text-sm text-cream/70">Hi, {user.name}</span>

        <button
          onClick={handleLogout}
          className="bg-amber text-navy-dark px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-amber/90 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar*/ 
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (!user) return null

  return (
    <nav className="bg-navy text-cream px-6 py-4 flex justify-between items-center shadow-md">
      <Link
        to={user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor'}
        className="font-display text-2xl font-semibold tracking-tight"
      >
        ConnectTutor
      </Link>

      <div className="space-x-6 flex items-center font-body">
        <Link
          to={user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor'}
          className="hover:text-amber transition-colors text-sm font-medium"
        >
          Dashboard
        </Link>

        {user.role === 'student' && (
          <Link to="/search" className="hover:text-amber transition-colors text-sm font-medium">
            Find Tutors
          </Link>
        )}

        <div className="flex items-center gap-2">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-amber/30 flex items-center justify-center text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm text-cream/70">Hi, {user.name}</span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-amber text-navy-dark px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-amber/90 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar