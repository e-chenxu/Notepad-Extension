// make sure to keep saving constanty and getting

// list of the notes that are saved
let notelist = [];
// how many buttons were created, saves id
let createdbuttons = 0;

// current notepad element
let notepad = undefined;

// get static elements
let leftcolumn = document.getElementById('notelist');
let rightcolumn = document.getElementById('notebox');
let namebox = document.getElementById('namebox');

// set button focus function
function buttonFocus(focused_button){
    // reset focus on all other buttons
    for (let i = 0; i < notelist.length; i++) {
        // button
        let button = document.getElementById(notelist[i].name + 'b');
        button.style.borderRight = "none";
        button.style.pointerEvents = "all";
    }
    // set the focus on one button
    focused_button.style.borderRight = "7px solid #807e7e";
    focused_button.style.pointerEvents = "none";
    // whenever buttonFocus is called, that means that a note was just swtiiched
    // so we have to save what button we are on now, by saving the current notepad, only if it exists
    if (notepad)
        chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons, notepad_id_saved: notepad.id}, () => {});
}

// initial get saved data
chrome.storage.local.get(['notelist_saved','createdbuttons_saved', 'notepad_id_saved'], function (saveddata) {
    if (saveddata.notelist_saved){
        notelist = JSON.parse(saveddata.notelist_saved);
        for (let i = 0; i < notelist.length; i++){
            // create div for each button
            let newdiv = document.createElement('div');
            newdiv.type = 'div';
            newdiv.id = notelist[i].name + 'div';
            newdiv.className = 'totalbutton';
            leftcolumn.appendChild(newdiv);

            // new button
            let button = document.createElement('button');
            button.type = 'button';
            button.className = 'button';
            button.id = notelist[i].name + 'b';
            button.innerHTML = notelist[i].displayname;
            newdiv.appendChild(button);
        }
        if (notelist.length !== 0) {
        // using saved notepad id, find that id and use it as the note
            let index = 0;
            if (saveddata.notepad_id_saved) {
                index = notelist.findIndex(x => (x.name) === saveddata.notepad_id_saved);
            }
            if (notelist[index] === undefined || index === -1){
                index = 0;
            }
            let note = document.createElement('div');
            note.className = 'note';
            note.id = notelist[index].name;
            note.innerHTML = notelist[index].notetext;
            note.contentEditable = 'true';
            rightcolumn.appendChild(note);
            notepad = note;

            // namebox title
            namebox.style.color = 'black';
            namebox.innerHTML = notelist[index].displayname;

            // find the left column button corresponding to the notepad
            let button = document.getElementById(note.id  + 'b');
            button.focus();
            buttonFocus(button);
        }
    }
    if (saveddata.createdbuttons_saved){
        // if saved data exists, then the amount of created buttons will get the saved data, to keep track of ids
        createdbuttons = saveddata.createdbuttons_saved;
    }
})


// if there exists a notepad
// event listener for whenever key is typed
document.addEventListener('keyup', function (e) {
        if (e.target && e.target.id === notepad.id){
            let currenthtml = e.target.innerHTML;
            // match the id of the current notepad with the one inside notelist
            let noteindex = notelist.findIndex(x => x.name === notepad.id);
            notelist[noteindex].notetext = currenthtml;
            chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons}, () => {});
        }
        else if (e.target && e.target.id === namebox.id){
            namebox.style.color = 'black';
            if (notepad !== undefined){
                // if changing the title in the namebox, we need to update the note display name and the button name
                let currenthtml = e.target.innerHTML;

                // match the id of the current notepad with the one inside notelist
                let noteindex = notelist.findIndex(x => x.name === notepad.id);
                notelist[noteindex].displayname = currenthtml;

                // find button corresponding to note
                let button = document.getElementById(notepad.id + 'b');
                button.innerHTML = currenthtml;
                chrome.storage.local.set({ notelist_saved: JSON.stringify(notelist), createdbuttons_saved: createdbuttons}, () => {});
            }
        }
});

document.addEventListener('click',function(e){
    if(e.target && e.target.id === 'addnote'){
        // create a new button, along with a delete that corresponds to it inside a new corresponding div
        let newdiv = document.createElement('div');
        newdiv.type = 'div';
        newdiv.id = createdbuttons + 'div';
        newdiv.className = 'totalbutton';
        leftcolumn.appendChild(newdiv);

        // add the id of the new button
       // notebuttonlist.push(newdiv.id);

        // new button
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'button';
        button.id = createdbuttons + 'b';
        button.innerHTML = 'New Note';
        newdiv.appendChild(button);

        // create corresponding note
        namebox.style.color = 'black';
        namebox.innerHTML = 'New Note';
        let note = document.createElement('div');
        note.className = 'note';
        note.id = createdbuttons;
        note.contentEditable = 'true';
        // if notepad exists, replace it
        if (notepad) {
            rightcolumn.replaceChild(note, notepad);
        }
        // otherwise just add it to the blank thing
        else {
            rightcolumn.appendChild(note);
        }

        //scroll to add button, focus on notepad
        button.focus();
        notepad = note;
        notepad.focus();

        let note_object = {
            displayname: 'New Note',
            // basically the id or internal name, i didnt want to name it id because html is named id
            name: note.id,
            notetext: ''
        }
        notelist.push(note_object);
        createdbuttons++;

        // save data
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
        let noteget = notelist[notelist.findIndex(x => (x.name + 'b') === e.target.id)];
        let notehtml = noteget.notetext;
        let notename = noteget.name;
        namebox.style.color = 'black';
        namebox.innerHTML = noteget.displayname;

        let note = document.createElement('div');
        note.className = 'note';
        note.id = notename;
        note.innerHTML = notehtml;
        note.contentEditable = 'true';

        // replace the current note with the new note
        // if notepad exists, replace it
        if (notepad) {
            rightcolumn.replaceChild(note, notepad);
        }

        // otherwise just add it to the blank thing
        else {
            rightcolumn.appendChild(note);
        }
        notepad = note;

        // button clicked
        let buttondiv = document.getElementById(e.target.id);
        // change focus adn save
        buttonFocus(buttondiv);

    }
    else if(e.target && notepad && e.target.className === 'deletebutton') {
        // if click on delete button, find the current notepad being used and delete it
        // also delete the button corresponding to the notepad
        // savea  temporary id because we ar edeleting
        if (notepad) {
            // remove notepad from list and column
            let notepadid_temp = notepad.id;
            let index = notelist.findIndex(x => (x.name) ===  notepad.id);
            notelist.splice(index,1);
            rightcolumn.removeChild(notepad);

            // delete the left column button corresponding to the notepad
            let div = document.getElementById(notepadid_temp + 'div');
            div.remove();

            // change namebox
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

