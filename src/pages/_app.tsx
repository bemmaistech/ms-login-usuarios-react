import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function MeuApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
