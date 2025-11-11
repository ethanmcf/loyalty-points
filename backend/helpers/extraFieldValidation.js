/* Returns if body contains extra keys */
function containsExtraFields(allowedFields, body) {
  const extraFields = Object.keys(body).filter(
    (key) => !allowedFields.includes(key)
  );
  return extraFields.length > 0;
}

module.exports = containsExtraFields;
