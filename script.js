/**
 * script.js
 *
 * @license MIT, https://opensource.org/license/mit
 * @version 2.1
 * @author  G.A. Jazali, dev@jazali.org
 * @updated 2026-09-28
 * @link    https://addons.mozilla.org/en-US/firefox/addon/put-site-domain-in-tab-title/
 *
 */

// Default preferences
let wwwPrefixRegex = /^ww[w\d]\d?\.(?=[^.]*\.[^.]*)/i;
let maxChar = 16;
let prefixInsteadOfSuffix = true;
const defaultExceptions = [
  ["colab.research.google.com", "Colab"],
  ["mail.google.com", "Gmail"],
  ["outlook.live.com", "Outlook"]
];
let exceptions = new Map(defaultExceptions);

let appliedLabel = null;
let appliedAsPrefix = true;

function onError(error) {
  console.log(`'Put Site Domain in Tab Title' Error: ${error}`);
}

function normalizeDomain(hostname) {
  return hostname.trim().toLowerCase().replace(/\.$/, "")
    .replace(wwwPrefixRegex, "");
}

function parseExceptions(exceptionsText) {
  let parsedExceptions = new Map();

  for (let line of exceptionsText.split(/\r?\n/)) {
    let separatorIndex = line.indexOf("=");
    if (separatorIndex === -1)
      continue;

    let exceptionDomain = normalizeDomain(line.slice(0, separatorIndex));
    let exceptionLabel = line.slice(separatorIndex + 1).trim();
    if (exceptionDomain && exceptionLabel)
      parsedExceptions.set(exceptionDomain, exceptionLabel);
  }

  return parsedExceptions;
}

function onGot(item) {
  if (typeof item.exceptions === "string")
    exceptions = parseExceptions(item.exceptions);
  if (typeof item.domainAfterTitle === "boolean")
    prefixInsteadOfSuffix = !item.domainAfterTitle;
}

function setTitle() {
  if (window.location.protocol != "http:" &&
      window.location.protocol != "https:") {
    return;
  }

  // The regex will cover `www.`, `ww1.`, `www2.`, etc. if they're in the nth
  // level domain, where n >= 3
  let domain = normalizeDomain(window.location.hostname);

  if (exceptions.has(domain)) {
    domain = exceptions.get(domain);
  } else if (domain.length >= maxChar) {
    let domainParts = domain.split('.');
    let shortenedDomain = domainParts.slice(-2).join('.');

    for (let partCount = 3; partCount <= domainParts.length; partCount++) {
      let newShortenedDomain = domainParts.slice(-partCount).join('.');
      if (newShortenedDomain.length > maxChar)
        break;
      shortenedDomain = newShortenedDomain;
    }

    domain = shortenedDomain;
  }
  let toAdd = "[" + domain + "]";

  if (prefixInsteadOfSuffix) {
    if (!document.title.startsWith(toAdd))
      document.title = toAdd + " " + document.title;
  } else {
    if (!document.title.endsWith(toAdd))
      document.title = document.title + " " + toAdd;
  }

  appliedLabel = toAdd;
  appliedAsPrefix = prefixInsteadOfSuffix;
}

function removeAppliedLabel() {
  if (appliedLabel === null)
    return;

  let title = document.title;
  if (appliedAsPrefix && title.startsWith(appliedLabel)) {
    document.title = title.slice(appliedLabel.length).replace(/^ /, "");
  } else if (!appliedAsPrefix && title.endsWith(appliedLabel)) {
    document.title = title.slice(0, -appliedLabel.length).replace(/ $/, "");
  }

  appliedLabel = null;
}

function onStorageChanged(changes, areaName) {
  if (areaName !== "sync")
    return;
  if (!("exceptions" in changes) && !("domainAfterTitle" in changes))
    return;

  removeAppliedLabel();

  if ("exceptions" in changes) {
    let newExceptions = changes.exceptions.newValue;
    exceptions = typeof newExceptions === "string" ?
      parseExceptions(newExceptions) : new Map(defaultExceptions);
  }
  if ("domainAfterTitle" in changes)
    prefixInsteadOfSuffix = changes.domainAfterTitle.newValue !== true;

  setTitle();
}

function startLabelingTitle() {
  setTitle();
  browser.storage.onChanged.addListener(onStorageChanged);

  let observedNode = document.head || document.documentElement;
  if (!observedNode)
    return;

  let observer = new MutationObserver(function() {
    setTitle();
  });
  observer.observe(observedNode,
    { subtree: true, characterData: true, childList: true });
}

// The observer starts after the preferences load
browser.storage.sync.get(["exceptions", "domainAfterTitle"])
  .then(onGot, onError)
  .then(startLabelingTitle);
