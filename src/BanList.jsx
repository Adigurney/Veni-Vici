import React from 'react';

const labels = {
  breed: 'Breeds',
  origin: 'Origins',
  weight: 'Weights',
  lifespan: 'Lifespans',
};

const BanList = ({ banList, toggleBan }) => {
  return (
    <div className="ban-list">
      <h3>Ban List</h3>
      
      <div>
        {Object.entries(banList).map(([type, items]) => (
          <div key={type}>
            
            <h4>{labels[type] || type}</h4>

            {items.map((item) => (
              
              <button key={item} onClick={() => toggleBan(type, item)}>
                {item}
              </button>
              
            ))}
          </div>

        ))}
      </div>
    </div>
  );
};

export default BanList;