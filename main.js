//set up appwrite connection
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67b12193000bc9718dfa');

const account = new Account(client);
const databases = new Databases(client)

//add message listener from popup, initialize from localStorage
let username;
if (localStorage.getItem("username")) {
    username = localStorage.getItem("username");
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    username = message;
    localStorage.setItem("username", username);
    console.log(message);
});

//add event listener on checkboxes, callback adding doc to database
//adds to hw checkboxes + class 'watched' checkboxes
const hwItems = document.querySelectorAll('.item');
hwItems.forEach(el => el.addEventListener('change', addHwActivity));
const watched = document.querySelectorAll('.watched');
watched.forEach(el => el.addEventListener('change', addClassActivity));

//add HW activity to database
async function addHwActivity() {
	if (this.checked) {
        try {
            const itemId = this.id;
            const label = document.querySelector(`label[for="${itemId}"]`)
            const promise = databases.createDocument(
                '67b125c20014e1f66505',
                '67b125fb00368bb996e0',
                ID.unique(),
                { 
                    "name": username,
                    "action": `did: ${label.innerText}`,
                }
            );
            
            promise.then(function (response) {
                console.log(response);
            }, function (error) {
                console.log(error);
            });
        } catch (err) {
            console.log(err);
        }
    }
}

//add class activity to database
async function addClassActivity() {
	if (this.checked) {
        try {
            const greatGrandparent = this.parentElement.parentElement.parentElement;
            const classNumber = greatGrandparent.querySelector('h3').innerText;
            const promise = databases.createDocument(
                '67b125c20014e1f66505',
                '67b125fb00368bb996e0',
                ID.unique(),
                { 
                    "name": username,
                    "action": `watched ${classNumber}`,
                }
            );
            
            promise.then(function (response) {
                console.log(response);
            }, function (error) {
                console.log(error);
            });
        } catch (err) {
            console.log(err);
        }
    }
}
