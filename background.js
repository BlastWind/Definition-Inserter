chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { word, messageType } = request;
  console.log({ messageType });
  switch (messageType) {
    case "save-to-study-list":
      saveToStudyList(word)
        .then((definition) => {
          sendResponse(definition);
        })
        .catch((err) => {
          console.log(err);
        });
    case "insert-definition":
      return true;
    default:
      break;
  }

  return true;
});

function saveToStudyList(word) {
  return new Promise(function (resolve, reject) {
    // fetch wikipedia with ${word} as parameter to set var definition
    const definition = "placeholder";
    var toStore = {};
    toStore[word] = definition;
    chrome.storage.sync.set(toStore, function () {
      if (chrome.runtime.error) {
        reject("error during chrome storage set");
      } else {
        chrome.storage.sync.get(word, function (definition) {
          //let's check if it is indeed saved
          if (chrome.runtime.error) {
            reject("error during chrome storage get");
          } else {
            console.log("we are at returning place!");
            resolve(definition);
          }
        });
      }
    });
  });
}
