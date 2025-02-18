//set up appwrite consts
import { Client, Account, Databases, ID, Query } from 'appwrite';
export const client = new Client();

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;

client.setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

//get username from local storage
let username;
getUsername();

//add fixed overlay to DOM
const overlay = document.createElement('aside');
overlay.id = 'overlay';
overlay.innerHTML = `
    <div id="collapse">        
        <span id="collapseText">Latest Activity</span> 
        <span id="collapseCurrentUser"></span>          
        <span class="w-5 h-5 justify-self-end"> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"></path>
            </svg>
        </span>        
    </div>
    <hr class="m-1" />
    <div id="overlayMessage"></div>    
    <div id="latestActivity" class="hidden"></div>    
    <div id="feed">
        <ul id="activityList"></ul>
    </div>`;
document.querySelector('main').appendChild(overlay);

//DOM overlay selectors
const overlayMessage = overlay.querySelector('#overlayMessage');
const currentUser = overlay.querySelector('#collapseCurrentUser');
const activtyList = document.querySelector('#activityList');
const latestActivity = overlay.querySelector('#latestActivity');

//make overlay collapsible by hiding feed
const collapse = document.querySelector('#collapse');
const feed = document.querySelector('#feed');
collapse.addEventListener('click', () => {
  feed.classList.toggle('hidden');
  latestActivity.classList.toggle('hidden');
  currentUser.classList.toggle('hidden');
});

function loadActivity() {
  fetchActivity();
  // Check for database updates every 60 seconds
  setInterval(() => {
    fetchActivity();
  }, 60000);
}
//grab existing actions from DB & append to DOM
function fetchActivity() {
  databases
    .listDocuments('67b125c20014e1f66505', '67b125fb00368bb996e0', [
      Query.orderDesc('$createdAt'),
      Query.limit(10),
    ])
    .then(function (response) {
      activtyList.innerHTML = '';
      response.documents.forEach((doc) => {
        const li = document.createElement('li');
        li.classList.add('activityItem');
        li.innerHTML = `<span class="activityItem-username">${doc.name}</span> <span class="activityItem-action">${doc.action}</span> <btn class="activityItem-likebtn" title="Add like"><svg class="activityItem-likebtn-icon" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 5.72c-2.624-4.517-10-3.198-10 2.461 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-5.678-7.396-6.944-10-2.461z" fill-rule="nonzero"/></svg> <span class="activityItem-likebtn-number">${doc.likes.length}</span> </btn>`;
        //add like functionality to <3
        const like = li.querySelector('btn');

        like.id = doc['$id'];
        like.addEventListener('click', likeActivity);
        activityList.appendChild(li);
      });
      //set up collapsed overlay highlight
      const latestFromlist = activityList.querySelector('li');
      latestActivity.innerHTML = latestFromlist.innerHTML;
    });
}

//like activity function
async function likeActivity() {
  console.log(this);
  //get relevant document by ID & store likes array
  const doc = await databases.getDocument(
    DATABASE_ID, // databaseId
    COLLECTION_ID, // collectionId
    `${this.id}` // documentId
  );
  const likes = doc.likes;
  //add new like to array, only if username hasn't already liked
  getUsername()
  if (!likes.includes(username)) {
    likes.push(username);
  console.log(likes);

  //update document with updated array
  const result = await databases.updateDocument(
    DATABASE_ID, // databaseId
    COLLECTION_ID, // collectionId
    `${this.id}`, // documentId
    { likes: likes } // data (optional)
  );
  loadActivity();
  }
}

//add event listener on checkboxes, callback adding doc to database
//adds to hw checkboxes + class 'watched' checkboxes
const hwItems = document.querySelectorAll('.item');
hwItems.forEach((el) => el.addEventListener('change', addHwActivity));
const watched = document.querySelectorAll('.watched');
watched.forEach((el) => el.addEventListener('change', addClassActivity));

//add HW activity to database
async function addHwActivity() {
  if (this.checked) {
    try {
      const itemId = this.id;
      const label = document.querySelector(`label[for="${itemId}"]`);
      const promise = databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name: username,
          action: `did: ${label.innerText}`,
        }
      );

      promise.then(
        function (response) {
          console.log(response);
        },
        function (error) {
          console.log(error);
        }
      );
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
          name: username,
          action: `watched ${classNumber}`,
        }
      );

      promise.then(
        function (response) {
          console.log(response);
        },
        function (error) {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

function getUsername() {
  chrome.storage.local.get(['username'], function (result) {
    if (result.username) {
      username = result.username;
      currentUser.textContent = `( ${username} )`;
      loadActivity();
    } else {
      overlayMessage.textContent =
        'Please set username in extension popup and refresh';
    }
  });
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
