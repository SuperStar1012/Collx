import axios from 'axios';

export const getTypeYears = async typeId => {
  const response = await axios.get(`/types/${typeId}/years`);

  return response.data;
};
