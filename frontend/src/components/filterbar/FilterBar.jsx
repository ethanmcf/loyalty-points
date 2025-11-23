import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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
 *
 * References:
 * https://mui.com/material-ui/react-select/
 *
 */

import { useState } from "react";
/**
 * @typedef {Object} FilterItem
 * @property {string} label
 * @property {"string" | "number" | "boolean"} type
 * @property {any} value // this could be a string, number, boolean
 * @property {Function} handleChange This is the function that handles
 * the change in value. It needs to be able to take in an event argument
 */

/**
 *
 * @param {{filters: FilterItem[]}}
 */
export function FilterBar({ filters }) {
  const [expand, setExpand] = useState(false);

  return (
    <div id="main-filter-bar">
      {filters.map((filter, index) => {
        if (filter.type === "string") {
          return (
            <div key={index} className="filter-input">
              {filter.label}
              <TextField
                id={filter.label}
                value={filter.value}
                onChange={(e) => filter.handleChange(e)}
                label="contains"
                variant="outlined"
              />
            </div>
          );
        } else if (filter.type === "number") {
          return (
            <div key={index} className="filter-input">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {filter.label}
                </InputLabel>
                <Select
                  labelId={filter.label}
                  id={filter.label}
                  value={filter.value}
                  label={filter.label}
                  onChange={(e) => filter.handleChange(e)}
                >
                  <MenuItem value={"lte"}>Greater than</MenuItem>
                  <MenuItem value={"gte"}>Less Than</MenuItem>
                </Select>
              </FormControl>
            </div>
          );
        }
      })}
    </div>
  );
}
