// ******************************************************************
// ---------------------- JOB EMAIL PARSER --------------------------
// ******************************************************************

// TODO: add LinkedIn & Indeed search results as well 

// Known issues
// multiline titles and locations cause misses in extraction of other data. Severity: LOW

// Possible Issues
// hiding row may make it not appear when collecting base data for comparing whether or not new data is unique

// FURTHER IMPROVEMENT: use "at" in Linux to run local code at specified time, write the program in 
// python and use selenium to search and scrape google jobs automatically then scrape and parse the job descriptions 
// for even more filtration


// ---------------------- GLOBAL VARIABLES --------------------------
const userEmail = <INSERT_GMAIL_ADDRESS_HERE>

/*
  * main function executes program
  * calls supporting funcs to read today's emails and parse them
  * writes job positions to a spreadsheet and emails user a summary report
  */ 
function mainFun() {
  
  // Set up to record function execution time
  var todayNow = new Date();
  var t0 = todayNow.getTime();
  
  // First Get Today's Messages 
  var messages = getTodaysMessages(); // Returns Array containing arrays of class {messages} 
  
  // Loop through all of today's messages from each email thread today and parse its contents 
  // Store results (array of Position objects) in an array called positionsData
  var positionsData = []; 
  var length_messages = messages.length;
  for (var i = 0; i < length_messages; i++) {
    for (var j = 0; j < messages[i].length; j++) {               // Add breakpoint here to get in and diagnose parsing function. See Funcs.gs for comments showing best places to put breakpoints for diagnosis
      positionsData.push(parseMessage(messages[i][j]));
    }
  }
  
  // Now Write Parsed Job Info To a Spreadsheet 
  var spreadsheetURL = <INSERT_SPREADSHEET_URL_HERE>
  
  var goodSheet = SpreadsheetApp 
  .openByUrl(spreadsheetURL)
  .getSheetByName("Data");
  
  var badSheet = SpreadsheetApp 
  .openByUrl(spreadsheetURL)
  .getSheetByName("Rejects");
  
  // Initialize counts
  var countGood = 0;
  var countBad = 0;
  
  var sheetHeaderOffset = 4; //num rows making up sheet header
  
  // Get data from both good and bad sheets, for comparing new data to make sure we're not writing duplicates to the sheet 
  var titlesData_GOODSHT = goodSheet.getRange(sheetHeaderOffset+1, 1, goodSheet.getLastRow(), 1).getValues();
  var employerData_GOODSHT = goodSheet.getRange(sheetHeaderOffset+1, 2, goodSheet.getLastRow(), 2).getValues();
  var locData_GOODSHT = goodSheet.getRange(sheetHeaderOffset+1, 3, goodSheet.getLastRow(), 3).getValues();
  
  var titlesData_BADSHT = badSheet.getRange(sheetHeaderOffset+1, 1, badSheet.getLastRow(), 1).getValues();
  var employerData_BADSHT = badSheet.getRange(sheetHeaderOffset+1, 2, badSheet.getLastRow(), 2).getValues();
  var locData_BADSHT = badSheet.getRange(sheetHeaderOffset+1, 3, badSheet.getLastRow(), 3).getValues();
  
  // Loop through positions data (array containing arrays of Position Objects from each email thread) and write the contents of each Position object to the spreadsheet
  var length_positionsData = positionsData.length;
  for ( var k = 0; k < length_positionsData; k++) {
    for ( var z = 0; z < positionsData[k].length; z++) {
      
      // Check the flag on the position, if it passed the filter, pass it on to the data sheet. If it didnt pass filter send it to the rejects
      if ( positionsData[k][z].badFlag == false && isPosUnique(positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, titlesData_GOODSHT, employerData_GOODSHT, locData_GOODSHT) ) { 
        goodSheet.appendRow([positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, positionsData[k][z].dateAccessed, positionsData[k][z].datePosted, positionsData[k][z].url])
        countGood++;
      }
      else if ( positionsData[k][z].badFlag == true && isPosUnique(positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, titlesData_BADSHT, employerData_BADSHT, locData_BADSHT) ) {
        badSheet.appendRow([positionsData[k][z].title, positionsData[k][z].employer, positionsData[k][z].loc, positionsData[k][z].dateAccessed, positionsData[k][z].datePosted, positionsData[k][z].url])
        countBad++;
      }
    
    }
  }

  // Measure execution time in ms
  var todayThen = new Date();
  var t1 = todayThen.getTime();
  var executionTime = (t1 - t0)/1000; // [s]
  
  // Now send an email to the user's inbox with a report of what was found today 
  mailBody = "TODAY'S REPORT \r\r" +
    "Found " + countGood + " Matching Positions \r\r" +
    "Found " + countBad + " Rejected Positions \r\r" +
    "See Results Here: " + spreadsheetURL + "\r\r" +
    "Execution Time: " + executionTime + "s"; 
  GmailApp.sendEmail(userEmail, "Daily Job Search Report From BotMan", mailBody); 
  
} // END OF MAIN FUNCTION



