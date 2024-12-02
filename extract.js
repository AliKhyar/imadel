// Create a function to display messages on the page
function displayMessage(message, isError = false) {
  const messageContainer = document.createElement('div');
  messageContainer.style.position = 'fixed';
  messageContainer.style.top = '10px';
  messageContainer.style.right = '10px';
  messageContainer.style.backgroundColor = isError ? 'red' : 'green';
  messageContainer.style.color = 'white';
  messageContainer.style.padding = '10px';
  messageContainer.style.zIndex = '1000';
  messageContainer.textContent = message;
  document.body.appendChild(messageContainer);

  // Remove the message after 5 seconds
  setTimeout(() => {
    document.body.removeChild(messageContainer);
  }, 5000);
}

// Function to send data to the server using jQuery AJAX
function sendDataToServer(data) {
  console.log("Data to be sent to the server:", data); // Log the data before sending

  $.ajax({
    url: 'http://localhost:3000/saveData',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(response) {
      console.log("Data saved successfully:", response);
      displayMessage("Data saved successfully!", false);
    }

  });
}

// Function to extract dynamic key-value pairs
function extractDynamicKeyValuePairs() {
  const data = {};

  // Locate the "Other information" section
  const otherInfoHeading = Array.from(document.querySelectorAll('div[role="heading"]'))
    .find(heading => heading.innerText.trim() === "Other information");

  if (otherInfoHeading) {
    // Navigate to the parent container containing sub-headings
    const infoSection = otherInfoHeading.closest('.xod5an3').nextElementSibling;

    // Extract key-value pairs from sub-headings within the section
    const subHeadings = infoSection.querySelectorAll('div[role="heading"]');
    subHeadings.forEach(subHeading => {
      const subKey = subHeading.innerText.trim();
      const allowedKeys = ["Match ID", "Video ID", "Match duration", "Video views", "Page followers"];

      if (allowedKeys.includes(subKey)) {
        // Locate the span element containing the value
        let valueElement = subHeading.parentElement.nextElementSibling?.querySelector('span')
          || subHeading.parentElement.parentElement.querySelector('span');

        if (valueElement) {
          const value = valueElement.innerText.trim();
          data[subKey] = value;
          console.log(`Extracted: ${subKey} - ${value}`); // Print both key and value
        }
      }
    });
  }

  // Check if any data was extracted
  if (Object.keys(data).length > 0) {
    sendDataToServer(data); // Call the function to send data to the server
  } else {
    // Display error message if no data was found
    displayMessage("No key-value pairs found!", true);
  }
}

// Function to extract and print hrefs of anchor elements with target="_blank" and role="link"
function extractAnchorLinks() {
  const anchors = document.querySelectorAll('a[target="_blank"][role="link"]');
  anchors.forEach(anchor => {
    const href = anchor.href;
    console.log(`Anchor href: ${href}`);
    
    if (href.includes("facebook.com")) {
      const urlParts = href.split('/');
      const usernameIndex = urlParts.indexOf("www.facebook.com") + 1;
      
      // Ensure index is within bounds
      if (usernameIndex > 0 && usernameIndex < urlParts.length) {
        const username = urlParts[usernameIndex];
        console.log(`Detected Facebook username: ${username}`);
      } else {
        console.log("Invalid Facebook URL structure");
      }
    } else {
      console.log("Not a Facebook video");
    }
  });
}

// Call the functions
extractDynamicKeyValuePairs();
extractAnchorLinks();
