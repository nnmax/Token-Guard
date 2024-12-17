import { t } from 'i18next'
import ConnectButton from '../../components/ConnectButton'
import ConnectedMenu from '../../components/ConnectedMenu'
import Keynote from '../../components/Keynote'
import Layout from '../../components/Layout'
import MainContent from '../../components/pension/MainContent'
import Title from '../../components/Title'
import { useConnectedAndAuthorized } from '../../store/hooks'

export default function PensionPage() {
  const { data: connectedAndAuthorized } = useConnectedAndAuthorized()

  const keynotes = [
    t('pension.desc1'),
    t('pension.desc2'),
    t('pension.desc3'),
    t('pension.desc4'),
    t('pension.desc5'),
    t('pension.desc6'),
  ]

  return (
    <Layout>
      <Title>{t('home.pension')}</Title>
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
