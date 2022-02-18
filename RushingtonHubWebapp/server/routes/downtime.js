const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { QueryTypes } = require('sequelize');


router.get('/:siteId', (req, res) => {
console.log("Called /downtime/:siteId. Retrieving downtime data for site with ID", req.params.siteId + '...');
    db.query(`
        SELECT * from tblTimeEvent where
        (cast(Down as date)  BETWEEN '${req.query.startDate}' AND '${req.query.endDate} ')
        AND SiteID = ${req.params.siteId} ORDER BY Down ASC
    `, { type: QueryTypes.SELECT })
        .then(data => {
            console.log("Successfully retrieved downtime data for site with ID", req.params.siteId + ':', data)
            res.status(200).send(data)
        })
        .catch(err => console.log('Failed to retrieve downtime data for site with ID', req.params.siteId, 'with error:', err))}
        );
    
router.get('/average/:CompanyId', (req, res) => {
            const CompanyId = req.params.CompanyId;
            console.log("Called /downtime/average/:CompanyId. Retrieving average downtime for company with ID", CompanyId + '...');
            db.query(`SELECT ABS(AVG(DATEDIFF(SECOND, 0, CAST(Down as TIME))) - AVG(DATEDIFF(SECOND, 0, CAST(Up as TIME))))
            FROM tblTimeEvent WHERE SiteID IN (SELECT Id FROM tblDomain WHERE CompanyId = ${CompanyId})`)
            .then(data => {
                console.log("Successfully retrieved average downtime for company with ID", CompanyId + ':', data);
                res.status(200).send(data);
            })
            .catch(err => console.log('Failed to retrieve average downtime for company with ID', CompanyId, 'with error:', err));
        })

module.exports = router;