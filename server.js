const express = require("express");
const app = express();
const pool = require("./database.js");
const cors  = require("cors");
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

// create new user
app.post("/add-member", async (req,res)=>{
	try{
		const {name,email,gender} = req.body;
		const properName = name[0].toUpperCase() + name.slice(1,name.length);
		const newMember = await pool.query(
			"INSERT INTO members (name,email,gender) VALUES($1,$2,$3) RETURNING *",
			[properName,email,gender] );
		res.json(newMember.rows);
		
	}
	catch(err){
		console.log(err.message);
	}
})

// get all users
app.get("/all-members",async(req,res)=>{
	try{
		const allMembers = await pool.query("SELECT * FROM members ORDER BY id ASC");
		res.json(allMembers.rows);
		}
	catch(err){
		console.error(err.message);
	}
})

// get a single user
app.get("/get-member-id/:id",async (req,res)=>{
	try{
		const {id} = req.params;
		const singleMember = await pool.query("SELECT * FROM members WHERE id = $1 " ,[id])
		res.json(singleMember.rows);
	}catch(e){
		console.error(e.message);
	}
})
app.get("/get-member-name/:name",async(req,res)=>{
	try{
		const {name} = req.params;
		const properName = name[0].toUpperCase() + name.slice(1,name.length).toLowerCase();
		const singleMember = await pool.query("SELECT * FROM members WHERE name = $1",[properName])
		res.json(singleMember.rows); 
	}catch(e){
		console.error(e.message);
	}
})

// update a user
app.put("/all-members/:id",async(req,res)=>{
	try{
		const {id} = req.params;
		const {name,email,gender} = req.body
		const properName = name[0].toUpperCase() + name.slice(1,name.length);
		const afterUpdate = await pool.query("UPDATE members SET name = $1, email = $2, gender = $3 WHERE id = $4 RETURNING *",
			[properName,email,gender,id] 
			);
		res.json(afterUpdate.rows);

	}catch(e){
		console.log(e.message);
	}
})
// delete a user
app.delete("/all-members/:id",async (req,res)=>{
	try{
		const{id} = req.params;
		await pool.query("DELETE FROM members WHERE id = $1",[id]);
		await pool.query("ALTER SEQUENCE members_id_seq RESTART WITH 1");
		const remainingMembers = await pool.query("SELECT * FROM members");
		res.json(remainingMembers.rows);
	}catch(e){
		console.log(e.message);
	}
	
})





app.listen(PORT,console.log("Server started at port 5000"));