const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const axios = require ('axios')

router.get("/getCompany", (req, res) => {
    console.log('Called /companyid/getCompany. Retrieving company with ID', req.query.CompanyId + '...');
  db.query(
    `
    SELECT * from tblCompany WHERE Id = '${req.query.CompanyId}'
    `).then(data=>{
        console.log('Successfully retrieved company', data);
        res.send(data);
    }).catch(err=>{console.log('Failed to retrieve company with ID', req.query.CompanyId, 'with error:', err)});
});

router.post("/updateCompanyName", (req, res) => {
    console.log('Called /companyid/updateCompanyName. Updating company', req.body.CompanyId + "'s name to", req.body.CompanyName + '...');
    db.query(
        `
        UPDATE tblCompany SET CompanyName = '${req.body.CompanyName}'
        WHERE Id = ${req.body.CompanyId};
        `
    ).then(data=>{
        console.log('Successfully updated company', req.body.CompanyId + "'s name to", req.body.CompanyName);
        res.send(data)
    }).catch(err=>{console.log('Failed to update company', req.body.CompanyId + "'s name to", req.body.CompanyName, 'with error:', err)})
});

router.post("/getCompanies", (req, res) => {
    console.log('Called /companyid/getCompanies. Retrieving the companies for the user with email', req.body.Email + '...');
    db.query(
        `
        SELECT * FROM tblCompany WHERE Id IN (SELECT CompanyId FROM tblPersonOfContact WHERE CONVERT(VARCHAR, Email) = CONVERT(VARCHAR, '${req.body.Email}'))
        `
    ).then(data=>{
        if(data[0].length == 0){
            console.log('Successfully retrieved 0 companies for user with email', req.body.Email + '.', 'Inserting new company');
            db.query(`
                INSERT INTO tblCompany (CompanyName)
                VALUES ('New Company');
                SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY];
                
            `).catch(err=>{console.log('Failed to retrieve companies for user with email', req.body.Email, 'with error:', err)})
                .then(newCIDResponse=>{
                console.log('Successfully created new company with ID', parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10));
                db.query(`
                INSERT INTO tblPersonOfContact (FName, LName, Phone, Email, CompanyId, Admin)
                VALUES ('${req.body.FName}', '${req.body.LName}', '', '${req.body.Email}', ${parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10)}, 1)
                UPDATE tblCompany SET CompanyName = 'Company ${parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10)}'
                WHERE Id = ${parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10)};
                `).then(response=>{
                    console.log('Successfully inserted new user with email', req.body.Email, 'and company ID', parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10), 'and named new company to Company', parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10));
                    res.send({response: [[{Id: parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10), CompanyName: 'Company ' + parseInt(newCIDResponse[0][0].SCOPE_IDENTITY, 10)}]], first: true})});
            })} else {
                console.log('Successfully retrieved companies for returning user with email', req.body.Email + ':', data);
                res.send({response: data, first: false})
            }
        
        
})})

module.exports = router;
