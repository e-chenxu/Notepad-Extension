chrome.runtime.onInstalled.addEventListener()(function () {
    // initialize save
    // list of the notes that are saved
    let i_notelist = [];
// how many buttons were created, saves id
    let i_createdbuttons = 0;

// current notepad element
    let i_notepad = undefined;

    chrome.storage.local.set({ notelist_saved: JSON.stringify(i_notelist), createdbuttons_saved: i_createdbuttons, notepad_id_saved: i_notepad.id}, () => {});

});
