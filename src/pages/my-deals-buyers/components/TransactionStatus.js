import React from 'react';
import {graphql, useFragment} from 'react-relay';

import {DealState} from 'components';

const TransactionStatus = React.memo((props) => {

  const deal = useFragment(graphql`
    fragment TransactionStatus_deal on Deal {
      state
    }`,
    props.deal
  );

  return <DealState state={deal.state} />;
});

TransactionStatus.displayName = 'TransactionStatus';

export default TransactionStatus;
