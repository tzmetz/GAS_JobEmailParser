// Initializes the beginning of the triggering 
// Triggers code execution on each weekday at 5pm
function triggerStart() {
  ScriptApp.newTrigger("mainFun")
  .timeBased()
  .atHour(17)
  .onWeekDay(ScriptApp.WeekDay.MONDAY)
  .create()
 
  ScriptApp.newTrigger("mainFun")
  .timeBased()
  .atHour(17)
  .onWeekDay(ScriptApp.WeekDay.TUESDAY)
  .create()
 
  ScriptApp.newTrigger("mainFun")
  .timeBased()
  .atHour(17)
  .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
  .create()
 
  ScriptApp.newTrigger("mainFun")
  .timeBased()
  .atHour(17)
  .onWeekDay(ScriptApp.WeekDay.THURSDAY)
  .create()
 
  ScriptApp.newTrigger("mainFun")
  .timeBased()
  .atHour(17)
  .onWeekDay(ScriptApp.WeekDay.FRIDAY)
  .create()
 
}
