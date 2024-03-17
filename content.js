console.log("beginning");

let ON_CALL = false;
let IS_SUBTITLE_ON = false;
let MEET_CODE;
let script = ""; // Global string to store data in conversational format
let speakers = {}; // Object to store each speaker's sentences

chrome.storage.local.set({
  ON_CALL: false,
  subtitleWarning: false,
});

const docObserver = new MutationObserver(() => {
  if (document.body.querySelector("div[jscontroller='kAPMuc']")) {
    ON_CALL = true;
    alert("Please turn on Captions to continue summarizing");
    docObserver.disconnect();
  } else {
    ON_CALL = false;
    chrome.storage.local.set({
      ON_CALL: false,
    });
  }
});

docObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

const observeSubtitles = () => {
  const dibba = document.body.querySelector(".iOzk7[jsname='dsyhDe']");
  console.log(dibba);

  if (dibba) {
    const subtitleObserver = new MutationObserver(() => {
      const subtitles = dibba.querySelectorAll(".iTTPOb span");
      const speakerName = dibba.querySelector(".zs7s8d").textContent.trim();

      subtitles.forEach((span) => {
        const text = span.textContent.trim();
        if (!speakers[speakerName] || !speakers[speakerName].includes(text)) {
          script += `${
            lastSpeaker !== speakerName ? `\n${speakerName}: ` : ""
          }${text} `;
          speakers[speakerName] = speakers[speakerName] || [];
          speakers[speakerName].push(text);
          lastSpeaker = speakerName;
        }
      });

      console.log(script);
    });

    subtitleObserver.observe(dibba, { childList: true, subtree: true });
  } else {
    console.error("Parent div not found.");
  }
};

const startObserving = () => {
  const observer = new MutationObserver(() => {
    const dibba = document.body.querySelector(".iOzk7[jsname='dsyhDe']");
    if (dibba && !IS_SUBTITLE_ON) {
      IS_SUBTITLE_ON = true;
      script = ""; // Clear the script when starting to observe subtitles
      speakers = {}; // Clear the speakers object
      observeSubtitles();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

window.addEventListener("load", () => {
  startObserving();
});

const sendScriptDataToBackground = () => {
  console.log(script);
  chrome.runtime.sendMessage({ type: "script_data", data: script });
};

// Find the button element by class name
const leaveCallButton = document.querySelector(".VfPpkd-Bz112c-LgbsSe");

// Add onclick event to the button
leaveCallButton.addEventListener("click", () => {
  // Call the function to send script data to background.js
  sendScriptDataToBackground();
});
