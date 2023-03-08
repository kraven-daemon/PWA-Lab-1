"use strict";
import express from "express";
import { v4 } from "uuid";
import 'web-push';
import { writeFile, readFile } from "fs/promises";

import cors from "cors";

const PORT = 5555;
const STATIC = './dist/moovie';
const app = express();

app.use(cors(
    { origin: '*' }
));

app.use('/', (req, _, next) => {
    console.log(req.url);
    next();
});
app.use('/', express.static(STATIC));

/////////////////// fake db
const getNewUUID = () => {
    const curr = v4();
    return curr.slice(0, curr.match('-').index);
}
const loadJSON = async (filename) => {
    return JSON.parse(
        await readFile(
            new URL(`../database/${filename}`, import.meta.url)
        ));
}

const loadCurrentVersion = async () => {
    try {
        const version = await loadJSON('current.json');
        const data = await loadJSON(`db_${version.current}.json`)
        console.log(`Success running version : ${version.current}`)
        return data;
    } catch (err) {
        console.error("Fake database is broken : \n\t", err.message)
        process.exit(1);
    }
}
///////////////////
//
app.get('/api/movies', async (_, res) => {
    res.status(200).json(await loadCurrentVersion());
})

app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT);
});

