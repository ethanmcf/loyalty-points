import { useState } from "react";
import "./Table.css";

/**
 * This is a helper function that lets us generate a table and helps us to get selected data
 * @param {data} any This is an array of objects that contains data about our information
 * @param {selectedData} any This is an array of SELECTED data which are each objects
 * @param {setSelectedData} function This acts as the function that allows us to pass in a
 * function that will set the value of a selectedData in another file when we click on an instance
 */
export function Table({ data, selectedData, setSelectedData }) {
  const [headers, setHeaders] = useState(); // get the headers

  const handleSelectChange = (id) => {
    // check if the item already exists in selectedData
    const instance = selectedData.find((dataSet) => dataSet.id === id);

    // if it already exists, remove it
    if (instance) {
      const newSelectedData = selectedData.filter(
        (dataSet) => dataSet.id !== id
      );
      setSelectedData(newSelectedData);
    } else {
      // otherwise add it
      const newData = data.find((dataSet) => dataSet.id === id);
      const newSelectedData = [...selectedData];
      newSelectedData.push(newData);
      setSelectedData(newSelectedData);
    }
  };

  /** Selects All The Instances */
  const handleSelectAll = () => {
    setSelectedData(data);
  };

  // Reference: https://www.w3schools.com/tags/tag_table.asp
  return (
    <table>
      {/* Header */}
      <tr>
        <th>
          <input
            type="checkbox"
            checked={data.length === selectedData.length}
            onChange={handleSelectAll}
          />
        </th>
        {/* Select All */}
        {headers.map((header, h_index) => (
          <th key={h_index}>{header}</th>
        ))}
      </tr>
      {data.map((instance, i_index) => (
        <tr key={i_index}>
          <td>
            <input
              type="checkbox"
              checked={selectedData.find(
                (dataSet) => dataSet.id === instance.id
              )}
              onChange={handleSelectChange(instance.id)}
            />
          </td>
          {Object.keys(instance).map((value, v_index) => (
            <td index={v_index} key={v_index}>
              {value}
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}
