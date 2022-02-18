const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { QueryTypes } = require("sequelize");

router.get('/:CompanyId', (req, res) => {
  console.log('Called /audomain/:CompanyId. Retrieving sites for company with ID', req.params.CompanyId + '...');
  db.query(
      `
        SELECT * FROM tblDomain WHERE CompanyId = ${req.params.CompanyId} Order By Cast(Url as nchar) Asc;`,
      { type: QueryTypes.SELECT }
    )
    .then((domains) => {
      console.log('Successfully retrieved', domains.length, 'sites with company ID', req.params.CompanyId);
      res.status(200).send(domains);
    })
    .catch((err) => console.log('Failed to retrieve sites for company with ID', req.params.CompanyId, 'with error:', err));
}
);

router.post("/addSite", (req, res) => {
  const data = req.body;
  console.log('Called /audomain/addSite. Adding', data.Url, 'to company with ID', data.CompanyId + '...');
  db.query(
    `
        INSERT INTO tblDomain (Url, CompanyId, InitialVisit)
        VALUES ('${data.Url}', ${data.CompanyId}, GETDATE());
    `,
    { type: QueryTypes.SELECT }
  )
    .then((result) => {
      console.log('Successfully added site', data.Url, 'to company with ID', data.CompanyId);
      res.status(200).send(result);
    })
    .catch((err) => console.log('Failed to add site', data.Url, 'to company with ID', data.CompanyId, 'with error:', err));
});

router.post("/removeSite", (req, res) => {
  const data = req.body;
  console.log('Called /audomain/removeSite. Removing', data.Url, 'from company with ID', data.CompanyId + '...');
  db.query(
    `
        DELETE FROM tblDomain WHERE Id = ${data.Id};
    `,
    { type: QueryTypes.SELECT }
  )
    .then((result) => {
      console.log('Successfully removed site', data.Url, 'from company with ID', data.CompanyId);
      res.status(200).send(result);
    })
    .catch((err) => console.log('Failed to remove site', data.Url, 'from company with ID', data.CompanyId, 'with error:', err));
});

router.post("/editSite", (req, res) => {
  const data = req.body;
  console.log('Called /audomain/editSite. Editing site', data.Id, 'to new URL', data.Url + '...');
  db.query(
    `
            UPDATE tblDomain SET URL = '${data.Url}'
            WHERE Id = ${data.Id};
            `,
    { type: QueryTypes.SELECT }
  )
    .then((result) => {
      console.log('Successfully edited site', data.Id, 'to new URL', data.Url);
      res.status(200).send(result);
    })
    .catch((err) => console.log('Failed to edit site', data.Id, 'to new URL', data.Url, 'with error:', err));
});

module.exports = router;
