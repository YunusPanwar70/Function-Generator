const queryInput = document.getElementById("query");
const button = document.getElementById("button");
const result = document.getElementById("result");
const copyButton = document.getElementById("copy")

function generateFunction(query) {
    if (query === "") {
        alert("Please Enter Query")
        return
    };
    // Split the query into lines
    const lines = query.trim().split("\n");

    // Extract the question and examples
    let question = "";
    let count = 0;
    while (lines[count] != "Examples") {
        if (lines[count] !== "")
            question += `// ${lines[count]}\n\n`;
        ++count;
    }
    const examples = lines.slice(count).filter(line => line.trim());

    if (examples.length === 0) {
        result.innerText = "// Error: No examples found in the input.";
        return;
    }

    // Extract the function name and parameters from the first example
    const functionNameMatch = examples[1].match(/(\w+)\s*\(([^)]+)\)/);

    if (!functionNameMatch) {
        result.innerText = "// Error: Unable to extract function name and parameters from the examples.";
        return;
    }
    const functionName = functionNameMatch[1];

    // Generate the function with a placeholder return statement
    let functionBody = `function ${functionName}() {\n    return\n}\n\n`;

    // Generate the console logs
    let consoleLogs = "";
    examples.forEach(line => {
        if (line.trim()) {
            const parts = line.split("➞");
            if (parts.length === 2) {
                const inputPart = parts[0].trim();
                consoleLogs += `console.log(${functionName}${inputPart.slice(inputPart.indexOf("("))});\n`;
            }
        }
    });

    // Generate the ouputs
    let outputs = "\nOutputs :\n";
    examples.forEach(line => {
        if (line.trim()) {
            const parts = line.split("➞");
            if (parts.length === 2) {
                const outputPart = parts[1].trim();
                outputs += `// ➞ ${outputPart}\n`;
            }
        }
    });

    result.innerText = question + functionBody + consoleLogs + outputs;
}

function generateQueryInput() {
    generateFunction(queryInput.value);
}
button.addEventListener('click', generateQueryInput);

const copy = async (text) => {
    if (text == "") {
        alert("Nothing copied");
        return
    }
    await navigator.clipboard.writeText(text)
    alert('Copied to clipboard')
};

function handelCopyBtn() {
    copy(result.innerText)
}
copyButton.addEventListener('click', handelCopyBtn);