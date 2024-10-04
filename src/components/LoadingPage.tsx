import { List, Skeleton } from 'antd'

const loadingPage = () => {
  return (
    <List
      itemLayout="vertical"
      grid={{ gutter: 24, column: 2, md: 2, sm: 1, xs: 1 }}
      dataSource={Array(6).fill('')}
      renderItem={() => (
        <List.Item style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Skeleton.Image active style={{ width: '13rem', height: '17rem' }} />
          <Skeleton active style={{ width: '50%' }} />
        </List.Item>
      )}
    />
  )
}

export default loadingPage
