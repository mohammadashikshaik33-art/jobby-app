import {useCallback, useEffect, useState} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const employmentTypesList = [
  {employmentTypeId: 'FULLTIME', label: 'Full Time'},
  {employmentTypeId: 'PARTTIME', label: 'Part Time'},
  {employmentTypeId: 'FREELANCE', label: 'Freelance'},
  {employmentTypeId: 'INTERNSHIP', label: 'Internship'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const API = 'https://apis.ccbp.in'

const LoaderView = () => (
  <div className="loader-container" data-testid="loader">
    <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
  </div>
)

const FailureView = ({retry}) => (
  <div className="failure-view">
    <img
      src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      alt="failure view"
    />
    <h1>Oops! Something Went Wrong</h1>
    <p>We cannot seem to find the page you are looking for</p>
    <button type="button" onClick={retry}>
      Retry
    </button>
  </div>
)

const Jobs = () => {
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(false)
  const [jobs, setJobs] = useState([])
  const [jobsError, setJobsError] = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [employmentTypes, setEmploymentTypes] = useState([])
  const [salary, setSalary] = useState('')

  const token = Cookies.get('jwt_token')

  const getProfile = useCallback(async () => {
    setLoadingProfile(true)
    setProfileError(false)

    try {
      const response = await fetch(`${API}/profile`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error('Profile request failed')
      }

      setProfile(data.profile_details)
    } catch {
      setProfileError(true)
    } finally {
      setLoadingProfile(false)
    }
  }, [token])

  const getJobs = useCallback(async () => {
    setLoadingJobs(true)
    setJobsError(false)

    const params = new URLSearchParams()
    params.set('employment_type', employmentTypes.join(','))
    params.set('minimum_package', salary)
    params.set('search', appliedSearch)

    try {
      const response = await fetch(`${API}/jobs?${params.toString()}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error('Jobs request failed')
      }

      setJobs(data.jobs || [])
    } catch {
      setJobsError(true)
    } finally {
      setLoadingJobs(false)
    }
  }, [employmentTypes, salary, appliedSearch, token])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  useEffect(() => {
    getJobs()
  }, [getJobs])

  if (!token) {
    return <Redirect to="/login" />
  }

  const toggleEmployment = id => {
    setEmploymentTypes(previous => {
      if (previous.includes(id)) {
        return previous.filter(item => item !== id)
      }

      return [...previous, id]
    })
  }

  const renderProfile = () => {
    if (loadingProfile) {
      return <LoaderView />
    }

    if (profileError) {
      return <FailureView retry={getProfile} />
    }

    if (!profile) {
      return null
    }

    return (
      <div className="profile-card">
        <img src={profile.profile_image_url} alt="profile" />
        <h1>{profile.name}</h1>
        <p>{profile.short_bio}</p>
      </div>
    )
  }

  const renderJobs = () => {
    if (loadingJobs) {
      return <LoaderView />
    }

    if (jobsError) {
      return <FailureView retry={getJobs} />
    }

    if (jobs.length === 0) {
      return (
        <div className="no-jobs">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobs.map(job => (
          <li key={job.id} className="job-card">
            <Link to={`/jobs/${job.id}`} className="job-link">
              <div className="job-card-heading">
                <img src={job.company_logo_url} alt="company logo" />
                <div>
                  <h1>{job.title}</h1>
                  <p>{job.rating}</p>
                </div>
              </div>

              <div className="job-meta">
                <p>{job.location}</p>
                <p>{job.employment_type}</p>
                <p>{job.package_per_annum}</p>
              </div>

              <hr />
              <h1>Description</h1>
              <p>{job.job_description}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <Header />
      <main className="jobs-page">
        <aside className="filters">
          {renderProfile()}

          <hr />
          <h1>Type of Employment</h1>

          {employmentTypesList.map(item => (
            <label key={item.employmentTypeId} className="filter-option">
              <input
                type="checkbox"
                checked={employmentTypes.includes(item.employmentTypeId)}
                onChange={() => toggleEmployment(item.employmentTypeId)}
              />
              {item.label}
            </label>
          ))}

          <hr />
          <h1>Salary Range</h1>

          {salaryRangesList.map(item => (
            <label key={item.salaryRangeId} className="filter-option">
              <input
                type="radio"
                name="salary"
                checked={salary === item.salaryRangeId}
                onChange={() => setSalary(item.salaryRangeId)}
              />
              {item.label}
            </label>
          ))}
        </aside>

        <section className="jobs-results">
          <div className="search-container">
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search"
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={() => setAppliedSearch(search)}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>

          {renderJobs()}
        </section>
      </main>
    </>
  )
}

export default Jobs
