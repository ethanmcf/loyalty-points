/**
 *
 *
 * i want to pass in the values i want to search for
 * and if they are a boolean and string type filter
 *
 *  expected data example
 *
 * filters
 *
 * [
 *  {
 * "name": "string",
 * "location": "string",
 * "started": "boolean"
 * "points": "number"
 * }]
 * @param filter An key-value dict object where the key is the filter we want and the
 */

export function FilterBar({ placeholder }) {
  return (
    <div id="main-filter-bar">
      <input id="search-bar" placeholder="" />
    </div>
  );
}
