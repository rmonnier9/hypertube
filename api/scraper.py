import requests

keyMovieDb = '92d923e066d13a3034abbbfb0d5ea7ab'
urlYify = 'https://yts.ag/api/v2/list_movies.json'
urlEztv = 'https://eztv.ag/api/get-torrents'

def urlImdbApi(imdbId):
    return "http://www.theimdbapi.org/api/movie?movie_id=" + imdbId
def urlMovieDb(imdbId, lang):
    return "https://api.themoviedb.org/3/find/" + imdbId + "?api_key=" + keyMovieDb + "&language=" + lang + "&external_source=imdb_id"


def movieScraperYify():
    r = requests.get(urlYify)
    data = r.json()["data"]
    movie_count = data["movie_count"]
    limit = 50
    max = 1
    # max = Math.ceil(movieCount / limit)
    for page in range(1, max + 1):
        url = urlYify + "?limit=" + str(limit) + "&page=" + str(page)
        r = requests.get(url)
        movies = r.json()["data"]["movies"]
        i = 1
        for movie in movies:
            torrents = movie["torrents"]
            imdb_code = movie["imdb_code"]
            print(imdb_code, i)
            movieInfos = fetchMovieInfo(torrents, imdb_code)
            i = i + 1



def parse(movieDbEn, movieDbFr, imdbApi):
  # genresEn = parseGenre(MovieDbEn.genre_ids, 'en');
  # genresFr = parseGenre(MovieDbFr.genre_ids, 'fr');
  movie = {}
  movie["title"] = {}
  movie["title"]["en"] = movieDbEn["title"]
  movie["title"]["fr"] = movieDbFr["title"]
  movie["overview"] = {}
  movie["overview"]["en"] = movieDbEn["overview"]
  movie["overview"]["fr"] = movieDbFr["overview"]
  movie["genre"] = {}
  # movie["genre"]["en"] = genresEn;
  # movie.runtime = parseInt(imdbApi.length, 10);
  # movie.director = imdbApi.director;
  # movie.stars = imdbApi.stars;
  # movie.rating = parseFloat(imdbApi.rating);
  # movie.posterLarge = imdbApi.poster.large;
  # movie.thumb = imdbApi.poster.thumb;
  # movie.year = parseInt(imdbApi.year, 10);
  return movie

def fetchTheMovieDBInfo(imdbId, lang):
    r = requests.get(urlMovieDb(imdbId, lang))
    infos = r.json()
    return infos["movie_results"][0]

def fetchImdbApiInfo(imdbId):
    r = requests.get(urlImdbApi(imdbId))
    infos = r.json()
    return infos

def fetchMovieInfo(torrents, imdbId):
    movieDbEn = fetchTheMovieDBInfo(imdbId, 'en')
    movieDbFr = fetchTheMovieDBInfo(imdbId, 'fr')
    imdbInfos = fetchImdbApiInfo(imdbId)
    movieInfos = parse(movieDbEn, movieDbFr, imdbInfos)
    return movieInfos



movieScraperYify()
