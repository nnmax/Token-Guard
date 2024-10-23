import { changeLanguage } from 'i18next'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Providers from './Providers'

export default function Root() {
  useEffect(() => {
    if (window.location.search) {
      const searchParams = new URLSearchParams(window.location.search)
      const lang = searchParams.get('lang')
      if (lang && ['en-US', 'zh-CN', 'en', 'zh'].includes(lang)) {
        if (lang === 'en') {
          changeLanguage('en-US')
        }
        else if (lang === 'zh') {
          changeLanguage('zh-CN')
        }
      }
    }
  }, [])

  return (
    <Providers>
      <div className="min-h-screen w-screen bg-[#eee]">
        <Outlet />
      </div>
    </Providers>
  )
}
