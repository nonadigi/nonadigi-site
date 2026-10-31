/* "Email me this result" — shared widget for the text-result tools.
   A page opts in by defining window.NonaEmailResult = { tool, title, getText }
   and placing <div id="emailResult"></div> where the block should appear.
   Sends go through the tools-email Edge Function, which applies the
   fixed template and the daily fair-use caps. */
(function () {
  "use strict";
  var cfg = window.NonaEmailResult;
  var host = document.getElementById("emailResult");
  if (!cfg || !host) return;
  var API = "https://ohwnsrwjdzigzceisker.supabase.co/functions/v1/tools-email";
  var ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9od25zcndqZHppZ3pjZWlza2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMzQzNDksImV4cCI6MjEwNjgxMDM0OX0.Lp_hcHPBRBCeJxCIIgpKpeUGTLSdhG3FrbDTkYSu2NA";

  host.innerHTML =
    '<div class="email-box">' +
      '<div class="email-head">📧 <b>Want this in your inbox?</b> <span>We will email you this result — no account, no strings.</span></div>' +
      '<div class="email-row" style="display:none">' +
        '<input type="email" class="email-input" placeholder="you@example.com" autocomplete="email">' +
        '<button type="button" class="btn btn-primary btn-sm email-send">Send it to me</button>' +
      '</div>' +
      '<button type="button" class="btn btn-ghost btn-sm email-open">Email me this result</button>' +
      '<p class="email-msg" style="display:none"></p>' +
    "</div>";

  var openBtn = host.querySelector(".email-open"),
      row = host.querySelector(".email-row"),
      input = host.querySelector(".email-input"),
      sendBtn = host.querySelector(".email-send"),
      msg = host.querySelector(".email-msg");

  function showMsg(text, ok) {
    msg.textContent = text;
    msg.style.display = "";
    msg.style.color = ok ? "#067a57" : "#9c1032";
    msg.style.fontWeight = "700";
  }
  openBtn.addEventListener("click", function () {
    openBtn.style.display = "none";
    row.style.display = "";
    input.focus();
  });
  sendBtn.addEventListener("click", function () {
    var email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { showMsg("That email address does not look complete. Check it and try again.", false); return; }
    var text = "";
    try { text = cfg.getText() || ""; } catch (e) { text = ""; }
    if (!text || text.trim().length < 10) { showMsg("There is no result to send yet — use the tool first.", false); return; }
    sendBtn.disabled = true; sendBtn.textContent = "Sending…";
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + ANON },
      body: JSON.stringify({ action: "email_result", email: email, tool: cfg.tool, title: cfg.title || "", result: text })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j && res.j.error ? res.j.error : "Something went wrong. Please try again.");
        row.style.display = "none";
        showMsg("Sent — check your inbox. It should arrive within a minute or two.", true);
      })
      .catch(function (e) { showMsg(e.message || "Something went wrong. Please try again.", false); })
      .finally(function () { sendBtn.disabled = false; sendBtn.textContent = "Send it to me"; });
  });
})();
