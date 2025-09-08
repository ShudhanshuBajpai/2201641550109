import express from 'express';
const router = express.Router();
import validUrl from 'valid-url';
import { URLModel } from '../database/url.schema.js';
import { generateUniqueCode } from '../generateUniqueCode.js';
import dotenv from 'dotenv';
import Log from '../middlewares/loggingMiddleware.js';


dotenv.config();
const baseUrl = process.env.BASE_URL;

router.post('/', async (req, res) => {
  const { longUrl, urlCode } = req.body;

  try {
    if (!validUrl.isUri(longUrl)) {
      await Log("backend", "warn", "handler", `Invalid URL submitted: ${longUrl}`);
      return res.status(401).json({ error: "Invalid Url" });
    }

    if (urlCode) {
      const exisitingShortCode = await URLModel.findOne({ urlCode });
      if (exisitingShortCode) {
        await Log("backend", "warn", "handler", `Duplicate code attempted: ${urlCode}`);
        return res.status(400).json({ error: `Code ${urlCode} already in use. Please choose a different code.` });
      }
    }

    const existingLongURL = await URLModel.findOne({ longUrl });
    if (existingLongURL && !urlCode) {
      await Log("backend", "info", "handler", `Returning existing short URL for ${longUrl}`);
      return res.json({
        urlCode: existingLongURL.urlCode,
        shortUrl: existingLongURL.shortUrl,
      });
    }

    let generatedShortCode = urlCode || await generateUniqueCode();
    const shortUrl = `${baseUrl}${generatedShortCode}`;

    const newURL = new URLModel({
      urlCode: generatedShortCode,
      longUrl,
      shortUrl,
    });

    await newURL.save();

    await Log("backend", "info", "handler", `New short URL created: ${shortUrl} for ${longUrl}`);

    res.status(201).json({
      urlCode: generatedShortCode,
      shortUrl,
    });
  } catch (err) {
    console.error(err);
    await Log("backend", "error", "handler", `URL shortening error: ${err.message}`);
    res.status(500).json('URL Shorten service error');
  }
});

export default router;