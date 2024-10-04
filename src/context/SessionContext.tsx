import { Component, createContext, ReactElement } from "react";

import { createGuestSession, GuestSessionDataType } from "../api/movies";

type SessionProviderStateType = {
  guestSessionData: GuestSessionDataType | null;
  ratedMovies: Map<string, number>;
};

type SessionContextType = {
  guestSessionData: GuestSessionDataType | null;
  getRateById: (id: number) => number | undefined;
  setRateById: (id: number, rate: number) => void;
};

const initState = {
  guestSessionData: null,
  ratedMovies: new Map<string, number>(),
  getRateById: () => undefined,
  setRateById: () => {},
};

export const SessionContext = createContext<SessionContextType>(initState);

type ChildrenType = { children: ReactElement | ReactElement[] | undefined };

class SessionProvider extends Component<
  ChildrenType,
  SessionProviderStateType
> {
  constructor(props: ChildrenType) {
    super(props);

    this.state = initState;
  }

  componentDidMount() {
    if (sessionStorage.length) {
      const guestSessionData = sessionStorage.getItem("guestSessionData");
      const ratedMovies = sessionStorage.getItem("ratedMovies");

      if (guestSessionData) {
        this.setState(() => ({
          guestSessionData: JSON.parse(
            guestSessionData,
          ) as GuestSessionDataType,
        }));
      }
      if (ratedMovies) {
        this.setState(() => ({
          ratedMovies: new Map<string, number>(
            Object.entries(
              JSON.parse(ratedMovies) as ArrayLike<number>,
            ) as Iterable<readonly [string, number]>,
          ),
        }));
      }
      if (guestSessionData) return;
    }

    createGuestSession()
      .then((result) => {
        this.setState(() => ({
          guestSessionData: result,
        }));
        sessionStorage.setItem("guestSessionData", JSON.stringify(result));
      })
      .catch((err) => {
        throw new Error(`GUEST ${String(err)}`);
      });
  }

  componentDidUpdate(): void {
    const { ratedMovies } = this.state;

    sessionStorage.setItem(
      "ratedMovies",
      JSON.stringify(Object.fromEntries(ratedMovies)),
    );
  }

  getRateById = (id: number) => {
    const { ratedMovies } = this.state;
    return ratedMovies.get(`${id}`);
  };

  setRateById = (id: number, rate: number) => {
    const { ratedMovies } = this.state;
    ratedMovies.set(`${id}`, rate);
    this.setState(() => ({
      ratedMovies,
    }));
  };

  render() {
    const { children } = this.props;
    const { guestSessionData } = this.state;

    return (
      <SessionContext.Provider
        value={{
          guestSessionData,
          getRateById: this.getRateById,
          setRateById: this.setRateById,
        }}
      >
        {children}
      </SessionContext.Provider>
    );
  }
}

export const SessionConsumer = SessionContext.Consumer;

export default SessionProvider;
