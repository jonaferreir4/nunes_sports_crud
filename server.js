const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'nunes_sports';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

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


app.post('/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await db.collection('products').insertOne(newProduct);
    newProduct._id = result.insertedId;
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    res.status(500).json({ message: 'Erro interno ao adicionar produto' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar produto' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount > 0) {
      res.status(204).json()

    } else {
      res.status(404).json()

    }
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json()
  }
});

app.get('/products/search', async (req, res) => {
  try {
    const searchTerm = req.query.name;
    const products = await db.collection('products').find({ productName: { $regex: searchTerm, $options: 'i' } }).toArray();
    res.json(products);
  } catch (error) {
    console.error('Erro ao pesquisar produtos:', error);
    res.status(500).json({ message: 'Erro interno ao pesquisar produtos' });
  }
});


app.get('/products', async (req, res) => {
  try {
    const products = await db.collection('products').find({}).toArray()
    res.json(products)
  } catch(error) {
    console.error("Erro ao listar os produtos", error)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
