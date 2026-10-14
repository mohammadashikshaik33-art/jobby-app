import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/jobs">Jobs</Link>
        </li>
      </ul>
      <button type="button" onClick={logout} className="logout-button">
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
