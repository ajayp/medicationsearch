import React from 'react';
import logo from './medicine.png';
import './App.css';
import Autocomplete from './autocomplete';

function App () {
  return (
    <div className="App">
      <header className="App-header">
        <Autocomplete />
        <img src={logo} className="App-logo" alt="medicine logo" type="image/jp2" />
        <p>
          Utilizing approximate string matching, informally known as fuzzy search, partial truth...
        </p>
      </header>
    </div>
  );
}

export default App;
