const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const serverless = require("serverless-http");

app.use(cors({ credentials: true, origin: true }));
const router = express.Router();

app.use("/.netlify/functions/server", router);
app.use(express.json());

const port = 3000;

// Fetch from json db
router.get("/api/notes", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "", "db.json"));
  } catch {
    res.sendStatus(500);
  }
});

// eslint-disable-next-line no-unused-vars
router.patch("/api/update", (req, res) => {
  try {
    let data = getData();
    let noteItem;
    data.notes.filter((item) => {
      if (item.id === req.body.id) {
        item.note = req.body.note;
        noteItem = item;
      }
    });
    fs.writeFileSync(path.resolve(__dirname, "db.json"), JSON.stringify(data));
    res.send({ item: noteItem });
  } catch {
    res.sendStatus(500);
  }
});

function getData() {
  const accounts = () =>
    fs.readFileSync(__dirname + "/db.json", { endoding: "utf8" });
  const accRead = JSON.parse(accounts());
  return accRead;
}

// Remove Item
// eslint-disable-next-line no-unused-vars
router.delete("/api/removeitem", (req, res) => {
  try {
    let data = getData();

    let deleteIndex = data.notes.findIndex((item) => item.id === req.body.id);
    data.notes.splice(deleteIndex, 1);

    fs.writeFileSync(path.resolve(__dirname, "db.json"), JSON.stringify(data));
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});
// Remove Tag
// eslint-disable-next-line no-unused-vars
router.delete("/api/removetag", (req, res) => {
  try {
    let data = getData();
    let index = req.body.tagIndex;
    data.tags.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, "db.json"), JSON.stringify(data));
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

// Add Note
// eslint-disable-next-line no-unused-vars
router.post("/api/add", (req, res) => {
  try {
    let data = getData();
    data.notes.unshift(req.body.obj);
    fs.writeFileSync(path.resolve(__dirname, "db.json"), JSON.stringify(data));
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
});

// Add Tag
// eslint-disable-next-line no-unused-vars
router.put("/api/addtag", (req, res) => {
  try {
    let data = getData();
    data.tags = [...new Set([...data.tags, ...req.body.tags])];
    fs.writeFileSync(path.resolve(__dirname, "db.json"), JSON.stringify(data));
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// module.exports = app;
// module.exports.handler = serverless(app);

// Export lambda handler
const handler = serverless(app);
exports.handler = async (event, context) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};
