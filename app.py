from flask import Flask, render_template, request, jsonify
import sys
import io
import contextlib

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run', methods=['POST'])
def run_code():
    code = request.json['code']
    output = io.StringIO()

    try:
        with contextlib.redirect_stdout(output):
            exec(code, {})
        return jsonify({'output': output.getvalue()})
    except Exception as e:
        return jsonify({'output': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
