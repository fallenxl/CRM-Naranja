import { Navigate, Outlet } from 'react-router-dom'
import { PublicRoutes} from '../constants'
import { useEffect, useState } from 'react'
import { tokenExpired, validateUser } from '../services'
import { Loading } from '../component/loader/Loading'
import { useDispatch } from 'react-redux'
import { setAuth } from '../redux/states/auth.state'
import { setSocket } from '../redux/states/socket.state'
import { io } from 'socket.io-client'

export const AuthGuard = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null)
  const dispatch = useDispatch()
  useEffect(() => {

    // Validar si el usuario está autenticado
    const validate = async () => {

      try {
        const data = await validateUser()
        if(data){
          dispatch(setAuth(data))
          dispatch(setSocket(io("http://localhost:82")))
          setIsAuth(true)
          
        }else{
          tokenExpired()
          setIsAuth(false)
        }

               
      } catch (error) {
        tokenExpired()
        setIsAuth(false)
      }
    }
    validate()
  }, [])

  // Si isAuth es null, se muestra el componente Loading
  if (isAuth === null) return <Loading />

  // Si isAuth es true, se muestra el componente Outlet
  return isAuth ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN} />
}
