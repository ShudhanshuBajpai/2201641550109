import express from 'express';
const router = express.Router();
import { URLModel } from '../database/url.schema.js';
import Log from '../../logging_middleware/loggingmiddleware.js';


router.get('/:code', async (req, res) => {
  try {
    const reqUrlCode = req.params.code;

    const url = await URLModel.findOne({ urlCode: reqUrlCode });

    if (url) {
      url.hitCount += 1;
      await url.save();

      await Log("backend", "info", "controller", `Redirected code: ${reqUrlCode} to ${url.longUrl}`);
      return res.redirect(url.longUrl);
    } else {
      await Log("backend", "warn", "controller", `Redirect request failed: Code ${reqUrlCode} not found`);
      return res.status(404).json('No URL Found');
    }
  } catch (err) {
    console.error(err);
    await Log("backend", "error", "controller", `Redirect error: ${err.message}`);
    res.status(500).json('Server Error');
  }
});

export default router;

