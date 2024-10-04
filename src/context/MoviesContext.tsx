import { Component, createContext, ReactElement } from "react";

import {
  fetchMoviesData,
  fetchTrendMovies,
  MoviesDataType,
} from "../api/movies";
import { debounce } from "lodash";

type MoviesStateType = {
  movieData: MoviesDataType | null;
  error: Error | null;
  loading: boolean;
  searchValue: string;
  page: number;
};

const initState: MoviesStateType = {
  movieData: null,
  error: null,
  loading: true,
  searchValue: "",
  page: 1,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debouncedFunction = debounce(() => {}, 1500);

type MovieContextType = {
  movieContext: MoviesStateType;
  debouncedSetSearch: typeof debouncedFunction;
  setPage: (value: number) => void;
};

const MovieContext = createContext<MovieContextType>({
  movieContext: initState,
  debouncedSetSearch: debounce(() => {}, 1500),
  setPage: (value) => value,
});

type ChildrenType = { children: ReactElement | ReactElement[] | undefined };

class MovieDataProvider extends Component<ChildrenType, MoviesStateType> {
  debouncedSetSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim())
      this.setState(() => ({
        searchValue: e.target.value,
        loading: true,
      }));
  }, 1500);

  constructor(props: ChildrenType) {
    super(props);

    this.state = initState;
  }

  componentDidMount(): void {
    this.updateTrendMovies();
  }

  componentDidUpdate(
    _prevProps: object,
    prevState: Readonly<MoviesStateType>,
  ): void {
    const { searchValue, page } = this.state;

    if (
      (prevState.searchValue !== searchValue && searchValue.trim()) ||
      (searchValue.trim() && prevState.page !== page)
    ) {
      this.updateFoundMovies(searchValue, page);
    }

    if (
      (!searchValue.trim() && prevState.page !== page) ||
      (prevState.searchValue !== searchValue && !searchValue.trim())
    ) {
      this.updateTrendMovies(page);
    }
  }

  setPage = (value: number) => {
    this.setState(() => ({
      page: value,
      loading: true,
    }));
  };

  updateTrendMovies(p?: number) {
    fetchTrendMovies(p)
      .then((data) => {
        this.setState(() => ({
          movieData: data,
          error: null,
          loading: false,
        }));
      })
      .catch((err) => {
        if (err instanceof Error)
          this.setState(() => ({
            error: err,
            loading: false,
          }));
      });
  }

  updateFoundMovies(q: string, p: number) {
    fetchMoviesData(q, p)
      .then((data) => {
        this.setState(() => ({
          movieData: data,
          error: null,
          loading: false,
        }));
      })
      .catch((err) => {
        if (err instanceof Error)
          this.setState(() => ({
            error: err,
            loading: false,
          }));
      });
  }

  render() {
    const { children } = this.props;
    const { movieData, loading, error, page, searchValue } = this.state;

    return (
      <MovieContext.Provider
        value={{
          movieContext: { movieData, loading, error, page, searchValue },
          debouncedSetSearch: this.debouncedSetSearch,
          setPage: this.setPage,
        }}
      >
        {children}
      </MovieContext.Provider>
    );
  }
}

export const MovieDataConsumer = MovieContext.Consumer;

export default MovieDataProvider;
