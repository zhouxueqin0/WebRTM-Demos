'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockLogin } from '../../shared/utils/auth.js'
import './page.css'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    const result = await mockLogin('user', 'password')
    setLoading(false)
    
    if (result.success) {
      localStorage.setItem('token', result.token)
      router.push('/dashboard')
    }
  }

  return (
    <div className="login-container">
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </div>
  )
}
