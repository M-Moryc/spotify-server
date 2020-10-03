import Spotify from 'spotify-web-api-node';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();
const STATE_KEY = 'spotify_auth_state';


let scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'playlist-read-private', "streaming", "user-modify-playback-state"];

const spotifyApi = new Spotify({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);

export function indexRoute(_, res){
    const state = generateRandomString(16);
    res.cookie(STATE_KEY, state);
    res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
}

export function callback(req, res){
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
    // first do state validation
    if (state === null || state !== storedState) {
      res.redirect('/#/error/state mismatch');
    // if the state is valid, get the authorization code and pass it on to the client
    } else {
      res.clearCookie(STATE_KEY);
      // Retrieve an access token and a refresh token
      spotifyApi.authorizationCodeGrant(code).then(data => {
        const { expires_in, access_token, refresh_token } = data.body;
  
  
        // we can also pass the token to the browser to make requests from there
        //res.redirect('http://local')
        res.redirect(`http://localhost:4200/login2/${access_token}/${refresh_token}`);
      }).catch(err => {
        res.redirect('/#/error/invalid token');
      });
    }
  }
export function refreshToken(req, res){
   console.log('trying to refresh')
   spotifyApi.setRefreshToken(req.query.refreshToken);
     spotifyApi.refreshAccessToken().then(
       function(data) {
             console.log('The access token has been refreshed!');
 
         console.log(data.body['access_token']);
         res.status(200).send({token: data.body['access_token']});
       },
       function(err) {
             console.log('Could not refresh access token', err);
         }
     );
 }
export function getUserPlaylists(req, res){
 console.log('getting playlists');
      spotifyApi.setAccessToken(req.query.accessToken);
   spotifyApi.getUserPlaylists( {limit: '50'})
   .then(
     (result) => {
       res.status(200).send(result.body.items);
     }
   )
}
export function getPlaylist(req, res){
    spotifyApi.setAccessToken(req.query.accessToken);
    spotifyApi.getPlaylist(req.query.playlistId)
    .then(
    (result) => {
        res.status(200).send(result.body);
    }
   );
}
export function getPlayer(req, res){
    axios.get('https://api.spotify.com/v1/me/player', {
      headers: { Authorization: `Bearer ${req.query.accessToken}`}
    }).then((result) =>{
      res.send(result.data);
    }).catch(error => {
      console.log(error);
    });
}


