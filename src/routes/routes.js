import express from 'express'; // Express web server framework
import { callback, getPlaylist, getUserPlaylists, indexRoute, refreshToken, getPlayer } from '../controllers/controllers.js';

const router = new express.Router();

router.get('/', indexRoute);
router.get('/callback', callback);
router.get('/refresh_token', refreshToken);
router.get('/get_user_playlists', getUserPlaylists);
router.get('/get_playlist', getPlaylist);
router.get('/get_player', getPlayer);

export { router };
