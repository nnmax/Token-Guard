import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

export interface UseGlobalStateReturn<T> {
  data: T
  setData: (data: T) => void
  resetData: () => void
}

export function useGlobalState<T>(queryKey: unknown, initialData: T): UseGlobalStateReturn<T> {
  const queryClient = useQueryClient()

  const { data } = useQuery<T>({
    queryKey: [queryKey, initialData],
    queryFn: async () => Promise.resolve(initialData),
    initialData,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  })

  const setData = useCallback((data: Parameters<typeof queryClient.setQueriesData<T>>[1]) => {
    queryClient.setQueryData<T>([queryKey], data)
  }, [queryClient])

  const resetData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [queryKey],
    }).catch(console.error)
    queryClient.refetchQueries({
      queryKey: [queryKey],
    }).catch(console.error)
  }, [queryClient])

  return useMemo<UseGlobalStateReturn<T>>(() => ({ data: data as T, setData, resetData }), [data, resetData, setData])
}

export function useWalletModalOpen() {
  return useGlobalState('wallet-modal-open', false)
}

export function useConnectedAndAuthorized() {
  return useGlobalState('connected-and-authorized', false)
}
