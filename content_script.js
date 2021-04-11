var savePng = chrome.runtime.getURL("icons/save.png");
var insertPng = chrome.runtime.getURL("icons/insert.png");
const toolBoxTemplate = `<template id="definition-inserter-toolbox-template">

<div id="definition-inserter-toolbox">


<img id="insertPng"/>
<img id="savePng"/>

</div>
</template>
`;
const toolBoxStyle = `<style>
#definition-inserter-toolbox {
  position: absolute;
  display: flex; 
  min-width: 50px; 
}

#savePng {
	width:25px; 
    cursor: pointer; 
	padding-left: 4px;

}

#insertPng{
	width:25px;
	transform:translate(0, -2px);
    cursor: pointer; 

}


#definition-inserter-toolbox {
    padding:2px; 
	padding-left: 5px; 
	padding-top: 5px; 
    background:white; 
    border: 1px solid black; 
    text-align: center; 
}
</style>
`;

if (document) {
  if (document.documentElement) {
    document.documentElement.insertAdjacentHTML("beforeend", toolBoxStyle);
    document.documentElement.insertAdjacentHTML("beforeend", toolBoxTemplate);
  }
}

window.addEventListener("message", (e) => {
  console.log(e);
});

function removeToolbox() {
  var toolBox = document.getElementById("definition-inserter-toolbox");
  if (toolBox) {
    toolBox.remove();
  }
}

document.addEventListener("click", (event) => {
  const selection = window.getSelection();
  const hit_elem = document.elementFromPoint(event.clientX, event.clientY);
  removeToolbox();

  if (!hit_elem) {
    return;
  }

  if (/INPUT|TEXTAREA/.test(hit_elem.nodeName) || hit_elem.isContentEditable) {
    return;
  }
  // Check for empty, multiple words, or non-alphabetical letters
  var untrimmedWord = selection.toString();
  var word = selection.toString().trim();
  if (!word.length || word.includes(" ") || !/^[a-zA-Z]+$/.test(word)) {
    return;
  }

  var rightBuffer =
    untrimmedWord.charAt(untrimmedWord.length - 1) === " " ? "" : " ";

  if (word.length) {
    // if a word is highlighted, show toolbox

    var temp = document.getElementById("definition-inserter-toolbox-template");
    var clon = temp.content.cloneNode(true);

    // console.log({ clon });
    document.body.appendChild(clon); // after appending element from <template>, we can select and edit element style
    var toolBox = document.getElementById("definition-inserter-toolbox");
    toolBox.style.left = event.pageX + 20 + "px";
    toolBox.style.top = event.pageY + "px";

    document.getElementById("savePng").src = savePng;
    document.getElementById("insertPng").src = insertPng;

    // Inserts definition in format: term (definition)
    document.getElementById("insertPng").onclick = insertDefinition;

    document.getElementById("savePng").onclick = saveToStudyList;

    function insertDefinition() {
      chrome.runtime.sendMessage(
        { word, messageType: "insert-definition" },
        (response) => {
          var oRange = selection.getRangeAt(0);
          // Last-minute check for whether definition valid
          if (response?.length) {
            oRange.collapse(false);
            oRange.insertNode(
              document.createTextNode(`${rightBuffer}(${response}) `)
            );
            oRange.collapse(true);
          }

          removeToolbox();
        }
      );
    }

    // TODO: Put add to chrome storage logic here
    function saveToStudyList() {
      chrome.runtime.sendMessage(
        { word, messageType: "save-to-study-list" },
        (response) => {
          // {word, key: val} is short for {word: word, key: val}
          console.log("returned in content script: ", { response });
        }
      );

      removeToolbox();
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const selection = window.getSelection();

  // Check for empty, multiple words, or non-alphabetical letters
  var untrimmedWord = selection.toString();
  var word = selection.toString().trim();
  if (!word.length || word.includes(" ") || !/^[a-zA-Z]+$/.test(word)) {
    return;
  }

  var rightBuffer =
    untrimmedWord.charAt(untrimmedWord.length - 1) === " " ? "" : " ";

  if (word.length) {
    switch (request.command) {
      case "save":
        saveToStudyList();
        break;
      case "insert":
        insertDefinition();
    }
    removeToolbox();

    // Inserts definition in format: term (definition)
    function insertDefinition() {
      chrome.runtime.sendMessage(
        { word, messageType: "insert-definition" },
        (response) => {
          var oRange = selection.getRangeAt(0);
          // Last-minute check for whether definition valid
          if (response?.length) {
            oRange.collapse(false);
            oRange.insertNode(
              document.createTextNode(`${rightBuffer}(${response}) `)
            );
            oRange.collapse(true);
          }
        }
      );
    }

    // TODO: Put add to chrome storage logic here
    function saveToStudyList() {
      chrome.runtime.sendMessage(
        { word, messageType: "save-to-study-list" },
        (response) => {
          // {word, key: val} is short for {word: word, key: val}
          console.log("returned in content script: ", { response });
        }
      );
    }
  }
});

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}
