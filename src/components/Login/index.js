import {useState} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const Login = ({history}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const token = Cookies.get('jwt_token')
  if (token) {
    return <Redirect to="/" />
  }

  const submitForm = async event => {
    event.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
      })
      const data = await response.json()

      if (response.ok) {
        Cookies.set('jwt_token', data.jwt_token, {expires: 30})
        history.replace('/')
      } else {
        setErrorMsg(data.error_msg)
      }
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="login-logo"
        />
        <label htmlFor="username">USERNAME</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={event => setUsername(event.target.value)}
          placeholder="Username"
        />
        <label htmlFor="password">PASSWORD</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>
    </div>
  )
}

export default Login
