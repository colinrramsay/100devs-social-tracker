//set up appwrite consts
const client = new Client();
const PROJECT_ID = '67b12193000bc9718dfa';
const DATABASE_ID = '67b125c20014e1f66505';
const COLLECTION_ID = '67b125fb00368bb996e0';

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client)

//add fixed overlay to DOM
const overlay = document.createElement('aside');
overlay.id = 'overlay';
overlay.innerHTML = 
    `<span id="collapse">V</span><span id="latestActivity" class="hidden"></span>
    <div id="feed">
        <input type="text" id="nameInput">
        <h2 id="setName">set name</h2>
        <ul id="activityList"></ul>
    </div>`;
document.querySelector('main').appendChild(overlay);

//DOM overlay selectors
const nameInput = document.querySelector('#nameInput');
const setName = document.querySelector('#setName');
const activtyList = document.querySelector('#activityList');
const latestActivity = overlay.querySelector('#latestActivity');

//make overlay collapsible by hiding feed
const collapse = document.querySelector('#collapse');
collapse.addEventListener('click', () => {
    const feed = document.querySelector('#feed');
    feed.classList.toggle('hidden');
    latestActivity.classList.toggle('hidden');
});

//initialize username from localStorage if exists
let username;
if (localStorage.getItem("username")) {
    username = localStorage.getItem("username");
    nameInput.value = username;
}

//set username event listener
setName.addEventListener('click', setUsername);

function setUsername() {
    if (nameInput.value) {
        username = nameInput.value;
        localStorage.setItem("username", username);
    }
}

//grab existing actions from DB & append to DOM
databases.listDocuments(
    "67b125c20014e1f66505",
    "67b125fb00368bb996e0",
    [
        Query.orderDesc('$createdAt'),    
        Query.limit(10),
    ]
)
    .then(function (response) {
        console.log(response);
        response.documents.forEach(doc => {
            const li = document.createElement('li');
            li.innerHTML = `${doc.name} ${doc.action}, ${doc.likes.length} likes | <span><3</span>`;
            //add like functionality to <3
            const like = li.querySelector("span");
            like.id = doc['$id'];
            like.addEventListener("click", likeActivity);
            activityList.appendChild(li);
            //set up collapsed overlay highlight
            const latestFromlist = activityList.querySelector('li');
            latestActivity.innerText = latestFromlist.innerText;
        })
    })

//like activity function
async function likeActivity() {
    console.log(this);
    //get relevant document by ID & store likes array
    const doc = await databases.getDocument(
        DATABASE_ID, // databaseId
        COLLECTION_ID, // collectionId
        `${this.id}`, // documentId
    );
    const likes = doc.likes;
    //add new like to array
    likes.push(localStorage.getItem("username"));
    console.log(likes);
    
    //update document with updated array
    const result = await databases.updateDocument(
        DATABASE_ID, // databaseId
        COLLECTION_ID, // collectionId
        `${this.id}`, // documentId
        {"likes": likes}, // data (optional)
    );
}

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
                DATABASE_ID,
                COLLECTION_ID,
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
                DATABASE_ID,
                COLLECTION_ID,
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

/*
GARBAGE CODE

//listen for username from extension popup

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    username = message;
    localStorage.setItem("username", username);
    console.log(message);
});
*/
