import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let array = this.state.playlistTracks;
      array.push(track);
      this.setState({playlistTracks: array});
    }
  }

  removeTrack(track){
    let array = this.state.playlistTracks.slice();
    let index = array.indexOf(track);
    array.splice(index, 1);
    this.setState({playlistTracks: array });
      }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track =>{
      return track.uri
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState({
      playlistName: 'New playlist',
      searchResults: []
    })
  }

  search(searchTerm){
    Spotify.search(searchTerm)
      .then(searchResults => this.setState({
        searchResults: searchResults
      }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
            playlistName = {this.state.playlistName}
            playlistTracks = {this.state.playlistTracks}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
            onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
