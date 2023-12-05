import React from 'react';
import PropTypes from 'prop-types';

import CardView from './CardView';
import DealView from './DealView';

import {Constants} from 'globals';

const CustomMessage = ({
  type,
  user,
  card,
  cards,
  deal,
  num_of_cards,
  onSelectCard,
  onSelectDeal,
}) => {

  const handleSelectCard = () => {
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  const handleSelectDeal = () => {
    if (onSelectDeal) {
      onSelectDeal(deal);
    }
  };

  if (type === Constants.streamMessageType.card) {
    return (
      <CardView
        user={user}
        card={card}
        onPress={handleSelectCard}
      />
    );
  } else if (type === Constants.streamMessageType.deal) {
    return (
      <DealView
        user={user}
        deal={deal}
        cards={cards}
        numOfCards={num_of_cards}
        onPress={handleSelectDeal}
      />
    );
  }

  return null;
};

CustomMessage.defaultProps = {
  onSelectCard: () => {},
  onSelectDeal: () => {},
};

CustomMessage.propTypes = {
  onSelectCard: PropTypes.func,
  onSelectDeal: PropTypes.func,
};

export default CustomMessage;
