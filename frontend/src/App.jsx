import React from 'react'
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div>
      <Header />
      <div style={{flexGrow: 1, padding: '20px'}}>
        <Dashboard />
      </div>
    </div>
  );
};

export default App
