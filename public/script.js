const API = "/api";
const token = localStorage.getItem("token");

// Register
async function register() {
  const username = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;

  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  alert("Registered! Now login.");
}

// Login
async function login() {
  console.log("Login function called"); // Add this line to confirm the function is hit

  const username = document.getElementById("logUser").value;
  const password = document.getElementById("logPass").value;

  console.log("Username:", username);
  console.log("Password:", password);

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log("Response received:", res);
    console.log("Response status:", res.status);

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username); // Store the username
        window.location = "home.html"; // Redirect to home page
      } else {
        alert("Login failed: token not found");
      }
    } else {
      alert("Login faileddd");
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
}

// Fetch subscribed topics + messages
async function loadHome() {
  console.log("Loading home topics..."); // Debugging line
  const res = await fetch(`${API}/topics/home`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const topics = await res.json();
    const div = document.getElementById("topics");
    div.innerHTML = topics
      .map(
        (t) => `
        <div>
          <h3>${t.title}</h3>
          ${t.messages.map((m) => `<p>${m.content}</p>`).join("")}
          <button onclick="unsubscribe('${t._id}')">Unsubscribe</button>
        </div>
      `
      )
      .join("");
  } else {
    console.error("Failed to load home topics");
  }

  loadAvailableTopics();
}

// Create topic
async function createTopic() {
  const title = document.getElementById("newTopic").value;
  console.log("Title being sent:", title);
  console.log("Payload being sent:", JSON.stringify({ title }));

  try {
    const response = await fetch(`${API}/topics`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    console.log("Response received:", response);
    console.log("Response status:", response.status);

    if (response.ok) {
      alert("Topic created successfully!");
      loadHome(); // Refresh the topics list
    } else {
      console.log("Failed to create topic");
      console.log("Response details:", await response.text()); // Log the response body
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
}

// Unsubscribe
async function unsubscribe(id) {
  await fetch(`${API}/topics/unsubscribe/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadHome();
}

// Available topics
async function loadAvailableTopics() {
  console.log("Loading available topics..."); // Debugging line
  const res = await fetch(`${API}/topics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const topics = await res.json();
    const div = document.getElementById("available");
    div.innerHTML = ""; // Clear existing content
    console.log("Available topics:", topics); // Debugging line

    topics.forEach((topic) => {
      const card = document.createElement("div");
      card.className = "topic-card";
      card.innerHTML = `
        <h3>${topic.title}</h3>
        <p>Created By: ${topic.createdBy || "Unknown"}</p>
        <p>Subscribers: ${topic.subscribers.length}</p>
        <p>Access Count: ${topic.accessCount}</p>
        <button onclick="subscribe('${topic._id}')">Subscribe</button>
      `;
      div.appendChild(card);
    });
  } else {
    console.error("Failed to load available topics");
  }
}

// Subscribe
async function subscribe(id) {
  await fetch(`${API}/topics/subscribe/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadHome();
}

// Post message
async function postMessage() {
  const topicId = document.getElementById("topicId").value;
  const content = document.getElementById("messageContent").value;

  await fetch(`${API}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topicId, content }),
  });

  loadHome();
}

// Display username
function displayUsername() {
  const username = localStorage.getItem("username"); // Retrieve username from localStorage
  if (username) {
    document.getElementById("usernameDisplay").textContent = username;
  } else {
    document.getElementById("usernameDisplay").textContent = "Guest";
  }
}

// Call this function when the page loads
window.onload = function () {
  displayUsername();
};

// Load home page content on visit
if (window.location.pathname.endsWith("home.html")) {
  loadHome();
  loadAvailableTopics();
}
