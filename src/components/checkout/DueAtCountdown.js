import React, {useMemo, useEffect, useState, useRef} from 'react';
import {Text, Animated} from 'react-native';
import moment from 'moment';
import {graphql, useFragment} from 'react-relay';

import {Colors, Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const viewHeight = 40 ;

const actionTexts = {
  [SchemaTypes.dealNextAction.REVISE]: 'respond to offer',
  [SchemaTypes.orderNextAction.CHECKOUT]: 'checkout',
  [SchemaTypes.orderNextAction.SHIP]: 'ship item(s)',
  [SchemaTypes.orderNextAction.COMPLETE]: 'confirm receipt',
};

export const DueAtCountdownPosition = {
  top: 0,
  bottom: 1,
};

const DueAtCountdown = ({
  isMeBuyer,
  position = DueAtCountdownPosition.top,
  deal,
  order,
}) => {
  const dealData = useFragment(graphql`
    fragment DueAtCountdown_deal on Deal {
      nextAction
      nextActionDueAt
      offer {
        madeBy
      }
    }`,
    deal
  );

  const orderData = useFragment(graphql`
    fragment DueAtCountdown_order on Order {
      nextAction
      nextActionDueAt
      deal {
        offer {
          madeBy
        }
      }
    }`,
    order
  );

  const nextAction = orderData?.nextAction || dealData?.nextAction;
  const nextActionDueAt = orderData?.nextActionDueAt || dealData?.nextActionDueAt;
  const offerMadeBy = orderData?.deal?.offer?.madeBy || dealData?.offer?.madeBy;

  const styles = useStyle();

  const [animatedHeight] = useState(new Animated.Value(0));
  const [countdown, setCountDown] = useState('');
  const timeIntervalRef = useRef(null);

  const nextRespondUser = useMemo(() => {
    const isOfferMadeByBuyer = offerMadeBy === SchemaTypes.dealOfferBy.BUYER;

    switch (nextAction) {
      case SchemaTypes.dealNextAction.REVISE: {
        if (isMeBuyer) {
          return isOfferMadeByBuyer ? 'Seller' : 'You';
        }
        return isOfferMadeByBuyer ? 'You' : 'Buyer';
      }
      case SchemaTypes.orderNextAction.CHECKOUT:
      case SchemaTypes.orderNextAction.COMPLETE:
        return isMeBuyer ? 'You' : 'Buyer';
      case SchemaTypes.orderNextAction.SHIP:
        return isMeBuyer ? 'Seller' : 'You';
    }

    return null;
  }, [nextAction, offerMadeBy, isMeBuyer]);

  useEffect(() => {
    if (nextAction && nextActionDueAt) {
      clearTimeInterval();

      let duration = moment.duration(moment(nextActionDueAt).diff(new Date()));

      let currentTime = getTimeFromDuration(duration);
      if (!currentTime) {
        return;
      }

      setCountDown(currentTime);

      const interval = 1000;

      timeIntervalRef.current = setInterval(() => {
        duration = moment.duration(duration - interval, 'milliseconds');
        let currentTime = getTimeFromDuration(duration);

        if (!currentTime) {
          clearTimeInterval();
          return;
        }

        setCountDown(currentTime);
      }, interval);
    }

    return () => {
      clearTimeInterval();
    };
  }, [nextAction, nextActionDueAt])

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: viewHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const clearTimeInterval = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  };

  const getTimeFromDuration = (duration) => {
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
      return null;
    }

    if (days > 0) {
      return `${days + 1} days`;
    }

    return moment(`${hours}:${minutes}:${seconds}`, 'HH:mm:ss').format('HH:mm:ss');
 }

  if (!nextAction || !nextActionDueAt || !countdown || !nextRespondUser) {
    return null;
  }

  if (
    position === DueAtCountdownPosition.top &&
    (nextAction === SchemaTypes.orderNextAction.SHIP || nextAction === SchemaTypes.orderNextAction.COMPLETE)
  ) {
    return null;
  }

  const animatedOpacity = animatedHeight.interpolate({
    inputRange: [0, viewHeight],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        position === DueAtCountdownPosition.top ? styles.topContainer : styles.bottomContainer,
        {
          height: animatedHeight,
          opacity: animatedOpacity,
        }
      ]}
    >
      <Text
        style={[
          styles.textDescription,
          position === DueAtCountdownPosition.top ? styles.textTopDescription : styles.textBottomDescription,
        ]}
        numberOfLines={1}
      >
        {`${nextRespondUser} must ${actionTexts[nextAction] || ''} in ${countdown}`}
      </Text>
    </Animated.View>
  );
};

export default DueAtCountdown;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topContainer: {
    backgroundColor: Colors.yellow,
  },
  bottomContainer: {
    backgroundColor: Colors.lightYellow,
    borderRadius: 100,
    marginTop: 16,
    marginHorizontal: 16,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  textTopDescription: {
    fontWeight: Fonts.semiBold,
    color: colors.white,
  },
  textBottomDescription: {
    color: Colors.yellow,
  },
}));
