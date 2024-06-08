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


function getSelectedText() {
    let text = "";
    if(typeof window.getSelection != "undefined"){
        text = window.getSelection().toString();
    }else if (typeof document.selection != "undefined" && document.selection.type == "Text"){
        text = document.selection.createRange().text;
    }
    return text;
}

function afterSelection() {
    let selectedText = getSelectedText();
    selectedText = selectedText.toLowerCase();
    alert(selectedText);
    //f(selectedText) //matches an actual word
}

//alert("??!");
document.onmouseup = afterSelection;
document.onkeyup = afterSelection;

//wsl2