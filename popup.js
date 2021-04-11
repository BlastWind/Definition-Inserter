const definitionList = document.getElementById("definition-list");

// TODO: move this to background.js
chrome.storage.sync.get(null, function (items) {
  for (var key in items) {
    if (items.hasOwnProperty(key)) {
      var keyDiv = document.createElement("div");
      keyDiv.innerHTML = key;
      definitionList.appendChild(keyDiv);
      var definitionDiv = document.createElement("div");
      definitionDiv.innerHTML = items[key];
      definitionList.appendChild(definitionDiv);
    }
  }
});
