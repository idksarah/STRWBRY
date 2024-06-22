document.getElementById('closeButton').addEventListener('click', function() {
    window.close();
});

// Function to set the text in the popup
function setText(text) {
    document.getElementById('word').innerText = text;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "showPopup") {
        setText(request.text);
    }
});
