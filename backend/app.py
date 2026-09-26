"""PyWorkshop Flask backend.

Serves the HTML frontend and a tiny JSON API used by the quiz.
On Netlify the static files are published directly; this server is for local use.
"""

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

ROOT = Path(__file__).resolve().parent.parent

app = Flask(__name__, static_folder=str(ROOT), static_url_path="")
CORS(app)

QUIZ_ANSWERS = {
    "q1": "b",
    "q2": "a",
    "q3": "c",
    "q4": "b",
    "q5": "a",
}


@app.get("/")
def home():
    return send_from_directory(ROOT, "index.html")


@app.get("/api/status")
def status():
    return jsonify(
        {
            "ok": True,
            "engine": "Flask / Python",
            "message": "HTML frontend connected to the Python backend",
        }
    )


@app.post("/api/quiz")
def quiz():
    payload = request.get_json(silent=True) or {}
    answers = payload.get("answers") or {}
    total = len(QUIZ_ANSWERS)
    score = sum(1 for key, expected in QUIZ_ANSWERS.items() if answers.get(key) == expected)
    return jsonify(
        {
            "score": score,
            "total": total,
            "source": "python",
            "passed": score == total,
        }
    )


@app.get("/<path:path>")
def static_files(path):
    return send_from_directory(ROOT, path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
