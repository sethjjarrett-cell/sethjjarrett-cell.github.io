/* Travel journal gate.
   Soft deterrent only: hides the page behind a passphrase screen.
   The page files remain publicly readable in the repository; this
   keeps casual visitors out, nothing more.

   To change the passphrase: generate a new SHA-256 hash of your
   chosen phrase and replace TG_HASH below. (Ask Claude, or in any
   browser console run:
     crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourphrase'))
       .then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
   ) */

(function () {
  var TG_HASH = "3bc827f834411aa350fca302a69798332533ac586e9abb010baa3013a89b18da";
  var TG_KEY = "sj-journal-unlock";

  try {
    if (localStorage.getItem(TG_KEY) === TG_HASH) return; // already unlocked
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

  function unlock(overlay) {
    try { localStorage.setItem(TG_KEY, TG_HASH); } catch (e) {}
    overlay.remove();
    document.documentElement.classList.remove("tg-lock");
  }

  function buildOverlay() {
    var page = (document.title || "this page").split("\u2014")[0].trim();
    var overlay = document.createElement("div");
    overlay.className = "tg-overlay";
    overlay.innerHTML =
      '<div class="tg-card">' +
      '<p class="tg-eyebrow">Travel journal</p>' +
      '<h1 class="tg-title">This part is not on general display.</h1>' +
      '<p class="tg-copy">The country pages are personal journal entries rather than portfolio material. If I have given you the passphrase, enter it below; it will unlock all of them. Otherwise you are welcome to ask.</p>' +
      '<div class="tg-row">' +
      '<input class="tg-input" type="password" autocomplete="off" placeholder="Passphrase" aria-label="Passphrase">' +
      '<button class="tg-btn" type="button">Unlock</button>' +
      "</div>" +
      '<p class="tg-err" aria-live="polite"></p>' +
      '<div class="tg-links">' +
      '<a href="mailto:sethjjarrett@gmail.com?subject=Travel%20journal%20access&body=Hi%20Seth%2C%20could%20I%20have%20access%20to%20the%20' + encodeURIComponent(page) + '%20journal%20page%3F">Request access</a>' +
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
        if (h === TG_HASH) { unlock(overlay); }
        else { err.textContent = "Not it, I'm afraid."; input.select(); }
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
