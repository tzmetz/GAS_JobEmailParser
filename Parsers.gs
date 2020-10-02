/*
  * Parses message to exrtact all job positions with all relevant information from each position
  * @param {Message}  message: message containing job positions to be parsed
  * @returns {Array} outputArray: returns an array containing Position objects which contain all relevant information from each position found in the message
  */ 
function parseMessage_Google(message) {
  
  // If this message is not from Google jobs then do not waste time parsing it
  if (!isGoogleMessage(message)) {
    return;
  }
  
  // Now get blocks of text containing each position from email body text
  var body = message.getPlainBody(); // Gets emial text from HTML 
  Logger.log(body)
  
  // split body text into blocks based on google job's time stamp included for all positions
  // Regex uses lookbehind to split at the word "Work" This preserves the date data which will be stored
  // Note: old Regex is /^Time\sicon/gm
  var positionBlocks = body.split(/(?<=Time\sicon\s...\s..\s)Work/gm); 
  
  var numPositions = positionBlocks.length - 1; // Number of position blocks. -1 to remove the footer
  
  // Split up each position block into seperate lines of text
  var length_positionBlocks = positionBlocks.length;
  for (var k = 0; k < length_positionBlocks; k++) {
    positionBlocks[k] = positionBlocks[k].split(/\r?\n/); // replacing each string in positions with an array of strings containing each line in the block
  }
  
  // Now Extract Job Titles, Locations & Employer From Each Position
  var numHeaderLines = 14; // To find the number of header lines, break here & look at positions[0] in the debugger
  var titlesIndex = 9;
  var employerIndex = 10;
  var locIndex = 12; 
  var datePostedIndex = 16;
  var outputArray = []; // initializing array of objects for output
  const negTitles = ["senior", "lead", "sr.", "manager", "mgr", "intern", "internship", "hvac"]; // importatnt that each keyword is all lower case
  const negEmployers = ["amazon", "raytheon", "facebook", "lockheed martin"];
  
  // Loop through each position block and extract the desired information
  for (var j = 0; j < numPositions; j++) {
    if (j == 0) {
      outputArray[j] = new Position();
      outputArray[j].title = positionBlocks[j][numHeaderLines]; 
      outputArray[j].employer = positionBlocks[j][numHeaderLines+1];
      outputArray[j].loc = positionBlocks[j][numHeaderLines+3];
      outputArray[j].datePosted = positionBlocks[j][numHeaderLines+7];
      outputArray[j].dateAccessed = today;
      outputArray[j].url = "https://www.google.com/search?q=" + outputArray[j].title.replace(/\s+/g, "+") + "+" + outputArray[j].employer.replace(/\s/g, "+") +  // TODO: make sure position titles dont start with special characters since this will mess up the url
        "+" + outputArray[j].loc.replace(/\s/g, "+") + "&ibp=htl;jobs"; 
      outputArray[j].source = "Google";
      
      // Apply a flag to this position if the title contains any negative keywords
      // To avoid long for loop we are going to use the some method to iterate through the negKeywords array for us 
      // At each element in the negKeywords array, (for keyword in negKeywods) run .includes method on the position title (made lowercase for simplicity)
      // If method returns 1 then enter the if statement 
      // Ref: https://stackoverflow.com/questions/46914159/look-for-keywords-in-a-string-in-js
      // Or condition added in if statment to check for negative employers as well
      if( negTitles.some(keyword => outputArray[j].title.toLowerCase().includes(keyword)) || negEmployers.some(keyword => outputArray[j].employer.toLowerCase().includes(keyword)) ) { 
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
      outputArray[j].datePosted = positionBlocks[j][datePostedIndex];
      outputArray[j].dateAccessed = today;
      outputArray[j].url = "https://www.google.com/search?q=" + outputArray[j].title.replace(/\s+/g, "+") + "+" + outputArray[j].employer.replace(/\s/g, "+") + 
        "+" + outputArray[j].loc.replace(/\s/g, "+") + "&ibp=htl;jobs"; 
      outputArray[j].source = "Google";
      
      if( negTitles.some(keyword => outputArray[j].title.toLowerCase().includes(keyword)) || negEmployers.some(keyword => outputArray[j].employer.toLowerCase().includes(keyword)) ) { 
        console.log("Found") 
        outputArray[j].badFlag = true; 
      }
      else {
        outputArray[j].badFlag = false;
      }
    }
  }
  
  return outputArray;
  
} // END OF parseMessage_Google()

