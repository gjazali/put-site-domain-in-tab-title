/**
 * script.js
 *
 * @license MIT, https://opensource.org/license/mit
 * @version 2.0
 * @author  G.A. Jazali, dev@jazali.org
 * @updated 2024-05-28
 * @link    https://addons.mozilla.org/en-US/firefox/addon/put-site-domain-in-tab-title/
 *
 */

// Default preferences
let regex = /ww[w\d]\d?\.(?=[^.]*\.[^.]*)/i;
let maxChar = 16;
let prefixInsteadOfSuffix = true;
let exceptions = { // The default exceptions
  "colab.research.google.com": "Colab",
  "mail.google.com": "Gmail",
  "outlook.live.com": "Outlook"
};

// Functions to handle `Promise`
function onError(error) {
  console.log(`'Put Site Domain in Tab Title' Error: ${error}`);
}

function onGot(item) {
  // Exceptions
  if (item.exceptions) {
    exceptions = item.exceptions.split("\n");
    exceptions = exceptions.map((x) => x.split("="));
    exceptions = exceptions.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  setTitle(); // The initial call
}

// Function to determine whether an item is in an `Object` or not
function itemInObject(item, object) {
  try {
    answer = item in object;
  } catch(e) { // If the object is empty
    if (e instanceof TypeError)
      answer = false;
    else
      throw e
  }

  return answer
}

// Function to add prefix to tab title
function setTitle() {
  // If it's neither HTTP nor HTTPS
  if (window.location.protocol != "http:" && window.location.protocol != "https:") {
    return
  }

  // The regex will cover `www.`, `ww1.`, `www2.`, etc. if they're in the nth
  // level domain, where n >= 3.
  var domain = window.location.hostname.replace(regex, "");

  if (itemInObject(domain, exceptions)) {
    domain = exceptions[domain];
  } else {
    if (domain.length >= maxChar) {
      let domainParts = domain.split('.');
      let shortenedDomain = domainParts.slice(-2).join('.');

      for (i = 3; i <= domainParts.length; i++) {
        let newShortenedDomain = domainParts.slice(-i).join('.');
        if (newShortenedDomain.length <= maxChar)
          shortenedDomain = newShortenedDomain;
      }

      domain = shortenedDomain;
    }
  }
  var toAdd  = "[" + domain + "]";

  if (prefixInsteadOfSuffix) {
    if (!document.title.startsWith(toAdd))
      document.title = toAdd + " " + document.title;
  } else {
    if (!document.title.endsWith(toAdd))
      document.title = document.title + " " + toAdd;
  }
}

const exceptionsObtained = browser.storage.sync.get("exceptions");
exceptionsObtained.then(onGot, onError);

var target = document.querySelector('head > title');
var observer = new MutationObserver(function(mutations) {
  setTitle();
});
observer.observe(target, { subtree: true, characterData: true, childList: true });
