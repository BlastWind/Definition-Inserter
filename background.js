chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


  const {word} = request;
  // fetch wikipedia with ${word} as parameter to set var definition 
  const definition = "placeholder" 
  var toStore = {}; 
  toStore[word] = definition; 
  chrome.storage.sync.set(toStore, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    }else{
      chrome.storage.sync.get(word, function(definition) {
        //let's check if it is indeed saved
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }else{
          sendResponse(definition)
        }
      });
    }
  });

  return true; 
});
