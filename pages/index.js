import Head from 'next/head'
import Image from 'next/image'
import Base from '../components/base'


export default function Home() {
  return (
    <div>
      <Head>
        <title>LMAC Experiment</title>
        <meta name="Description" content="LMAC Experiment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Base/>
    </div>
  )
}
