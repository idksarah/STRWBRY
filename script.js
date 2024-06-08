/* 
    detect click
    check for highlighted text**
    convert text to lowercase
    let highlighted = yk, the highlighted text
    reference dictionary to look for matching terms
        convert dictionary term to lowercase
        if var == dictionary term {
            display text
            remove text when mouse moves away
            play audio file **
        } else {
         return;
        }
*/

function positionPopup(event, info) {
    // Get mouse coordinates
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    // Position the popup above the mouse cursor
    info.style.left = `${mouseX}px`;
    info.style.top = `${mouseY - 30}px`; // Adjust as necessary to position above the cursor
}

function getSelectedText() {
    let text = "";
    if(typeof window.getSelection != "undefined"){
        text = window.getSelection().toString();
    }else if (typeof document.selection != "undefined" && document.selection.type == "Text"){
        text = document.selection.createRange().text;
    }
    return text;
}

function afterSelection(event) {
    let selectedText = getSelectedText();
    selectedText = selectedText.toLowerCase();

    let info = document.getElementById("info");
    if (!info) {
        // Create the popup element if it doesn't exist
        info = document.createElement("div");
        info.id = "info";
        document.body.appendChild(info);
    }

    if (selectedText === "highlighted") {
        info.textContent = "pick out an emphasize"; // Message for the popup
        positionPopup(event, info);
        info.style.display = "block";
    } else {
        info.style.display = "none";
    }
}

//alert("??!");
document.onmouseup = afterSelection;
document.onkeyup = afterSelection;

//ubuntu!!