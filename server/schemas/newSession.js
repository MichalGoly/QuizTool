module.exports = {
  "type": "object",
  "properties": {
    "lecture_id": {
      "type": "string"
    },
    "date": {
      "type": "string"
    },
    "answers": {
      "type": "object"
    }
  },
  "required": [
    "lecture_id", "date", "answers"
  ]
}
