import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import redirect from './controllers/redirect.js';
import urlRedirect from './controllers/urlRedirect.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ Message: 'Logged in' });
  });

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    try {
      await connect();
      console.log(`Server is running on PORT : ${PORT}`);
    } catch (error) {
      console.log(error.message);
    }
  });

app.use('/', redirect);
app.use('/api/shorten', urlRedirect);

export default app;