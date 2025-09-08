import { URLModel } from "./database/url.schema.js";

const base62Alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateShortId = (length = 6) => {
    let shortId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * base62Alphabet.length);
        shortId += base62Alphabet[randomIndex];
    }
    return shortId;
}

export const generateUniqueCode = async () => {
    let shortId;
    let existingURL;

    while (true) {
        shortId = generateShortId();
        existingURL = await URLModel.findOne({ urlCode: shortId });

        if (!existingURL)
            break;
    }
    return shortId;
};