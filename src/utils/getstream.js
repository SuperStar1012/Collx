export const getPeerUser = (members, currentUserId) => {
  const peerKey = Object.keys(members).find(key => key !== `${currentUserId}`);

  if (peerKey) {
    return members[peerKey]?.user;
  }

  return null;
};
