import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found">
      <img
        src="/batman.gif"
        alt="Batman — Page not found"
        className="not-found__gif"
      />
      <h1 className="not-found__title">404</h1>
      <p className="not-found__msg">ไม่พบหน้านี้ · Page not found</p>
      <button
        type="button"
        className="not-found__btn"
        onClick={() => navigate('/')}
      >
        ← กลับหน้าหลัก · Go home
      </button>
    </div>
  )
}
