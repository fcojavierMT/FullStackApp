const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
  } catch (err) {
    res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  const posts = await loadPostsCollection();

  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date()
  });

  res.status(201).send();
});

router.delete('/:id', async (req, res) => {
  try {
    const posts = await loadPostsCollection();
    await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

async function loadPostsCollection() {
  try {
    const client = await mongodb.MongoClient.connect(
      'mongodb+srv://exampleUser214:exampleUser214@fullstackapp-hbxp4.mongodb.net/test?retryWrites=true',
      { useNewUrlParser: true }
    );
    return client.db('FullStackApp').collection('posts');
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
