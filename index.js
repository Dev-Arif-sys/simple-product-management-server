const express= require('express');
const app=express();
const cors= require('cors')
const { MongoClient }=  require("mongodb");
const port =5000;
const ObjectId=require('mongodb').ObjectId

// userName: myDbUser1
// pass:EEGJ8dqap5ZlUI59



const uri = "mongodb+srv://myDbUser1:EEGJ8dqap5ZlUI59@cluster0.ffgwy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("Products");
      const sellingProduct = database.collection("dailyProduct");
      // create a document to insert
    // get the database
      app.get('/users', async(req,res)=>{
          const cursor= sellingProduct.find({});
          const Products= await cursor.toArray();
          res.send(Products);
       app.get('/users/:id', async(req,res)=>{
           const id=req.params.id
           const query={_id:ObjectId(id)}
           const product=await sellingProduct.findOne(query)
           res.send(product);
         
       })

      app.post('/users', async(req,res)=>{
          const newProduct=req.body;
          const result=await sellingProduct.insertOne(newProduct)
          res.json(result);
      })

    //   update a product
    app.put("/users/:id",async(req,res)=>{

        const id=req.params.id;
        const filter={_id:ObjectId(id)};
        const UpdateProduct=req.body
        const options = { upsert: true };

        const updateDoc={
            $set:{
                name:UpdateProduct.name,
                price:UpdateProduct.price,
                stock:UpdateProduct.stock
            }
        }

        const result=   await sellingProduct.updateOne(filter, updateDoc, options);

      res.json(result)
    })

    // delete a product
    app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};

        const result=await sellingProduct.deleteOne(query)
        res.json(result)
    })
          
      })
     
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);






app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send('server activated')
})

app.listen(port,()=>{
    console.log('server running on port',port);
})