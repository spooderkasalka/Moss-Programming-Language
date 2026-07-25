document.querySelectorAll(".copy-button").forEach(button => {
    const text = button.textContent;
    const copied = "✓ Copied!";
    let timeout;

    button.addEventListener("click", async () => {
        const code = button.closest(".code-block").querySelector("code").innerText;

        navigator.clipboard.writeText(code);

        button.textContent = copied;

        clearTimeout(timeout)

        timeout = setTimeout(() => {
            button.textContent = text;
        }, 1500);
    });
});