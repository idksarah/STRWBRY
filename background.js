// background.js (service worker)

chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.action === "showPopup") {
        chrome.action.setPopup({ tabId: sender.tab.id, popup: "popup.html" });
    }
});
