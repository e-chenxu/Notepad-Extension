var note_id =  "note1";
var notepad = document.getElementById(note_id);
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

document.addEventListener('click',function(e){
    if(e.target && e.target.id === 'bro'){
        //do something
        notepad.style.backgroundColor = 'yellow';
    }
    else if(e.target && e.target.id === 'add'){
        notepad.style.backgroundColor = 'blue';
        var button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'added button';
        var column = document.getElementById('notelist');
        column.insertBefore(button,e.target);
    }
});

