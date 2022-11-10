const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json());

//dentistDB
//ms5lC91lNe7gnQ8i



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wfblndv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
const serviceCollect = client.db('dentalClient').collection('services');
const reviewCollect = client.db('dentalClient').collection('review');
app.get('/services', async(req,res)=>{
    const query = {};
    const cursor = serviceCollect.find(query);
    const services = await cursor.toArray();
    res.send(services);
});

app.post('/addservice',async(req,res)=>{
    const review = req.body;
    const result = await serviceCollect.insertOne(review);
    res.send(result);
});

app.get('/services/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const service = await serviceCollect.findOne(query);
    res.send(service);
});

//review
app.get('/review',async(req,res)=>{
    let query = {};
    if(req.query.email){
        query={
            email:req.query.email
        }
    }
    const cursor = reviewCollect.find(query);
    const review = await cursor.toArray();
    res.send(review);
})
app.post('/review',async(req,res)=>{
    const review = req.body;
    const result = await reviewCollect.insertOne(review);
    res.send(result);
});

app.delete('/review/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await reviewCollect.deleteOne(query);
    res.send(result);
});


app.patch('/review/:id',async(req,res)=>{
    const id = req.params.id;
    const status = req.body.status;
    const query = {_id:ObjectId(id)};
    const updatedDoc = {
        $set:{
              status : status
        }
    }
    const result = await reviewCollect.updateOne(query,updatedDoc);
    res.send(result);
})

}finally{

}
}
run().catch(err=>console.error(err))


app.get('/',(req,res)=>{
    res.send('dental point running')
})

app.listen(port,()=>{
    console.log(`point is running on ${port}`)
})