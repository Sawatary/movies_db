import { List, Pagination } from "antd";

import { MovieRatedConsumer } from "../../context/RatingContext";
import LoadingPage from "../LoadingPage";
import MovieCard from "../MovieCard";

const Rated = () => {
  return (
    <MovieRatedConsumer>
      {({ setPage, movieRatedContext: { movieData, loading, page } }) => {
        return (
          <>
            {!loading ? (
              <List
                itemLayout="vertical"
                grid={{ gutter: 24, column: 2, md: 2, sm: 1, xs: 1 }}
                dataSource={movieData?.results}
                renderItem={(item) => <MovieCard movie={item} />}
              />
            ) : (
              <LoadingPage />
            )}
            <Pagination
              onChange={setPage}
              showSizeChanger={false}
              defaultPageSize={1}
              defaultCurrent={page}
              total={
                Number(movieData?.total_pages) > 500
                  ? 500
                  : movieData?.total_pages
              }
              align="center"
            />
          </>
        );
      }}
    </MovieRatedConsumer>
  );
};

export default Rated;
