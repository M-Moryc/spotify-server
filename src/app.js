import express from 'express'; // Express web server framework
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import io from './websocket.js';
const app = express();
import {router} from './routes/routes.js';

import cors from 'cors';

var corsOptions = {
  origin: 'm-moryc.github.io/spotify-clone/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

const port = process.env.PORT || 3001;

app.set('port', port);
app.use(cookieParser())
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(router)
.use(cors())


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
