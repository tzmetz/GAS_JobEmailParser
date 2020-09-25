const today = Utilities.formatDate(new Date(), "PST", "yyyy-MM-dd");

function getTodaysMessages() {
  
  // Get today's email messages
  
  // Get all email threads corresponding to job search results 
  var labelName = "JobSearchResults";
  var labelThreads = GmailApp.getUserLabelByName(labelName);
  var allThreads = labelThreads.getThreads();
  
  // Now get today's email threads by lopping through all inbox email threads and comparing their date to today's 
  // Once we get to the previous day, break the loop to save time
  var todaysThreads = [];
  for (var i = 0; i < allThreads.length; i++) {
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
  for (var i = 0; i < todaysThreads.length; i++) {
    threadMessages[i] = todaysThreads[i].getMessages();
  } 
  
  return threadMessages;
  
} 

function isGoogleMessage(message) {
  if (message.getFrom() == 'Job Alerts from Google <notify-noreply@google.com>') {
    return 1;
  }
  else {
    return 0;
  }
}

function parseMessage(message) {
  
  // If this message is not from Google jobs then do not waste time parsing it
  if (!isGoogleMessage(message)) {
    return;
  }
  
  // Now get blocks of text containing each position from email body text
  var body = message.getPlainBody(); // Gets emial text from HTML
  var positionBlocks = body.split(/^Time\sicon/gm); // split body text into blocks based on indicator
  var numPositions = positionBlocks.length - 1; // Number of position blocks. -1 to remove the footer
  
  // Split up each position block into seperate lines of text
  for (var k = 0; k < positionBlocks.length; k++) {
    positionBlocks[k] = positionBlocks[k].split(/\r?\n/); // replacing each string in positions with an array of strings containing each line in the block
  }
  
  // Now Extract Job Titles, Locations & Employer From Each Position
  var numHeaderLines = 14; // To find the number of header lines, break here & look at positions[0] in the debugger
  var titlesIndex = 9;
  var employerIndex = 10;
  var locIndex = 12;
  var outputArray = []; // initializing array of objects for output
  const negKeywords = ["senior", "lead", "sr.", "manager", "intern", "internship", "HVAC"];
  
  // Loop through each position block and extract the desired information
  for (var j = 0; j < numPositions; j++) {
    if (j == 0) {
      outputArray[j] = new Position();
      outputArray[j].title = positionBlocks[j][numHeaderLines]; 
      outputArray[j].employer = positionBlocks[j][numHeaderLines+1];
      outputArray[j].loc = positionBlocks[j][numHeaderLines+3];
      outputArray[j].date = today;
      outputArray[j].url = "https://www.google.com/search?q=" + outputArray[j].title.replace(/\s+/g, "+") + "+" + outputArray[j].employer.replace(/\s/g, "+") +  // TODO: make sure position titles dont start with special characters since this will mess up the url
        "+" + outputArray[j].loc.replace(/\s/g, "+") + "&ibp=htl;jobs"; 
      
      // Apply a flag to this position if the title contains any negative keywords
      // To avoid long for loop we are going to use the some method to iterate through the negKeywords array for us 
      // At each element in the negKeywords array, (for keyword in negKeywods) run .includes method on the position title (made lowercase for simplicity)
      // If method returns 1 then enter the if statement 
      // Ref: https://stackoverflow.com/questions/46914159/look-for-keywords-in-a-string-in-js
      if( negKeywords.some(keyword => outputArray[j].title.toLowerCase().includes(keyword) )) { 
        console.log("Found") 
        outputArray[j].badFlag = true; 
      }
      else {
        outputArray[j].badFlag = false;
      }
    }
    else {
      outputArray[j] = new Position();
      outputArray[j].title = positionBlocks[j][titlesIndex]; 
      outputArray[j].loc = positionBlocks[j][locIndex];
      outputArray[j].employer = positionBlocks[j][employerIndex];
      outputArray[j].date = today;
      outputArray[j].url = "https://www.google.com/search?q=" + outputArray[j].title.replace(/\s+/g, "+") + "+" + outputArray[j].employer.replace(/\s/g, "+") + 
        "+" + outputArray[j].loc.replace(/\s/g, "+") + "&ibp=htl;jobs";
      
      if( negKeywords.some(keyword => outputArray[j].title.toLowerCase().includes(keyword) )) { 
        console.log("Found") 
        outputArray[j].badFlag = true; 
      }
      else {
        outputArray[j].badFlag = false;
      }
    }
  }
  
  return outputArray;
  
}

function Position(title, loc, employer, date, datePosted, url, badFlag) {
  this.title = title;
  this.loc = loc;
  this.employer = employer;
  this.date = date;
  this.datePosted = datePosted;
  this.url = url;
  this.badFlag = badFlag;
}
    
    

