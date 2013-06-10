// @author diamondbishop 
// Redirects from mobile wiki pages to normal pages when extension is on

var RequestMatcher = chrome.declarativeWebRequest.RequestMatcher;
var RedirectByRegEx = chrome.declarativeWebRequest.RedirectByRegEx;


function registerRules() {
  var redirectRule = {
    priority: 100,
    conditions: [
      // Match if this is a mobile wiki page
      new RequestMatcher({
        url: {hostContains: '.m.wikipedia.'}}),
    ],
    actions: [
		//Use a regex to redirect to non-mobile page
		new RedirectByRegEx({from:'^(.*)(\.m\.wikipedia)(.*)', to:"$1.wikipedia$3"})
    ]
  };


  var callback = function() {
    if (chrome.extension.lastError) {
      console.error('Error adding rules: ' + chrome.extension.lastError);
    } else {
      console.info('Rules successfully installed');
      chrome.declarativeWebRequest.onRequest.getRules(null,
          function(rules) {
            console.info('Now the following rules are registered: ' +
                         JSON.stringify(rules, null, 2));
          });
    }
  };

  chrome.declarativeWebRequest.onRequest.addRules(
      [redirectRule], callback);
}

function setup() {
  // This function is also called when the extension has been updated.  Because
  // registered rules are persisted beyond browser restarts, we remove
  // previously registered rules before registering new ones.
  chrome.declarativeWebRequest.onRequest.removeRules(
    null,
    function() {
      if (chrome.extension.lastError) {
        console.error('Error clearing rules: ' + chrome.extension.lastError);
      } else {
        registerRules();
      }
    });
}

// This is triggered when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(setup);
