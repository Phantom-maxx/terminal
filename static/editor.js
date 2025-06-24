const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "python",
  lineNumbers: true,
  theme: "default"
});

let pyodideReadyPromise = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });

async function runCode() {
  const outputEl = document.getElementById("output");
  outputEl.textContent = "⏳ Running...";
  try {
    const pyodide = await pyodideReadyPromise;
    let result = await pyodide.runPythonAsync(editor.getValue());
    outputEl.textContent = result !== undefined ? result.toString() : "";
  } catch (err) {
    outputEl.textContent = err;
  }
}
