import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';

import { setToken } from './store/actions/sessionActions';
import { fetchUser } from './store/actions/userActions';

import Spinner from './components/spinner/spinner';
import LeftSection from './containers/leftSection/leftSection';
import MainSection from './containers/mainSection/mainSection';
import RightSection from './containers/rightSection/rightSection';

import WebPlaybackReact from './spotify/webPlayback';

import { QRCodeSVG } from 'qrcode.react';
import login from './spotify/login';

window.onSpotifyWebPlaybackSDKReady = () => { };


const buildSpotifyAuthUrl = () => {
  const scopes = [
    'streaming',
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-library-modify',
    'user-follow-modify',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-read-playback-position',
    'user-top-read',
    'user-follow-modify',
    'user-follow-read',
  ].join('%20');
  return [
    'https://accounts.spotify.com/authorize',
    `?client_id=${process.env.REACT_APP_CLIENT_ID}`,
    `&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}`,
    `&scope=${scopes}`,
    '&response_type=token',
    '&show_dialog=true',
  ].join('');
};


class App extends Component {
  state = {
    playerLoaded: false,
  };


  async getToken() {
    let hashParams = {};
    let e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    window.location.hash = '';
    let token = hashParams.access_token;
    if (token) {
      login.setToken(token, hashParams.expires_in)
    } else {
      token = await login.getToken();
    }
    this.setState({ token });
    this.props.setToken(token);
    this.props.fetchUser();
  }


  componentDidMount() {
    this.getToken()
  }

  render() {
    if (!this.state.token) {
      const url = buildSpotifyAuthUrl();
      return (<div className='app' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
        <QRCodeSVG size={256} value={url} />
        <a href={url}>点击登录</a>
      </div>)
    }


    let webPlaybackSdkProps = {
      playerName: 'Spotify React Player',
      playerInitialVolume: 1.0,
      playerRefreshRateMs: 1000,
      playerAutoConnect: true,
      onPlayerRequestAccessToken: () => this.state.token,
      onPlayerLoading: () => { },
      onPlayerWaitingForDevice: () => {
        this.setState({ playerLoaded: true });
      },
      onPlayerError: (e) => {
        console.log(e);
      },
      onPlayerDeviceSelected: () => {
        this.setState({ playerLoaded: true });
      },
    };

    return (
      <div className='app'>
        <WebPlaybackReact {...webPlaybackSdkProps}>
          <Spinner loading={!this.state.playerLoaded}>
            <LeftSection />
            <MainSection />
            <RightSection />
          </Spinner>
        </WebPlaybackReact>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.sessionReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token)),
  fetchUser: () => dispatch(fetchUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
