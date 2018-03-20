module.exports = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "_id": {
        "type": "string"
      },
      "quizType": {
        "type": ["string", "null"]
      }
    },
    "required": [
      "_id", "quizType"
    ]
  }
}
