import React, {useState} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import moment from 'moment';

import Button from './Button';

import {Constants, Styles} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';

const CustomDatePicker = props => {
  const {style, initDate, onSelectDate} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [date, setDate] = useState(initDate || new Date());
  const [selectedDate, setSelectedDate] = useState(
    initDate ? moment.utc(initDate).format(Constants.dateFormat) : null,
  );
  const [isVisible, setIsVisible] = useState(false);

  const handleCancel = () => {
    setIsVisible(!isVisible);
  };

  const handleSelect = () => {
    setIsVisible(!isVisible);
    const currentDate = date || new Date();
    const currentDateString = moment.utc(currentDate).format(Constants.dateFormat);
    setSelectedDate(currentDateString);
    onSelectDate(currentDate);
  };

  return (
    <>
      <Button
        style={[styles.button, style]}
        label={selectedDate || 'Enter Date'}
        labelStyle={selectedDate ? styles.textLabel : styles.textPlaceholder}
        scaleDisabled
        onPress={() => setIsVisible(!isVisible)}
      />
      <Modal
        style={styles.modalContainer}
        isVisible={isVisible}
        onBackdropPress={() => handleCancel()}>
        <View
          style={[
            styles.modalContentContainer,
            {paddingBottom: Styles.screenSafeBottomHeight || 10},
          ]}>
          <View style={styles.headerContainer}>
            <Button
              style={styles.cancelButton}
              label="Cancel"
              labelStyle={styles.textCancel}
              onPress={() => handleCancel()}
            />
            <Button
              style={styles.cancelButton}
              label="Done"
              labelStyle={styles.textDone}
              onPress={() => handleSelect()}
            />
          </View>
          <DatePicker
            date={date}
            mode="date"
            timeZoneOffsetInMinutes={-moment().utcOffset()}
            textColor={colors.primaryText}
            onDateChange={setDate}
          />
        </View>
      </Modal>
    </>
  );
};

CustomDatePicker.defaultProps = {
  onSelectDate: () => {},
  initDate: null,
};

CustomDatePicker.propTypes = {
  onSelectDate: PropTypes.func,
  initDate: PropTypes.object,
};

export default CustomDatePicker;

const useStyle = createUseStyle(({colors}) => ({
  button: {
    width: 140,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 2,
    justifyContent: 'flex-end',
    backgroundColor: colors.secondaryCardBackground,
  },
  textLabel: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textPlaceholder: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
  modalContainer: {
    margin: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primaryCardBackground,
  },
  headerContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  textCancel: {
    color: colors.primaryText,
  },
  textDone: {
    fontWeight: Fonts.bold,
    color: colors.primaryText,
  },
}));
