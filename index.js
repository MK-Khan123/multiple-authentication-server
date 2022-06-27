const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const registeredUserCollection = database.collection(`${process.env.DB_COLLECTION3}`);

        //GET API
        //For fetching all the products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        //For fetching all the registered users
        app.get('/registeredUsers', async (req, res) => {
            const cursor = registeredUserCollection.find({});
            const registeredUsers = await cursor.toArray();
            res.send(registeredUsers);
        });

        //For fetching a particular emailId
        app.get('/email/:emailId', async (req, res) => {
            const emailId = req.params.emailId;
            const query = { email: emailId }
            const cursor = registeredUserCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        //For fetching all the categories
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find({});
            const categories = await cursor.toArray();
            res.send(categories);
        });

        //POST API
        //For storing registered user data
        app.post('/registeredUser', async (req, res) => {
            const newUser = req.body;
            const newUserEmail = req.body.email;
            const query = { email: newUserEmail }
            const cursor = registeredUserCollection.find(query);
            const result = await cursor.toArray();
            if (result.length === 1) {
                res.json("The email already registered");
            } else {
                const response = await registeredUserCollection.insertOne(newUser);
                res.json(response);
            }
        });

        // For adding category
        app.post('/category', async (req, res) => {
            const newCategory = req.body;
            const result = await categoryCollection.insertOne(newCategory);
            res.json(result);
        });

        //For adding product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.json(result);
        });

        //For filtering registered users using email and phone number
        app.post('/filter', async (req, res) => {
            const { phone, email } = req.body;
            const query = { phone: phone, email: email }
            const filter = registeredUserCollection.find(query);
            const filteredData = await filter.toArray();
            res.send(filteredData);
        });

        //PATCH API
        // To edit the role of registered users (admin or user)
        app.patch('/editRole/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUserRole = req.body.role;
            const filter = { _id: ObjectId(id) };
            const action = {
                $set: { role: updatedUserRole }
            };
            const result = await registeredUserCollection.updateOne(filter, action);
            res.send(result.modifiedCount > 0);
        });

        //DELETE API
        //Delete a single category
        app.delete('/deleteCategory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await categoryCollection.deleteOne(query);
            res.json(result);
        });

        //Delete a single product
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
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