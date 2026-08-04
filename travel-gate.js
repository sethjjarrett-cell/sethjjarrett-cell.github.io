/* Travel journal gate.
   Soft deterrent only: hides each country page behind its own password.
   The page files remain publicly readable in the repository; this
   keeps casual visitors out, nothing more.

   Every journal has a separate password, so handing someone the Japan
   password does not give them Africa. Unlocking one page does not unlock
   the others. The master password opens any of them (that one is for me).

   To change a password: generate a SHA-256 hash of the new phrase and
   replace the matching "hash" below. (Ask Claude, or in any browser
   console run:
     crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourphrase'))
       .then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
   )

   To gate a new journal page: add an entry here keyed by its filename
   (without .html) and put <script src="travel-gate.js"></script> in its
   <head>, before the stylesheet. Pages not listed here are left open. */

(function () {
  var TG_PAGES = {
    "north-america": { name: "North America", hash: "7f7b758fd9198a61abc316282fb3452c154037e53e359747a92f664071e9df70" },
    "asia":          { name: "Asia",          hash: "fed78b98bf23c083eb85abb0766c61a2dea1f6695b9b7470ecd3f874c5efb8e1" },
    "australia":     { name: "Australia",     hash: "49848b8799512c47b7be344774a3936bc3ba687fed2a251cd1b6c67673b38731" },
    "japan":         { name: "Japan",         hash: "583b94291f744c44102f4de526e58080a3ab6e94770f31235ec31ce89b5f4794" },
    "africa":        { name: "Africa",        hash: "78e7758252d88daf4b10808bb469a0287c347dc77b231e89aa7330bd1d21799c" },
    "europe":        { name: "Europe",        hash: "f784d64ca6ec0cd84a9ff92c1aa2ea4374536cad38fff9cef49d89f55a45f0c1" },
    "south-america": { name: "South America", hash: "5042d76fc0e2225f105b465f1db5390073ab64c5295883ba3a8805ce2624546d" }
  };

  // Opens every journal. Mine, not for sharing.
  var TG_MASTER = "a5cab24df8520b3c18a4fa690ae9cc12e965496879131ae7d5032b4d1505a0fd";

  var TG_PREFIX = "sj-journal-unlock:";
  var TG_MASTER_KEY = "sj-journal-unlock:all";

  var slug = (location.pathname.split("/").pop() || "").replace(/\.html?$/i, "").toLowerCase();
  var page = TG_PAGES[slug];
  if (!page) return; // page isn't gated

  var storeKey = TG_PREFIX + slug;

  try {
    if (localStorage.getItem(storeKey) === page.hash) return;   // this page already unlocked
    if (localStorage.getItem(TG_MASTER_KEY) === TG_MASTER) return; // master used earlier
  } catch (e) { /* storage blocked: fall through, gate still works for the session */ }

  // Lock immediately, before the body paints.
  var lockCss =
    "html.tg-lock{overflow:hidden;}" +
    "html.tg-lock body>*:not(.tg-overlay){display:none!important;}" +
    ".tg-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:2rem;background:#171512;color:#e9e4da;font-family:var(--sans,'DM Sans',sans-serif);}" +
    ".tg-card{max-width:430px;width:100%;}" +
    ".tg-eyebrow{font-size:0.68rem;letter-spacing:0.16em;text-transform:uppercase;color:#9b937f;margin-bottom:1rem;}" +
    ".tg-title{font-family:var(--serif,'Lora',serif);font-size:1.9rem;font-weight:400;line-height:1.15;margin-bottom:1rem;}" +
    ".tg-copy{font-size:0.92rem;font-weight:300;line-height:1.8;color:#c9c2b4;margin-bottom:1.75rem;}" +
    ".tg-row{display:flex;gap:0.5rem;margin-bottom:0.75rem;}" +
    ".tg-input{flex:1;padding:0.7rem 0.9rem;font-size:0.92rem;font-family:inherit;background:#211e1a;color:#e9e4da;border:1px solid #3a352d;border-radius:2px;outline:none;}" +
    ".tg-input:focus{border-color:#9b937f;}" +
    ".tg-btn{padding:0.7rem 1.2rem;font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;font-family:inherit;background:#e9e4da;color:#171512;border:none;border-radius:2px;cursor:pointer;}" +
    ".tg-btn:hover{background:#fff;}" +
    ".tg-err{font-size:0.8rem;color:#c96f4a;min-height:1.2rem;margin-bottom:1rem;}" +
    ".tg-links{display:flex;gap:1.5rem;font-size:0.8rem;}" +
    ".tg-links a{color:#9b937f;text-decoration:underline;text-underline-offset:3px;}" +
    ".tg-links a:hover{color:#e9e4da;}";

  document.documentElement.classList.add("tg-lock");
  var st = document.createElement("style");
  st.textContent = lockCss;
  document.head.appendChild(st);

  function hashHex(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function unlock(overlay, master) {
    try {
      if (master) { localStorage.setItem(TG_MASTER_KEY, TG_MASTER); }
      else { localStorage.setItem(storeKey, page.hash); }
    } catch (e) {}
    overlay.remove();
    document.documentElement.classList.remove("tg-lock");
  }

  function buildOverlay() {
    var overlay = document.createElement("div");
    overlay.className = "tg-overlay";
    overlay.innerHTML =
      '<div class="tg-card">' +
      '<p class="tg-eyebrow">Travel journal &middot; ' + page.name + "</p>" +
      '<h1 class="tg-title">This part is not on general display.</h1>' +
      '<p class="tg-copy">The country pages are personal journal entries rather than portfolio material. Each one has its own password. If I have given you the one for ' +
      page.name + ', enter it below. Otherwise you are welcome to ask.</p>' +
      '<div class="tg-row">' +
      '<input class="tg-input" type="password" autocomplete="off" placeholder="Password for ' + page.name + '" aria-label="Password for ' + page.name + '">' +
      '<button class="tg-btn" type="button">Unlock</button>' +
      "</div>" +
      '<p class="tg-err" aria-live="polite"></p>' +
      '<div class="tg-links">' +
      '<a href="mailto:sethjjarrett@gmail.com?subject=Travel%20journal%20access&body=Hi%20Seth%2C%20could%20I%20have%20the%20password%20for%20the%20' + encodeURIComponent(page.name) + '%20journal%20page%3F">Request access</a>' +
      '<a href="travel.html">Back to travel</a>' +
      "</div></div>";
    document.body.appendChild(overlay);

    var input = overlay.querySelector(".tg-input");
    var btn = overlay.querySelector(".tg-btn");
    var err = overlay.querySelector(".tg-err");

    function attempt() {
      var v = input.value.trim();
      if (!v) return;
      hashHex(v).then(function (h) {
        if (h === page.hash) { unlock(overlay, false); }
        else if (h === TG_MASTER) { unlock(overlay, true); }
        else { err.textContent = "Not it, I'm afraid. Each page has its own password."; input.select(); }
      });
    }
    btn.addEventListener("click", attempt);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") attempt(); });
    input.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildOverlay);
  } else {
    buildOverlay();
  }
})();
