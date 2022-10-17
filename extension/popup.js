let notelist = [];           // list of the notes that are saved
let createdbuttons = 0;      // how many buttons were created, saves id
let notepad = undefined;     // current notepad element

/* get static elements */
let leftcolumn = document.getElementById('notelist');   // buttons and notes
let rightcolumn = document.getElementById('notebox');
let namebox = document.getElementById('namebox');       // title

/* highlight button, and also save everything */
function buttonFocus(focused_button){
    for (let i = 0; i < notelist.length; i++) {
        let button = document.getElementById(notelist[i].name_id + 'b');
        button.style.borderRight = "none";
        button.style.pointerEvents = "all";
    }
    focused_button.style.borderRight = "7px solid #807e7e";
    focused_button.style.pointerEvents = "none";
    chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons, notepad_id_saved: notepad.id}, () => {});
}


function addButton(div_id, button_id, button_text){
    let newdiv = document.createElement('div');
    newdiv.type = 'div';
    newdiv.id = div_id;
    newdiv.className = 'totalbutton';
    leftcolumn.appendChild(newdiv);

    let button = document.createElement('button');
    button.type = 'button';
    button.className = 'button';
    button.id = button_id;
    button.innerHTML = button_text;
    newdiv.appendChild(button);
    return button;
}


function addNote(note_id, note_text, note_title){
    let note = document.createElement('div');
    note.className = 'note';
    note.id = note_id;
    note.innerHTML = note_text;
    note.contentEditable = 'true';

    // namebox title
    namebox.style.color = 'black';
    namebox.innerHTML = note_title;
    return note;
}


chrome.storage.local.get(['notelist_saved','createdbuttons_saved', 'notepad_id_saved'], function (saveddata) {
    if (saveddata.notelist_saved){
        notelist = JSON.parse(saveddata.notelist_saved);
        for (let i = 0; i < notelist.length; i++){
            addButton(notelist[i].name_id + 'div', notelist[i].name_id + 'b', notelist[i].displayname);
        }
        // find the note corresponding to this button
        if (notelist.length !== 0) {
            let index = 0;
            if (saveddata.notepad_id_saved) {
                index = notelist.findIndex(x => (x.name_id) === saveddata.notepad_id_saved);
            }
            if (notelist[index] === undefined || index === -1){
                index = 0;
            }
            let note = addNote(notelist[index].name_id, notelist[index].notetext, notelist[index].displayname);
            rightcolumn.appendChild(note);
            notepad = note;
            // find the left column button corresponding to the notepad
            let button = document.getElementById(notepad.id  + 'b');
            button.focus();

            buttonFocus(button);
        }
    }
    if (saveddata.createdbuttons_saved){
        createdbuttons = saveddata.createdbuttons_saved;
    }
})

document.addEventListener('keyup', function (e) {
        if (e.target && e.target.id === notepad.id){
            // saves the html into a note
            let currenthtml = e.target.innerHTML;
            let noteindex = notelist.findIndex(x => x.name_id === notepad.id);
            notelist[noteindex].notetext = currenthtml;
            chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons}, () => {});
        }
        else if (e.target && e.target.id === namebox.id){
            namebox.style.color = 'black';
            if (notepad !== undefined){
                // saves title of note, and changes button text
                let currenthtml = e.target.innerHTML;
                let noteindex = notelist.findIndex(x => x.name_id === notepad.id);
                let button = document.getElementById(notepad.id + 'b');

                notelist[noteindex].displayname = currenthtml;
                button.innerHTML = currenthtml;
                chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons}, () => {});
            }
        }
});

document.addEventListener('click',function(e){
    if(e.target && e.target.id === 'addnote'){
        // we use createdbuttons to keep track of ids
        // it will increment each time a new button is created
        createdbuttons++;
        let button = addButton(createdbuttons + 'div', createdbuttons + 'b', 'New Note');
        let note = addNote(createdbuttons, "", 'New Note');
        let note_object = {
            displayname: 'New Note',
            name_id: note.id,
            notetext: ''
        }
        if (notepad) {
            rightcolumn.replaceChild(note, notepad);
        }
        else {
            rightcolumn.appendChild(note);
        }
        notepad = note;
        button.focus();
        notepad.focus();
        notelist.push(note_object);
        chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons, notepad_id_saved: notepad.id}, () => {});
        buttonFocus(button);
    }
    // if click on note button, then show the corresponding note
    else if(e.target && e.target.className === 'button'){
        // get the notelist because of updates while popup is open
        chrome.storage.local.get(['notelist_saved','createdbuttons_saved'], function (saveddata) {
            if (saveddata.notelist_saved) {
                notelist = JSON.parse(saveddata.notelist_saved);
            }
        });
        // find the note that corresponds to the button id
        let noteget = notelist[notelist.findIndex(x => (x.name_id + 'b') === e.target.id)];
        let note = addNote(noteget.name_id, noteget.notetext, noteget.displayname);
        if (notepad) {
            rightcolumn.replaceChild(note, notepad);
        }
        else {
            rightcolumn.appendChild(note);
        }
        notepad = note;
        // button clicked
        let buttondiv = document.getElementById(e.target.id);
        buttonFocus(buttondiv);
    }
    else if(e.target && notepad && e.target.className === 'deletebutton') {
        if (notepad) {
            // we have to save a temporary id before deleting
            let notepadid_temp = notepad.id;
            let index = notelist.findIndex(x => (x.name_id) ===  notepad.id);
            notelist.splice(index,1);
            rightcolumn.removeChild(notepad);

            // delete the left column button corresponding to the notepad
            let div = document.getElementById(notepadid_temp + 'div');
            div.remove();

            namebox.style.color = 'grey';
            if (notelist.length !== 0)
                namebox.innerHTML = "Select a note..."
            else
                namebox.innerHTML = "Add a note..."

            chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons, notepad_id_saved: notepad.id}, () => {});
            notepad = undefined;
        }
    }
});

