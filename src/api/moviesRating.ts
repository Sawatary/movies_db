const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZDcyNWNkY2NhN2ViMTA0NWQ1MmM2ZWNkMzBlOTVlNiIsIm5iZiI6MTcyMjUwNTk4Ny4xMTQ5NzEsInN1YiI6IjY2OWU0MjJmNzk0ZDFkZjgwYzUwMjI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Accj3iZ0aXgp92JYPkeeeQtQH3CDVqPKiV0k0IrfUJQ',
  },
  body: '',
}

type RatingResponse = {
  success: boolean
  status_code: number
  status_message: string
}

const addRating = async (
  sessionId: string,
  movieId: number,
  value = 0
): Promise<RatingResponse> => {
  try {
    const newOptions = { ...options, body: JSON.stringify({ value }) }

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`,
      newOptions
    )

    if (!res.ok) throw new Error('Response not ok')

    const data = (await res.json()) as Promise<RatingResponse>

    return await data
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Rating failed! '${error.message}'`)
    return Promise.reject(error)
  }
}

export default addRating
