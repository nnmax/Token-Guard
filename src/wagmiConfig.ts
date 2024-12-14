import { createConfig, createConnector, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import browserWalletIcon from './assets/images/browser-wallet-light.svg'
import coinbaseWalletIcon from './assets/images/coinbaseWalletIcon.svg'
import metamaskIcon from './assets/images/metamask-icon.svg'
import walletConnectIcon from './assets/images/walletConnectIcon.svg'

function coinbaseWalletWithIcon() {
  return createConnector<any>((config) => {
    const coinbaseWalletReturn = coinbaseWallet({
      // TODO: 配置 favicon
      // appLogoUrl: IS_PROD ? 'https://packex.io/favicon.svg' : 'https://web-dev.packex.io/favicon.svg',
      // appName: 'PackEX',
    })(config)

    return {
      ...coinbaseWalletReturn,
      icon: coinbaseWalletIcon,
    }
  })
}

function walletConnectWithIcon() {
  return createConnector<any>((config) => {
    const walletConnectReturn = walletConnect({
      // TODO: 配置域名, https://cloud.reown.com/
      projectId: '11acd9dda00869bfeee0efac6dd5865e',
      // TODO: 配置 App 名称和域名 icons 等
      // metadata: {
      //   name: 'PackEX',
      //   description: 'PackEX',
      //   url: IS_PROD ? 'https://packex.io' : 'https://web-dev.packex.io',
      //   icons: [IS_PROD ? 'https://packex.io/favicon.svg' : 'https://web-dev.packex.io/favicon.svg'],
      // },
    })(config)

    return {
      ...walletConnectReturn,
      icon: walletConnectIcon,
    }
  })
}

function injectedWithFallback() {
  return createConnector((config) => {
    const injectedConnector = injected()(config)

    return {
      ...injectedConnector,
      async connect(...params) {
        if (!window.ethereum) {
          window.open('https://metamask.io/', 'inst_metamask')
        }
        return injectedConnector.connect(...params)
      },
      get icon() {
        return !window.ethereum || window.ethereum?.isMetaMask ? metamaskIcon : browserWalletIcon
      },
      get name() {
        return !window.ethereum ? 'Install MetaMask' : window.ethereum?.isMetaMask ? 'MetaMask' : 'Browser Wallet'
      },
    }
  })
}

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injectedWithFallback(), coinbaseWalletWithIcon(), walletConnectWithIcon()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export default wagmiConfig
