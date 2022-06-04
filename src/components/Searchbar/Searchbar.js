import { useState } from 'react';
import PropTypes from 'prop-types';
import s from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchValueChange = event => {
    setSearchValue(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (searchValue.trim() === '') {
      alert('Input search value');
      return;
    }
    onSubmit(searchValue);
  };

  return (
    <header className={s.Searchbar}>
      <form onSubmit={handleSubmit} className="form">
        <button type="submit" className="button">
          <span className="button-label">Search</span>
        </button>

        <input
          className="input"
          type="text"
          value={searchValue}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleSearchValueChange}
        />
      </form>
    </header>
  );
}
Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
