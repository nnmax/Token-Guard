import type { paths } from '../api/schema'
import i18n from 'i18next'
import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import { API_PREFIX, AUTHORIZATION_KEY } from '../constants'

const fetchClient = createFetchClient<paths>({
  baseUrl: API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
})

const PATHNAME_WHITELIST: (keyof paths)[] = [
  '/connect-wallet',
]

fetchClient.use({
  onRequest: ({ request }) => {
    const language = i18n.languages[0] ?? 'en-US'
    const token = localStorage.getItem(AUTHORIZATION_KEY)
    const pathname = new URL(request.url).pathname.replace(API_PREFIX, '') as keyof paths
    if (!PATHNAME_WHITELIST.includes(pathname) && !token) {
      console.error('fetchClient middleware error: Unauthorized')
      throw new Error('Unauthorized')
    }
    if (token) {
      request.headers.set('Authorization', token)
    }
    request.headers.set('X-Language', language)
  },
  onResponse: ({ response }) => {
    if (!response.ok) {
      throw new Error(`${response.url}: ${response.status} ${response.statusText}`)
    }
  },
})

const $api = createClient(fetchClient)

export default $api
