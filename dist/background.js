/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    chrome.scripting.executeScript({
      files: ["contentscript.js"],
      target: { tabId: tab.id },
    });
  }
});

/******/ })()
;
//# sourceMappingURL=background.js.map