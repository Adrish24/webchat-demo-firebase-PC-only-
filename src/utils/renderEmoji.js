const renderEmoji = (reactions) => {
  const emojis = Object.entries(reactions).map(([key, value]) => ({
    reactId: key,
    ...value,
  }));

  return emojis;
};

export default renderEmoji;
