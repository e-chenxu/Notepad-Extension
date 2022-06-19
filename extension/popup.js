let notepad = document.getElementById("note1");
notepad.focus();

// grab saved data in notepad
chrome.storage.local.get(['notepad'], function (data) {
    notepad.innerHTML = data.notepad;
});

// event listener for whenever key is typed
notepad.addEventListener('keyup', function (event) {
    chrome.storage.local.set({notepad: event.target.innerHTML}, () => {
        console.log("Notepad updated with", event.target.innerHTML);
    });
});
