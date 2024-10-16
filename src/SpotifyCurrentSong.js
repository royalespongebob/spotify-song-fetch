import { useEffect, useState } from 'react';
import getCurrentSongData from './SpotifyAPI';

export const SpotifyCurrentSong = () => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState({});

  useEffect(() => {
    Promise.all([
      getCurrentSongData()
    ]).then((responses) => {
      setResponse(responses[0]);
      setLoading(false);
    })
  })

  // var storedReply = {
  //   title: response.title,
  //   artist: response.artist,
  //   albumImageUrl: response.albumImageUrl,
  //   songUrl: response.songUrl
  // };

  // getCurrentSongData().then(() => {
  //   if (response === false || Object.keys(response).length === 0) {
  //     return;
  //   } else {
  //     localStorage.setItem('lastlyPlayed', JSON.stringify(storedReply));
  //   }
  // })

  const lastResponse = JSON.parse(localStorage.getItem('lastlyPlayed'));

  function convertTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let extraSeconds = seconds % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    extraSeconds = extraSeconds < 10 ? '0' + extraSeconds : extraSeconds;
    return `${minutes}:${extraSeconds}`;
  }

  const progressBar = {
    width: `${((response.trackProgress / response.trackLength) * 100)}%`
  }

  const songIsPlaying = response.isPlaying;

  return (
    <div className="songContainer">

      {loading && <p>Loading...</p>}

      {/* {!loading && !songIsPlaying && (
        <div>
          <div>
            <img
              src={lastResponse.albumImageUrl}
              alt={`${lastResponse.title} album cover`}
            />
            <p><a href={lastResponse.songUrl} target="_blank" rel="noreferrer">{lastResponse.title}</a></p>
            <p>{lastResponse.artist}</p>
            <p>Lastly played song</p>
          </div>
        </div>
      )} */}

      {!loading && songIsPlaying && (
        <div>
          <div>
            <img
              src={response.albumImageUrl}
              alt={`${response.title} album cover`}
            />
            <p><a href={response.songUrl} target="_blank" rel="noreferrer">{response.title}</a></p>
            <p>{response.artist}</p>
            <p>{convertTime(response.trackProgress)} / {convertTime(response.trackLength)}</p>
          </div>
          <div className="full-bar">
            <div className="progress-bar" style={progressBar}></div>
          </div>
        </div>
      )}
    </div>
  )
}