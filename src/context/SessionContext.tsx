import {
  createContext,
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { createGuestSession, GuestSessionDataType } from '../api/movies'

type SessionProviderStateType = {
  guestSessionData: GuestSessionDataType | null
  ratedMovies: Map<string, number>
}

type SessionContextType = {
  guestSessionData: GuestSessionDataType | null
  getRateById: (id: number) => number | undefined
  setRateById: (id: number, rate: number) => void
}

export const SessionContext = createContext<SessionContextType>({
  guestSessionData: null,
  getRateById: () => undefined,
  setRateById: () => {},
})

type ChildrenType = { children: ReactElement | ReactElement[] | undefined }

const SessionProvider = ({ children }: ChildrenType) => {
  const [state, setState] = useState<SessionProviderStateType>({
    guestSessionData: null,
    ratedMovies: new Map<string, number>(),
  })

  useEffect(() => {
    const storedGuestSessionData = sessionStorage.getItem('guestSessionData')
    const storedRatedMovies = sessionStorage.getItem('ratedMovies')

    if (storedGuestSessionData) {
      setState((prev) => ({
        ...prev,
        guestSessionData: JSON.parse(
          storedGuestSessionData
        ) as GuestSessionDataType,
      }))
    }

    if (storedRatedMovies) {
      setState((prev) => ({
        ...prev,
        ratedMovies: new Map<string, number>(
          Object.entries(JSON.parse(storedRatedMovies))
        ),
      }))
    }

    if (!storedGuestSessionData) {
      createGuestSession()
        .then((result) => {
          setState((prev) => ({
            ...prev,
            guestSessionData: result,
          }))
          sessionStorage.setItem('guestSessionData', JSON.stringify(result))
        })
        .catch((err) => {
          throw new Error(`GUEST ${String(err)}`)
        })
    }
  }, [])

  useEffect(() => {
    if (state.ratedMovies.size) {
      sessionStorage.setItem(
        'ratedMovies',
        JSON.stringify(Object.fromEntries(state.ratedMovies))
      )
    }
  }, [state.ratedMovies])

  const getRateById = useCallback(
    (id: number) => state.ratedMovies.get(`${id}`),
    [state.ratedMovies]
  )

  const setRateById = useCallback((id: number, rate: number) => {
    setState((prev) => {
      const updatedMovies = new Map(prev.ratedMovies)
      updatedMovies.set(`${id}`, rate)
      return { ...prev, ratedMovies: updatedMovies }
    })
  }, [])

  return (
    <SessionContext.Provider
      value={{
        guestSessionData: state.guestSessionData,
        getRateById,
        setRateById,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const SessionConsumer = SessionContext.Consumer
export default SessionProvider
