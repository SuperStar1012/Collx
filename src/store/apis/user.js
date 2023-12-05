import axios from 'axios';

// Auth
export const signIn = async data => {
  const response = await axios.post('/users/login', data);
  return response.data;
};

export const signUp = async data => {
  const response = await axios.post('/users', data);
  return response.data;
};

export const lookUp = async data => {
  const response = await axios.post('/users/lookup', data);
  return response.data;
};

export const updateUser = async data => {
  const response = await axios.put('/users', data);
  return response.data;
};

export const createLink = async data => {
  const response = await axios.post(
    `/users/create-link?email=${encodeURIComponent(data.email)}`,
  );

  return response.data;
};

export const resetPassword = async data => {
  const response = await axios.post(
    `/users/request-password-reset?email=${encodeURIComponent(data.email)}`,
  );

  return response.data;
};

export const uploadAvatar = async data => {
  // eslint-disable-next-line no-undef
  const form = new FormData();
  form.append('avatar', {
    uri: data.uri,
    name: data.name,
    type: data.type || 'image/jpeg',
  });

  const response = await axios.post('/users/avatar', form, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

  return response.data;
};

export const deleteUser = async userId => {
  const response = await axios.delete(`/users/${userId}`);

  return response.data;
};

// User
export const getUsers = async query => {
  const response = await axios.get('/users', {params: query});

  return response.data;
};

export const setFollow = async userId => {
  const response = await axios.post(`/users/${userId}/follow`);

  return response.data;
};

export const setUnfollow = async userId => {
  const response = await axios.post(`/users/${userId}/unfollow`);

  return response.data;
};

export const setBlock = async userId => {
  const response = await axios.post(`/users/${userId}/block`);

  return response.data;
};

export const setUnblock = async userId => {
  const response = await axios.post(`/users/${userId}/unblock`);

  return response.data;
};
