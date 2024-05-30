import { useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Context } from '@/context/appContext.jsx';
import { Helmet } from 'react-helmet-async';

export const Home = () => {
  const {store, actions} = useContext(Context)
  
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{import.meta.env.VITE_APP_NAME+" | Inicio"}</title>
      </Helmet>
      <div>
          <Button variant="primary" onClick={() => actions.setCounter()}>{store.counter}</Button>
          {store.current_user ? "Logueado" : store.current_user === false ? "Error" : <Spinner animation="border" role='status'/> }
      </div>
    </>
  )
}
