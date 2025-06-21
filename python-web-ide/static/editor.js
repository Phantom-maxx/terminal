const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "python",
  theme: "default",
  lineNumbers: true,
});

function runCode(event) {
  event.preventDefault();

  fetch('/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: editor.getValue() })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('output').innerText = data.output;
  });
}
