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
  console.log("Loading home topics...");
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
          <h4>Messages:</h4>
          <ul>
            ${
              t.messages.length > 0
                ? t.messages
                    .map(
                      (m) =>
                        `<li><strong>${
                          m.user?.username || "Unknown"
                        }:</strong> ${m.content} <em>(${new Date(
                          m.createdAt
                        ).toLocaleString()})</em></li>`
                    )
                    .join("")
                : "<li>No messages yet</li>"
            }
          </ul>
          <button onclick="unsubscribe('${t._id}')">Unsubscribe</button>
        </div>
      `
      )
      .join("");
  } else {
    console.error("Failed to load home topics");
  }
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
  await fetch(`${API}/topics/${id}/unsubscribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadHome();
}

// Available topics
async function loadAvailableTopics() {
  console.log("Loading available topics...");
  const res = await fetch(`${API}/topics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const topics = await res.json();
    const div = document.getElementById("available");
    const select = document.getElementById("topicTitle"); // Dropdown for topic titles
    div.innerHTML = "";
    select.innerHTML =
      '<option value="" disabled selected>Select a Topic</option>'; // Reset dropdown

    topics.forEach((topic) => {
      // Populate topic cards
      const card = document.createElement("div");
      card.className = "topic-card";
      card.innerHTML = `
        <h3>${topic.title}</h3>
        <p>Created By: ${topic.createdBy || "Unknown"}</p>
        <p>Subscribers: ${topic.subscribers.length}</p>
        <p>Access Count: ${topic.accessCount}</p>
        <h4>Messages:</h4>
        <ul>
          ${
            topic.messages
              .map((message) => `<li>${message.content}</li>`)
              .join("") || "<li>No messages yet</li>"
          }
        </ul>
        <button onclick="subscribe('${topic._id}')">Subscribe</button>
      `;
      div.appendChild(card);

      // Populate dropdown
      const option = document.createElement("option");
      option.value = topic.title;
      option.textContent = topic.title;
      select.appendChild(option);
    });
  } else {
    console.error("Failed to load available topics");
  }
}

// Subscribe
async function subscribe(id) {
  await fetch(`${API}/topics/${id}/subscribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadHome(); // Refresh "Your Topics"
  loadAvailableTopics(); // Refresh "Available Topics"
}

// Post message
async function postMessage() {
  const topicTitle = document.getElementById("topicTitle").value; // Get the topic title
  const content = document.getElementById("messageContent").value;

  try {
    // Fetch the topic by title to get its ID
    const topicResponse = await fetch(`${API}/topics`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!topicResponse.ok) {
      console.error("Failed to fetch topics");
      console.log("Response status:", topicResponse.status);
      console.log("Response details:", await topicResponse.text());
      return;
    }

    const topics = await topicResponse.json();
    const topic = topics.find((t) => t.title === topicTitle);

    if (!topic) {
      alert("Topic not found");
      return;
    }

    const topicId = topic._id; // Extract the topic ID

    // Post the message
    const response = await fetch(`${API}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topicId, content }),
    });

    if (response.ok) {
      alert("Message posted successfully!");
      loadHome(); // Refresh "Your Topics"
      loadAvailableTopics(); // Refresh "Available Topics"
    } else {
      console.error("Failed to post message:", await response.text());
    }
  } catch (error) {
    console.error("Error posting message:", error);
  }
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
