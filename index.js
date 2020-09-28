// import express from 'express'; // ES2015 modules, not supported by default by all versions of node
const express = require("express"); // CommonJS modules

const server = express();

// needed to teach express how to read JSON data from req.body
server.use(express.json()); // remember to invoke json()

server.get("/", (req, res) => {
    // always return the correct http status code based on the operation performed
    res.status(200).json({ hello: "Node 34" });
});

let users = [
    {
        id: 1, // hint: use the shortid npm package to generate it
        name: "Jane Doe", // String, required
        bio: "Not Tarzan's Wife, another Jane",  // String, required
      },
];
let nextId = 2; // hack, not needed when we start using databases

// GET /users
server.get("/api/users", (req, res) => {
    res.status(200).json({ data: users });
});

server.get("/api/users/:id", (req,res) => {
    const id = Number(req.params.id);
    const user = users.find(u=>u.id === id)
    if(user){
        res.status(200).json({data:user})
    }
    else{
        res.status(404).json({error: "user with the specific id does not exist"})
    }
})

// POST /users -> add a lesson to the users array -> respond with the users array
server.post("/api/users", function (req, res) {
    // client will axios.post('https://api.com/users', data);
    const data = req.body;

    if(data.name === undefined || data.bio === undefined){
        res.status(400).json({error : "Please provide name and bio for the user"})
    }
    else{
        users.push({ id: nextId++, ...data });

        res.status(201).json({ data: users });
    }
   
});

server.put("/api/users/:id", (req, res) => {
    

    const id = Number(req.params.id);
    const changes = req.body;

    const found = users.find(l => l.id === id);

    if (found) {
        Object.assign(found, changes);

        res.status(200).json({ data: users });
    } else {
        res.status(404).json({ message: "users not found" });
    }
});

server.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const found = users.find(l => l.id === id)
    users = users.filter(l => l.id !== id);
    if(found){

        res.status(200).json({ data: users });
    }
    else{
        res.status(404).json({message: "user with that id not found"})
    }
});

const port = 5000;
server.listen(port, () => console.log("api running"));

// npm run server
