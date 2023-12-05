import React, {useState, useEffect, useRef, useMemo} from 'react';
import {Text, TextInput, View, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {graphql, useLazyLoadQuery} from 'react-relay';
import moment from 'moment';

import {
  // Switch,
  Button,
  Dropdown,
  DatePicker,
  TextInputUnit,
  CardMainInfo,
} from 'components';
import CardCapture from './components/CardCapture';

import {Constants, Styles, SchemaTypes, Urls} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {openUrl} from 'utils';

const helpIcon = require('assets/icons/question_circle_fill.png');
const chevronIcon = require('assets/icons/chevron_forward.png');

const pendingListingStatus = Constants.cardBasicListingStatus;
const normalListingStatus = [...Constants.cardBasicListingStatus, ...Constants.cardSoldListingStatus];

const CardEditContent = props => {
  const {
    navigation,
    tradingCardId,
    canonicalCardId,
    isEdit,
    isRemove,
    isCapture,
    queryOptions,
    onChangeValues,
    onSearchCard,
    onRemove,
  } = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  let queryData = null;

  if (tradingCardId) {
    queryData = useLazyLoadQuery(graphql`
      query CardEditContentTradingCardQuery($tradingCardId: ID!) {
        tradingCard(with: {id: $tradingCardId}) {
          id
          frontImageUrl
          backImageUrl(usePlaceholderWhenAbsent: false)
          card {
            id
            ...CardMainInfo_card
          }
          # public
          notes
          certificationNumber
          purchasePrice {
            amount
          }
          purchaseDate
          condition {
            name
            gradingScale {
              name
            }
          }
          state
          listing {
            askingPrice {
              amount
            }
          }
          sale {
            __typename
            soldFor {
              amount
            }
          }
          viewer {
            frontImageUploadUrl
            backImageUploadUrl
          }
        }
        allGradingScales {
          name
          conditions {
            name
          }
        }
      }`,
      {tradingCardId},
      queryOptions
    );
  } else if (canonicalCardId) {
    queryData = useLazyLoadQuery(graphql`
      query CardEditContentCardQuery($canonicalCardId: ID!) {
        card(with: {id: $canonicalCardId}) {
          id
          frontImageUrl
          backImageUrl(usePlaceholderWhenAbsent: false)
          ...CardMainInfo_card
        }
        allGradingScales {
          name
          conditions {
            name
          }
        }
      }`,
      {canonicalCardId},
      queryOptions
    );
  }

  if (!queryData) {
    return null;
  }

  // Conditions
  const allConditions = useMemo(() => {
    const conditions = Constants.cardConditions.map(item => ({
      label: item.long,
      value: item.long,
    }));
    conditions.unshift({
      label: 'Unknown',
      value: null,
    });

    return conditions;
  }, []);

  // Grading Scales
  const allGradingScales = useMemo(() => {
    const gradingScales = [
      {
        label: 'Not Graded',
        value: Constants.cardGradingScaleRaw,
      },
    ];
    queryData.allGradingScales?.map(grader => {
      gradingScales.push({
        label: grader.name,
        value: grader.name,
      });
    });

    return gradingScales;
  }, [queryData.allGradingScales]);

  const allGrades = useMemo(() => {
    const allGrades = {};

    queryData.allGradingScales?.map(grader => {
      const newGrades = [];
      grader.conditions.map(scale => {
        newGrades.push({
          label: scale.name,
          value: scale.name,
        });
      });
      allGrades[grader.name] = newGrades;
    });

    return allGrades;
  }, [queryData.allGradingScales]);

  const initFrontImageUrl = tradingCardId ? queryData.tradingCard?.frontImageUrl : queryData.card?.frontImageUrl;
  const initBackImageUrl = tradingCardId ? queryData.tradingCard?.backImageUrl : queryData.card?.backImageUrl;

  const [frontImageUrl, setFrontImageUrl] = useState(initFrontImageUrl);
  const [backImageUrl, setBackImageUrl] = useState(initBackImageUrl);

  // init
  // const [isPublic, setIsPublic] = useState(queryData.tradingCard?.public);
  const [purchasePrice, setPurchasePrice] = useState(queryData.tradingCard?.purchasePrice?.amount);
  const [purchaseDate, setPurchaseDate] = useState(
    queryData.tradingCard?.purchaseDate ? new Date(queryData.tradingCard?.purchaseDate) : null,
  );
  const [askingPrice, setAskingPrice] = useState(queryData.tradingCard?.listing?.askingPrice?.amount);
  const [salePrice, setSalePrice] = useState(queryData.tradingCard?.sale?.soldFor?.amount);
  const [notes, setNotes] = useState(queryData.tradingCard?.notes || '');
  const [certificationNumber, setCertificationNumber] = useState(
    queryData.tradingCard?.certificationNumber,
  );

  // Grade
  const [currentGrade, setCurrentGrade] = useState(
    queryData.tradingCard?.condition?.name,
  );

  // Condition
  const [currentCondition, setCurrentCondition] = useState(
    queryData.tradingCard?.condition?.name,
  );

  // Grade Scale
  const [currentGradingScale, setCurrentGradingScale] = useState(
    queryData.tradingCard?.condition?.gradingScale?.name || Constants.cardGradingScaleRaw,
  );
  const [selectedAllGrades, setSelectedAllGrades] = useState(
    allGrades[currentGradingScale] || []
  );

  // ListingStatus
  const [currentListingStatus, setCurrentListingStatus] = useState(
    Constants.cardBasicListingStatus[0].value,
  );

  const [extraScrollHeight, setExtraScrollHeight] = useState(10);

  const isInitGradingRef = useRef(true);
  const updatedValues = useRef({});

  useEffect(() => {
    if (queryData.tradingCard?.state === SchemaTypes.tradingCardState.SOLD) {
      const saleTypeName = queryData.tradingCard?.sale?.__typename;
      if (saleTypeName === 'InternalSingleCardSale') {
        setCurrentListingStatus(SchemaTypes.soldTradingCardType.COLLX);
      } else if (saleTypeName === 'ExternalSingleCardSale') {
        setCurrentListingStatus(SchemaTypes.soldTradingCardType.OTHER);
      }
    } else if (queryData.tradingCard?.state === SchemaTypes.tradingCardState.LISTED) {
      setCurrentListingStatus(SchemaTypes.tradingCardState.LISTED);
    }
  }, []);

  useEffect(() => {
    if (isInitGradingRef.current) {
      isInitGradingRef.current = false;
      updateGrades(currentGradingScale, currentGrade);
    } else {
      updateGrades(currentGradingScale);
    }
  }, [currentGradingScale]);

  const updateGrades = (gradingScale, gradeValue = null) => {
    if (gradingScale === allGradingScales[0].value) {
      setCurrentGrade(null);
      setSelectedAllGrades([]);
      return;
    }

    const newGrades = allGrades[gradingScale] || [];

    if (!gradeValue && newGrades.length) {
      gradeValue = newGrades[0].value;
    }

    setCurrentGrade(gradeValue);
    setSelectedAllGrades(newGrades);
  };

  // const handleChangeVisibility = value => {
  //   setIsPublic(value);

  //   updatedValues.current.public = value;

  //   if (onChangeValues) {
  //     onChangeValues(updatedValues.current);
  //   }
  // };

  const handleChangePurchasePrice = value => {
    setPurchasePrice(value);

    updatedValues.current.purchasePrice = value ? Number(value) : 0;

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleSelectDate = value => {
    setPurchaseDate(value);
    updatedValues.current.purchaseDate = value ? moment(value).format(Constants.inputDateFormat) : null;

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleChangeAskingPrice = value => {
    setAskingPrice(value);

    updatedValues.current.askingPrice = value ? Number(value) : 0;

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleChangeSalePrice = value => {
    setSalePrice(value);

    updatedValues.current.salePrice = value ? Number(value) : '';

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleChangeGradingScale = value => {
    setCurrentGradingScale(value);

    const newGrades = allGrades[value] || [];

    if (newGrades.length) {
      updatedValues.current.condition = {
        name: newGrades[0].value,
      };
    } else {
      updatedValues.current.condition = null;
    }

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleChangeGrade = value => {
    setCurrentGrade(value);

    updatedValues.current.condition = {
      name: value,
    };

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleChangeCondition = value => {
    setCurrentCondition(value);

    if (value) {
      updatedValues.current.condition = {
        name: value,
      };
    } else {
      updatedValues.current.condition = null;
    }

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleChangeCertificationNumber = value => {
    setCertificationNumber(value);

    updatedValues.current.certificationNumber = value;

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleChangeListingStatus = value => {
    setCurrentListingStatus(value);

    if (value === SchemaTypes.tradingCardState.LISTED) {
      delete updatedValues.current.salePrice;
      updatedValues.current.listingStatus = SchemaTypes.tradingCardState.LISTED;
      handleChangeAskingPrice(queryData.tradingCard?.listing?.askingPrice?.amount);
    } else if (value === SchemaTypes.soldTradingCardType.COLLX) {
      delete updatedValues.current.askingPrice;
      updatedValues.current.listingStatus = SchemaTypes.soldTradingCardType.COLLX;
      handleChangeSalePrice(queryData.tradingCard?.sale?.soldFor?.amount);
    } else if (value === SchemaTypes.soldTradingCardType.OTHER) {
      delete updatedValues.current.askingPrice;
      updatedValues.current.listingStatus = SchemaTypes.soldTradingCardType.OTHER;
      handleChangeSalePrice(queryData.tradingCard?.sale?.soldFor?.amount);
    } else {
      // Removes previous values
      delete updatedValues.current.listingStatus;
      delete updatedValues.current.askingPrice;
      delete updatedValues.current.salePrice;
      handleChangeAskingPrice(0);
      handleChangeSalePrice(0);
    }
  };

  const handleChangeNotes = value => {
    setNotes(value);

    updatedValues.current.notes = value;

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleHelpCondition = () => {
    openUrl(Urls.conditionHelpUrl);
  };

  const handleHelpGrading = () => {
    openUrl(Urls.gradingHelpUrl);
  };

  const handleHelpGrade = () => {
    openUrl(Urls.gradingHelpUrl);
  };

  const handleTakeCards = cards => {
    setFrontImageUrl(cards.front);
    setBackImageUrl(cards.back);

    updatedValues.current.frontImageUrl = cards.front;
    updatedValues.current.backImageUrl = cards.back;
    updatedValues.current.frontImageUploadUrl = queryData.tradingCard?.viewer?.frontImageUploadUrl;
    updatedValues.current.backImageUploadUrl = queryData.tradingCard?.viewer?.backImageUploadUrl;

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleResetPhotos = () => {
    setFrontImageUrl(initFrontImageUrl);
    setBackImageUrl(initBackImageUrl);

    updatedValues.current.frontImageUrl = initFrontImageUrl;
    updatedValues.current.backImageUrl = initBackImageUrl;

    delete updatedValues.current.frontImageUploadUrl;
    delete updatedValues.current.backImageUploadUrl;

    if (onChangeValues) {
      onChangeValues(updatedValues.current);
    }
  };

  const handleCapture = () => {
    if (!navigation) {
      return;
    }

    navigation.navigate('CameraStackModal', {
      screen: 'Camera',
      params: {
        openFrom: Constants.openCameraFrom.addCollection,
        onTakeCards: handleTakeCards,
      },
    });
  };

  const handleRemoveCard = () => {
    Keyboard.dismiss();

    if (onRemove) {
      onRemove(tradingCardId);
    }
  };

  const handleSearchCard = () => {
    if (onSearchCard) {
      onSearchCard();
    }
  };

  const renderSearchRightCard = () => {
    if (!tradingCardId) {
      return null;
    }

    return (
      <Button
        style={styles.searchButton}
        label="Not the right card? Tap to fix"
        labelStyle={styles.textSearchRightCard}
        iconStyle={styles.iconChevron}
        icon={chevronIcon}
        scale={Button.scaleSize.One}
        onPress={handleSearchCard}
      />
    );
  };

  const renderFieldName = (label, onHelp) => (
    <View style={styles.fieldNameItem}>
      <Text style={styles.textFieldName}>{label}</Text>
      {onHelp ? (
        <Button
          style={styles.helpButton}
          iconStyle={styles.iconHelp}
          icon={helpIcon}
          onPress={onHelp}
        />
      ) : null}
    </View>
  );

  const renderPurchase = () => (
    <>
      <View style={styles.itemContainer}>
        <Text style={styles.textFieldName}>Purchase Price</Text>
        <TextInputUnit
          style={styles.fieldValue}
          textInputStyle={styles.textFieldValue}
          unitStyle={styles.textFieldValuePrefix}
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor={colors.placeholderText}
          unitPrefix="$"
          value={purchasePrice}
          onChangeText={handleChangePurchasePrice}
          onFocus={() => setExtraScrollHeight(10)}
        />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.textFieldName}>Purchase Date</Text>
        <DatePicker
          style={styles.datePickerContainer}
          initDate={purchaseDate}
          onSelectDate={handleSelectDate}
        />
      </View>
    </>
  );

  const renderGrade = () => (
    <>
      <View style={styles.itemContainer}>
        {renderFieldName('Grading', handleHelpGrading)}
        <Dropdown
          placeholder="Not Graded"
          data={allGradingScales}
          value={currentGradingScale}
          onChangedValue={handleChangeGradingScale}
        />
      </View>
      {renderGradeExtra()}
    </>
  );

  const renderGradeExtra = () => {
    if (currentGradingScale === allGradingScales[0].value) {
      return (
        <View style={styles.itemContainer}>
          {renderFieldName('Condition', handleHelpCondition)}
          <Dropdown
            placeholder="Select"
            data={allConditions}
            value={currentCondition}
            onChangedValue={handleChangeCondition}
          />
        </View>
      );
    }

    return (
      <>
        <View style={styles.itemContainer}>
          {renderFieldName('Grade', handleHelpGrade)}
          <Dropdown
            placeholder="Select"
            data={selectedAllGrades}
            value={currentGrade}
            onChangedValue={handleChangeGrade}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>Certification #</Text>
          <TextInput
            style={[styles.fieldValue, styles.textFieldValue]}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Enter Number"
            placeholderTextColor={colors.placeholderText}
            value={certificationNumber}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            onChangeText={handleChangeCertificationNumber}
            onFocus={() => setExtraScrollHeight(10)}
          />
        </View>
      </>
    );
  };

  const renderListingStatus = () => {
    if (queryData.tradingCard?.state === SchemaTypes.tradingCardState.PENDING) {
      return null;
    }

    return (
      <>
        <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>Listing Status</Text>
          <Dropdown
            placeholder="None"
            data={!queryData.tradingCard?.state ? pendingListingStatus : normalListingStatus}
            value={currentListingStatus}
            onChangedValue={handleChangeListingStatus}
          />
        </View>
        {renderListingStatusExtra()}
      </>
    );
  };

  const renderListingStatusExtra = () => {
    if (currentListingStatus === SchemaTypes.tradingCardState.LISTED) {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>Asking Price</Text>
          <TextInputUnit
            style={styles.fieldValue}
            textInputStyle={styles.textFieldValue}
            unitStyle={styles.textFieldValuePrefix}
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={colors.placeholderText}
            unitPrefix="$"
            value={askingPrice}
            onChangeText={handleChangeAskingPrice}
            onFocus={() => setExtraScrollHeight(10)}
          />
        </View>
      );
    } else if (
      currentListingStatus === SchemaTypes.soldTradingCardType.COLLX ||
      currentListingStatus === SchemaTypes.soldTradingCardType.OTHER
    ) {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>Amount Sold For</Text>
          <TextInputUnit
            style={styles.fieldValue}
            textInputStyle={styles.textFieldValue}
            unitStyle={styles.textFieldValuePrefix}
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={colors.placeholderText}
            unitPrefix="$"
            value={salePrice}
            onChangeText={handleChangeSalePrice}
            onFocus={() => setExtraScrollHeight(10)}
          />
        </View>
      );
    }

    return null;
  };

  const renderSettings = () => {
    // if (!isEdit) {
    //   return null;
    // }

    return (
      <View style={styles.settingsContainer}>
        {/* <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>Visibility</Text>
          <Switch
            style={styles.switchContainer}
            label={isPublic ? 'Public' : 'Private'}
            labelStyle={styles.textPublic}
            value={isPublic}
            onChangedValue={handleChangeVisibility}
          />
        </View> */}
        {renderPurchase()}
        {renderGrade()}
        {renderListingStatus()}
        <View style={styles.noteItemContainer}>
          <Text style={styles.textFieldName}>Note</Text>
          <View style={styles.noteWrapper}>
            <TextInput
              style={styles.textInputNote}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="I got this card from..."
              placeholderTextColor={colors.placeholderText}
              multiline
              maxLength={350}
              value={notes}
              underlineColorAndroid="transparent"
              onChangeText={handleChangeNotes}
              onFocus={() => setExtraScrollHeight(110)}
            />
            <Text style={styles.textNoteLength}>{notes.length}/350</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRemoveButton = () => {
    if (!isRemove) {
      return null;
    }

    return (
      <Button
        style={styles.removeButton}
        scale={Button.scaleSize.One}
        label="Remove From Collection"
        labelStyle={styles.textRemoveButton}
        onPress={handleRemoveCard}
      />
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: Styles.screenSafeBottomHeight || 10}}
        extraScrollHeight={extraScrollHeight}>
        <CardMainInfo
          style={styles.cardMainInfoContainer}
          card={tradingCardId ? queryData.tradingCard?.card : queryData.card}
        />
        {renderSearchRightCard()}
        <CardCapture
          isCapture={isCapture}
          isEdit={isEdit}
          initFrontImageUrl={initFrontImageUrl}
          frontImageUrl={frontImageUrl}
          initBackImageUrl={initBackImageUrl}
          backImageUrl={backImageUrl}
          onCapture={handleCapture}
          onResetPhotos={handleResetPhotos}
        />
        {renderSettings()}
        {renderRemoveButton()}
      </KeyboardAwareScrollView>
    </View>
  );
};

CardEditContent.defaultProps = {
  isEdit: false,
  isRemove: false,
  isCapture: true,
  onChangeValues: () => {},
  onSearchCard: () => {},
  onRemove: () => {},
};

CardEditContent.propTypes = {
  isEdit: PropTypes.bool,
  isRemove: PropTypes.bool,
  isCapture: PropTypes.bool,
  onChangeValues: PropTypes.func,
  onSearchCard: PropTypes.func,
  onRemove: PropTypes.func,
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  cardMainInfoContainer: {
    marginBottom: 12,
  },
  settingsContainer: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  fieldNameItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textFieldName: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textTransform: 'capitalize',
  },
  noteItemContainer: {
    flexDirection: 'column',
    marginVertical: 8,
  },
  noteWrapper: {
    flex: 1,
    height: 110,
    marginTop: 7,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  textInputNote: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 6,
  },
  textNoteLength: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    textAlign: 'right',
    margin: 6,
  },
  helpButton: {
    padding: 5,
  },
  iconHelp: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.lightGrayText,
  },
  searchButton: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 15,
  },
  textSearchRightCard: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
  },
  iconChevron: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
  fieldValue: {
    width: 140,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  textFieldValue: {
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'left',
  },
  textFieldValuePrefix: {
    fontSize: 15,
    letterSpacing: -0.24,
  },
  textRemoveButton: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.41,
    color: Colors.red,
  },
  switchContainer: {
    justifyContent: 'flex-start',
  },
  textPublic: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginRight: 7,
  },
  datePickerContainer: {
    justifyContent: 'flex-start',
  },
  removeButton: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.red,
  },
}));

export default CardEditContent;
