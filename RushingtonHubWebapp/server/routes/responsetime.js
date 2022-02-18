const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { QueryTypes } = require('sequelize');

router.get('/:siteId', (req, res) => {
    console.log('Called /responsetime/:siteId. Retrieving response time data for site with ID', req.params.siteId + '...')
    db.query(`
    SELECT * from tblResponseTime where
    (cast(RecordDate as date) BETWEEN '${req.query.startDate}' AND '${req.query.endDate}')
    AND SiteId = ${req.params.siteId} ORDER BY RecordDate ASC
    `, { type: QueryTypes.SELECT }) 
        .then(data => {
            console.log("Successfully retrieved response time data for site with ID", req.params.siteId + ':', data)
            res.status(200).send(data)
        })
        .catch(err => console.log('Failed to retrieve response time data for site with ID', req.params.siteId, 'with error:', err))});
        
router.get('/average/:CompanyId', (req, res) => {
            const CompanyId = req.params.CompanyId;
            db.query(`SELECT AVG(DATEDIFF(ms, 0, ResponseTime)) FROM tblResponseTime 
            WHERE SiteId IN (SELECT Id FROM tblDomain WHERE CompanyId = ${CompanyId})`)
            .then(data => {
                console.log("Successfully retrieved average response time for company with ID", CompanyId + ':', data);
                res.status(200).send(data);
            })
            .catch(err => console.log('Failed to retrieve average response time for company with ID', CompanyId, 'with error:', err));
        })

module.exports = router;