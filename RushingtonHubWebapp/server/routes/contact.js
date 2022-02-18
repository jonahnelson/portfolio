const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const axios = require ('axios')

router.get("/:CompanyId", (req, res) => {
  console.log('Called /contact/:CompanyId. Retrieving contacts in company with ID', req.params.CompanyId + '...');
  db.query(
    `
    SELECT * from tblPersonOfContact WHERE CompanyId = ${req.params.CompanyId}; 
    `, { type: QueryTypes.SELECT }) 
        .then(data => {
            console.log("Successfully retrieved", data.length, "contacts in company with ID", req.params.CompanyId)
            res.status(200).send(data)
        })
        .catch(err => console.log('Failed to retrieve contacts in company with ID', req.params.CompanyId, 'with error:', err))
    }
);

router.post("/editContact", (req, res) => {
  const data = req.body;
  console.log('Called /contact/editContact. Editing contact with ID', data.Id, 'to new data:', data + '...');
  db.query(
    `
        UPDATE tblPersonOfContact SET FName = '${data.FName}', LName = '${data.LName}', Phone = '${data.Phone}', Email = '${data.Email}', Admin = ${data.Admin}
        WHERE Id = ${data.Id};
        `,
    { type: QueryTypes.SELECT }
  )
    .then((dataResponse) => {
      console.log("Successfully edited contact with ID", data.Id, 'to new data:', data);
      res.status(200).send(dataResponse);
    })
    .catch((err) => console.log('Failed to edit contact with ID', data.Id, 'with error:', err));
});

router.post("/addContact", (req, res) => {
  const data = req.body;
  console.log('Called /contact/addContact. Adding new contact', data, 'to company with ID', data.CompanyId + '...');
  db.query(
    `
        INSERT INTO tblPersonOfContact (FName, LName, Phone, Email, CompanyId, Admin)
        VALUES ('${data.FName}', '${data.LName}', '${data.Phone}', '${data.Email}', ${data.CompanyId}, ${data.Admin});
    `,
    { type: QueryTypes.SELECT }
  )
    .then((dataResponse) => {
      console.log("Successfully added new contact", data, 'to company with ID', data.CompanyId);
      res.status(200).send(dataResponse);
    })
    .catch((err) => console.log('Failed to add new contact', data, 'to company with ID', data.CompanyId, 'with error:', err));
});

router.post("/removeContact", (req, res) => {
  const data = req.body;
  console.log('Called /contact/removeContact. Removing contact with ID', data.Id + '...');
  db.query(
    `
        DELETE FROM tblPersonOfContact WHERE Id = ${data.Id};
    `,
    { type: QueryTypes.SELECT }
  )
    .then((dataResponse) => {
      console.log("Successfully removed contact with ID", data.Id);
      res.status(200).send(dataResponse);
    })
    .catch((err) => console.log('Failed to remove contact with ID', data.Id, 'with error:', err));
});

router.post("/removeContactByCIDAndEmail", (req, res) => {
  const data = req.body;
  console.log('Called /contact/removeContactByCIDAndEmail. Removing contact with company ID', data.CompanyId, 'and email', data.email + '...');
  db.query(
    `
        DELETE FROM tblPersonOfContact WHERE CompanyId = ${data.CompanyId} AND CONVERT(VARCHAR, Email) = CONVERT(VARCHAR, '${data.email}')
    `,
    { type: QueryTypes.SELECT }
  )
    .then((dataResponse) => {
      console.log("Successfully removed contact with company ID", data.CompanyId, 'and email', data.email);
      res.status(200).send(dataResponse);
    })
    .catch((err) => console.log('Failed to remove contact with company ID', data.CompanyId, 'and email', data.email, 'with error:', err));
})

/* router.post("/editContact/:companyId/", (req, res) => {
  const data = req.body;
  db.query(
    `
            UPDATE tblArtUPersonOfContact SET FName = '${data.FName}', LName = '${data.LName}', Phone = '${data.Phone}', Email = '${data.Email}', Admin = ${data.Admin}
            WHERE Id = ${data.Id};
            `,
    { type: QueryTypes.SELECT }
  )
    .then((data) => {
      console.log("res", data);
      res.status(200).send(data);
    })
    .catch((err) => console.log(err));
}); */

router.get('/checkUser/admin', (req, res) => {
  console.log('Called /contact/checkUser/admin. Checking if user with email', req.query.email, 'is an admin in company with ID', req.query.CompanyId + '...');
  db.query(`SELECT Admin FROM tblPersonOfContact WHERE CompanyId = ${req.query.CompanyId} AND CONVERT(VARCHAR, Email) = CONVERT(VARCHAR, '${req.query.email}')`)
    .then(data => {
      console.log('Successfully retrieved admin information for user with email', req.query.email, 'in company with ID', req.query.CompanyId);
      res.send(data);
    }).catch(err => console.log('Failed to retrieve admin information for user with email', req.query.email, 'in company with ID', req.query.CompanyId, 'with error:', err));
})

module.exports = router;
