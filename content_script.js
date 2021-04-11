const toolBoxTemplate = `<template id="definition-inserter-toolbox-template">

<div id="definition-inserter-toolbox">
<div id="insert-definition-button">
  
  I
</div>
<div id="add-to-study-button"> 
A
</div>
</div>
</template>
`;

const toolBoxStyle = `<style>
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
	var word = selection.toString().trim();
	if (!word.length || word.includes(" ") || !/^[a-zA-Z]+$/.test(word)) {
		return;
	}
	if (word.length) {
		// if a word is highlighted, show toolbox

		var oRange = selection.getRangeAt(0);

		var temp = document.getElementById("definition-inserter-toolbox-template");
		var clon = temp.content.cloneNode(true);

		// console.log({ clon });
		document.body.appendChild(clon); // after appending element from <template>, we can select and edit element style
		var toolBox = document.getElementById("definition-inserter-toolbox");
		toolBox.style.left = event.pageX + "px";
		toolBox.style.top = event.pageY + "px";

		// Inserts definition in format: term (definition)
		document.getElementById("insert-definition-button").onclick = () => {
			chrome.runtime.sendMessage(
				{ word, messageType: "insert-definition" },
				(response) => {
					// Last-minute check for whether definition valid
					if (response?.length) {
						oRange.collapse(false);
						oRange.insertNode(document.createTextNode(`(${response}) `));
						oRange.collapse(true);
					}
				},
			);
		};

		// TODO: Put add to chrome storage logic here
		document.getElementById("add-to-study-button").onclick = () => {
			chrome.runtime.sendMessage(
				{ word, messageType: "save-to-study-list" },
				(response) => {
					// {word, key: val} is short for {word: word, key: val}
					console.log("returned in content script: ", { response });
				},
			);
		};
	}
});

function htmlToElement(html) {
	var template = document.createElement("template");
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}
