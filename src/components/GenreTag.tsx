import { Tag } from 'antd'

import { genres } from '../api/moviesGenre'

type GnrTagPropType = { genreId: number }

const GenreTag = ({ genreId }: GnrTagPropType) => {
  const findGenreName = (): string | undefined =>
    genres.find(({ id }) => id === genreId)?.name

  return (
    <Tag color="red" style={{ fontSize: '.7rem' }}>
      {findGenreName() || 'ERROR'}
    </Tag>
  )
}

export default GenreTag
