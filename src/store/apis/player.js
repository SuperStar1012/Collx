import axios from 'axios';

export const getPlayers = async query => {
  const response = await axios.get('/players', {params: query});

  return response.data;
};

export const getPlayerYears = async playerID => {
  const response = await axios.get(`/players/${playerID}/years`);

  return response.data;
};
