import {Link} from 'react-router-dom'

const NotFound = () => (
  <div className="not-found-page">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
    />
    <h1>Page Not Found</h1>
    <p>We are sorry, the page you requested could not be found.</p>
    <Link to="/">Go Home</Link>
  </div>
)

export default NotFound
