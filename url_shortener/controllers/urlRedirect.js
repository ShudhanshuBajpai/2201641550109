import express from 'express';
const router = express.Router();
import validUrl from 'valid-url';
import { URLModel } from '../database/url.schema.js';
import { generateUniqueCode } from '../generateUniqueCode.js';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.BASE_URL;

router.post('/', async (req, res) => {
    const { longUrl, urlCode } = req.body;

    try {
      if (!validUrl.isUri(longUrl)) {
        return res.status(401).json({ error: "Invalid Url" });
      }

      if (urlCode) {
        const exisitingShortCode = await URLModel.findOne({ urlCode });

        if (exisitingShortCode) {
          return res.status(400).json({ error: `Code ${urlCode} already in use. Please choose a different code.` });
        }
      }

      const existingLongURL = await URLModel.findOne({ longUrl });
      if (existingLongURL && !urlCode) {
        return res.json({ 
          urlCode: existingLongURL.urlCode,
          shortUrl: existingLongURL.shortUrl
        });
      }

      let generatedShortCode;
      if (!urlCode) {
        generatedShortCode = await generateUniqueCode();
      } else {
        generatedShortCode = urlCode;
      }
      const shortUrl = `${baseUrl}${generatedShortCode}`;

      const newURL = new URLModel({
        urlCode: generatedShortCode,
        longUrl,
        shortUrl,
      });
      await newURL.save();

      res.status(201).json({
        urlCode: generatedShortCode,
        shortUrl
      });
  } catch (err) {
    console.error(err);
    res.status(500).json('URL Shorten service error');
  }
});

export default router;

