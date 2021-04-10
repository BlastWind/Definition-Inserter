//import toolBoxTemplate from "./lib/toolbox.html";

const toolBoxTemplate = `<template id="definition-inserter-toolbox-template">
<style>
#definition-inserter-toolbox {
  position: absolute;
  color: yellow;
  display: flex; 
  min-width: 50px; 
}

#definition-inserter-toolbox > div {
    padding:2px; 
    background:white; 
    border: 1px solid black; 
    background:red; 
    flex-grow: 1; 
    text-align: center; 
    cursor: pointer; 
}
</style>

<div id="definition-inserter-toolbox">
<div id="insert-definition-button">
  
  I
</div>
<div id="add-to-study-button"> 
A
</div>
</template>
`;

if (document) {
  if (document.documentElement) {
    document.documentElement.insertAdjacentHTML("beforeend", toolBoxTemplate);
  }
}

window.addEventListener("message", (e) => {
  console.log(e);
});

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection();
  const hit_elem = document.elementFromPoint(event.clientX, event.clientY);

  if (!hit_elem) {
    return;
  }

  if (/INPUT|TEXTAREA/.test(hit_elem.nodeName) || hit_elem.isContentEditable) {
    return;
  }

  word = selection.toString().trim();
  if (word != "") {
    var oRange = selection.getRangeAt(0);
    var toolBox = document.getElementById("definition-inserter-toolbox");
    if (toolBox) {
      toolBox.remove();
    }
    var temp = document.getElementById("definition-inserter-toolbox-template");
    var clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
    toolBox = document.getElementById("definition-inserter-toolbox");
    toolBox.style.left = event.pageX + "px";
    toolBox.style.top = event.pageY + "px";

    document.getElementById("insert-definition-button").onclick = () => {
      toolBox.remove();
    };

    document.getElementById("add-to-study-button").onclick = () => {
      toolBox.remove();
    };
  }

  /*
  const selection = window.getSelection().toString().trim();
  if (selection.length) {
    console.log("Got selection: " + selection);
    //var oRange = selection.getRangeAt(0);
    //var oRect = oRange.getBoundingClientRect();

    var boxHTML =
      '<div style="position: absolute; transform:translate(100px, 100px)">Fucking Box Yo!</div>';

    var box = htmlToElement(boxHTML);
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    document.body.appendChild(input);

    
  } */
});

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}
