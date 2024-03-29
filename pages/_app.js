import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import Aos from 'aos';
import "aos/dist/aos.css";
import { useEffect } from 'react';

import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  rainbowWallet,
} from "@thirdweb-dev/react";



export default function App({ Component, pageProps }) {

  useEffect(() => {
    Aos.init({ duration : 1500,
               offset: 100,
               delay : 100})
  }, []);
  
  return (
   
    <div>
        <ThirdwebProvider
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        coinbaseWallet(),
        walletConnect(),
        safeWallet(),
        rainbowWallet(),
      ]}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain="base-sepolia-testnet"
    >
  <Component {...pageProps} />
  </ThirdwebProvider>
  </div>
  
  )
}
