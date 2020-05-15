const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();

const router = express.Router();

// get posts
router.get("/", async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({ deleted: false }).toArray());
});

// add posts
router.post("/", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.insertOne({
    title: req.body.title,
    text: req.body.text,
    deleted: false,
    userName: "",
    createdAt: new Date()
  });
  res.status(201).send();
});

// delete posts
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.updateOne(
    { _id: new mongodb.ObjectID(req.params.id) },
    { $set: { deleted: true } }
  );
  res.status(200).send();
});

// update posts

// connect to mongodb
async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-fzniu.mongodb.net/vueblog?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  return client.db("vueblog").collection("posts");
}

module.exports = router;
