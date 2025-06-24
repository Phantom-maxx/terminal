/* Initialize CodeMirror with IDLE theme */
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "python",
  lineNumbers: true,
  theme: "idle",
  indentUnit: 4,
  tabSize: 4,
  indentWithTabs: false
});

let pyodideReadyPromise = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });

/* Run Python code */
async function runCode() {
  const outputEl = document.getElementById("output");
  outputEl.textContent = "⏳ Running...";
  try {
    const pyodide = await pyodideReadyPromise;
    // capture stdout via Pyodide
    await pyodide.runPythonAsync(\`
import sys, io, contextlib, builtins
_stdout = io.StringIO()
with contextlib.redirect_stdout(_stdout):
    exec(\"\"\"" + editor.getValue().replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/"/g, "\\\"") + "\\"\"\")
sys.stdout.write(_stdout.getvalue())
\`);
    outputEl.textContent = pyodide.stdout;
    pyodide.stdout = ""; // clear buffer
  } catch (err) {
    outputEl.textContent = err;
  }
}

/* New file */
function newFile() {
  if (confirm("Clear the editor? Unsaved work will be lost.")) {
    editor.setValue("");
  }
}

/* Open file */
function openFile() {
  document.getElementById("file-input").click();
}

document.getElementById("file-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    editor.setValue(reader.result);
  };
  reader.readAsText(file);
});

/* Save file */
function saveFile() {
  const blob = new Blob([editor.getValue()], { type: "text/x-python" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "script.py";
  a.click();
  URL.revokeObjectURL(url);
}

/* Shortcut: F5 to run */
document.addEventListener("keydown", (e) => {
  if (e.key === "F5") {
    e.preventDefault();
    runCode();
  }
});
