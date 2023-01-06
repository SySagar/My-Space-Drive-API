const express = require('express')
const app = express()
const fs = require('fs');


const cors = require('cors');
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));
app.use(express.json());
require('dotenv').config()
const { google } = require('googleapis')
const path = require('path')
const { version } = require('os');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

const REFRESH_TOEKN = process.env.REFRESH_TOEKN

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOEKN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
}
)

const filePath = path.join(__dirname,'./outputs/file.txt')

async function uploadFile(){

    try {
        
        const response = await drive.files.create({
            requestBody:{
                name: 'MyUpload.jpg',
                mimeType: 'text/plain'
            },
            media:{
                mimeType: 'text/plain',
                body: fs.createReadStream(filePath)
            }
        }) 

        console.log(response.data);
    } catch (error) {
        console.log(error.message);
    }
}

//uploadFile();

async function deleteFile(){
    try {
    const response  = await drive.files.delete({
        fileId: '1X2yNGOVzF0jxh35WvAZz_7Qto5Xi9AwG'
    })

    console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
}


//deleteFile()


async function read(){

    const phrase = "Questions :"
let fetch_url = `https://www.googleapis.com/drive/v3/files?orderBy=folder&q=trashed%3Dfalse%20and%20fullText%20contains%20%27${encodeURIComponent(
phrase
)}%27`;
let fetch_options = {
method: "GET",
headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
},
};

const response = await fetch(fetch_url, fetch_options);
const json = await response.json();

}


app.post('/', (req,res)=>{
    const question = req.body.question
    const answer = req.body.answer

    const data = "Question : "+question+'\n'+'Answer : '+answer;
    
 var promise = new Promise(function(resolve,reject){

     fs.writeFile('./outputs/file.txt', data, (err) => {
         
         if(err) {
            reject();
             throw err;
            }
            resolve();
            console.log("New Text File Successfully loaded.");
            res.send("New Text File Successfully loaded.")
        })
        
    });

    promise
    .then(function(){
        console.log("suceess");
        uploadFile();
    })
    .catch(function(){})



})

app.listen(3000 || process.env.url,()=>{
    console.log("listeing");
})