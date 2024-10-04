import React, { createContext, useEffect, useState } from 'react'

import {
  fetchRatedMoviesData,
  GuestSessionDataType,
  MoviesDataType,
} from '../api/movies'

type MoviesStateType = {
  movieData: MoviesDataType | null
  error: Error | null
  loading: boolean
  page: number
}

type MovieRatedContextType = {
  movieRatedContext: MoviesStateType
  setPage: (value: number) => void
}

const MovieRatedContext = createContext<MovieRatedContextType>({
  movieRatedContext: { movieData: null, error: null, loading: true, page: 1 },
  setPage: () => {},
})

type ChildrenType = {
  children: React.ReactNode
  guestSession: GuestSessionDataType | null
}

const RatingProvider = ({ children, guestSession }: ChildrenType) => {
  const [state, setState] = useState<MoviesStateType>({
    movieData: null,
    error: null,
    loading: true,
    page: 1,
  })

  const updateRatedMovies = async (page: number) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const data = await fetchRatedMoviesData(guestSession, page)
      setState({ movieData: data, error: null, loading: false, page })
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err : null,
        loading: false,
      }))
    }
  }

  useEffect(() => {
    if (guestSession) updateRatedMovies(state.page)
  }, [guestSession, state.page])

  const setPage = (page: number) => updateRatedMovies(page)

  return (
    <MovieRatedContext.Provider value={{ movieRatedContext: state, setPage }}>
      {children}
    </MovieRatedContext.Provider>
  )
}

export const MovieRatedConsumer = MovieRatedContext.Consumer

export default RatingProvider
