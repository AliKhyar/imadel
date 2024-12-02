chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let activeTab = tabs[0];
      console.log("Current tab title:", activeTab.title);
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "zoomAndScreenshot") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      let activeTab = tabs[0];
      
      // Zoom out the tab by 50%
      chrome.tabs.setZoom(activeTab.id, 0.5, function() {
        // Take a screenshot after zooming out
        chrome.tabs.captureVisibleTab(null, {}, function(screenshotUrl) {
          if (chrome.runtime.lastError) {
            console.error("Error capturing screenshot:", chrome.runtime.lastError);
            return; // Exit if there's an error
          }
          
          // Create a download link for the screenshot
          const now = new Date().toISOString().replace(/:/g, '-'); // Format timestamp
          const filename = `screenshot-${activeTab.title}-${now}.png`; // Create a filename
          
          // Use chrome.downloads API to save the screenshot
          chrome.downloads.download({
            url: screenshotUrl,
            filename: filename,
            saveAs: true // Prompt user to save
          }, function(downloadId) {
            if (chrome.runtime.lastError) {
              console.error("Error downloading screenshot:", chrome.runtime.lastError);
            }
          });
        });
      });
    });
  } else if (request.action === "extractAndDownloadCSV") {
    // Get the active tab to execute the script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      let activeTab = tabs[0];
      // Extract information from the other-information.html
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id }, // Use activeTab.id here
        files: ['extract.js']
      }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error executing script:", chrome.runtime.lastError);
        }
      });
    });
  }
});
