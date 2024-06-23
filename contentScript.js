console.log("contentscript.js injected");

let highlightedWord = ''; // Variable to store the highlighted word

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

    let tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${clientY}px`;
    tooltip.style.left = `${clientX}px`;
    tooltip.style.backgroundColor = 'rgba(365,365,365,0.9)';
    tooltip.style.padding = '15px';
    tooltip.style.maxWidth = '330px';
    tooltip.style.borderRadius = '10px';

    let tooltipContent = document.createElement('div');
    tooltipContent.className = 'tooltip-content';
    tooltipContent.style.color = 'rgb(48,46,46)';

    definitions.forEach((definition, index) => {
        if (definition.shortdef && definition.shortdef.length > 0) {
            let definitionText = document.createElement('p');
            definitionText.textContent = `${index + 1}. ${definition.shortdef[0]}`;
            tooltipContent.appendChild(definitionText);
        }
    });

    let audioButton = document.createElement('button');
    audioButton.textContent = 'Play Audio';
    audioButton.addEventListener('click', () => {
        playTextToSpeech(highlightedWord); //no audio i guess
    });

    let popupHighlightedWord = document.createElement('h3');
    popupHighlightedWord.textContent = highlightedWord.charAt(0).toUpperCase() + highlightedWord.slice(1);
    popupHighlightedWord.style.color = 'rgb(171,58,50)';
    popupHighlightedWord.style.backgroundColor = 'rgba(240, 227,192,0.7';
    popupHighlightedWord.style.height = '30px';
    popupHighlightedWord.style.margin = '5px';
    popupHighlightedWord.style.display = 'flex';
    popupHighlightedWord.style.alignItems = 'center';
    popupHighlightedWord.style.borderRadius = '5px';
    popupHighlightedWord.style.paddingLeft = '5px';

    tooltip.appendChild(popupHighlightedWord);
    tooltip.appendChild(tooltipContent);
    tooltip.appendChild(audioButton);
    document.body.appendChild(tooltip);

    // Close tooltip when clicking outside
    document.addEventListener('click', function closeTooltip(event) {
        if (!tooltip.contains(event.target)) {
            document.removeEventListener('click', closeTooltip);
            tooltip.remove();
        }
    });
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
