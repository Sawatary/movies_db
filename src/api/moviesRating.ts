const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json;charset=utf-8",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTAxZTBhODU1ZTZhZjgyNmI2YTQ4NTE2MjIyMDk5YSIsIm5iZiI6MTcyODA4MjA0OS42MDA3MTUsInN1YiI6IjY2ZTg0Y2E2OWRmYmJkZjBlNmQwMTAwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.flmWrrsFwHqwpIKgAdA7c8j1vPRYtHK_ImTroYB04UU",
  },
  body: "",
};

type RatingResponse = {
  success: boolean;
  status_code: number;
  status_message: string;
};

const addRating = async (
  sessionId: string,
  movieId: number,
  value = 0,
): Promise<RatingResponse> => {
  try {
    const newOptions = { ...options, body: JSON.stringify({ value }) };

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`,
      newOptions,
    );

    if (!res.ok) throw new Error("Response not ok");

    const data = (await res.json()) as Promise<RatingResponse>;

    return await data;
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Rating failed! '${error.message}'`);
    return Promise.reject(error);
  }
};

export default addRating;
