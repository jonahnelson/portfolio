const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const axios = require ('axios');
const querystring = require('querystring')
require('dotenv').config({path: '../../.env'})
const gitHubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
const gitHubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;


async function getGitHubUser(code, originalResponse){
  console.log('Retrieving GitHub user...');
  const gitHubToken = await axios.post(
    `https://github.com/login/oauth/access_token?client_id=${gitHubClientId}&client_secret=${gitHubClientSecret}&code=${code}&scope=read:user%20user:email`
  ).then((res) => res.data)

  .catch((error) => {
    throw error;
  });
  const decoded = querystring.parse(gitHubToken);

  const accessToken = decoded.access_token;

  console.log("Retrieving GitHub user's email...");
  axios
    .get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => {
      axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((emailResponse) => {
        if(res.data.email == null){
        res.data.email = emailResponse.data[0].email}
        console.log("Successfully retrieved GitHub user's email")
        originalResponse.send(res.data)
        return res.data;
        
      }).catch(error=>{console.log('Failed to retrieve GitHub user with error:', error)})
        
    })
      
    .catch((error) => {
      console.error(`Failed to retrieve GitHub user with error:`, error);
      throw error;
    });
}

    router.get('/github/:Code', async (req, res) => {
      console.log('Called /authentication/github/:Code. Retrieving GitHub authorization code...')
  const code = req.params.Code
  const path = 'http://localhost:3000'
  if(!code){
    console.log("Error retrieving GitHub authorization code. No code retrieved")
    //throw new Error('No code')
  }
  
 getGitHubUser(code, res).then(res=>{})
})

module.exports = router;