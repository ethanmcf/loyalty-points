// Content by Jennifer Tan

/**
 * This function allows for us to check if the list of given strings are mandatory (they exist)
 * @param {*} strings: a list of strings
 * @returns true if all strings are valid, false otherwise
 */
function isMandatoryValidStrings(strings) {
  for (let string in strings) {
    if (typeof string !== "string" || string.trim().length <= 0) {
      return false;
    }
  }
  return true; // all strings in the list passed
}

// (2) ai.txt
// checks if a string is in ISO 8601 Format (Jennifer Tan)
function checkISO8601Format(dateTime) {
  const date = new Date(dateTime);
  const normalized = dateTime
    .replace(/(\.\d{3})\d+/, "$1")
    .replace("+00:00", "Z");
  return !isNaN(date.getTime()) && date.toISOString() === normalized;
}

module.exports = {
  checkISO8601Format,
  isMandatoryValidStrings,
};
