// Stops the automatic triggering of the code
function triggerEnd() {
  var triggers = ScriptApp.getProjectTriggers();
  
  for(var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i])
  }
  
}
