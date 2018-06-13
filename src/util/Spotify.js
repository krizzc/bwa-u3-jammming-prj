const clientId = '81b64a8a41e94c4297883cfeee3b0c1c';
const redirect = 'http://tatramaco.surge.sh/';
let accessToken = '';
let expiresIn = '';


const Spotify = {
  getAccesstoken() {
    if(accessToken){
      return accessToken;
    }
      const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
      const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if(urlAccessToken && urlExpiresIn){
        accessToken = urlAccessToken[1];
        expiresIn = urlExpiresIn[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect}`;
    }
  },

  search(searchTerm) {
    let accessToken = this.getAccesstoken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm.replace(' ', '%20')}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Search failed!');
    }, networkError => console.log(networkError.message)
    )
    .then(jsonResponse => {
      if(!jsonResponse.tracks) return[];
        return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      });
    });
  },

  savePlaylist(playlistName, trackURIs){
    if (!playlistName || !trackURIs) {
      return;
    }
    let accessToken = this.getAccesstoken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
  //  let userId;
  //  let playlistId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers})
      .then(response => {
        if (response.ok){
          return response.json();
        }
        throw new Error('Name Query Failed!');
      }, networkError => console.log(networkError.message)
    )
    .then (jsonResponse => {
      this.userId = jsonResponse.id;

      fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
           name: playlistName
          })
        })
        .then(response => {
          if (response.ok) {
             return response.json();
           }
           throw new Error('Post Request failed!');
          }, networkError => console.log(networkError.message)
        )
        .then (jsonResponse => {
          this.playlistId = jsonResponse.id;

          fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists/${this.playlistId}/tracks`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                uris: trackURIs
              })
            });
        });
    })
  }
}

export default Spotify;
