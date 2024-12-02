document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab = tabs[0];
    document.getElementById('title').textContent = activeTab.title;

    // Add event listener for taking a screenshot
    document.getElementById('screenshotButton').addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: "zoomAndScreenshot" });
    });

    // Add event listener for downloading CSV
    document.getElementById('csvButton').addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: "extractAndDownloadCSV" });
    });
  });
});
