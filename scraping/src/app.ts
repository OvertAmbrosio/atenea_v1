import express, { Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
//importar rutas
import ordenesRoutes from './routes/ordenes.routes'
//configuraciones
dotenv.config();

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/files'),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '_' + file.originalname);
  }
});
//inicializaciones
const app = express();
app.set('port', process.env.PORT || 4000);
app.disable('x-powered-by');
app.get('/', function(req, res:Response) {
  res.send('Hola compa')
});
// app.use(helmet());
app.use(compression( { level: 9 } ));
//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json({limit: '20mb'}));
app.use(multer({storage}).single('file'));
//routes logs
app.get('/api/logger/error', function(req, res) {
  res.sendFile( path.join(__dirname, 'logs/error-log-api.log'))
})
app.get('/api/logger/info', function(req, res) {
  res.sendFile( path.join(__dirname, 'logs/info-log-api.log'))
})
//routes
app.use('/api/ordenes', ordenesRoutes);

export default app;