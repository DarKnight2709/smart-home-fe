import ROUTES from '@/shared/lib/routes'
import { Navigate } from 'react-router'
import LoginForm from '../components/LoginForm'
import useAuthStore from '../stores/authStore'

const LoginPage = () => {
  const { isAuth } = useAuthStore()

  if (isAuth) {
    return <Navigate to={ROUTES.HOME.url} replace />
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[url(/debut-light.png)]  p-4'>
      <div className='w-full max-w-md space-y-6'>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
