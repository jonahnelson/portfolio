const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { QueryTypes } = require("sequelize");
var { SiteChecker } = require("broken-link-checker");
const link = require('linkinator');


router.get("/:siteId", (req, res) => {
    console.log('Called /brokenlinksreport/:siteId. Generating Broken Link Report for site with ID', req.params.siteId + '...')
    var siteUrl = "";
    var response = "";
    db.query(
        `
            SELECT Url from tblDomain WHERE Id = ${req.params.siteId}
        `,
        { type: QueryTypes.SELECT }
      )
        .then(async (resultQuery) => {
            console.log('Retrieved site with ID', req.params.siteId, 'as', JSON.stringify(resultQuery[0]));
            siteUrl = "" + Object.values(resultQuery[0]);
            console.log('Generating Broken Link Report for', siteUrl, 'formatted as', formatUrl(siteUrl) + '...');
                link.check({
                  path: formatUrl(siteUrl),
                  recurse: true
                }).then(results => {res.send(results.links.filter(e=>{return e.state === 'BROKEN' && e.status != 403 && e.status != 999}).map(e=>{return JSON.stringify({StatusCode: e.status, Url: e.url, Page: e.parent})}))
                  console.log('Successfully retrieved', results.links.filter(e=>{return e.state === 'BROKEN' && e.status != 403 && e.status != 999}).map(e=>{return JSON.stringify({StatusCode: e.status, Url: e.url, Page: e.parent})}).length,
                  'broken links for site with ID', req.params.siteId);})
                .catch(error => console.log('Failed to generate Broken Link Report for', formatUrl(siteUrl), 'with error:', error))
                
        })
            
});

function formatUrl(url){
  if(!url.startsWith('http')){
    if(url.startsWith('www.')){
      return(`https://${url.substring(4, url.length)}`);
    } else {
      return(`https://${url}`);
    }
  } else {
    if(url.startsWith('http://')){
      if(url.startsWith('http://www.')){
        return(`https://${url.substring(11, url.length)}`);
      } else {
        return(`https://${url.substring(7, url.length)}`);
      }
    } else {
      if(url.startsWith('https://www.')){
        return(`https://${url.substring(12, url.length)}`);
      } else {
        return url;
      }
    }
  }
}

module.exports = router;
