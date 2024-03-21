console.log("beginning");

let ON_CALL = false;
let IS_SUBTITLE_ON = false;
let MEET_CODE;
let script = ""; // Global string to store data in conversational format
let speakers = {}; // Object to store each speaker's sentences
let lastSpeaker = ""; // Initialize lastSpeaker variable
let TOGGLE = false
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
    // chrome.storage.local.set({
    //   ON_CALL: false,
    // });
  }
});

docObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// const sendScriptDataToBackground = () => {
//   console.log("Sending script data to background:", script);
//   chrome.runtime.sendMessage({ type: 'script_data', data: script });
// };
const documentObserver = new MutationObserver(() => {
  if(document.body.getElementsByClassName("roSPhc")){
    // console.log("data sending")
    // sendScriptDataToBackground();
    documentObserver.disconnect();
  }

})

documentObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

const observeSubtitles = () => {
  const dibba = document.body.querySelector(".iOzk7[jsname='dsyhDe']");

  if (dibba) {
    const subtitleObserver = new MutationObserver(() => {
      const subtitles = dibba.querySelectorAll(".iTTPOb span");
      const speakerName = dibba.querySelector(".zs7s8d").textContent.trim();

      subtitles.forEach(span => {
        const text = span.textContent.trim();
        if (!speakers[speakerName] || !speakers[speakerName].includes(text)) {
          script += `${lastSpeaker !== speakerName ? `\n${speakerName}: ` : ''}${text} `;
          speakers[speakerName] = speakers[speakerName] || [];
          speakers[speakerName].push(text);
          lastSpeaker = speakerName;

          // Print the line by line conversation
          console.log(`${speakerName}: ${text}`);
        }
      });

      console.log(script); // Print the whole script
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
      script = ""; 
      speakers = {}; 
      observeSubtitles();
  
    }


    const endCall = document.querySelector(".NHaLPe[jscontroller='m1IMT'][jsaction='JIbuQc:wB8Z8d']")
    if (endCall && !TOGGLE) {
      endCall.addEventListener('click', ()=>{
        TOGGLE=true;
        console.log("The call has ended!");
        console.log("Sending this to background:", script);
        chrome.runtime.sendMessage({ type: 'script_data', data: script });
      });
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


