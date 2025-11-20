export function PaginationBar({
  totalPages,
  currentPage, // lower limit is 1
  limit,
  setCurrentPage,
  setLimit,
}) {
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleLimitChange = (e) => {
    e.preventDefault();
    setLimit(e.target.value);
  };

  return (
    <div id="pagination-bar">
      <div id="page-numbers">
        Current page {currentPage} of {totalPages} pages.
      </div>
      <div id="page-control">
        {currentPage !== 1 && (
          <button onClick={handlePreviousPage}>Previous</button>
        )}
        {currentPage !== totalPages && (
          <button onClick={handleNextPage}>Next</button>
        )}
      </div>
      <div id="limit-setting">
        <p>Number of entries per page: </p>
        <input
          type="number"
          value={limit}
          onChange={(e) => handleLimitChange(e)}
        />
      </div>
    </div>
  );
}
