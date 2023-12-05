import React, {useEffect, useState, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  Image,
} from 'react-native';

import {createUseStyle, useTheme} from 'theme';

const searchIcon = require('assets/icons/search-bar/search.png');
const closeIcon = require('assets/icons/search-bar/circle_close.png');

const SearchBar = forwardRef(({
  style,
  inputStyle,
  cancelButtonStyle,
  cancelButtonTextStyle,
  cancelTitle,
  autoFocus,
  editable,
  placeholder,
  placeholderTextColor,
  selectionColor,
  returnKeyType,
  keyboardType,
  keyboardAppearance,
  autoCapitalize,
  blurOnSubmit,
  defaultValue,
  searchValue,
  keyboardShouldPersist,
  cancelButtonWidth = 55,
  onChangeText,
  onSearch,
  onFocus,
  onBlur,
  onDelete,
  onCancel,
}, ref) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [value, setValue] = useState(defaultValue);
  const [iconDeleteAnimated] = useState(new Animated.Value(0));
  const [btnCancelAnimated] = useState(new Animated.Value(0));

  useEffect(() => {
    if (autoFocus) {
      expandAnimation();
    } else {
      collapseAnimation();
    }
  }, []);

  useEffect(() => {
    if (searchValue !== null) {
      setValue(searchValue);
    }
  }, [searchValue]);

  const expandAnimation = () => {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(btnCancelAnimated, {
          toValue: cancelButtonWidth,
          duration: 200,
          useNativeDriver: false,
        }).start(),
        Animated.timing(iconDeleteAnimated, {
          toValue: value.length > 0 ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start(),
      ]);
      resolve();
    });
  };

  const collapseAnimation = () => {
    return new Promise((resolve) => {
      Animated.parallel([
        keyboardShouldPersist === false ? Keyboard.dismiss() : null,
        Animated.timing(btnCancelAnimated, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(),
        Animated.timing(iconDeleteAnimated, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(),
      ]);
      resolve();
    });
  };

  const handleSearch = async () => {
    try {
      if (keyboardShouldPersist === false) {
        await Keyboard.dismiss();
      }
    } catch (error) {
      console.log(error);
    }

    if (onSearch) {
      await onSearch(value);
    }
  };

  const handleChangeText = async text => {
    setValue(text);

    try {
      await new Promise((resolve) => {
        Animated.timing(iconDeleteAnimated, {
          toValue: text.length > 0 ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => resolve());
      });
    } catch (error) {
      console.log(error);
    }

    if (onChangeText) {
      await onChangeText(text);
    }
  };

  const handleFocus = async () => {
    try {
      await expandAnimation();
    } catch (error) {
      console.log(error);
    }

    if (onFocus) {
      await onFocus();
    }
  };

  const handleBlur = async () => {
    if (onBlur) {
      onBlur();
    }
  };

  const handleDelete = async () => {
    setValue('');

    try {
      await new Promise((resolve) => {
        Animated.timing(iconDeleteAnimated, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => resolve());
      });
    } catch (error) {
      console.log(error);
    }

    if (onDelete) {
      onDelete();
    }
  };

  const handleCancel = async () => {
    setValue('');

    try {
      await collapseAnimation();
    } catch (error) {
      console.log(error);
    }

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainContainer}>
        <TouchableWithoutFeedback onPress={handleFocus}>
          <Image source={searchIcon} style={styles.iconSearch} />
        </TouchableWithoutFeedback>
        <TextInput
          ref={ref}
          style={[styles.textInput, inputStyle]}
          selectionColor={selectionColor}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || colors.placeholderText}
          editable={editable}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          keyboardAppearance={keyboardAppearance || 'default'}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          blurOnSubmit={blurOnSubmit}
          underlineColorAndroid="transparent"
          accessibilityTraits="search"
          onChangeText={text => handleChangeText(text)}
          onSubmitEditing={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={handleDelete}>
          <Animated.Image
            source={closeIcon}
            style={[styles.iconDelete, {opacity: iconDeleteAnimated}]}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCancel}
      >
        <Animated.View
          style={[
            styles.cancelButton,
            cancelButtonStyle,
            {width: btnCancelAnimated},
          ]}>
          <Text style={[styles.textCancel, cancelButtonTextStyle]}>
            {cancelTitle}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
});

SearchBar.defaultProps = {
  cancelTitle: 'Cancel',
  defaultValue: '',
  searchValue: null,
  placeholder: 'Search',
  returnKeyType: 'search',
  keyboardType: 'default',
  keyboardAppearance: 'default',
  editable: true,
  blurOnSubmit: true,
  keyboardShouldPersist: false,
  autoFocus: false,

  onFocus: () => {},
  onBlur: () => {},
  onSearch: () => {},
  onChangeText: () => {},
  onCancel: () => {},
  onDelete: () => {},
};

SearchBar.propTypes = {
  placeholderTextColor: PropTypes.string,

  defaultValue: PropTypes.string,
  searchValue: PropTypes.string,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  cancelTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  returnKeyType: PropTypes.string,
  keyboardType: PropTypes.string,
  keyboardAppearance: PropTypes.string,
  autoCapitalize: PropTypes.string,
  editable: PropTypes.bool,
  blurOnSubmit: PropTypes.bool,
  keyboardShouldPersist: PropTypes.bool,

  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSearch: PropTypes.func,
  onChangeText: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
};

SearchBar.displayName = 'SearchBar';

export default SearchBar;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 36,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryCardBackground,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    paddingVertical: 0,
  },
  iconSearch: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
    marginLeft: 14,
    marginRight: 9,
  },
  deleteButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDelete: {
    height: 15,
    width: 15,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  textCancel: {
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));
