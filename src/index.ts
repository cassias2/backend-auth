import { config } from 'dotenv';
import express, { Application } from 'express';
import cors from './middlewares/cors';
import routes from './routes';

// dot env file setup
config();
const app: Application = express();


// Allows JSON data to be understood
app.use(express.json());
// Cors middleware
app.use(cors);
// Routes
app.use(routes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});