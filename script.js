async function fetchDefinition(word) {
    const apiKey = 'e9cf6d9e-d14f-4994-b21c-31ac82894fc5';
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/spanish/json/${word.toLowerCase()}?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

function displayDefinitions(definitions) {
    if (!definitions || definitions.length === 0) {
        return;
    }

    let definitionText = 'Definitions:\n';
    definitions.forEach((definition, index) => {
        if (definition.shortdef && definition.shortdef.length > 0) {
            definitionText += `${index + 1}. ${definition.shortdef[0]}\n`;
        }
    });
    alert(definitionText);
}

async function afterSelection(event) {
    // Retrieve switch state from localStorage
    let switchState = localStorage.getItem('switchState');

    // Check if the switch is off or the switch state is not stored
    if (switchState !== 'on') {
        return; // Don't proceed if the switch is off or not set
    }

    let selectedText = getSelectedText().trim().toLowerCase();
    if (selectedText.length === 0) {
        return;
    }

    console.log('Selected Text:', selectedText);
    const definitions = await fetchDefinition(selectedText);
    console.log('Definitions:', definitions); 
    displayDefinitions(definitions);
    playTextToSpeech(selectedText); // Call text-to-speech function
}

document.addEventListener('mouseup', afterSelection);
document.addEventListener('keyup', afterSelection);

function getSelectedText() {
    let text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

function playTextToSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

/*document.querySelector('.switch input[type="checkbox"]').addEventListener('change', function() {
    localStorage.setItem('switchState', this.checked ? 'on' : 'off');
});

document.addEventListener('DOMContentLoaded', function() {
    let switchState = localStorage.getItem('switchState');
    if (switchState === 'on') {
        document.querySelector('.switch input[type="checkbox"]').checked = true;
    }
});*/

//wsl2

//wsl2