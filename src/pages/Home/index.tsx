import { t } from 'i18next'

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">{t('Welcome to React')}</h1>
    </div>
  )
}
