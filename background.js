chrome.runtime.onInstalled.addListener(function() {
  // Remove any existing context menu items to avoid duplicates
  chrome.contextMenus.removeAll(function() {
      chrome.contextMenus.create({
          id: "contextMenu1",
          title: "Show Popup",
          contexts: ["selection"]
      });
      console.log("Context menu created");
  });
});

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "contextMenu1") {
      console.log("Context menu clicked, sending message to content script with text:", info.selectionText);
      chrome.tabs.sendMessage(tab.id, { action: "showPopup", text: info.selectionText });
  }
});

// Listen for messages from the extension (popup or other components)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Message received in background script:", request);
  if (request.action === "createDiv") {
      console.log("Message received to create div", request.params);
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "createDiv", params: request.params });
          } else {
              console.error("No active tab found.");
          }
      });
  } else if (request.action === "showPopup") {
      console.log("Message received to show popup with text:", request.text);
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "showPopup", text: request.text }, function(response) {
                  if (chrome.runtime.lastError) {
                      console.error("Error sending message to content script:", chrome.runtime.lastError);
                  } else {
                      console.log("Message sent to content script, response:", response);
                  }
              });
          } else {
              console.error("No active tab found.");
          }
      });
  } else if (request.action === "playTextToSpeech") {
      console.log("Message received to play text-to-speech:", request.text);
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "playTextToSpeech", text: request.text }, function(response) {
                  if (chrome.runtime.lastError) {
                      console.error("Error sending message to content script:", chrome.runtime.lastError);
                  } else {
                      console.log("Message sent to content script to play text-to-speech.");
                  }
              });
          } else {
              console.error("No active tab found.");
          }
      });
  }
});
