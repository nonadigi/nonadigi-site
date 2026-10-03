/* ============================================================
   NONA DIGI — SITE CONFIG
   Fill these in before launch.
   ============================================================ */
// Formspree endpoint for the free-audit form. Create a free account at
// https://formspree.io, make a form, and paste the endpoint URL here,
// e.g. window.NONADIGI_FORMSPREE = "https://formspree.io/f/xabc1234";
// Leave empty to keep the form in demo mode (shows success UI only).
window.NONADIGI_FORMSPREE = "https://formspree.io/f/mqparozk";



/* ---- Nona widget ---- */
(function(){
  var panel = document.getElementById('nonaPanel');
  var body = document.getElementById('nonaBody');
  var input = document.getElementById('nonaInput');
  var state = 'idle', req = {}, greeted = false;
  var STD = ['Get my free audit', 'Services & pricing', 'How does it work?'];
  var nowT = function(){ return new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}); };
  var validEmail = function(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); };

  function scroll(){ body.scrollTop = body.scrollHeight; }
  function addMsg(text, who, chips){
    var w = document.createElement('div');
    w.className = 'msg ' + who;
    w.innerHTML = '<span class="tag">' + (who === 'bot' ? 'Nona' : 'You') + '</span>' + text + '<div class="time">' + nowT() + '</div>';
    body.appendChild(w);
    if (chips && chips.length){
      var c = document.createElement('div');
      c.className = 'nona-chips';
      chips.forEach(function(label){
        var b = document.createElement('button');
        b.className = 'nona-chip'; b.textContent = label;
        b.onclick = function(){ c.remove(); sendUser(label); };
        c.appendChild(b);
      });
      body.appendChild(c);
    }
    scroll();
  }
  function botSay(text, chips, delay){
    var t = document.createElement('div');
    t.className = 'nona-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t); scroll();
    setTimeout(function(){ t.remove(); addMsg(text, 'bot', chips); }, (delay || 900) + Math.random() * 400);
  }
  function sendUser(text){
    if (!text.trim()) return;
    addMsg(text.replace(/</g, '&lt;'), 'user');
    input.value = '';
    setTimeout(function(){ reply(text); }, 300);
  }
  function prices(){ return '<strong>AI Receptionist</strong> — $750 setup + $149/mo<br><strong>AI Visibility Engine</strong> — from $600/mo'; }

  function reply(raw){
    var q = raw.toLowerCase();
    if (state === 'await_audit_biz'){
      req.business = raw.trim().replace(/</g, '&lt;');
      state = 'await_audit_web';
      botSay('Great — <strong>' + req.business + '</strong>. What\'s your website? (Just paste the URL.)');
      return;
    }
    if (state === 'await_audit_web'){
      req.website = raw.trim().replace(/</g, '&lt;').replace(/^https?:\/\//, '');
      state = 'await_audit_email';
      botSay('And where should we send the report?');
      return;
    }
    if (state === 'await_audit_email'){
      if (!validEmail(raw.trim())){ botSay('Hmm, that email doesn\'t look quite right — mind double-checking it?'); return; }
      req.email = raw.trim().replace(/</g, '&lt;');
      state = 'done';
      botSay('You\'re in! Your 5-point AI visibility report for <strong>' + req.business + '</strong> is being prepared — it\'ll land at <strong>' + req.email + '</strong> within 24 hours, along with a personal video walkthrough. Anything else I can help with?', ["I'm good", 'Services & pricing']);
      return;
    }
    if (state === 'await_human_email'){
      if (!validEmail(raw.trim())){ botSay('Hmm, that email doesn\'t look quite right — mind double-checking it?'); return; }
      state = 'done';
      botSay('Got it — someone from the team will reply to <strong>' + raw.trim().replace(/</g, '&lt;') + '</strong> within one business day. Anything else?', ["I'm good", 'Get my free audit']);
      return;
    }
    if (q.indexOf('audit') > -1 || q.indexOf('report') > -1){ req = {}; state = 'await_audit_biz'; botSay('Love it — the audit is the best place to start. What\'s your business name?'); return; }
    if (q.indexOf('price') > -1 || q.indexOf('pricing') > -1 || q.indexOf('cost') > -1 || q.indexOf('much') > -1){
      botSay('Here\'s the menu:<br>' + prices() + '<br><br>Founding clients get 40% off setup with pricing locked in for life. Want the free audit to see which fits?', ['Get my free audit', "I'm good"]); return;
    }
    if (q.indexOf('service') > -1 || q.indexOf('offer') > -1 || q.indexOf('what do you do') > -1){
      botSay('Two offers, done properly:<br><br><strong>AI Receptionist</strong> — a 24/7 AI front desk for your website. Answers, qualifies, books while you sleep.<br><br><strong>AI Visibility Engine</strong> — become the business ChatGPT, Gemini and Perplexity recommend.', ['Get my free audit', 'How does it work?']); return;
    }
    if (q.indexOf('how does it work') > -1 || q.indexOf('how it works') > -1 || q.indexOf('process') > -1){
      botSay('<strong>1.</strong> Try the demo on this page — our AI receptionist for a fictional dental clinic.<br><strong>2.</strong> Get your free audit.<br><strong>3.</strong> Go live in 7 days.', ['Get my free audit', "I'm good"]); return;
    }
    if (q.indexOf('demo') > -1){
      botSay('The Smile Studio demo above is our AI Receptionist in action — for a fictional dental clinic. And <em>right now</em>, I\'m the same product working for Nona Digi. Want us to map it out for your business?', ['Get my free audit']); return;
    }
    if (q.indexOf('human') > -1 || q.indexOf('real person') > -1 || q.indexOf('team') > -1 || q.indexOf('contact') > -1){
      state = 'await_human_email'; botSay('Of course — leave your email and someone from the team will reply within one business day.'); return;
    }
    if (q.indexOf("i'm good") > -1 || q.indexOf('im good') > -1){ botSay('Perfect — have a great day! If anything comes up later, I\'ll be right here.'); return; }
    if (q.indexOf('thank') > -1){ botSay('Anytime! If anything else comes up, I\'ll be right here.'); return; }
    if (q.indexOf('bye') > -1){ botSay('Take care — and remember, your competitors\' customers are asking AI for recommendations right now.'); return; }
    botSay('Good question — I\'ll have the team confirm that personally. Meanwhile, can I help with services, pricing, or the free audit?', STD);
  }

  function open(){
    panel.classList.add('open');
    document.getElementById('nonaFab').setAttribute('aria-expanded', 'true');
    if (!greeted){
      greeted = true;
      botSay('Hey! I\'m <strong>Nona</strong>, Nona Digi\'s AI assistant. Ask me about our services and pricing — or get your <strong>free AI visibility audit</strong>.', STD, 500);
    }
    setTimeout(function(){ input.focus(); }, 350);
  }
  function close(){ panel.classList.remove('open'); document.getElementById('nonaFab').setAttribute('aria-expanded', 'false'); }
  document.getElementById('nonaFab').onclick = function(){ panel.classList.contains('open') ? close() : open(); };
  document.getElementById('nonaClose').onclick = close;
  document.getElementById('nonaSend').onclick = function(){ sendUser(input.value); };
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter') sendUser(input.value); });
  if (location.hash === '#nona') open();
})();

/* ---- Audit form + claim flow + smooth scroll ---- */
var claimMode = false, claimSlot = 2;
function enterClaimMode(slot){
  claimMode = true; claimSlot = slot;
  var pill = document.getElementById('claimPill');
  pill.style.display = 'block';
  pill.textContent = 'Slot ' + slot + ' of 3 · No payment today';
  document.getElementById('auditFormTitle').textContent = 'Hold your founding slot';
  document.getElementById('auditFormFine').textContent = 'Slot ' + slot + ' of 3 · No payment today — submitting holds your slot for 48 hours while we prepare your free audit. You only pay if you decide to go ahead after the audit.';
  var wrap = document.getElementById('audit-form-wrap');
  wrap.style.border = '2px solid var(--primary)';
  smoothTo(wrap, true);
}
document.getElementById('claimSlotBtn').addEventListener('click', function(e){
  e.preventDefault(); enterClaimMode(2);
});
document.querySelectorAll('.slot-btn').forEach(function(b){
  b.addEventListener('click', function(){ enterClaimMode(parseInt(b.dataset.slot, 10)); });
});
function setErr(id, msg){
  var e = document.getElementById('err-' + id);
  var f = document.getElementById(id);
  if (msg){ e.textContent = msg; e.style.display = 'block'; f.classList.add('bad'); }
  else { e.style.display = 'none'; f.classList.remove('bad'); }
  return !msg;
}
document.getElementById('auditForm').addEventListener('submit', function(e){
  e.preventDefault();
  var name = document.getElementById('f-name').value.trim();
  var biz = document.getElementById('f-biz').value.trim();
  var web = document.getElementById('f-web').value.trim();
  var em = document.getElementById('f-email').value.trim();
  var ok = true;
  ok = setErr('f-name', name ? '' : 'Please enter your name') && ok;
  ok = setErr('f-biz', biz ? '' : 'Please enter your business name') && ok;
  ok = setErr('f-web', web ? '' : 'Please enter your website') && ok;
  ok = setErr('f-email', !em ? 'Please enter your email' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) ? '' : 'That email doesn\'t look right — mind checking it?')) && ok;
  if (!ok){
    var firstBad = document.querySelector('#auditForm input.bad');
    if (firstBad) firstBad.focus();
    return;
  }
  /* Production: forward the lead to Formspree (if configured above).
     Fire-and-forget — the success UI shows regardless so the UX never
     hangs on the network. */
  try {
    if (window.NONADIGI_FORMSPREE) {
      var payload = { name: name, business: biz, website: web, email: em,
        _replyto: em,
        _subject: (claimMode ? 'Founding slot ' + claimSlot + ' hold' : 'Free audit request') + ' — ' + biz,
        request: claimMode ? ('Founding slot ' + claimSlot + ' of 3') : 'Free AI visibility audit',
        page: location.href };
      if (navigator.sendBeacon) {
        navigator.sendBeacon(window.NONADIGI_FORMSPREE,
          new Blob([JSON.stringify(payload)], {type: 'application/json'}));
      } else {
        fetch(window.NONADIGI_FORMSPREE, { method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload), keepalive: true });
      }
    }
  } catch (err) { /* never block the UX */ }
  document.getElementById('audit-form-inner').style.display = 'none';
  var done = document.getElementById('audit-done');
  if (claimMode) {
    var safeBiz = biz ? biz.replace(/</g, '&lt;') : 'your business';
    var safeEm = em ? em.replace(/</g, '&lt;') : 'your inbox';
    document.getElementById('doneTitle').textContent = 'Slot ' + claimSlot + ' held — no payment taken';
    document.getElementById('doneText').innerHTML = 'Slot ' + claimSlot + ' is held for <strong>' + safeBiz + '</strong> for the next 48 hours.<br>Your audit + video walkthrough land at <strong>' + safeEm + '</strong> within 24 hours — then we lock it in on a call.';
  } else if (em) {
    document.getElementById('done-email').textContent = em;
  }
  done.style.display = 'block';
  smoothTo(done, true);
});
/* smooth in-page scrolling for every anchor button (nav + CTAs).
   Uses window.scrollTo instead of scrollIntoView — more reliable on mobile WebKit. */
function smoothTo(el, center, instant){
  var r = el.getBoundingClientRect();
  var y = r.top + window.pageYOffset - (center ? Math.max(0, (window.innerHeight - r.height) / 2) : 80);
  if (instant) { window.scrollTo(0, y); } else { window.scrollTo({top: y, behavior: 'smooth'}); }
}
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  if (a.id === 'claimSlotBtn') return;
  a.addEventListener('click', function(e){
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el){ e.preventDefault(); smoothTo(el, el.id === 'demoWindow', el.id === 'audit'); }
  });
});

/* ---- Smile Studio live demo engine ---- */
/* Smile Studio LIVE demo engine (blue identity) — ported from demo.html */
(function(){
  var CFG = {
    businessName: "Smile Studio", botName: "Smile Studio AI",
    hours: "Mon–Fri 9 AM–6 PM, Sat 9 AM–2 PM",
    address: "1234 Lake Nona Blvd, Orlando, FL", phone: "(407) 555-0134",
    services: [
      { name: "Cleaning & checkup", price: "$99", keys: ["cleaning", "checkup", "check-up", "exam"] },
      { name: "In-office whitening", price: "$349", keys: ["whitening", "whiten", "bleaching", "brighten"] },
      { name: "Take-home whitening kit", price: "$129", keys: ["take-home", "take home", "kit"] },
      { name: "Filling", price: "from $150", keys: ["filling", "cavity", "cavities"] },
      { name: "Root canal", price: "from $800", keys: ["root canal"] },
      { name: "Crown", price: "from $950", keys: ["crown"] },
      { name: "Invisalign consultation", price: "free", keys: ["invisalign", "braces", "aligners", "straighten"] }
    ],
    insurances: ["Delta Dental", "Cigna", "Aetna", "MetLife", "Guardian"],
    bookingDays: ["Thursday", "Friday", "Saturday"],
    bookingTimes: ["9:30 AM", "11:00 AM", "2:30 PM", "4:00 PM"]
  };
  var body = document.getElementById('demoBody');
  var input = document.getElementById('demoInput');
  var state = 'idle', booking = {}, greeted = false;
  var STD = ['Book an appointment', 'See prices', 'Opening hours'];
  var nowT = function(){ return new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}); };
  function parsePhone(raw){
    var d = raw.replace(/\D/g, '');
    var digits = (d.length === 11 && d[0] === '1') ? d.slice(1) : d;
    if (digits.length !== 10) return null;
    if (/^(\d)\1{9}$/.test(digits)) return null;
    if (digits.split('').sort().join('') === '0123456789') return null;
    if (/^55501\d\d$/.test(digits)) return null;
    return digits;
  }
  var fmtPhone = function(d){ return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6); };
  function scroll(){ body.scrollTop = body.scrollHeight; }
  function addMsg(text, who, chips){
    var w = document.createElement('div');
    w.className = 'msg ' + who;
    w.innerHTML = '<span class="tag">' + (who === 'bot' ? CFG.botName : 'You') + '</span>' + text + '<div class="time">' + nowT() + '</div>';
    body.appendChild(w);
    if (chips && chips.length){
      var c = document.createElement('div');
      c.className = 'demo-chips';
      chips.forEach(function(label){
        var b = document.createElement('button');
        b.className = 'demo-chip'; b.textContent = label;
        b.onclick = function(){ c.remove(); sendUser(label); };
        c.appendChild(b);
      });
      body.appendChild(c);
    }
    scroll();
  }
  function botSay(text, chips, delay){
    var t = document.createElement('div');
    t.className = 'nona-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t); scroll();
    setTimeout(function(){ t.remove(); addMsg(text, 'bot', chips); }, (delay || 900) + Math.random() * 400);
  }
  function sendUser(text){
    if (!text.trim()) return;
    addMsg(text.replace(/</g, '&lt;'), 'user');
    input.value = '';
    setTimeout(function(){ reply(text); }, 300);
  }
  function findService(q){
    q = q.toLowerCase();
    return CFG.services.find(function(s){ return s.keys.some(function(k){ return q.indexOf(k) > -1; }); });
  }
  function prices(){ return CFG.services.map(function(s){ return s.name + ' <strong>' + s.price + '</strong>'; }).join('<br>· '); }

  function reply(raw){
    var q = raw.toLowerCase();
    var hasBooking = booking.status === 'confirmed';
    if (state === 'await_service'){
      var picked = CFG.services.find(function(s){ return q.indexOf(s.name.toLowerCase()) > -1 || s.keys.some(function(k){ return q.indexOf(k) > -1; }); });
      booking.service = picked ? picked.name : raw.trim().replace(/</g, '&lt;');
      booking.interest = booking.service;
      state = 'await_insurance';
      botSay('Got it — <strong>' + booking.service + '</strong>. Quick check: do you have dental insurance?', ['Yes', 'No']);
      return;
    }
    if (state === 'await_insurance'){
      if (q === 'yes' || q.indexOf('yes') > -1 || q.indexOf('yeah') > -1 || q.indexOf('yep') > -1){
        state = 'await_insurance_name';
        botSay('Which provider?', CFG.insurances.concat(['Other']));
        return;
      }
      booking.insurance = 'None';
      state = 'await_day';
      botSay('No problem — I\'ll note that down. Which day works best for you?', CFG.bookingDays);
      return;
    }
    if (state === 'await_insurance_name'){
      var prov = CFG.insurances.find(function(i){ return q.indexOf(i.toLowerCase()) > -1; });
      booking.insurance = prov || raw.trim().replace(/</g, '&lt;');
      state = 'await_day';
      botSay('Thanks — we\'ll verify your ' + booking.insurance + ' coverage before your visit, so no surprises. Which day works best?', CFG.bookingDays);
      return;
    }
    if (state === 'await_day'){
      var day = CFG.bookingDays.find(function(d){ return q.indexOf(d.toLowerCase()) > -1; }) || raw.trim();
      booking.day = day.charAt(0).toUpperCase() + day.slice(1);
      state = 'await_time';
      botSay('Great — ' + booking.day + ' it is. What time works best?', CFG.bookingTimes);
      return;
    }
    if (state === 'await_time'){
      booking.time = raw.trim();
      state = 'await_name';
      botSay('Locked in: ' + booking.day + ' at ' + booking.time + '. What\'s your full name for the booking?');
      return;
    }
    if (state === 'await_name'){
      booking.name = raw.trim().replace(/</g, '&lt;');
      state = 'await_phone';
      botSay('Thanks ' + booking.name.split(' ')[0] + '! And a mobile number where we can send the confirmation?');
      return;
    }
    if (state === 'await_phone_human'){
      var dh = parsePhone(raw);
      if (!dh){ botSay('Hmm, that number doesn\'t look quite right — mind double-checking it?'); return; }
      state = 'done';
      botSay('Got it — someone from our front desk will call <strong>' + fmtPhone(dh) + '</strong> during business hours. Anything else I can do for you right now?', STD);
      return;
    }
    if (state === 'await_phone'){
      var dg = parsePhone(raw);
      if (!dg){ botSay('Hmm, that number doesn\'t look quite right — mind double-checking it?'); return; }
      booking.phone = fmtPhone(dg);
      booking.status = 'confirmed';
      state = 'done';
      var first = booking.name.split(' ')[0];
      var svcBit = booking.service ? ' for <strong>' + booking.service + '</strong>' : '';
      var insBit = (booking.insurance && booking.insurance !== 'None') ? ' We\'ll verify your ' + booking.insurance + ' coverage ahead of time.' : '';
      var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CFG.address);
      botSay('Done, ' + first + ' — you\'re booked' + svcBit + ', <strong>' + booking.day + ' at ' + booking.time + '</strong>.' + insBit + ' Confirmation is on its way to ' + booking.phone + '.<br><br>Find us at ' + CFG.address + ' — <a href="' + mapsUrl + '" target="_blank" rel="noopener">get directions →</a>. Free parking right outside.<br><br>Anything else I can help with?', ["I'm good", 'See prices', 'Opening hours']);
      return;
    }
    if (state === 'await_resched_day'){
      var rd = CFG.bookingDays.find(function(d){ return q.indexOf(d.toLowerCase()) > -1; }) || raw.trim();
      booking.day = rd.charAt(0).toUpperCase() + rd.slice(1);
      state = 'await_resched_time';
      botSay('Got it — ' + booking.day + '. What time works instead?', CFG.bookingTimes);
      return;
    }
    if (state === 'await_resched_time'){
      booking.time = raw.trim();
      state = 'done';
      botSay('All set — moved your appointment' + (booking.service ? ' for ' + booking.service : '') + ' to <strong>' + booking.day + ' at ' + booking.time + '</strong>. Anything else I can help with?', ["I'm good", 'See prices', 'Opening hours']);
      return;
    }
    if (state === 'await_cancel_confirm'){
      if (q === 'yes' || q.indexOf('yes') > -1 || q.indexOf('yeah') > -1 || q.indexOf('yep') > -1){
        booking.status = 'cancelled';
        state = 'idle';
        botSay('Done — your appointment' + (booking.service ? ' for ' + booking.service : '') + ' on ' + booking.day + ' at ' + booking.time + ' is cancelled. Sorry to see you go! If you\'d like to rebook anytime, just say the word.', ['Book an appointment']);
        return;
      }
      state = 'done';
      botSay('Glad to hear it! Your appointment is still on for <strong>' + booking.day + ' at ' + booking.time + '</strong>.', ["I'm good"]);
      return;
    }
    if (q.indexOf('cancel') > -1){
      if (!hasBooking){ botSay('No appointment on the books to cancel — want to book one?', ['Book an appointment']); return; }
      state = 'await_cancel_confirm';
      botSay('Just to confirm — cancel your appointment' + (booking.service ? ' for ' + booking.service : '') + ' on <strong>' + booking.day + ' at ' + booking.time + '</strong>?', ['Yes, cancel it', 'No, keep it']);
      return;
    }
    if (q.indexOf('reschedule') > -1 || q.indexOf('change my appointment') > -1 || q.indexOf('move my appointment') > -1 || q.indexOf('different day') > -1 || q.indexOf('different time') > -1){
      if (!hasBooking){ botSay('It doesn\'t look like you have an appointment booked yet — want to book one now?', ['Book an appointment']); return; }
      state = 'await_resched_day';
      botSay('No problem! Which day works instead?', CFG.bookingDays);
      return;
    }
    if (q.indexOf('book') > -1 || q.indexOf('appointment') > -1 || q.indexOf('schedule') > -1 || q.indexOf('availability') > -1 || q.indexOf('available') > -1){
      if (hasBooking){
        botSay('You already have an appointment' + (booking.service ? ' for <strong>' + booking.service + '</strong>' : '') + ' booked for <strong>' + booking.day + ' at ' + booking.time + '</strong>. Want to reschedule it instead?', ['Reschedule it', "I'm good"]);
        return;
      }
      booking = {};
      state = 'await_service';
      botSay('I\'d love to get you booked in. Which service is this for?', CFG.services.map(function(s){ return s.name; }));
      return;
    }
    var svc = findService(q);
    if (svc){
      var extra = svc.name.toLowerCase().indexOf('whitening') > -1 && svc.name.toLowerCase().indexOf('take-home') === -1
        ? ' Take-home kits start at $129 if you prefer.' : '';
      botSay(svc.name + ' is <strong>' + svc.price + '</strong>.' + extra + ' Want me to book you a free consultation?', ['Yes, book me in', 'What else do you offer?']);
      return;
    }
    if (q.indexOf('price') > -1 || q.indexOf('cost') > -1 || q.indexOf('much') > -1){
      botSay('Here\'s a quick rundown:<br>· ' + prices() + '<br><br>Want details on any of these, or shall I book you a free consultation?', ['Book an appointment', 'Do you take insurance?']);
      return;
    }
    if (q.indexOf('hour') > -1 || q.indexOf('open') > -1 || q.indexOf('close') > -1 || q.indexOf('when') > -1){
      botSay('We\'re open <strong>' + CFG.hours + '</strong>. Even when we\'re closed, I can still book you in — want to grab a slot?', ['Book an appointment']);
      return;
    }
    if (q.indexOf('where') > -1 || q.indexOf('address') > -1 || q.indexOf('located') > -1 || q.indexOf('direction') > -1){
      var mu = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CFG.address);
      botSay('You\'ll find us at <strong>' + CFG.address + '</strong> — <a href="' + mu + '" target="_blank" rel="noopener">get directions →</a>. Free parking right outside.');
      return;
    }
    if (q.indexOf('insurance') > -1){
      botSay('We work with ' + CFG.insurances.join(', ') + ', and we\'ll verify your coverage before any treatment so there are no surprises. Which one do you have?');
      return;
    }
    if (q.indexOf('new patient') > -1 || q.indexOf('first visit') > -1 || q.indexOf('first time') > -1){
      botSay('Welcome! New patients get a <strong>free whitening consultation (normally $75)</strong>. Shall I book your first visit?', ['Yes, book me in']);
      return;
    }
    if (q.indexOf('offer') > -1 || q.indexOf('what else') > -1 || (q.indexOf('services') > -1 && q.indexOf('price') === -1)){
      botSay('Here\'s what we offer:<br>· ' + prices() + '<br><br>Want details on any of these, or shall I book you in?', ['Book an appointment', 'See prices']);
      return;
    }
    if (q.indexOf('human') > -1 || q.indexOf('real person') > -1 || q.indexOf('call me') > -1 || q.indexOf('person') > -1){
      botSay('Of course — I\'ll have someone from the front desk call you within business hours. What\'s the best number to reach you?');
      state = 'await_phone_human';
      return;
    }
    if (q.indexOf("i'm good") > -1 || q.indexOf('im good') > -1){ botSay('Perfect — have a great day! If anything comes up later, even at 2 AM, I\'ll be right here.'); return; }
    if (q.indexOf('thank') > -1){ botSay('Anytime! If anything else comes up, I\'ll be right here.'); return; }
    if (q.indexOf('bye') > -1){ botSay('Take care! We look forward to seeing your smile.'); return; }
    botSay('Good question — I want to make sure you get the right answer, so I\'ll have the team confirm that personally. Meanwhile, can I help with prices, hours, or booking an appointment?', STD);
  }

  document.getElementById('demoSend').onclick = function(){ sendUser(input.value); };
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter') sendUser(input.value); });
  document.getElementById('talkCta').addEventListener('click', function(){ setTimeout(function(){ input.focus(); }, 600); });
  setTimeout(function(){
    greeted = true;
    botSay('Hi! Looking for a dentist in Lake Nona? I can answer questions, check availability, and book you in — what do you need?', ['Book an appointment', 'See prices', 'Opening hours'], 600);
  }, 900);
})();
