const token_types = {
    keyword: ["let", "const", "if"],
    type: ["str", "bool", "int32", "int64", "fl32", "fl64"],
    restricted: ["u32"],
    boolean: ["true", "false"],
    null: ["null"]
};

function escape_html(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function get_token_type(word) {
    for (const [type, values] of Object.entries(token_types)) {
        if (values.includes(word)) {
            return type;
        }
    }

    return null;
}

function highlight(code) {
    let output = "";
    let i = 0;

    while (i < code.length) {
        let char = code[i];

        // Comments
        if (code.startsWith("//", i)) {
            let end = code.indexOf("\n", i);

            if (end === -1) {
                end = code.length;
            }

            output += `<span class="comment">${escape_html(code.slice(i, end))}</span>`;
            i = end;
            continue;
        }

        // Strings
        if (char === '"' || char === "'") {
            let quote = char;
            let end = i + 1;

            while (end < code.length && code[end] !== quote) {
                end++;
            }

            end++;

            output += `<span class="string">${escape_html(code.slice(i, end))}</span>`;
            i = end;
            continue;
        }

        // Numbers
        if (/[0-9]/.test(char)) {
            let end = i;

            while (end < code.length && /[0-9.]/.test(code[end])) {
                end++;
            }

            output += `<span class="number">${code.slice(i, end)}</span>`;
            i = end;
            continue;
        }

        // Identifiers & types
        if (/[A-Za-z_]/.test(char)) {
            let end = i;

            while (end < code.length && /[A-Za-z0-9_]/.test(code[end])) {
            end++;
            }

            let word = code.slice(i, end);
            let type = get_token_type(word);

            if (type) {
                // Type
                output += `<span class="${type}">${word}</span>`;
            } else {
                // Check if identifier is followed by (
                let next = end;

                while (next < code.length && /\s/.test(code[next])) {
                    next++;
                }

                if (code[next] === "(") {
                    // Function
                    output += `<span class="function">${word}</span>`;
                } else {

                    output += escape_html(word);
                }
            }

            i = end;
            continue;
        }

        // Everything else
        output += escape_html(char);
        i++;
    }

    return output;
}


// Apply to all code blocks
document.querySelectorAll("pre code").forEach(block => {
    block.innerHTML = highlight(block.textContent);
});


document.querySelectorAll("code:not(pre code)").forEach(block => {
    block.innerHTML = highlight(block.textContent);
});
