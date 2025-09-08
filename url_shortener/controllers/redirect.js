import express from 'express';
const router = express.Router();
import { URLModel } from '../database/url.schema.js';

router.get('/:code', async (req, res) => {
  try {
    const reqUrlCode = req.params.code;

    const url = await URLModel.findOne({
      urlCode: reqUrlCode
    });
    
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json('No URL Found');
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

export default router;