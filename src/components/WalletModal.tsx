import type { Connector } from 'wagmi'
import type { components } from '../api/schema'
import { useEffect, useMemo, useState } from 'react'
import { Heading } from 'react-aria-components'
import { toast } from 'react-toastify'
import { ConnectorAlreadyConnectedError, useAccount, useChainId, useConnect, useSignMessage } from 'wagmi'
import $api from '../api/fetchClient'
import { AUTHORIZATION_KEY, MESSAGE_KEY, SIGNATURE_KEY } from '../constants'
import { useConnectedAndAuthorized, useWalletModalOpen } from '../globalState'
import Modal from './Modal'

export default function WalletModal() {
  const [pendingWallet, setPendingWallet] = useState<Connector>()
  const { data: walletModalOpen, setData: setWalletModalOpen } = useWalletModalOpen()
  const { connectAsync } = useConnect()
  const chainId = useChainId()
  const { isConnected, addresses: accountAddresses } = useAccount()
  const { data: connectedAndAuthorized, setData: setConnectedAndAuthorized } = useConnectedAndAuthorized()
  const { signMessageAsync } = useSignMessage()
  const { mutateAsync: connectWalletApi } = $api.useMutation('post', '/connect-wallet')

  useEffect(() => {
    const authorization = localStorage.getItem(AUTHORIZATION_KEY)
    setConnectedAndAuthorized(isConnected && authorization !== null && authorization !== '')
  }, [isConnected, setConnectedAndAuthorized])

  const tryActivation = async (connector: Connector) => {
    setPendingWallet(connector)

    try {
      const { accounts } = await connectAsync({
        connector,
        chainId,
      }).catch((error) => {
        if (error instanceof ConnectorAlreadyConnectedError) {
          if (connectedAndAuthorized) {
            setWalletModalOpen(false)
            throw error
          }
          else if (accountAddresses) {
            return { accounts: accountAddresses }
          }
        }
        throw error
      })

      if (accounts.length === 0) {
        toast.error('Failed to connect wallet')
        return
      }

      const s = window.localStorage.getItem(SIGNATURE_KEY)
      const m = window.localStorage.getItem(MESSAGE_KEY)

      let connectWalletResponse: false | components['schemas']['ConnectWalletResponse'] = false
      if (m !== null && !m && s !== null && !s) {
        connectWalletResponse = await connectWalletApi({
          body: {
            address: accounts[0],
            signature: s,
            message: m,
          },
        }).then((response) => {
          if (response.code !== 200) {
            throw response
          }
          return response
        }).catch((err) => {
          console.error(err)
          return false
        })
      }
      if (connectWalletResponse === false) {
        connectWalletResponse = await connectWalletApi({
          body: {
            address: accounts[0],
            signature: '',
            message: '',
          },
        })
      }

      let authorization = connectWalletResponse.authorization
      if (accounts.length > 0 && typeof connectWalletResponse.message_to_sign === 'string') {
        const signature = await signMessageAsync({
          message: connectWalletResponse.message_to_sign,
          account: accounts[0],
        })
        const connectWalletResponse2 = await connectWalletApi({
          body: {
            address: accounts[0],
            signature,
            message: connectWalletResponse.message_to_sign,
          },
        })
        authorization = connectWalletResponse2.authorization
        window.localStorage.setItem(SIGNATURE_KEY, signature)
        window.localStorage.setItem(MESSAGE_KEY, connectWalletResponse.message_to_sign)
      }

      if (authorization !== null && authorization !== '') {
        window.localStorage.setItem(AUTHORIZATION_KEY, authorization)
      }
      else {
        throw new Error('Authorization not found')
      }
      setConnectedAndAuthorized(true)
      setPendingWallet(undefined)
      setWalletModalOpen(false)
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log('%c [ error ]-93', 'font-size:13px; background:pink; color:#bf2c9f;', error)
      setPendingWallet(undefined)
    }
  }

  const connectors = useOrderedConnections()

  return (
    <WalletModalWrapper open={walletModalOpen} onClose={() => setWalletModalOpen(false)}>
      {connectors.map((connector) => {
        return (
          <WalletModalListItem
            key={connector.uid}
            name={connector.name}
            icon={connector.icon!}
            loading={connector === pendingWallet}
            disabled={!!pendingWallet}
            onClick={() => {
              tryActivation(connector).catch(console.error)
            }}
          />
        )
      })}
    </WalletModalWrapper>
  )
}

function WalletModalWrapper(props: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  const { open, onClose, children } = props

  return (
    <Modal isOpen={open} onClose={onClose} padding="24px 36px" maxWidth="384px">
      <Heading slot="title" className="mb-2 text-lg/6 font-bold text-[#576FAA]">
        Connect Wallet
      </Heading>
      <p className="text-xs font-medium text-[#6E86C2]">
        Choose how you want to connect. lf you don't have a wallet, you can select a provider and create one.
      </p>

      <ul className="mt-6 flex flex-col gap-6" role="menu">
        {children}
      </ul>
    </Modal>
  )
}

const liClasses
  = 'flex h-8 items-center aria-disabled:pointer-events-none gap-6 text-sm font-bold text-[#3255AC] cursor-pointer'

function WalletModalListItem(props: {
  loading?: boolean
  icon: string
  name: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
}) {
  const { onClick, loading, icon, name, disabled } = props

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (!onClick || loading || disabled) {
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      onClick(e)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!onClick || loading || disabled) {
      return
    }
    onClick(e)
  }

  return (
    <li
      className={liClasses}
      role="menuitem"
      tabIndex={loading || disabled ? -1 : 0}
      aria-disabled={loading || disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {loading ? <span className="size-8 loading" /> : <img src={icon} alt="" width="32" height="32" />}
      {name}
    </li>
  )
}

const CONNECTION = {
  WALLET_CONNECT_CONNECTOR_ID: 'walletConnect',
  INJECTED_CONNECTOR_ID: 'injected',
  INJECTED_CONNECTOR_TYPE: 'injected',
  COINBASE_SDK_CONNECTOR_ID: 'coinbaseWalletSDK',
  COINBASE_RDNS: 'com.coinbase.wallet',
  METAMASK_RDNS: 'io.metamask',
} as const

function getInjectedConnectors(connectors: readonly Connector[]) {
  const injectedConnectors = connectors.filter((c) => {
    if (c.id === CONNECTION.COINBASE_RDNS) {
      return false
    }

    return c.type === CONNECTION.INJECTED_CONNECTOR_TYPE && c.id !== CONNECTION.INJECTED_CONNECTOR_ID
  })

  // Special-case: Return deprecated window.ethereum connector when no eip6963 injectors are present.
  const fallbackInjector = getConnectorWithId(connectors, CONNECTION.INJECTED_CONNECTOR_ID, { shouldThrow: true })
  if (!injectedConnectors.length && window.ethereum && fallbackInjector) {
    return { injectedConnectors: [fallbackInjector] }
  }

  return { injectedConnectors }
}

type ConnectorID = (typeof CONNECTION)[keyof typeof CONNECTION]

function getConnectorWithId(
  connectors: readonly Connector[],
  id: ConnectorID,
  options: { shouldThrow: true },
): Connector | undefined
function getConnectorWithId(connectors: readonly Connector[], id: ConnectorID): Connector | undefined
function getConnectorWithId(
  connectors: readonly Connector[],
  id: ConnectorID,
  options?: { shouldThrow: true },
): Connector | undefined {
  const connector = connectors.find(c => c.id === id)
  if (!connector && options?.shouldThrow) {
    throw new Error(`Expected connector ${id} missing from wagmi context.`)
  }
  return connector
}

function useOrderedConnections() {
  const { connectors } = useConnect()

  return useMemo(() => {
    const { injectedConnectors } = getInjectedConnectors(connectors)
    const SHOULD_THROW = { shouldThrow: true } as const
    const coinbaseSdkConnector = getConnectorWithId(connectors, CONNECTION.COINBASE_SDK_CONNECTOR_ID, SHOULD_THROW)
    const walletConnectConnector = getConnectorWithId(connectors, CONNECTION.WALLET_CONNECT_CONNECTOR_ID, SHOULD_THROW)

    if (!coinbaseSdkConnector || !walletConnectConnector) {
      throw new Error('Expected connector(s) missing from wagmi context.')
    }

    const orderedConnectors: Connector[] = []

    // Injected connectors should appear next in the list, as the user intentionally installed/uses them.
    orderedConnectors.push(
      ...injectedConnectors.filter(item => ['com.okex.wallet', 'io.metamask'].includes(item.id)),
    )

    // WalletConnect and Coinbase are added last in the list.
    orderedConnectors.push(walletConnectConnector)
    orderedConnectors.push(coinbaseSdkConnector)

    // id 等于 io.metamask 的排在最前面，id 等于 com.okex.wallet 的排在最后面
    orderedConnectors.sort((a, b) => {
      if (a.id === 'io.metamask') {
        return -1
      }
      if (b.id === 'io.metamask') {
        return 1
      }
      if (a.id === 'com.okex.wallet') {
        return 1
      }
      if (b.id === 'com.okex.wallet') {
        return -1
      }
      return 0
    })

    return orderedConnectors
  }, [connectors])
}
