/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect      = require('chai').expect;
const ObjectId    = require('mongodb').ObjectID;

module.exports = (app, db) => {
  
  app.route('/api/issues/:project')
    .get((req, res) => {
    var project = req.params.project;
  })
  
  //submitting the issue
    .post((req, res, next) => {
    var project = req.params.project;
    
    const issueTitle = req.body.issue_title;
    const issueText = req.body.issue_text;
    const submitter = req.body.created_by;
    
    if (!issueTitle) { //checking to see if the user entered a title in the input field
      res.json('Please enter a title for your issue');
    } else if (!issueText) { //checking to see if the user entered a description in the input field
      res.json('Please enter a description for your issue');
    } else if (!submitter) { //checking to see if the user entered his name in the input field
      res.json('Please enter your name');
    } else { //all fields are filled => proceed to add the issue to the database
      db.collection('projects').insertOne({
        "issue_title": req.body.issue_title,
        "issue_text": req.body.issue_text,
        "created_on": new Date().toISOString(),
        "updated_on": new Date().toISOString(),
        "created_by": req.body.created_by,
        "assigned_to": req.body.assigned_to,
        "open": true,
        "status_text": req.body.status_text
      }, (err, doc) => {
        console.log('Issue ' + req.body.issue_title + ' has been successfully submitted.');
        res.json(doc.ops);
        if (err) {
          res.redirect('/');
        } else {
          next(null, doc);
        }
      })
    }
  })
  
  //updating the issue
    .put((req, res, next) => {
    var project = req.params.project;
    
    /*db.collection('projects').findOne({
      id: req.body._id
    }, (err, issue) => {
      if (err) {
        next(err);
      } else if (project) {
        res.redirect('/');
      } else {
        db.collection('projects').insertOne({
          "issue_title": req.body.issue_title,
          "issue_text": req.body.issue_text,
          "created_on": new Date().toISOString(),
          "updated_on": new Date().toISOString(),
          "created_by": req.body.created_by,
          "assigned_to": req.body.assigned_to,
          "open": true,
          "status_text": req.body.status_text
        }, (err, doc) => {
          console.log('Issue ' + doc._id + ' has been successfully submitted.');
          res.json(doc);
          if (err) {
            res.redirect('/');
          } else {
            next(null, doc);
          }
        })
      }
    })*/
  })
  
  //deleting the issue
    .delete(function(req, res, next) {
    var project = req.params.project;
  
  });
    
};
