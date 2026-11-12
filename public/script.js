// Get HTML elements
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

// Function to display messages
function addMessage(message, sender) {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender);

    const messageText = document.createElement("p");
    messageText.textContent = message;

    messageDiv.appendChild(messageText);
    chatMessages.appendChild(messageDiv);

    // Scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle form submission
chatForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    // Remove welcome message
    const welcomeMessage = document.querySelector(".welcome-message");

    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    // Display user's message
    addMessage(message, "user-message");

    // Clear input
    messageInput.value = "";

    // Disable button while waiting
    sendBtn.disabled = true;
    sendBtn.textContent = "Thinking...";

    // Show loading message
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "ai-message");
    loadingDiv.textContent = "Thinking...";
    chatMessages.appendChild(loadingDiv);

    try {

        // Send message to backend
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Check for errors
        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        // Remove loading message
        loadingDiv.remove();

        // Display Gemini's response
        addMessage(data.reply, "ai-message");

    } catch (error) {

        loadingDiv.remove();

        addMessage(
            "Sorry, something went wrong: " + error.message,
            "ai-message"
        );

        console.error("Chat error:", error);

    } finally {

        // Enable button again
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";

        messageInput.focus();
    }

});

// New Chat button
newChatBtn.addEventListener("click", function () {

    chatMessages.innerHTML = `
        <div class="welcome-message">
            <h1>How can I help you today?</h1>
            <p>Ask me anything!</p>
        </div>
    `;

    messageInput.value = "";
    messageInput.focus();

});
