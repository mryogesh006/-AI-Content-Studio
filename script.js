// API Setup
const API_KEY = "AIzaSyAVS6BYRvmM23ShiNGgdwZLXFZs-vvQadI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${API_KEY}`;

// Button click → Generate
document.getElementById("generateBtn").addEventListener("click", async function () {

    let text = document.getElementById("userInput").value.trim();
    let feature = document.getElementById("feature").value;
    let output = document.getElementById("output");

    if (!text) { output.innerText = "⚠️ Please enter text."; return; }

    // Loading
    this.disabled = true;
    this.textContent = "⏳ Generating...";
    document.getElementById("loader").style.display = "block";

    try {
        let res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: feature + ": " + text }] }] })
        });

        let data = await res.json();
        output.innerHTML = data.candidates[0].content.parts[0].text.replace(/\n/g, "<br>");

    } catch (e) {
        output.innerText = "❌ Error: " + e.message;
    }

    // Done
    document.getElementById("loader").style.display = "none";
    this.disabled = false;
    this.textContent = "🚀 Generate";
});
