const definitionList = document.getElementById("definition-list");

// TODO: move this to background.js
chrome.storage.sync.get(null, function (items) {
  for (var key in items) {
    if (items.hasOwnProperty(key)) {
      var span = document.createElement("span");
      span.innerHTML += key;
      span.innerHTML += items[key];
      definitionList.appendChild(span);
    }
  }
});
definitionList.style.backgroundColor = "green";
