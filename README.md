# GAS_JobEmailParser 

## General Info 
This project reads the user's Gmail messages under a specified label and extracts information about job openings from alerts made by Google Jobs such as title, employer, location. This information is then filtered and writen to a Google Sheet. See this blog post for a more detailed description of the general workings of this project. https://trevormetz.myportfolio.com/job-search-automation-with-google-apps-scripts

## Dependencies 
* Google Apps Scripts 
* Gmail 
* Google Sheets
* Google Account  

## Setup 
All this project requires to run is Google Apps Scripts which will run in the browser.  

## Example Usage 
* User subscribes to Google Job alerts which are filtered by Gmail under a label called "job alerts"
* This project runs once a day at 5pm where it reads and parses all messages under the label "job alerts" 
* The extracted information from each message is writen to a Google Sheet set up by the user 
* At the end of code execution, an email is sent to the user with a link to this Sheet and a report on number of jobs found 

## In Development 
The option to also read messages from LinkedIn and Indeed job alerts is in the works and is currently being tested. 



