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
			break;
		case "insert-definition":
			getDefinition(word)
				.then((definition) => {
					sendResponse(definition);
				})
				.catch((err) => {
					console.log(err);
				});
			break;
		default:
			break;
	}

	return true;
});

chrome.commands.onCommand.addListener((command) => {
  // console.log(command);
	sendCommand = {};
	sendCommand["command"] = command;
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, sendCommand);
		// console.log("sent command" + sendCommand);
	});
});

function saveToStudyList(word) {
	return new Promise(function (resolve, reject) {
		// fetch wikipedia with ${word} as parameter to set var definition
		getDefinition(word).then((definition) => {
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
	});
}

/**
 *
 * @param {String} term The search query term.
 * @returns {String} The definition or description of given term.
 */
async function getDefinition(term) {
	// Check wikipedia
	let title = term.replace(" ", "_");
	let response = await fetch(
		`https://en.wikipedia.org/w/api.php?action=query&redirects&prop=pageprops&format=json&titles=${title}`,
	);
	let data = await response.json();
	let pages = data?.["query"]?.["pages"];
	let shortDesc =
		pages[Object?.keys(pages)?.[0]]?.["pageprops"]?.["wikibase-shortdesc"];
	// Check if Wikipedia has valid descriptor
	if (
		!shortDesc ||
		shortDesc ===
			"Disambiguation page providing links to topics that could be referred to by the same search term"
	) {
		//TODO - Check Dictionary.com, handle more than 1 definition
		response = await fetch(
			`https://api.dictionaryapi.dev/api/v2/entries/en_US/${term}`,
		);
		data = await response.json();
		if (!Array.isArray(data)) {
			return "";
		}
		shortDesc = data[0]["meanings"][0]["definitions"][0]["definition"].slice(0, -1);
	}
	return shortDesc;
}
