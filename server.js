const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'nunes_sports';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public', { 'Content-Type': 'application/javascript' }));

let db;

(async () => {
  try {
    const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Conectado ao MongoDB');
    db = client.db(DB_NAME);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
})();

app.get('/products', async (req, res) => {
  const products = await db.collection('products').find().toArray();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const newProduct = req.body;
  const result = await db.collection('products').insertOne(newProduct);
  newProduct._id = result.insertedId;
  res.status(201).json(newProduct);
});

app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  const result = await db.collection('products').updateOne(
    { _id: ObjectId(productId) },
    { $set: updatedProduct }
  );

  if (result.modifiedCount > 0) {
    res.json({ ...updatedProduct, _id: ObjectId(productId) });
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const result = await db.collection('products').deleteOne({ _id: ObjectId(productId) });

  if (result.deletedCount > 0) {
    res.json({ message: 'Produto deletado com sucesso' });
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
