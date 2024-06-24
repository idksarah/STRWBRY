console.log("contentscript.js injected");

let highlightedWord = ''; // Variable to store the highlighted word
let tooltip = null; // Variable to store the tooltip

async function fetchDefinition(word) {
    const apiKey = 'e9cf6d9e-d14f-4994-b21c-31ac82894fc5';
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/spanish/json/${word.toLowerCase()}?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

async function afterSelection(event) {
    highlightedWord = getSelectedText().trim().toLowerCase(); // Store the highlighted word
    if (highlightedWord.length === 0) {
        return;
    }

    console.log('Selected Text:', highlightedWord);
    const definitions = await fetchDefinition(highlightedWord);
    console.log('Definitions:', definitions);
    displayDefinitions(event.clientX, event.clientY, definitions);
}

function displayDefinitions(clientX, clientY, definitions) {
    if (!definitions || definitions.length === 0) {
        return;
    }

    // Create tooltip only if it doesn't exist
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '100000';
        tooltip.style.top = `${clientY}px`;
        tooltip.style.left = `${clientX}px`;
        tooltip.style.backgroundColor = 'rgba(365,365,365,0.9)';
        tooltip.style.padding = '15px';
        tooltip.style.maxWidth = '330px';
        tooltip.style.borderRadius = '10px';

        let tooltipContent = document.createElement('div');
        tooltipContent.className = 'tooltip-content';
        tooltipContent.style.color = 'rgb(73,68,68)';

        definitions.forEach((definition, index) => {
            if (definition.shortdef && definition.shortdef.length > 0) {
                let definitionText = document.createElement('p');
                definitionText.textContent = `${index + 1}. ${definition.shortdef[0]}`;
                tooltipContent.appendChild(definitionText);
            }
        });
        

        let audioButton = document.createElement('button');
        //audioButton.textContent = 'Play Audio';
        audioButton.style.background = 'rgba(201,100,92,0.7)'
        audioButton.style.borderRadius = '100%';
        audioButton.style.borderWidth = '0px';
        audioButton.style.width = 'auto';
        audioButton.style.height = '30px';
        audioButton.style.cursor = 'pointer';

        let audioIcon = document.createElement('img');
        audioIcon.src = chrome.runtime.getURL('volumeIcon.png');
        audioIcon.alt = 'Play Audio';
        audioIcon.style.width = '18px';
        audioIcon.style.height = '18px';

        audioButton.appendChild(audioIcon);

        audioButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from triggering the tooltip close logic
            playTextToSpeech(highlightedWord);
        });

        let popupHighlightedWord = document.createElement('h3');
        popupHighlightedWord.textContent = highlightedWord.charAt(0).toUpperCase() + highlightedWord.slice(1);
        popupHighlightedWord.style.color = 'rgb(209,115,108)';
        popupHighlightedWord.style.backgroundColor = 'rgba(240, 227,192,0.7)';
        popupHighlightedWord.style.height = '30px';
        popupHighlightedWord.style.margin = '5px';
        popupHighlightedWord.style.display = 'flex';
        popupHighlightedWord.style.alignItems = 'center';
        popupHighlightedWord.style.borderRadius = '5px';
        popupHighlightedWord.style.paddingRight = '5px';
        popupHighlightedWord.style.paddingLeft = '5px';
        popupHighlightedWord.style.marginRight = '15px';

        let topBar = document.createElement('div');
        topBar.style.display = 'flex';
        topBar.style.alignItems = 'center';

        tooltip.appendChild(topBar);

        topBar.appendChild(popupHighlightedWord);
        topBar.appendChild(audioButton);
        tooltip.appendChild(tooltipContent);
        document.body.appendChild(tooltip);

        // Close tooltip when clicking outside
        document.addEventListener('click', function closeTooltip(event) {
            if (!tooltip.contains(event.target)) {
                document.removeEventListener('click', closeTooltip);
                tooltip.remove();
                tooltip = null; // Reset the tooltip variable
            }
        });
    }
}

function playTextToSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

function getSelectedText() {
    let text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

document.addEventListener('mouseup', afterSelection);

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message received in content script:", request);
    if (request.action === "playTextToSpeech") {
        console.log("Playing text-to-speech:", request.text);
        playTextToSpeech(request.text);
    }
});
