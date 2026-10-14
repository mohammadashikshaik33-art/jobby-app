import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

const Home = () => {
  if (!Cookies.get('jwt_token')) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <main className="home-page">
        <div className="home-content">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="find-jobs-link">
            Find Jobs
          </Link>
        </div>
      </main>
    </>
  )
}

export default Home
