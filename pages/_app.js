import '../styles/globals.css'
import React from 'react'
import Nav from '../components/Nav'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  return (
    <React.Fragment>
      {router.pathname !== '/' && <Nav></Nav>}
      <Component {...pageProps} />

    </React.Fragment>
  )
}

export default MyApp
