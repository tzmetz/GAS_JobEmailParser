// ---------------- GLOBAL VARIABLES ----------------------
//const today = Utilities.formatDate(new Date(), "PST", "yyyy-MM-dd");
//var today = "2020-10-01"
// ----------------- SUPPORTING FUNCTIONS --------------------

/*
  * Reads all threads from inbox with given label. Gets messages from all threads
  * @returns {array}  threadMessages: array of arrays. Each element contains an array of class messages from an email thread
  */ 
function getTodaysMessages(labelName) {
  
  // Get today's email messages
  
  // Get all email threads corresponding to job search results 
  var labelThreads = GmailApp.getUserLabelByName(labelName);
  var allThreads = labelThreads.getThreads();
  
  // Now get today's email threads by lopping through all inbox email threads and comparing their date to today's 
  // Once we get to the previous day, break the loop to save time
  var todaysThreads = [];
  var length_allThreads = allThreads.length;
  for (var i = 0; i < length_allThreads; i++) {
    var threadDate = Utilities.formatDate(allThreads[i].getLastMessageDate(), "PST", "yyyy-MM-dd");
    if (threadDate == today) {
      todaysThreads[i] = allThreads[i];
      Logger.log(todaysThreads[i].getFirstMessageSubject())
    }
    else {
      break;
    }
  }
  
  // Now loop through all of todays threads and get all messages
  var threadMessages = [];
  var length_todaysThreads = todaysThreads.length;
  for (var i = 0; i < length_todaysThreads; i++) {
    threadMessages[i] = todaysThreads[i].getMessages();
  } 
  
  return threadMessages;
  
} // END OF getTodaysMessages()


/*
  * Checks sender of message to make sure it is correct
  * @param {message}  message: checks sender of this message
  * @returns {boolean} true if from correct sender, false if not
  */ 
function isGoogleMessage(message) {
  if (message.getFrom() == 'Job Alerts from Google <notify-noreply@google.com>') {
    return 1;
  }
  else {
    return 0;
  }
} 

/*
  * Checks sender of message to make sure it is correct
  * @param {message}  message: checks sender of this message
  * @returns {boolean} true if from correct sender, false if not
  */ 
function isIndeedMessage(message) {
  if (message.getFrom() == 'Indeed <alert@indeed.com>') {
    return 1;
  }
  else {
    return 0;
  }
}

/*
  * Checks sender of message to make sure it is correct
  * @param {message}  message: checks sender of this message
  * @returns {boolean} true if from correct sender, false if not
  */ 
function isLinkedInMessage(message) {
  if (message.getFrom() == 'LinkedIn Job Alerts <jobalerts-noreply@linkedin.com>') {
    return 1;
  }
  else {
    return 0;
  }
}


/*
  * Position Class
  */ 
function Position(title, loc, employer, dateAccessed, datePosted, url, badFlag, source) {
  this.title = title;
  this.loc = loc;
  this.employer = employer;
  this.dateAccessed = dateAccessed;
  this.datePosted = datePosted;
  this.url = url;
  this.badFlag = badFlag;  
  this.source = source;
} 

/*
  * Checks each supplied data with against base data
  * @param {array}  title: array of len 1 containing position title as a string
  * @param {array}  employer: array of len 1 containing position employer as a string
  * @param {array}  loc: array of len 1 containing position location as a string
  * @param {array}  titlesData: array containing base titles for comparison
  * @param {array}  employerData: array containing base employers for comparison
  * @param {array}  locData: array containing base locations for comparison
  * @returns {boolean} false if found a match, true if no matches found
  */ 
function isPosUnique(title, employer, loc, titlesData, employerData, locData) {  
    
  // Compare stored data to new data
  var length_titlesData = titlesData.length;
  for (var i = 0; i < length_titlesData; i++) {
    if ( title == titlesData[i][0] && employer == employerData[i][0] && loc == locData[i][0] ) {
      return 0; // found an exact match, so return false
    }
  }
  
  // Got through the whole for loop without finding an exact match, return true
  return 1;
  
} 


/*
  * Checks each supplied data with against base data
  * @param {array}  messages: array of arrays containing messages
  * @returns {array} positionsData: array of arrays containing Positions objects
  */ 
function parseMessagesByLabel(messages, label) {
  // Loop through all of today's messages from each email thread today and parse its contents 
  // Store results (array of Position objects) in an array called positionsData
  var positionsData = []; 
  var length_messages = messages.length;
  for (var i = 0; i < length_messages; i++) {
    for (var j = 0; j < messages[i].length; j++) {              
      
      // Based on label, run correct email parser
      if (label == "JobSearchResults") {  
        positionsData.push(parseMessage_Google(messages[i][j]));    // Add breakpoint here to get in and diagnose parsing function. See Funcs.gs for comments showing best places to put breakpoints for diagnosis
      }
      else if (label == "IndeedSearchResults") {
        positionsData.push(parseMessage_Indeed(messages[i][j]));    // Add breakpoint here to get in and diagnose parsing function. See Funcs.gs for comments showing best places to put breakpoints for diagnosis
      }
      else if (label == "LinkedInJobSearchResults") {
        positionsData.push(parseMessage_LinkedIn(messages[i][j]));    // Add breakpoint here to get in and diagnose parsing function. See Funcs.gs for comments showing best places to put breakpoints for diagnosis
      }
    
    }
  }
  
  return positionsData;
}

/*
  * Checks each supplied data with against base data
  * @param {array}  positionsData: array of arrays containing positions from each message
  * @param {sheet}  goodSheet/badSheet: sheets for good and bad positions respectively
  * @param {number}  countGood/countBad: array of len 1 containing position location as a string
  * @param {array}  titlesData_GOODSHT/BADSHT: array containing titles from good/bad sheet
  * @param {array}  employerData_GOOSHT/BADSHT: array containing employers from good/bad sheet
  * @param {array}  locData_GOODSHT/BADSHT: array containing locations from good/bad sheet
  * @returns {array} counts: array containing counts of unique good/bad positions and number of repeated positions
  */ 
function write2Sheet(positionsData, goodSheet, badSheet, countGood, countBad, countRpt, titlesData_GOODSHT, employerData_GOODSHT, locData_GOODSHT, titlesData_BADSHT, employerData_BADSHT, locData_BADSHT) {
// Loop through positions data (array containing arrays of Position Objects from each email thread) and write the contents of each Position object to the spreadsheet
  var length_positionsData = positionsData.length;
  for ( var k = 0; k < length_positionsData; k++) {
    for ( var z = 0; z < positionsData[k].length; z++) {
      
      // Check the flag on the position, if it passed the filter, pass it on to the data sheet. If it didnt pass filter send it to the rejects. Additionally, run isPosUnique to make sure we're only writing unique positions
      // TODO: would be faster to check isPosUnique first then look at the flag
      if ( positionsData[k][z].badFlag == false && isPosUnique(positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, titlesData_GOODSHT, employerData_GOODSHT, locData_GOODSHT) ) { 
        goodSheet.appendRow([positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, positionsData[k][z].dateAccessed, positionsData[k][z].datePosted, positionsData[k][z].source, positionsData[k][z].url])
        countGood++;
      }
      else if ( positionsData[k][z].badFlag == true && isPosUnique(positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, titlesData_BADSHT, employerData_BADSHT, locData_BADSHT) ) {
        badSheet.appendRow([positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, positionsData[k][z].dateAccessed, positionsData[k][z].datePosted, positionsData[k][z].source, positionsData[k][z].url])
        countBad++;
      }
      else {
        countRpt++;
      }
    }
  }
  var counts = [countGood, countBad, countRpt]; 
  return counts; 
} // END OF write2Sheet()