const API = '/api';
const token = localStorage.getItem('token');

// Register
async function register() {
  const username = document.getElementById('regUser').value;
  const password = document.getElementById('regPass').value;

  await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password })
  });

  alert('Registered! Now login.');
}

// Login
async function login() {
  const username = document.getElementById('logUser').value;
  const password = document.getElementById('logPass').value;

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location = 'home.html';
  } else {
    alert('Login failed');
  }
}

// Fetch subscribed topics + messages
async function loadHome() {
  const res = await fetch(`${API}/topics/home`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const topics = await res.json();

  const div = document.getElementById('topics');
  div.innerHTML = topics.map(t =>
    `<div>
      <h3>${t.title}</h3>
      ${t.messages.map(m => `<p>${m.content}</p>`).join('')}
      <button onclick="unsubscribe('${t._id}')">Unsubscribe</button>
    </div>`).join('');

  loadAvailableTopics();
}

// Create topic
async function createTopic() {
  const title = document.getElementById('newTopic').value;
  await fetch(`${API}/topics/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });
  loadHome();
}

// Unsubscribe
async function unsubscribe(id) {
  await fetch(`${API}/topics/unsubscribe/${id}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  loadHome();
}

// Available topics
async function loadAvailableTopics() {
  const res = await fetch(`${API}/topics/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const topics = await res.json();

  const div = document.getElementById('available');
  div.innerHTML = topics.map(t =>
    `<div>${t.title} <button onclick="subscribe('${t._id}')">Subscribe</button></div>`
  ).join('');
}

// Subscribe
async function subscribe(id) {
  await fetch(`${API}/topics/subscribe/${id}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  loadHome();
}

// Post message
async function postMessage() {
  const topicId = document.getElementById('topicId').value;
  const content = document.getElementById('messageContent').value;

  await fetch(`${API}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topicId, content })
  });

  loadHome();
}

// Load home page content on visit
if (window.location.pathname.endsWith('home.html')) {
  loadHome();
}
