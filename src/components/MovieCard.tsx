import {
  List,
  Avatar,
  Typography,
  Image,
  Flex,
  Rate,
  Progress,
  Tag,
} from 'antd'
import { format } from 'date-fns'

import { MoviesType } from '../api/movies'
import { SessionConsumer } from '../context/SessionContext'
import addRating from '../api/moviesRating'

import GenreTag from './GenreTag'

const { Text, Paragraph } = Typography

type MovCdPropType = {
  movie: MoviesType
}
const rateColor = (rate: number) => {
  if (rate <= 3) return '#E90000'
  if (rate <= 5) return '#E97E00'
  if (rate <= 7) return '#E9D100'
  return '#66E900'
}

const cutTxt = (length = 0, text = '') => {
  return text.length > length
    ? text.substring(0, length).replace(/\s?\w*$/, '...')
    : text
}

const baseURLImgPath = 'https://image.tmdb.org/t/p/w500'

const MovieCard = ({ movie }: MovCdPropType) => {
  const {
    title,
    release_date: date,
    overview,
    poster_path: imgPath,
    backdrop_path: bdImgPath,
    vote_average: rate,
    genre_ids: genreIds,
    id,
  } = movie

  return (
    <List.Item
      style={{
        boxShadow: '0.1rem .2rem .6rem 0.2rem hsla(1, 1%, 70%, 0.300)',
        padding: window.innerWidth >= 768 ? 0 : '.5rem',
        borderRadius: '10px',
      }}
    >
      <Flex gap="1rem" style={{ borderRadius: '10px' }}>
        <Avatar
          shape="square"
          className="posterImg"
          style={{ borderRadius: '10px' }}
          src={
            <Image
              src={`${baseURLImgPath}${imgPath || bdImgPath}`}
              preview
              fallback="/favicon.gif"
            />
          }
        />
        <Flex
          vertical
          gap=".5rem"
          style={{
            paddingRight: '.5rem',
            paddingBottom: '1rem',
            minWidth: 0,
            flex: 1,
          }}
        >
          <Flex align="center" justify="space-between">
            <Text title={title} style={{ fontSize: '1.2rem' }}>
              {cutTxt(45, title)}
            </Text>
            <Progress
              type="circle"
              percent={99.99}
              size={30}
              strokeWidth={8}
              strokeColor={rateColor(rate || 0)}
              format={() => (rate ? rate.toFixed(1) : -0)}
              style={{
                paddingTop: '.5em',
                paddingLeft: '.5em',
                alignSelf: 'flex-start',
              }}
            />
          </Flex>

          <Text type="secondary" style={{ fontSize: '.7rem' }}>
            {date && format(new Date(date), 'MMMM d, yyyy')}
            {!date && 'No date'}
          </Text>
          <Flex wrap gap="4px 0" style={{ minWidth: 0 }}>
            {genreIds &&
              genreIds.map((genreId) => (
                <GenreTag genreId={genreId} key={`genre-${genreId}`} />
              ))}
            {(genreIds && !!genreIds.length) || (
              <Tag>This movie has no Genres</Tag>
            )}
          </Flex>
          <Flex
            vertical
            style={{ marginLeft: window.innerWidth >= 768 ? 0 : -75, flex: 1 }}
          >
            <Paragraph style={{ fontSize: '.9em' }}>
              {cutTxt(180, overview) ||
                'This movie has no description to show...'}
            </Paragraph>
            <SessionConsumer>
              {({ guestSessionData, getRateById, setRateById }) => (
                <Rate
                  onChange={(value: number) => {
                    if (guestSessionData) {
                      setRateById(id, value)

                      addRating(
                        guestSessionData.guest_session_id,
                        id,
                        value
                      ).catch(() => {
                        setRateById(id, 0)
                      })
                    }
                  }}
                  value={getRateById(id) || 0}
                  count={10}
                  style={{
                    alignSelf: 'flex-end',
                    fontSize: '1rem',
                    marginTop: 'auto',
                  }}
                />
              )}
            </SessionConsumer>
          </Flex>
        </Flex>
      </Flex>
    </List.Item>
  )
}

export default MovieCard
