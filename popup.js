chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "showPopup") {
      document.getElementById("word").textContent = message.text;
    }
  });
  