/**
 * options.js
 *
 * @license MIT, https://opensource.org/license/mit
 * @version 2.1.1
 * @author  G.A. Jazali, dev@jazali.org
 * @updated 2026-09-28
 * @link    https://addons.mozilla.org/en-US/firefox/addon/put-site-domain-in-tab-title/
 *
 */

function onError(error) {
  console.log(`Error: ${error}`);
}

function saveOptions(e) {
  e.preventDefault();
  let values = document.querySelector("#exceptions").value;
  let domainAfterTitle =
    document.querySelector("#domainAfterTitle").checked;
  browser.storage.sync.set({
    exceptions: values,
    domainAfterTitle: domainAfterTitle,
  }).catch(onError);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    let defaultValues = "colab.research.google.com=Colab\n" +
      "mail.google.com=Gmail\noutlook.live.com=Outlook";
    document.querySelector("#exceptions").value =
      typeof result.exceptions === "string" ?
        result.exceptions : defaultValues;
    document.querySelector("#domainAfterTitle").checked =
      result.domainAfterTitle === true;
  }

  let getting = browser.storage.sync.get(["exceptions", "domainAfterTitle"]);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
