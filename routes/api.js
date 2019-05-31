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
    const project = req.params.project;
    db.collection(project).find({}).toArray((err, issues) => {
      err ? res.json(err) : res.json(issues);
      //console.log(issues);
      db.close();
    });
  })
  
  //submitting the issue
    .post((req, res) => {
    const project = req.params.project;
    console.log(project);
    
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
      db.collection(project).insertOne({
        "issue_title": req.body.issue_title,
        "issue_text": req.body.issue_text,
        "created_on": new Date().toISOString(),
        "updated_on": new Date().toISOString(),
        "created_by": req.body.created_by,
        "assigned_to": req.body.assigned_to,
        "open": true,
        "status_text": req.body.status_text
      }, (err, issue) => {
        console.log('Issue ' + req.body.issue_title + ' has been successfully submitted.');
        res.json(issue.ops);
        if (err) {
          res.redirect('/');
        } else {
          res.json(null, issue);
        }
        db.close();
      })
    }
  })
  
  //updating the issue
    .put((req, res) => {
    const project = req.params.project;
    
    /*db.collection(project).findOne({
      id: req.body._id
    }, (err, issue) => {
      if (err) {
        next(err);
      } else if (issue) {
        res.redirect('/');
      } else {
        db.collection(project).insertOne({
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
    .delete(function(req, res) {
    const project = req.params.project;
    const issueId = req.body._id;
    
    if (!issueId) { //checking to see if the user entered issue _id in the input field
      res.json('_id error');
    } else { //_id entered=> proceed to delete the issue from the database
      db.collection(project).deleteOne({_id: ObjectId(issueId)}, (err, obj) => {
      err ? res.json("could not delete " + issueId) : res.json("deleted: " + issueId);
      //console.log(issues);
      db.close();
    });
    }
  });
    
};
