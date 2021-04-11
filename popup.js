const definitionList = document.getElementById("definition-list");

// TODO: move this to background.js
chrome.storage.sync.get(null, function (items) {
  for (var key in items) {
    if (items.hasOwnProperty(key)) {
      var rowDiv = document.createElement("div");
      var keyDiv = document.createElement("div");
      var defDiv = document.createElement("div");

      rowDiv.classList.toggle("row");
      keyDiv.innerHTML = key;
      defDiv.innerHTML = items[key];

      rowDiv.appendChild(keyDiv);
      rowDiv.appendChild(defDiv);

      rowDiv.onclick = (event) => {
        let target = event.target;
        while (target.className !== "row") {
          target = target.parentNode;
        }

        // UI removal
        const key = target.childNodes[0].innerHTML;
        target.remove();

        // DB removal
        chrome.storage.sync.remove(key);
      };

      definitionList.appendChild(rowDiv);
    }
  }

  document.getElementById("remove-button").onclick = () => {
    var definitionList = document.getElementById("definition-list");
    definitionList.innerHTML = "";
    console.log(Object.keys(items));
    chrome.storage.sync.remove(Object.keys(items));
  };
});
