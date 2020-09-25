// TODO: make the split at "via" instead of time icon that way I can get date posted info as well
// TODO: add a check to make sure that each appended row to data sheet is unique
// TODO: add LinkedIn & Indeed search results as well 

// FURTHER IMPROVEMENT: use "at" in Linux to run local code at specified time, write the program in 
// python and use selenium to search and scrape google jobs automatically then scrape and parse the job descriptions 
// for even more filtration



function mainFun() {
  
  // First Get Today's Messages 
  var messages = getTodaysMessages(); // Returns Array containing arrays of class {messages} 
  
  // Loop through all of today's messages from each email thread today and parse its contents 
  // Store results (array of Position objects) in an array called positionsData
  var positionsData = []; 
  for (var i = 0; i < messages.length; i++) {
    for (var j = 0; j < messages[i].length; j++) {               // Add breakpoint here to get in and diagnose parsing function. See Funcs.gs for comments showing best places to put breakpoints for diagnosis
      positionsData.push(parseMessage(messages[i][j]));
    }
  }
  
  // Now Write Parsed Job Info To a Spreadsheet 
  var spreadsheetURL = "https://docs.google.com/spreadsheets/d/1UWBO4w85lKeSLSztepJvxGR-KYU_pNpnHLRpJFZQptk/edit#gid=0"
  
  var goodSheet = SpreadsheetApp 
  .openByUrl(spreadsheetURL)
  .getSheetByName("Data");
  
  var badSheet = SpreadsheetApp 
  .openByUrl(spreadsheetURL)
  .getSheetByName("Rejects");
  
  var countGood = 0;
  var countBad = 0;
  
  // Loop through positions data (array containing arrays of Position Objects from each email thread) and write the contents of each Position object to the spreadsheet
  for ( var k = 0; k < positionsData.length; k++) {
    for ( var z = 0; z < positionsData[k].length; z++) {
      
      // Check the flag on the position, if it passed the filter, pass it on to the data sheet. If it didnt pass filter send it to the rejects
      if (positionsData[k][z].badFlag == false) { 
        goodSheet.appendRow([positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, positionsData[k][z].date, positionsData[k][z].url])
        countGood++;
      }
      else if (positionsData[k][z].badFlag == true) {
        badSheet.appendRow([positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, positionsData[k][z].date, positionsData[k][z].url])
        countBad++;
      }
    
    }
  }

  // Now send an email to the user's inbox with a report of what was found today 
  mailBody = "TODAY'S REPORT \r\r" +
    "Found " + countGood + " Matching Positions \r\r" +
    "Found " + countBad + " Rejected Positions \r\r" +
    "See Results Here: " + spreadsheetURL;
  GmailApp.sendEmail(userEmail, "Daily Job Search Report From BotMan", mailBody);
  
} // END OF MAIN FUNCTION



