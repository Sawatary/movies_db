import { Component, createContext, ReactElement } from "react";

import {
  fetchRatedMoviesData,
  GuestSessionDataType,
  MoviesDataType,
} from "../api/movies";

type MoviesStateType = {
  movieData: MoviesDataType | null;
  error: Error | null;
  loading: boolean;
  page: number;
};

const initState: MoviesStateType = {
  movieData: null,
  error: null,
  loading: true,
  page: 1,
};

type MovieRatedContextType = {
  movieRatedContext: MoviesStateType;
  setPage: (value: number) => void;
};

const MovieRatedContext = createContext<MovieRatedContextType>({
  movieRatedContext: initState,
  setPage: (value) => value,
});

type ChildrenType = {
  children: ReactElement | ReactElement[] | undefined;
  guestSession: GuestSessionDataType | null;
};

class RatingProvider extends Component<ChildrenType, MoviesStateType> {
  constructor(props: ChildrenType) {
    super(props);
    this.state = initState;
  }

  componentDidMount(): void {
    const { guestSession } = this.props;
    this.updateRatedMovies(guestSession);
  }

  componentDidUpdate(
    _prevProps: object,
    prevState: Readonly<MoviesStateType>,
  ): void {
    const { guestSession } = this.props;
    const { page } = this.state;
    if (prevState.page !== page) this.updateRatedMovies(guestSession, page);
  }

  setPage = (value: number) => {
    this.setState(() => ({
      page: value,
      loading: true,
    }));
  };

  updateRatedMovies(guestSession: GuestSessionDataType | null, p?: number) {
    fetchRatedMoviesData(guestSession, p)
      .then((data) => {
        console.log(data);
        this.setState(() => ({
          movieData: data,
          error: null,
          loading: false,
        }));
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Error)
          this.setState(() => ({
            error: err,
            loading: false,
          }));
      });
  }

  render() {
    const { children } = this.props;
    const { movieData, loading, error, page } = this.state;

    return (
      <MovieRatedContext.Provider
        value={{
          movieRatedContext: {
            movieData,
            loading,
            error,
            page,
          },
          setPage: this.setPage,
        }}
      >
        {children}
      </MovieRatedContext.Provider>
    );
  }
}

export const MovieRatedConsumer = MovieRatedContext.Consumer;

export default RatingProvider;
