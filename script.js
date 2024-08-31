async function fetchDefinition(word) {
  const apiKey = 'e9cf6d9e-d14f-4994-b21c-31ac82894fc5'; //should convert to a local variable oops
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

function displayDefinitions(definitions) {
  if (!definitions || definitions.length === 0) {
      return;
  }

  let popUpText = 'Definitions:\n';
  definitions.forEach((definition, index) => {
      if (definition.shortdef && definition.shortdef.length > 0) {
          popUpText += `${index + 1}. ${definition.shortdef[0]}\n`;
      }
  });
  alert(popUpText);
}

async function afterSelection(event) {
  let selectedText = getSelectedText().trim().toLowerCase();
  if (selectedText.length === 0) {
      return;
  }

  console.log('Selected Text:', selectedText);
  const definitions = await fetchDefinition(selectedText);
  console.log('Definitions:', definitions);
  displayDefinitions(definitions);
  playTextToSpeech(selectedText);
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

function playTextToSpeech(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function enableSelectionHandler() {
  document.addEventListener('mouseup', afterSelection);
}

function disableSelectionHandler() {
  document.removeEventListener('mouseup', afterSelection);
}
