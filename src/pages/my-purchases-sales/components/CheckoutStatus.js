import React from 'react';
import {graphql, useFragment} from 'react-relay';

import {CheckoutState} from 'components';

const CheckoutStatus = React.memo((props) => {

  const order = useFragment(graphql`
    fragment CheckoutStatus_order on Order {
      state
    }`,
    props.order
  );

  return <CheckoutState state={order.state} isGroup />;
});

CheckoutStatus.displayName = 'CheckoutStatus';

export default CheckoutStatus;
