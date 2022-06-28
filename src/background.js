chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    chrome.scripting.executeScript({
      files: ["contentscript.ts"],
      target: { tabId: tab.id },
    });
  }
});
