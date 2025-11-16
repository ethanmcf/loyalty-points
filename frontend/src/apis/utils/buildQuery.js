// Takes a map of query params, and creates query param string
// of only the params that are not null
export const buildQuery = (params) => {
  return params
    ? new URLSearchParams(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined
        )
      ).toString()
    : "";
};
