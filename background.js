chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "script_data") {
      const scriptData = request.data; // Get the script data from the content script
      console.log(request.data);
      // Make the API call to Gemini
      fetch("https://gemini-server-hsl4.onrender.com/api/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script: scriptData }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("Gemini API Response:", responseData);
          // Handle the response data (e.g., send back to content script)
          sendResponse({ data: responseData }); // Send data to content script
        })
        .catch((error) => {
          console.error("Error calling Gemini API:", error);
          // Handle potential errors during the API call
          sendResponse({ error: error.message }); // Send error message to content script
        });
    }
  });