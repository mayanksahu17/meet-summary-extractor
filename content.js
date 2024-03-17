let ON_CALL = false;
let IS_SUBTITLE_ON = false;
let MEET_CODE;
let script = "";
let last_speaker = "";

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
      console.log(subtitles);
      subtitles.forEach(span => {
        script += span.textContent.trim() + " ";
      });
      console.log(script);
    });

    subtitleObserver.observe(dibba, { childList: true, subtree: true });
  } else {
    console.error("Parent div not found.");
  }
};

// Observe changes in the DOM and start observing subtitles when the div becomes available
const startObserving = () => {
  const observer = new MutationObserver(() => {
    const dibba = document.body.querySelector(".iOzk7[jsname='dsyhDe']");
    if (dibba && !IS_SUBTITLE_ON) {
      IS_SUBTITLE_ON = true;
      observeSubtitles();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

// Start observing subtitles when the page loads
window.addEventListener("load", () => {
  startObserving();
});
