/* data.js */
const DB_NAME = "LocalSocialMediaDB";
const DB_VERSION = 1;
let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = e => {
      db = e.target.result;
      if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media", { keyPath: "key" });
      }
    };
    request.onsuccess = e => { db = e.target.result; resolve(db); };
    request.onerror = e => reject(e);
  });
}

async function saveMedia(key, blob) {
  await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("media", "readwrite");
    const store = tx.objectStore("media");
    store.put({ key, blob });
    tx.oncomplete = () => resolve(true);
    tx.onerror = e => reject(e);
  });
}

async function getMedia(key) {
  await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("media", "readonly");
    const store = tx.objectStore("media");
    const req = store.get(key);
    req.onsuccess = () => {
      resolve(req.result ? req.result.blob : null);
    };
    req.onerror = e => reject(e);
  });
}

/* LOCALSTORAGE HELPERS */
function getUsers() { return JSON.parse(localStorage.getItem("users") || "{}"); }
function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }
function getCurrentUser() { return localStorage.getItem("currentUser"); }
function setCurrentUser(u) { localStorage.setItem("currentUser", u); }
function logout() { localStorage.removeItem("currentUser"); }

function getPosts() { return JSON.parse(localStorage.getItem("posts") || "[]"); }
function savePosts(posts) { localStorage.setItem("posts", JSON.stringify(posts)); }

function getComments(postId) { return JSON.parse(localStorage.getItem("comments_"+postId) || "[]"); }
function saveComments(postId, comments) { localStorage.setItem("comments_"+postId, JSON.stringify(comments)); }

function getSubscriptions(user) { return JSON.parse(localStorage.getItem("subs_"+user) || "[]"); }
function saveSubscriptions(user, subs) { localStorage.setItem("subs_"+user, JSON.stringify(subs)); }

function likePost(user, postId) {
  let likes = JSON.parse(localStorage.getItem("likes_"+postId) || "[]");
  if (!likes.includes(user)) likes.push(user);
  localStorage.setItem("likes_"+postId, JSON.stringify(likes));
}
function getLikes(postId) { return JSON.parse(localStorage.getItem("likes_"+postId) || "[]"); }
