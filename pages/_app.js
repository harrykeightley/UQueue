import '../styles/globals.css'
import React from 'react'
import Nav from '../components/Nav'

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Nav></Nav>
      <Component {...pageProps} />

    </React.Fragment>
  )
}

export default MyApp
