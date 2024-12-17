import { t } from 'i18next'
import ConnectButton from '../../components/ConnectButton'
import ConnectedMenu from '../../components/ConnectedMenu'
import Keynote from '../../components/Keynote'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import MainContent from '../../components/trust/MainContent'
import { useConnectedAndAuthorized } from '../../globalState'

export default function TrustPage() {
  const { data: connectedAndAuthorized } = useConnectedAndAuthorized()

  const keynotes = [
    t('trust.desc1'),
    t('trust.desc2'),
    t('trust.desc3'),
    t('trust.desc4'),
    t('trust.desc5'),
    t('trust.desc6'),
  ]

  return (
    <Layout>
      <Title>{t('home.trust')}</Title>
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
