
const btn = document.getElementById("generateBtn");
const input = document.getElementById("userInput");
const output = document.getElementById("output");
const loader = document.getElementById("loader");
const feature = document.getElementById("feature");

const prompts = {
    ask: "Answer clearly and concisely.\n\nQuestion: ",
    summarize: "Summarize this in bullet points:\n\n",
    ideas: "Generate creative ideas about:\n\n",
    define: "Explain in simple words with an example:\n\n"
};

async function callAPI(text) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text }] }]
        })
    });

    const data = await res.json();

    // Handle errors
    if (data.error) return "❌ " + data.error.message;
    if (!data.candidates?.[0]) return "⚠️ No response from API.";

    return data.candidates[0].content.parts[0].text;
}

function formatText(text) {
    return text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/^### (.+)$/gm, "<h4>$1</h4>")
        .replace(/^## (.+)$/gm, "<h3>$1</h3>")
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/^\* (.+)$/gm, "<li>$1</li>")
        .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
        .replace(/\n/g, "<br>");
}

btn.addEventListener("click", async () => {
    const text = input.value.trim();

    if (!text) {
        output.innerHTML = "<span class='warning'>⚠️ Please enter some text.</span>";
        return;
    }

    // Show loading
    btn.disabled = true;
    btn.textContent = "⏳ Generating...";
    loader.style.display = "block";
    output.innerHTML = "";

    const prompt = (prompts[feature.value] || "") + text;
    const result = await callAPI(prompt);

    loader.style.display = "none";
    btn.disabled = false;
    btn.textContent = "🚀 Generate";
    output.innerHTML = formatText(result);
});

input.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") btn.click();
});
