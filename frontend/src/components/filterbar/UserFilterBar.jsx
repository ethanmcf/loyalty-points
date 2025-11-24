import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

/**
 * @typedef {"regular" | "cashier" | "manager" | "superuser"} UserRole
 * @typedef {"true" | "false"} BooleanValue
 */

/**
 * @typedef {Object} UserFilterProps
 * @property {string} nameValue
 * @property {(name: string) => void} setNameValue
 * @property {UserRole[]} roleValues
 * @property {(role: UserRole[]) => void} setRoleValues
 * @property {BooleanValue[]} verifiedValues
 * @property {(verified: BoolString[]) => void} setVerifiedValues
 * @property {BooleanValue[]} activatedValues
 * @property {(activated: BoolString[]) => void} setActivatedValues
 */

/**
 *
 * The filters we need are:
 * name: string
 * role: string
 * verified: boolean
 * activated: boolean
 *
 * @param {UserFilterProps} props
 * @returns
 */
export function UserFilterBar({
  nameValue,
  setNameValue,
  roleValues,
  setRoleValues,
  verifiedValues,
  setVerifiedValues,
  activatedValues,
  setActivatedValues,
}) {
  const handleNameChange = (e) => {
    e.preventDefault();
    setNameValue(e.target.value);
  };

  const handleRoleChange = (option) => (event) => {
    if (event.target.checked) {
      setRoleValues([...roleValues, option]);
    } else {
      setRoleValues(roleValues.filter((o) => o !== option));
    }
  };

  const handleVerifiedChange = (option) => (event) => {
    if (event.target.checked) {
      setVerifiedValues([...verifiedValues, option]);
    } else {
      setVerifiedValues(verifiedValues.filter((o) => o !== option));
    }
  };

  const handleActivatedChange = (option) => (event) => {
    if (event.target.checked) {
      setActivatedValues([...activatedValues, option]);
    } else {
      setActivatedValues(activatedValues.filter((o) => o !== option));
    }
  };

  return (
    <div id="user-filters">
      <div className="filter-input">
        Name
        <TextField
          id="name"
          value={nameValue}
          onChange={(e) => handleNameChange(e)}
          label="contains"
          variant="outlined"
        />
      </div>
      <div className="filter-input">
        Role
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={roleValues.includes("regular")}
                onChange={handleRoleChange("regular")}
              />
            }
            label="regular"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={roleValues.includes("cashier")}
                onChange={handleRoleChange("cashier")}
              />
            }
            label="cashier"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={roleValues.includes("manager")}
                onChange={handleRoleChange("manager")}
              />
            }
            label="manager"
          />
          <FormControlLabel
            control={
              <Checkbox
                dchecked={roleValues.includes("superuser")}
                onChange={handleRoleChange("regular")}
              />
            }
            label="superuser"
          />
        </FormGroup>
      </div>
      <div className="filter-input">
        Verified
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifiedValues.includes("true")}
                onChange={handleVerifiedChange("true")}
              />
            }
            label="true"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={verifiedValues.includes("false")}
                onChange={handleVerifiedChange("false")}
              />
            }
            label="false"
          />
        </FormGroup>
      </div>
      <div className="filter-input">
        Activated
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={activatedValues.includes("true")}
                onChange={handleActivatedChange("true")}
              />
            }
            label="true"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={activatedValues.includes("false")}
                onChange={handleActivatedChange("false")}
              />
            }
            label="false"
          />
        </FormGroup>
      </div>
    </div>
  );
}
