// list of the notes that are saved
let notelist = [];
// list of the buttons that correspond to each note
let notebuttonlist = [];
// how many buttons were created
let createdbuttons = 0;

// current notepad
let notepad = undefined;

let leftcolumn = document.getElementById('notelist');
let rightcolumn = document.getElementById('notebox');
let addbutton = document.getElementById('addbutton');

// grab saved data
/*chrome.storage.local.get(['notelist_saved','notebuttonlist_saved'], function (saveddata) {
    // get the saved buttons
    notebuttonlist = JSON.parse(saveddata.notebuttonlist_saved);
    for (let i = 0; i < notebuttonlist.length; i++){
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'button';
        button.id = notebuttonlist[i];
        button.innerHTML = button.id;
        leftcolumn.insertBefore(button,addbutton);
    }
    // set initial notepad, button 1



    // saved notes?
    notelist = JSON.parse(saveddata.notelist_saved);
  //  notepad.innerHTML = data.notepad;
   // notepad. =

});*/

if (notepad){
    // event listener for whenever key is typed
    notepad.addEventListener('keyup', function (event) {
        chrome.storage.local.set({notepad: event.target.innerHTML}, () => {
            // save to specific notepad
            console.log("Notepad updated with", event.target.innerHTML);
        });
    });
}

document.addEventListener('click',function(e){
    if(e.target && e.target.id === 'addnote'){
        // create a new button, along with a delete that corresponds to it inside a new corresponding div
        let newdiv = document.createElement('div');
        newdiv.type = 'div';
        newdiv.id = createdbuttons;
        newdiv.className = 'totalbutton';
        leftcolumn.insertBefore(newdiv,addbutton);

        // add the id of the new button
        notebuttonlist.push(newdiv.id);

        // new button
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'button';
        button.id = createdbuttons + 'b';
        button.innerHTML = button.id + "ruh";
        newdiv.appendChild(button);

        // new delete
        let deletebut = document.createElement('button');
        deletebut.type = 'button';
        deletebut.className = 'deletebut';
        deletebut.id = createdbuttons + 'd';
        deletebut.innerHTML = '-';
        newdiv.appendChild(deletebut);

        // create corresponding note
        let note = document.createElement('div');
        note.className = 'note';
        note.id = createdbuttons;
        note.innerHTML = note.id;
        // if notepad exists, replace it
        if (notepad) {
            rightcolumn.replaceChild(note, notepad);
        }
        // otherwise just add it to the blank thing
        else {
            rightcolumn.appendChild(note);
        }
        notepad = note;

        let note_object = {
            name: note.id,
            notetext: note.id
        }
        notelist.push(note_object);

        // save new note
        chrome.storage.local.set({notelist_saved: JSON.stringify(notelist), notebuttonlist_saved: JSON.stringify(notebuttonlist)}, () => {
            // save to specific notepad
            console.log("saved");
        });

        createdbuttons++;

    }
    // if click on note button, then show the corresponding note
    else if(e.target && e.target.className === 'button'){
        // get the notelist
        chrome.storage.local.get(['notelist_saved','notebuttonlist_saved'], function (saveddata) {
            notelist = JSON.parse(saveddata.notelist_saved);
        });
        // find the note that corresponds to the button id
        let notehtml = notelist[notelist.findIndex(x => x.name === e.target.id)].notetext;
        let note = document.createElement('div');
        note.className = 'note';
        note.id = e.target.id;
        note.innerHTML = notehtml;
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
    }
});

