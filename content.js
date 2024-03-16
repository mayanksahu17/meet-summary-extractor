let ON_CALL = false;
let IS_SUBTITLE_ON = false;
let MEET_CODE;
let script = [];
let last_speaker = "";


function turnOnCaption() {
    
}

const docObserver = new MutationObserver(() => {
    if (document.body.querySelector("div[jscontroller='kAPMuc']")) {
        ON_CALL = true;
        console.log("Found call");
        
        docObserver.disconnect();
        turnOnCaption();

    } else {
        ON_CALL = false;       
    }
});

docObserver.observe(document.body, {
    childList: true,
    subtree: true,
});
