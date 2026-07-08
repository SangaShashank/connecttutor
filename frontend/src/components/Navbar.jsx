import { Link, useNavigate } from 'react-router-dom'

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

export default Navbar