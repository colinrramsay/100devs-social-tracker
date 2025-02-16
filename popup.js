//establish appwrite consts
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67b12193000bc9718dfa');

const account = new Account(client);
const databases = new Databases(client)

//select DOM elements
const nameInput = document.querySelector('#nameInput');
const setName = document.querySelector('#setName');
const activityList = document.querySelector('#activityList');

if (localStorage.getItem("username")) {
    nameInput.value = localStorage.getItem("username");
    sendMessageToContentScript();
}

setName.addEventListener('click', sendMessageToContentScript);

// Function to send a test message to the main.js content script
async function sendMessageToContentScript() {
    const username = nameInput.value;
    localStorage.setItem("username", username);
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, `${username}`);
    // do something with response here, not outside the function
    console.log(response);
};

//like activity function
async function likeActivity() {
    console.log(this);
    const doc = await databases.getDocument(
        '67b125c20014e1f66505', // databaseId
        '67b125fb00368bb996e0', // collectionId
        `${this.id}`, // documentId
    );
    const likes = doc.likes;
    likes.push(localStorage.getItem("username"));
    console.log(likes);
    
    const result = await databases.updateDocument(
        '67b125c20014e1f66505', // databaseId
        '67b125fb00368bb996e0', // collectionId
        `${this.id}`, // documentId
        {"likes": likes}, // data (optional)
    );
}

//grab existing actions
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
            const like = li.querySelector("span");
            like.id = doc['$id'];
            like.addEventListener("click", likeActivity);
            activityList.appendChild(li);
        })
    })


