const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s88xr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db(`${process.env.DB_NAME}`);
        const productCollection = database.collection(`${process.env.DB_COLLECTION1}`);
        const categoryCollection = database.collection(`${process.env.DB_COLLECTION2}`);
        const orderCollection = database.collection(`${process.env.DB_COLLECTION3}`);
        const userCollection = database.collection(`${process.env.DB_COLLECTION4}`);

        //GET API
        //For fetching all the food items
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});            
            const products = await cursor.toArray();
            res.send(products);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})