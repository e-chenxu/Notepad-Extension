// make sure to keep saving constanty and getting

// list of the notes that are saved
let notelist = [];
// how many buttons were created
let createdbuttons = 0;

// current notepad element
let notepad = undefined;

let leftcolumn = document.getElementById('notelist');
let rightcolumn = document.getElementById('notebox');
let addbutton = document.getElementById('addbutton');
let namebox = document.getElementById('namebox');

// initial get saved data
chrome.storage.local.get(['notelist_saved','createdbuttons_saved'], function (saveddata) {
    if (saveddata.notelist_saved){
        notelist = JSON.parse(saveddata.notelist_saved);
        for (let i = 0; i < notelist.length; i++){
            // create button, along with a delete that corresponds to it inside a new corresponding div
            let newdiv = document.createElement('div');
            newdiv.type = 'div';
            newdiv.id = notelist[i].name + 'div';
            newdiv.className = 'totalbutton';
            leftcolumn.insertBefore(newdiv,addbutton);

            // new button
            let button = document.createElement('button');
            button.type = 'button';
            button.className = 'button';
            button.id = notelist[i].name + 'b';
            button.innerHTML = notelist[i].displayname;
            newdiv.appendChild(button);

       /*     // new delete
            let deletebut = document.createElement('button');
            deletebut.type = 'button';
            deletebut.className = 'deletebut';
            deletebut.id = notelist[i].name + 'd';
            deletebut.innerHTML = '-';
            newdiv.appendChild(deletebut);*/
        }
        if (notelist.length !== 0) {
        // initial notepad is the first one
            let note = document.createElement('div');
            note.className = 'note';
            note.id = notelist[0].name;
            note.innerHTML = notelist[0].notetext;
            note.contentEditable = 'true';
            rightcolumn.appendChild(note);
            notepad = note;
            // namebox title
            namebox.innerHTML = notelist[0].displayname;
        }
    }
    if (saveddata.createdbuttons_saved){
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
});

document.addEventListener('click',function(e){
    if(e.target && e.target.id === 'addnote'){
        // create a new button, along with a delete that corresponds to it inside a new corresponding div
        let newdiv = document.createElement('div');
        newdiv.type = 'div';
        newdiv.id = createdbuttons + 'div';
        newdiv.className = 'totalbutton';
        leftcolumn.insertBefore(newdiv,addbutton);

        // add the id of the new button
       // notebuttonlist.push(newdiv.id);

        // new button
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'button';
        button.id = createdbuttons + 'b';
        button.innerHTML = 'New Note';
        newdiv.appendChild(button);

     /*   // new delete
        let deletebut = document.createElement('button');
        deletebut.type = 'button';
        deletebut.className = 'deletebut';
        deletebut.id = createdbuttons + 'd';
        deletebut.innerHTML = '-';
        newdiv.appendChild(deletebut);*/

        // create corresponding note
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
        chrome.storage.local.set({notelist_saved: JSON.stringify(notelist),createdbuttons_saved: createdbuttons}, () => {});

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
    }
   /* else if(e.target && e.target.className === 'deletebut'){
        // find the div that contains this and delete it
        e.target.parentNode.remove();
        // find the index of where the corresponding note is in the array
        let index = notelist.findIndex(x => (x.name + 'd') ===  e.target.id);
        notelist.splice(index,1);
        chrome.storage.local.set({notelist_saved: JSON.stringify(notelist),createdbuttons_saved: createdbuttons}, () => {});
        if (notepad) {
            rightcolumn.removeChild(notepad);
            notepad = undefined;
        }
    }*/
    else if(e.target && notepad && e.target.className === 'deletebutton') {
        // if click on delete button, find the current notepad being used and delete it
        // also delete the button corresponding to the notepad
        // savea  temporary id because we ar edeleting
        let notepadid_temp = notepad.id;
        let index = notelist.findIndex(x => (x.name) ===  notepad.id);
        notelist.splice(index,1);
        chrome.storage.local.set({notelist_saved: JSON.stringify(notelist),createdbuttons_saved: createdbuttons}, () => {});
        if (notepad) {
            rightcolumn.removeChild(notepad);
            notepad = undefined;
            // delete the left column button corresponding to the notepad
            let div = document.getElementById(notepadid_temp + 'div');
            div.remove();
            namebox.innerHTML = '';
        }
    }
});

