function deleteRow() {
  var spreadsheetURL = "https://docs.google.com/spreadsheets/d/1UWBO4w85lKeSLSztepJvxGR-KYU_pNpnHLRpJFZQptk/edit#gid=0"  
  var ss = SpreadsheetApp.openByUrl(spreadsheetURL).getActiveSheet();
  
  var activeCell = ss.getActiveCell();
  
  var activeRow = activeCell.getRow();
  
  ss.deleteRow(activeRow);
}
