import { Empty, Tabs } from 'antd'

import MovieDataProvider from '../context/MoviesContext'
import RatingProvider from '../context/RatingContext'
import SessionProvider, { SessionConsumer } from '../context/SessionContext'

import RatedTab from './pages/Rating'
import SearchTab from './pages/Search'

const Movies = () => {
  const ratedTab = (
    <SessionConsumer>
      {({ guestSessionData }) => (
        <RatingProvider guestSession={guestSessionData}>
          <RatedTab />
        </RatingProvider>
      )}
    </SessionConsumer>
  )

  const tabs = [
    {
      key: '1',
      label: 'Search',
      children: (
        <MovieDataProvider>
          <SearchTab />
        </MovieDataProvider>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: ratedTab,
    },
  ]

  return (
    <SessionProvider>
      <Tabs
        onChange={(activeKey) => {
          if (activeKey === '2') {
            tabs[1].children = ratedTab
          } else tabs[1].children = <Empty />
        }}
        defaultActiveKey="1"
        items={tabs}
        centered
        size="large"
      />
    </SessionProvider>
  )
}

export default Movies
