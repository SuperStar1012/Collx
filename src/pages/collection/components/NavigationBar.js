import React from 'react';
import {Text} from 'react-native';
import {Header} from '@react-navigation/stack';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const NavigationBar = props => {
  const {subTitleStyle, subTitle} = props;

  const styles = useStyle();

  return (
    <>
      <Header {...props} />
      <Text style={[styles.textSubTitle, subTitleStyle]}>{subTitle}</Text>
    </>
  );
};

NavigationBar.defaultProps = {};

NavigationBar.propTypes = {
  subTitle: PropTypes.string.isRequired,
};

export default NavigationBar;

const useStyle = createUseStyle(({colors}) => ({
  textSubTitle: {
    fontFamily: Fonts.nunitoSemiBold,
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: -10,
  },
}));
