// list of the notes that are saved
var notelist = [];
// list of the buttons that correspond to each note
var notebuttonlist = [];
// how many buttons were created
var createdbuttons = 0;

var notepad = undefined;


// grab saved data
chrome.storage.local.get(['notelist','notebuttonlist'], function (data) {
  //  notepad.innerHTML = data.notepad;

});

if (notepad){
    // event listener for whenever key is typed
    notepad.addEventListener('keyup', function (event) {
        chrome.storage.local.set({notepad: event.target.innerHTML}, () => {
            console.log("Notepad updated with", event.target.innerHTML);
        });
    });
}

document.addEventListener('click',function(e){
    if(e.target && e.target.id === 'addnote'){
        // create a new button, along with a note that corresponds to it , internal id should be like note1 and notebutton1
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'button';
        button.id = 'notebutton' + createdbuttons;
        button.innerHTML = button.id;

        var leftcolumn = document.getElementById('notelist');
        leftcolumn.insertBefore(button,e.target);
        notebuttonlist.push(button);

        // create note
        var note = document.createElement('div');
        note.className = 'note';
        note.id = 'note' + createdbuttons;
        note.innerHTML = note.id;
        // if notepad exists, replace it
        if (notepad) {
            var rightcolumn = document.getElementById('notebox');
            rightcolumn.replaceChild(note, notepad);
        }
        // otherwise just add it to the blank thing
        else {
            var rightcolumn = document.getElementById('notebox');
            rightcolumn.appendChild(note);
        }
        notepad = note;
        notelist.push(note);

        createdbuttons++;

    }
    else if(e.target && e.target.id === 'add'){
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'button';
        button.innerHTML = 'added note';
        var column = document.getElementById('notelist');
        column.insertBefore(button,e.target);
    }
});

