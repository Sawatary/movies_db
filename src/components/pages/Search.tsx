import { Flex, Input, List, Pagination } from "antd";

import ErrorMessage from "../Error";
import MovieCard from "../MovieCard";
import Skelet from "../Skelet";
import { MovieDataConsumer } from "../../context/MoviesContext";

function SearchTab() {
  return (
    <MovieDataConsumer>
      {({
        debouncedSetSearch,
        setPage,
        movieContext: { movieData, loading, error, page },
      }) => {
        if (error) return <ErrorMessage message={error.message} />;
        return (
          <>
            <Flex vertical gap={16} style={{ marginBottom: "1rem" }}>
              <Input
                placeholder="Type Movie title here..."
                style={{ borderRadius: 2 }}
                onChange={(e) => {
                  debouncedSetSearch(e);
                }}
              />
            </Flex>

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

            {!loading ? (
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
            ) : (
              false
            )}
          </>
        );
      }}
    </MovieDataConsumer>
  );
}

export default SearchTab;
