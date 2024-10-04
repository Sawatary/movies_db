import {
  createContext,
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { debounce } from 'lodash'

import {
  fetchMoviesData,
  fetchTrendMovies,
  MoviesDataType,
} from '../api/movies'

type MoviesStateType = {
  movieData: MoviesDataType | null
  error: Error | null
  loading: boolean
  searchValue: string
  page: number
}

const initState: MoviesStateType = {
  movieData: null,
  error: null,
  loading: true,
  searchValue: '',
  page: 1,
}

type MovieContextType = {
  movieContext: MoviesStateType
  debouncedSetSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  setPage: (value: number) => void
}

const MovieContext = createContext<MovieContextType>({
  movieContext: initState,
  debouncedSetSearch: () => {},
  setPage: () => {},
})

type ChildrenType = { children: ReactElement | ReactElement[] | undefined }

const MovieDataProvider = ({ children }: ChildrenType) => {
  const [state, setState] = useState<MoviesStateType>(initState)

  const updateTrendMovies = useCallback(async (page = 1) => {
    try {
      const data = await fetchTrendMovies(page)
      setState((prevState) => ({
        ...prevState,
        movieData: data,
        error: null,
        loading: false,
      }))
    } catch (err) {
      if (err instanceof Error) {
        setState((prevState) => ({
          ...prevState,
          error: err,
          loading: false,
        }))
      }
    }
  }, [])

  const updateFoundMovies = useCallback(async (query: string, page: number) => {
    try {
      const data = await fetchMoviesData(query, page)
      setState((prevState) => ({
        ...prevState,
        movieData: data,
        error: null,
        loading: false,
      }))
    } catch (err) {
      if (err instanceof Error) {
        setState((prevState) => ({
          ...prevState,
          error: err,
          loading: false,
        }))
      }
    }
  }, [])

  const debouncedSetSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim()
      if (value) {
        setState((prevState) => ({
          ...prevState,
          searchValue: value,
          loading: true,
        }))
      }
    }, 1500),
    []
  )

  const setPage = (value: number) => {
    setState((prevState) => ({
      ...prevState,
      page: value,
      loading: true,
    }))
  }

  useEffect(() => {
    const { searchValue, page } = state

    if (searchValue) {
      updateFoundMovies(searchValue, page)
    } else {
      updateTrendMovies(page)
    }
  }, [state.searchValue, state.page, updateFoundMovies, updateTrendMovies])

  return (
    <MovieContext.Provider
      value={{
        movieContext: state,
        debouncedSetSearch,
        setPage,
      }}
    >
      {children}
    </MovieContext.Provider>
  )
}

export const MovieDataConsumer = MovieContext.Consumer

export default MovieDataProvider
