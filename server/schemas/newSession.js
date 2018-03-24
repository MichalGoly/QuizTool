module.exports = {
  "type": "object",
  "properties": {
    "lectureId": {
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
    "lectureId", "date", "answers"
  ]
}
