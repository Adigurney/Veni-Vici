import React from 'react';

const DogCard = ({ dog, onAttributeClick, banList }) => {
  const breed = dog.breeds[0];

  return (
    <div className="dog-card"> 
      <h2>{breed.name}</h2>
      
      <img src={dog.url} alt={breed.name} />
      
      <div className="attributes">
        <button onClick={() => onAttributeClick('breed', breed.name)}>
            {breed.name}
        </button>

        <button onClick={() => onAttributeClick('weight', breed.weight.imperial)}>
            {breed.weight.imperial} lbs
        </button>

        {breed.origin && (
            <button onClick={() => onAttributeClick('origin', breed.origin)}>
            {breed.origin}
            </button>
        )}

        <button onClick={() => onAttributeClick('lifespan', breed.life_span)}>
            {breed.life_span}
        </button>
      </div>
    </div>
  );
};

export default DogCard;