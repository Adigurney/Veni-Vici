import React, { useState, useEffect } from 'react';
import DogCard from './DogCard.jsx';
import BanList from './BanList.jsx';
import './index.css';

const API_URL = 'https://api.thedogapi.com/v1/images/search?has_breeds=1';

const parseRange = (str) => {
  if (!str) return null;

  const rangeMatch = str.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    return [min, max];
  }

  const singleMatch = str.match(/(\d+)/);
  if (singleMatch) {
    const num = parseInt(singleMatch[1]);
    return [num, num]; 
  }

  return null;
};

const rangesOverlap = (range1, range2) => {
  if (!range1 || !range2) return false;
  return range1[0] <= range2[1] && range2[0] <= range1[1];
};

const App = () => {
  const [dogData, setDogData] = useState(null);
  const [error, setError] = useState(null);
  const [banList, setBanList] = useState({
  origin: [],
  breed: [],
  weight: [],
  lifespan: [],
  });

  const fetchDog = async () => {
  setError(null);
  setDogData(null);

  const MAX_ATTEMPTS = 5;
  let attempt = 0;

  while (attempt < MAX_ATTEMPTS) {
    const res = await fetch(`${API_URL}&limit=10`, {
      headers: {
        'x-api-key': 'live_4N1hY8KjhZkiNBNFXEcGQnZqY1cDRY4loCPnM8aCzwUOlETP1NpeZlcGbdZfYlk1',
      },
    });

    const data = await res.json();

    const validDog = data.find((dog) => {
      const breed = dog?.breeds?.[0];
      if (!breed) return false;

      const isBreedBanned = banList.breed.includes(breed.name);
      const isOriginBanned = breed.origin && banList.origin.includes(breed.origin);

      const dogWeight = parseRange(breed.weight?.imperial);
      const bannedWeights = banList.weight.map(parseRange);
      const isWeightBanned = bannedWeights.some((b) => rangesOverlap(b, dogWeight));

      const dogLifespan = parseRange(breed.life_span);
      const bannedLifespans = banList.lifespan.map(parseRange);
      const isLifespanBanned = bannedLifespans.some((b) => rangesOverlap(b, dogLifespan));

      return !(isBreedBanned || isOriginBanned || isWeightBanned || isLifespanBanned);
    });

    if (validDog) {
      setDogData(validDog);
      return;
    }

    attempt++;
  }

  setError("No matching dogs found after several attempts. Try removing some bans!");
};

  const toggleBan = (type, value) => {
    setBanList((prev) => {
      const updated = [...prev[type]];
      const index = updated.indexOf(value);
      if (index > -1) updated.splice(index, 1);
      else updated.push(value);
      return { ...prev, [type]: updated };
    });
  };

  useEffect(() => {
    fetchDog();
  }, []);

  return (
  <div className="app">
    <h1>Veni Vici!</h1>
    <h2>Discover Dogs from your wildest dreams! 🐶🐕</h2>

    <div className="layout">
      <div className="main-content">
        {dogData && dogData.breeds?.[0] && (
          <DogCard
            dog={dogData}
            onAttributeClick={toggleBan}
            banList={banList}
          />
        )}
        <button className="discover" onClick={fetchDog}>🐾 Discover!</button>
      </div>

      <div className="side-panel">
        <BanList banList={banList} toggleBan={toggleBan} />
      </div>
    </div>
  </div>
  );
};

export default App;