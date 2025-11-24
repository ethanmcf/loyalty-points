/**
 * The filters we need are:
 * name: string
 * createdBy: string
 * suspicious: boolean
 * promotionId: number
 * type: string
 * relatedId: number -> Must be used with type
 * amount: number -> must be used with operator
 * operator: string -> must be used with amount
 */

/**
 * @typedef {"true" | "false"} BooleanValue
 */

/**
 * @typedef {Object} TransactionFilterProps
 * @property {string} name
 * @property {(name: string) => void} setName
 * @property {string} createdBy
 * @property {(createdBy: string) => void} setCreatedBy
 * @property {BooleanValue[]} suspicious
 * @property {(suspicious: string) => void} setSuspicious
 * @property {number} promotionId
 * @property {(promotionId: number) => void} setPromotionId
 * @property {string} type
 * @property {(type: string) => void} setType
 * @property {number} relatedId
 * @property {(relatedId: number) => void} setRelatedId
 * @property {number} amount
 * @property {(amount: number) => void} setAmount
 * @property {string} operator
 * @property {(operator: string) => void} setOperator
 */

/**
 *
 * @param {TransactionFilterProps} props
 */
export function TransactionsFilterBar({
  name,
  setName,
  createdBy,
  setCreatedBy,
  suspicious,
  setSuspicious,
  promotionId,
  setPromotionId,
  type,
  setType,
  relatedId,
  setRelatedId,
  amount,
  setAmount,
  operator,
  setOperator,
}) {
  const handleNameChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleCreatedByChange = (e) => {
    e.preventDefault();
    setCreatedBy(e.target.value);
  };

  const handleSuspiciousChange = (option) => (event) => {
    if (event.target.checked) {
      setSuspicious([...suspicious, option]);
    } else {
      setSuspicious(suspicious.filter((o) => o !== option));
    }
  };

  return (
    <div id="transactions-filters">
      <div className="filter-input">
        Name
        <TextField
          id="name"
          value={name}
          onChange={(e) => handleNameChange(e)}
          label="contains"
          variant="outlined"
        />
      </div>
      <div className="filter-input">
        CreatedBy
        <TextField
          id="createdBy"
          value={createdBy}
          onChange={(e) => handleCreatedByChange(e)}
          label="contains"
          variant="outlined"
        />
      </div>
      <div className="filter-input">
        Suspicious
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={suspicious.includes("true")}
                onChange={handleSuspiciousChange("true")}
              />
            }
            label="true"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={suspicious.includes("false")}
                onChange={handleSuspiciousChange("false")}
              />
            }
            label="false"
          />
        </FormGroup>
      </div>
    </div>
  );
}
