const express = require("express");
const path = require("path");
const fs = require("fs");

const uuid = require("./helpers/uuid")

const db = require("./db/db.json")



const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")))

app.get("/api/notes", (req, res) => {
    res.status(200).json(db);
})

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note`);

    // Deconstructing assignment for the items in req.body
    const { title, text } = req.body;

    // Checks if all data is present at submit. 
    if (title && text) {

        // This gets the data in the db JSON file
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json('Error in posting note');
                return;
            }

            const existingData = JSON.parse(data);

            const newNote = {
                title,
                text,
                id: uuid(),
            };

            // This adds the new data to the existing data in the db file. 
            existingData.push(newNote);

            const updatedDataString = JSON.stringify(existingData);


            // This creates a new db file with the contents of the
            fs.writeFile("./db/db.json",
                updatedDataString, (err) =>
                err
                    ? console.error(err)
                    : console.log(
                        `Note has been written to JSON file`
                    )
            );


            const response = {
                status: "success",
                body: newNote,
            };

            console.log(response);
            res.status(201).json(response);
        });
    } else {
        res.status(500).json('Error in posting note');
    }

});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")))

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);