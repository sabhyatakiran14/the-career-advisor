/**
 * THE CAREER ADVISOR — Enquiry receiver (Google Apps Script)
 *
 * 1. Open https://script.google.com → New project → paste this file as Code.gs
 * 2. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (required for the public website to POST)
 * 3. Copy the Web app URL into config.js as window.TCA_ENQUIRY_WEB_APP_URL
 * 4. First run: Run → authorize → allow Gmail send for MailApp
 *
 * Each submission emails counsellorpoint2019@gmail.com and appends one row to
 * the spreadsheet this script is bound to (optional: create sheet from Extensions
 * in a new Google Sheet: Extensions → Apps Script, paste this, save, deploy).
 *
 * If the script is NOT bound to a spreadsheet, comment out appendRow below or
 * create a Sheet and bind the script from that Sheet's Extensions menu.
 */
function doPost(e) {
  var p = e.parameter || {};
  var lines = [];
  var order = [
    "student_name",
    "dob",
    "gender",
    "current_class",
    "parent_name",
    "relationship",
    "phone",
    "phone_alt",
    "email",
    "city",
    "state",
    "program_interest",
    "help_topics",
    "callback",
    "message",
    "consent",
  ];
  order.forEach(function (key) {
    if (p[key] !== undefined && p[key] !== "") {
      lines.push(key + ": " + p[key]);
    }
  });
  for (var k in p) {
    if (p.hasOwnProperty(k) && order.indexOf(k) === -1) {
      lines.push(k + ": " + p[k]);
    }
  }
  var body = lines.join("\n") || "(empty payload)";
  var subject = "[The Career Advisor] Enquiry — " + (p.student_name || "Website");

  MailApp.sendEmail({
    to: "counsellorpoint2019@gmail.com",
    subject: subject,
    body: body,
  });

  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (sheet) {
    var sh = sheet.getSheets()[0];
    sh.appendRow([
      new Date(),
      p.student_name || "",
      p.parent_name || "",
      p.phone || "",
      p.email || "",
      p.city || "",
      p.program_interest || "",
      p.help_topics || "",
      p.message || "",
    ]);
  }

  return HtmlService.createHtmlOutput(
    "<html><body style=\"font-family:sans-serif;padding:1rem\">Thank you. You can close this tab.</body></html>"
  );
}
