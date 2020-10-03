import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Search from '../components/Search'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>UQueue</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        U<span className={styles.alt}>Queue</span>
        </h1>

        {/* <p className={styles.description}>
          The queueing solution for the classroom{' '}
        </p> */}

        <Search></Search>

       
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.iris}>IRIS</span>
        </a>
      </footer>
    </div>
  )
}
