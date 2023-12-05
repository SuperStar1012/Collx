import axios from 'axios';

export const getTeamLeagues = async typeId => {
  const response = await axios.get(`/teams/leagues?type=${typeId}`);

  return response.data;
};

export const getTeamYears = async teamId => {
  const response = await axios.get(`/teams/${teamId}/years`);

  return response.data;
};
