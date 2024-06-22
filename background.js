chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "contextMenu1",
        title: "Show Popup",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "contextMenu1") {
        console.log("Context menu clicked, sending message to content script");
        chrome.tabs.sendMessage(tab.id, { action: "showPopup", text: info.selectionText });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "createDiv") {
        console.log("Message received to create div", request.params);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "createDiv", params: request.params });
        });
    }
});

chrome.action.onClicked.addListener(tab => { … });