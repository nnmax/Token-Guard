import { t } from 'i18next'
import ConnectButton from '../../components/ConnectButton'
import ConnectedMenu from '../../components/ConnectedMenu'
import Keynote from '../../components/Keynote'
import Layout from '../../components/Layout'
import MainContent from '../../components/legacy/MainContent'
import Title from '../../components/Title'
import { useConnectedAndAuthorized } from '../../globalState'

export default function LegacyPage() {
  const { data: connectedAndAuthorized } = useConnectedAndAuthorized()

  const keynotes = [
    t('legacy.desc1'),
    t('legacy.desc2'),
    t('legacy.desc3'),
    t('legacy.desc4'),
    t('legacy.desc5'),
    t('legacy.desc6'),
  ]

  return (
    <Layout>
      <Title>{t('home.legacy')}</Title>
      <ConnectedMenu />
      <Keynote>
        {keynotes}
      </Keynote>
      {
        connectedAndAuthorized ? <MainContent /> : <ConnectButton className="mx-auto mt-[120px] flex" />
      }
    </Layout>
  )
}
