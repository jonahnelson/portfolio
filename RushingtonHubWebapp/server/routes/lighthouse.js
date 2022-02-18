const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { QueryTypes } = require('sequelize');


router.get('/:siteId', (req, res) => {
    console.log('Called /lighthouse/:siteId. Retrieving all lighthouse scores for site with ID', req.params.siteId + '...')
    db.query(`
        SELECT * from tblLighthouse where
        (cast(Date as date)  BETWEEN '${req.query.startDate} 'AND '${req.query.endDate} ')
        AND SiteID = ${req.params.siteId} ORDER BY Date ASC
    `, { type: QueryTypes.SELECT })
        .then(data => {
            console.log("Successfully retrieved all lighthouse scores for site with ID", req.params.siteId + ':', data)
            res.status(200).send(data)
        })
        .catch(err => console.log('Failed to retrieve all lighthouse scores for site with ID', req.params.siteId, 'with error:', err))});
        router.get('/averageSEO/:CompanyId', (req, res) => {
            const CompanyId = req.params.CompanyId;
            db.query(`SELECT AVG(Seo) FROM tblLighthouse
            WHERE SiteId IN (SELECT Id FROM tblDomain WHERE CompanyId = ${req.params.CompanyId})`)
            .then(data => {
                console.log("Successfully retrieved average SEO for company with ID", CompanyId + ':', data);
                res.status(200).send(data);
            })
            .catch(err => console.log('Failed to retrieve average SEO for company with ID', CompanyId, 'with error:', err));
        })

router.get('/averagePerformance/:CompanyId', (req, res) => {
            const CompanyId = req.params.CompanyId;
            db.query(`SELECT AVG(Performance) FROM tblLighthouse
            WHERE SiteId IN (SELECT Id FROM tblDomain WHERE CompanyId = ${req.params.CompanyId})`)
            .then(data => {
                console.log("Successfully retrieved average performance for company with ID", CompanyId + ':', data);
                res.status(200).send(data);
            })
            .catch(err => console.log('Failed to retrieve average performance for company with ID', CompanyId, 'with error:', err));
        })



router.get('/averageBestPractices/:CompanyId', (req, res) => {
            const CompanyId = req.params.CompanyId;
            db.query(`SELECT AVG(BestPractices) FROM tblLighthouse
            WHERE SiteId IN (SELECT Id FROM tblDomain WHERE CompanyId = ${req.params.CompanyId})`)
            .then(data => {
                console.log("Successfully retrieved average best practices for company with ID", CompanyId + ':', data);
                res.status(200).send(data);
            })
            .catch(err => console.log('Failed to retrieve average best practices for company with ID', CompanyId, 'with error:', err));
        })

router.get('/averageAccessibility/:CompanyId', (req, res) => {
            const CompanyId = req.params.CompanyId;
            db.query(`SELECT AVG(Accessibility) FROM tblLighthouse
            WHERE SiteId IN (SELECT Id FROM tblDomain WHERE CompanyId = ${req.params.CompanyId})`)
            .then(data => {
                console.log("Successfully retrieved average accessibility for company with ID", CompanyId + ':', data);
                res.status(200).send(data);
            })
            .catch(err => console.log('Failed to retrieve average accessibility for company with ID', CompanyId, 'with error:', err));
        })
module.exports = router;