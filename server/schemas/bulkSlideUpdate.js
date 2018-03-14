module.exports = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "_id": {
        "type": "string"
      },
      "isQuiz": {
        "type": "boolean"
      }
    },
    "required": [
      "_id", "isQuiz"
    ]
  }
}
