from flask import Flask, jsonify
from services.recommend_personalized import train_recommendations
from services.item_based import train_item_based
from services.top_trending import train_top_trending

app = Flask(__name__)

@app.route("/train/recommend", methods=["POST"])
def recommend():
    result = train_recommendations()
    return jsonify(result)

@app.route("/train/item", methods=["POST"])
def item():
    result = train_item_based()
    return jsonify(result)

@app.route("/train/trending", methods=["POST"])
def trending():
    result = train_top_trending()
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
