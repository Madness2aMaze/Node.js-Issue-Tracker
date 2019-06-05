/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect   = require('chai').expect;
const ObjectId = require('mongodb').ObjectID;


module.exports = (app, db) => {
  
  app.route('/api/issues/:project')
    .get((req, res) => {
    const project = req.params.project;        
    const issueQuery = req.query; //getting the query object filled with the query strings   
    
    issueQuery._id ? issueQuery._id = new ObjectId(issueQuery._id) : undefined;
    
    //assigning the boolean value resulting from the comparison to the issueQuery.open property before running the .find() method
    issueQuery.open ? issueQuery.open = issueQuery.open.toString() == "true" : null; 
    
    //running the .find() method with the query object req.query resulted from the user query strings
    //on the first run the query object is empty and the .find() returns all the issue entries for that particular project
    db.collection(project).find(issueQuery).toArray((err, issues) => {      
      err ? res.send(err) : res.send(issues);
      
      //console.log(issueQuery);
      //db.close();
    });
  })
  
  //submitting the issue
    .post((req, res) => {
    const project = req.params.project;
    console.log(project);
    
    const issueTitle = req.body.issue_title;
    const issueText  = req.body.issue_text;
    const createdBy  = req.body.created_by;
    const assignedTo = req.body.assigned_to;
    const statusText = req.body.status_text;
    
    const standardIssue = {
      issue_title: issueTitle,
      issue_text:  issueText,
      created_on:  new Date().toISOString(),
      updated_on:  new Date().toISOString(),
      created_by:  createdBy,
      assigned_to: assignedTo || "",
      open:        true,
      status_text: statusText || ""
    }  
    
    if (!issueTitle || !issueText || !createdBy ) { //checking to see if the user entered a title, description and name in the required input fields
      res.send('*required fields missing');
    } else { //all fields are filled => proceed to add the issue to the database
      db.collection(project).insertOne(standardIssue, (err, issue) => {
        //console.log('Issue ' + issueTitle + ' has been successfully submitted.');
        standardIssue._id = issue.insertedId;
        //console.log(issue); 
        err ? res.send(err) : res.json(standardIssue);
        //db.close();
      })
    }
  })
  
  //updating the issue
    .put((req, res) => {
    const project = req.params.project;    
    const issueUpdate = req.body; // issueUpdate obj composed of the form fields
    
    const issueTitle  = req.body.issue_title;
    const issueText   = req.body.issue_text;
    const createdBy   = req.body.created_by;
    const assignedTo  = req.body.assigned_to;
    const statusText  = req.body.status_text;
    const issueId     = req.body._id;    
    
    // a series of checks to refine the updates object and keep only the user completed form fields(updates) before is sent to the update method      
    !issueTitle ? delete issueUpdate.issue_title : null; 
    !issueText  ? delete issueUpdate.issue_text  : null; 
    !createdBy  ? delete issueUpdate.created_by  : null; 
    !assignedTo ? delete issueUpdate.assigned_to : null; 
    !statusText ? delete issueUpdate.status_text : null; 
                  delete req.body._id; //reseting the body._id from memory          
    
    //assigning the boolean value resulting from the comparison to the standardUpdates.open property before running the .find() method
    issueUpdate.open ? issueUpdate.open = issueUpdate.open.toString() == "true" : null; 
    
    //console.log(Object.entries(issueUpdate));
    
    if (Object.entries(issueUpdate).length === 0) { // form input fields are empty
      res.send('no updated field sent');
    } else { //all required fields are filled => proceed to find the issue by the _id provided and update it's entry in the database
      issueUpdate.updated_on =  new Date().toISOString(); //reset the updated_on property
      db.collection(project).findOneAndUpdate({_id: ObjectId(issueId)}, { $set: issueUpdate }, (err, issue) => {
        err ? res.send('could not update ' + issueId) : res.send('successfully updated');        
        //console.log(req.body);
        //db.close();
      })
    }
  })  
  
  //deleting the issue
    .delete((req, res) => {
    const project = req.params.project;
    const issueId = req.body._id;
    
    if (!issueId) { //checking to see if the user entered issue's _id in the input field
      res.send('_id error');
    } else { //_id entered=> proceed to delete the issue from the database
      db.collection(project).deleteOne({_id: ObjectId(issueId)}, (err, issue) => {
        err ? res.send('could not delete ' + issueId) : res.send('deleted ' + issueId);
        //console.log(issues);
        //db.close();
      });
    }
  });
    
};
