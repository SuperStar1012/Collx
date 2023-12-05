import React from 'react';
import {graphql, useFragment} from 'react-relay';

import {CheckoutState} from 'components';

const OrderGroupStatus = React.memo(({order}) => {

  const orderData = useFragment(graphql`
    fragment OrderGroupStatus_order on Order {
      state
    }`,
    order
  );

  return <CheckoutState state={orderData.state} isGroup />;
});

OrderGroupStatus.displayName = 'OrderGroupStatus';

export default OrderGroupStatus;
