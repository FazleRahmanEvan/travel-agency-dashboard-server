const express = require('express')
const cors = require('cors');
const jwt = require ('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gboeax5.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
     
      if (err) {
          
          return res.status(403).send({ message: 'Forbidden access' })
      }
      // console.log(decoded)
      req.decoded = decoded;

      next();
  });
}





async function run(){

    try{
      // await client.connect();

        console.log('Data Connected')

        const countryCollection = client.db('travel_agency_dashboard').collection('country');
        const universityCollection = client.db('travel_agency_dashboard').collection('university');
        const courseCollection = client.db('travel_agency_dashboard').collection('course');
        const sourceCollection = client.db('travel_agency_dashboard').collection('source');
        const statusCollection = client.db('travel_agency_dashboard').collection('status');
        const studentCollection = client.db('travel_agency_dashboard').collection('student');
        const weightageCollection = client.db('travel_agency_dashboard').collection('weightage');
        const leedsCollection = client.db('travel_agency_dashboard').collection('leeds');
        const userCollection = client.db('travel_agency_dashboard').collection('user');
        const attendenceCollection = client.db('travel_agency_dashboard').collection('attendence');


        
        app.get('/user',  async(req, res)=> {
          const users = await userCollection.find().toArray();
          res.send(users);
        })


        app.get('/admin/:email', async(req,res) => {
          const email = req.params.email;
          const user =await userCollection.findOne({email:email});
          const isAdmin = user.role === 'admin';
          res.send({admin: isAdmin})
      })



        app.put('/user/admin/:email',verifyJWT,  async(req,res) => {
          const email =req.params.email;
         const requester = req.decoded.email;
         const requesterAccount = await userCollection.findOne({email:requester});
         if(requesterAccount.role ==='admin'){
          const filter={email:email};
          const updateDoc ={
            $set: {role: 'admin'},
          };
          const result =await userCollection.updateOne(filter,updateDoc);
          res.send(result);
         }
         else{
          res.status(403).send({message:'forbiden'});
         }
        })


        
        app.get('/user/:email', async(req,res) => {
          const email = req.params.email;
          const users =await userCollection.findOne({email:email});
          const isUsers = users.role === 'users';
          res.send({users: isUsers})
      })



        app.put('/user/:email',  async(req,res) => {
          const email =req.params.email;
          const user = req.body;
          const filter={email:email};
          const options ={upsert:true};
          const updateDoc ={
            $set: user,
          };
          const result =await userCollection.updateOne(filter,updateDoc, options);
          const token =jwt.sign({email:email}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1hr' });
          res.send({result, token});
        })



        app.delete('/user/:email', async (req,res)=> {
          const email = req.params.email;
          console.log(email); 
          const filter ={email:email}
          const result = await userCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })





        app.get('/country', async (req,res)=>{      
             const query = {};
             const cursor =  countryCollection.find(query);
            const country= await cursor.toArray();
            res.send(country);
        });



        app.post('/country', async (req,res)=> {
          const countryName = req.body.countryName; 
          const result = await countryCollection.insertOne({countryName});
          console.log(result);
          return res.status(201).send(result);          
        })



        app.delete('/country/:_id', async (req,res)=> {
          const id = req.params._id;
          console.log(id); 
          const filter ={_id: ObjectId(id)}
          const result = await countryCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })





        app.post('/university', async (req,res)=> {
      
          const universityName = req.body.universityName; 

          const result = await universityCollection.insertOne({universityName});
          console.log(result);
          return res.status(201).send(result);          
        })



        app.get('/university', async (req,res)=>{      
          const query = {};
          const university = await universityCollection.find(query).toArray();
            res.send(university);
        });



        
        app.delete('/university/:_id', async (req,res)=> {
          const id = req.params._id;
          console.log(id); 
          const filter ={_id: ObjectId(id)}
          const result = await universityCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })






        app.post('/course', async (req,res)=> {
       
          const courseName = req.body.courseName; 

          const result = await courseCollection.insertOne({courseName});
          console.log(result);
          return res.status(201).send(result);          
        })



        app.get('/course', async (req,res)=>{      
          const query = {};
          const course = await courseCollection.find(query).toArray();
            res.send(course);
        });


        app.delete('/course/:_id', async (req,res)=> {
          const id = req.params._id;
          console.log(id); 
          const filter ={_id: ObjectId(id)}
          const result = await courseCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })





        app.post('/source', async (req,res)=> {
        
          const sourceName = req.body.sourceName; 

          const result = await sourceCollection.insertOne({sourceName});
          console.log(result);
          return res.status(201).send(result);          
        })



        app.get('/source', async (req,res)=>{      
          const query = {};
          const source = await sourceCollection.find(query).toArray();
            res.send(source);
        });


        app.delete('/source/:_id', async (req,res)=> {
          const id = req.params._id;
          console.log(id); 
          const filter ={_id: ObjectId(id)}
          const result = await sourceCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })




        app.post('/status', async (req,res)=> {
         
          const statusName = req.body.statusName; 

          const result = await statusCollection.insertOne({statusName});
          console.log(result);
          return res.status(201).send(result);          
        })



        app.get('/status', async (req,res)=>{      
          const query = {};
          const status = await statusCollection.find(query).toArray();
            res.send(status);
        });


        app.delete('/status/:_id', async (req,res)=> {
          const id = req.params._id;
          console.log(id); 
          const filter ={_id: ObjectId(id)}
          const result = await statusCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })





        app.post('/student', async (req,res)=> {
          const studentName = req.body.studentName; 

          const result = await studentCollection.insertOne({studentName});
          console.log(result);
          return res.status(201).send(result);          
        })



        app.get('/student', async (req,res)=>{      
          const query = {};
          const student = await studentCollection.find(query).toArray();
            res.send(student);
        });


        app.delete('/student/:_id', async (req,res)=> {
          const id = req.params._id;
          console.log(id); 
          const filter ={_id: ObjectId(id)}
          const result = await studentCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })






        app.post('/weightage', async (req,res)=> {
          
          const weightageName = req.body.weightageName; 
          const result = await weightageCollection.insertOne({weightageName});
          console.log(result);
          return res.status(201).send(result);          
        })



        app.get('/weightage', async (req,res)=>{      
          const query = {};
          const weightage = await weightageCollection.find(query).toArray();
            res.send(weightage);
        });



        app.delete('/weightage/:_id', async (req,res)=> {
          const id = req.params._id;
          console.log(id); 
          const filter ={_id: ObjectId(id)}
          const result = await weightageCollection.deleteOne(filter);
          console.log(result);
          res.send(result);        
        })




        app.post('/leeds', async (req, res)=> {
         const resp = await leedsCollection.insertOne({...req.body});
         res.send(resp)
      })


        app.get('/leeds', async (req, res)=> {
         const result = await leedsCollection.find().toArray();
         res.send(result)
      })
      

      app.get('/leeds/:_id', async (req,res)=> {
        const id = req.params._id;
        console.log(id); 
        const filter ={_id: ObjectId(id)}
        const result = await leedsCollection.findOne(filter);
        console.log(result);
        res.send(result);        
      })

      
      app.delete('/leeds/:_id', async (req,res)=> {
        const id = req.params._id;
        console.log(id); 
        const filter ={_id: ObjectId(id)}
        const result = await leedsCollection.deleteOne(filter);
        console.log(result);
        res.send(result);        
      })

      app.get("/attendence", async (req, res) => {
        const list = await attendenceCollection.find().toArray();

        res.send(list);
      })
      app.put('/attendence', async (req, res) => {

        const body = req.body;
        

        const user = await attendenceCollection.updateOne({_id: ObjectId(body._id)}, {$set: { clockOut: body.clockOut}})
        
        res.send(user);
      })

      app.post('/attendence', async (req, res) => {
        const body = req.body;
        const user = await attendenceCollection.insertOne(body);

        res.send(user);
      })

      
       

    }


    finally {

    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Travel Agency')
})

app.listen(port, () => {
  console.log('Travel Agency app listening on port', port);
})