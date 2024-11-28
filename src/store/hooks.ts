import { createGlobalState } from '.'

export const useWalletModalOpen = createGlobalState('wallet-modal-open', false)
export const useConnectedAndAuthorized = createGlobalState('connected-and-authorized', false)
