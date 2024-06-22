chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Message received in content script:", request);
  if (request.action === "showPopup") {
      showPopup(request.text);
  } else if (request.action === "createDiv") {
      createDiv(request.params);
  }
});

function showPopup(selectedText) {
  console.log("Creating popup for text:", selectedText);

  let overlay = document.createElement('div');
  overlay.className = 'overlay';
  
  let popupContent = document.createElement('div');
  popupContent.className = 'popup-content';
  popupContent.innerHTML = `
      <div id="word">${selectedText}</div>
      <button id="closeButton">Close</button>
  `;
  
  overlay.appendChild(popupContent);
  document.body.appendChild(overlay);
  
  document.getElementById('closeButton').addEventListener('click', function() {
      document.body.removeChild(overlay);
  });
}

function createDiv(params) {
  console.log("Creating div with params:", params);

  var div = document.createElement("div");
  div.style.width = params.width;
  div.style.height = params.height;
  div.innerHTML = params.innerHTML;
  document.body.appendChild(div);
}
