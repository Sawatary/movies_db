import { List, Pagination } from "antd";

import ErrorMessage from "../Error";
import Skelet from "../Skelet";
import { MovieRatedConsumer } from "../../context/RatingContext";
import MovieCard from "../MovieCard";

function RatedTab() {
  return (
    <MovieRatedConsumer>
      {({
        setPage,
        movieRatedContext: { movieData, loading, error, page },
      }) => {
        if (error) return <ErrorMessage message={error.message} />;

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
              <Skelet />
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
}

export default RatedTab;
