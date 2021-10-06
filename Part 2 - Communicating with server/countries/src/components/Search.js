import React from 'react';

const Search = ({ search, handleSearchChange }) => {
    return (
        <div>
          <form onSubmit={handleSearchChange}>
            <div>
            find countries{" "}
            <input value={search} onChange={handleSearchChange} />
    
            </div>
          </form>
        </div>
      );
};
  
export default Search;