import {useCallback, useEffect, useState} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

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

const JobDetails = ({match}) => {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const token = Cookies.get('jwt_token')

  const getDetails = useCallback(async () => {
    setLoading(true)
    setHasError(false)

    try {
      const response = await fetch(`${API}/jobs/${match.params.id}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error('Job details request failed')
      }

      setDetails(data.job_details)
    } catch {
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }, [match.params.id, token])

  useEffect(() => {
    getDetails()
  }, [getDetails])

  if (!token) {
    return <Redirect to="/login" />
  }

  const renderDetailsContent = () => {
    if (loading) {
      return <LoaderView />
    }

    if (hasError) {
      return <FailureView retry={getDetails} />
    }

    if (!details) {
      return null
    }

    return (
      <div className="details-card">
        <div className="job-card-heading">
          <img src={details.company_logo_url} alt="job details company logo" />
          <div>
            <h1>{details.title}</h1>
            <p>{details.rating}</p>
          </div>
        </div>

        <div className="job-meta">
          <p>{details.location}</p>
          <p>{details.employment_type}</p>
          <p>{details.package_per_annum}</p>
        </div>

        <div className="description-heading">
          <h1>Description</h1>
          <a
            href={details.company_website_url}
            target="_blank"
            rel="noreferrer"
          >
            Visit
          </a>
        </div>

        <p>{details.job_description}</p>

        <h1>Skills</h1>
        <ul className="skills-list">
          {details.skills &&
            details.skills.map(skill => (
              <li key={skill.name}>
                <img src={skill.image_url} alt={skill.name} />
                <p>{skill.name}</p>
              </li>
            ))}
        </ul>

        {details.life_at_company && (
          <section className="life-section">
            <h1>Life at Company</h1>
            <div className="life-at-company">
              <p>{details.life_at_company.description}</p>
              <img
                src={details.life_at_company.image_url}
                alt="life at company"
              />
            </div>
          </section>
        )}

        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {details.similar_jobs &&
            details.similar_jobs.map(job => (
              <li key={job.id} className="similar-job-card">
                <div className="job-card-heading">
                  <img
                    src={job.company_logo_url}
                    alt="similar job company logo"
                  />
                  <div>
                    <h1>{job.title}</h1>
                    <p>{job.rating}</p>
                  </div>
                </div>

                <h1>Description</h1>
                <p>{job.job_description}</p>

                <div className="job-meta">
                  <p>{job.location}</p>
                  <p>{job.employment_type}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="details-page">{renderDetailsContent()}</main>
    </>
  )
}

export default JobDetails
