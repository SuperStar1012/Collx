import React, {useRef, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Animated,
} from 'react-native';

import {
  BottomSheetModal,
} from 'components';
import FilterChangeList from './FilterChangeList';
import FilterChangeRadioGroup from './FilterChangeRadioGroup';
import FilterChangeSlider from './FilterChangeSlider';

import {createUseStyle} from 'theme';
import {SearchFilterOptions} from 'globals';

const FilterChangeSheet = ({
  isVisible,
  filter,
  onClear,
  onApply,
  onClose,
}) => {
  const styles = useStyle();

  const flatListRef = useRef(null);
  const handleViewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
  const scrollX = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef(null);

  const currentPageIndex = useRef(0);
  const currentFilter = useRef(filter);

  const [currentOptionValues, setCurrentOptionValues] = useState({});
  const [currentOption, setCurrentOption] = useState(null);

  const checkGradeOptionValues = () => {
    Object.values(currentOptionValues).map(({
      name,
      value,
      lowValue,
      highValue,
    }) => {
      const index = currentFilter.current?.options.findIndex(item => item?.label === name);

      if (index > -1) {
        let options = [];
        if (value !== 'no') {
          options = [...currentFilter.current.options];
        } else {
          options = [currentFilter.current.options[index]]
        }
        options[index] = {
          ...currentFilter.current.options[index],
        };

        if (lowValue && highValue) {
          options[index].lowValue = lowValue;
          options[index].highValue = highValue;
        } else {
          options[index].value = value || filter.options[0].value;
        }

        currentFilter.current = {
          ...currentFilter.current,
          options,
        };
      }
    });

    return currentFilter.current;
  };

  const pages = useMemo(() => {
    currentFilter.current = filter;

    const {optionType} = currentFilter.current || {};

    if (
      optionType === SearchFilterOptions.valueTypes.parent &&
      currentFilter.current?.name === SearchFilterOptions.filterNames.grade
    )
    {
      const newFilter = checkGradeOptionValues();

      const currentChild = {
        ...currentOption?.child || {},
        value: currentOption?.value,
        lowValue: currentOption?.lowValue,
        highValue: currentOption?.highValue,
      }

      return [newFilter, currentChild];
    }

    if (
      optionType === SearchFilterOptions.valueTypes.option ||
      optionType === SearchFilterOptions.valueTypes.range
    ) {
      return [currentFilter.current];
    }

    return [];
  }, [filter, currentOption, currentOptionValues]);

  useEffect(() => {
    if (!bottomSheetRef.current) {
      return;
    }

    if (isVisible) {
      setTimeout(() => {
        bottomSheetRef.current?.present();
      });
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  useEffect(() => {
    if (currentOption && pages?.length) {
      setTimeout(() => {
        goNextPage();
      }, 10);
    }
  }, [pages, currentOption]);

  const goNextPage = () => {
    if (!flatListRef.current) {
      return;
    }

    currentPageIndex.current += 1;
    if (currentPageIndex.current > pages.length - 1) {
      currentPageIndex.current = pages.length - 1;
    }

    if (currentPageIndex.current < 0) {
      currentPageIndex.current = 0;
    }

    flatListRef.current.scrollToIndex({
      index: currentPageIndex.current,
      animated: true,
    });
  };

  const goPrevPage = () => {
    if (!flatListRef.current) {
      return;
    }

    if (currentPageIndex.current < 0) {
      currentPageIndex.current = 0;
    }

    setTimeout(() => {
      flatListRef.current.scrollToIndex({
        index: currentPageIndex.current - 1,
        animated: true,
      });
      currentPageIndex.current -= 1;
    }, 500);
  };

  const resetGrade = () => {
    if (Object.keys(currentOptionValues).length) {
      setCurrentOptionValues({});
    }

    if (currentOption) {
      setCurrentOption(null);
    }

    if (currentFilter.current) {
      currentFilter.current = null;
    }
  };

  const handleClose = () => {
    resetGrade();

    if (onClose) {
      onClose();
    }
  };

  const handleApply = (name, value) => {
    if (!onApply) {
      handleClose();
      return;
    }

    if (currentFilter.current?.name === SearchFilterOptions.filterNames.grade && Object.keys(currentOptionValues).length) {
      // For Grade
      const values = Object.values(currentOptionValues);
      onApply({
        name: currentFilter.current.name,
        value: values,
      });
    } else {
      onApply({
        name,
        value,
      });
    }

    handleClose();
  };

  const handleClear = (name) => {
    if (!onClear) {
      handleClose();
      return;
    }

    if (currentFilter.current?.name === SearchFilterOptions.filterNames.grade) {
      onClear({
        name: currentFilter.current.name
      });
    } else {
      onClear({
        name,
      });
    }

    handleClose();
  };

  const handleApplyRange = (name, lowValue, highValue) => {
    // For only Grade now.
    if (currentFilter.current?.name === SearchFilterOptions.filterNames.grade) {
      currentOptionValues[name] = {
        name,
        lowValue,
        highValue,
      };

      setCurrentOptionValues({
        ...currentOptionValues
      });
    }
  };

  const handleChangeValue = (name, value) => {
    // For only Grade now.
    currentOptionValues[name] = {
      name,
      value
    };

    setCurrentOptionValues(currentOptionValues);

    handleBack();
  };

  const handleSelect = (item) => {
    setCurrentOption(item);
  };

  const handleBack = () => {
    goPrevPage();
  };

  const handleMomentumScrollEnd = () => {
    if (currentPageIndex.current) {
      return;
    }

    if (currentOption) {
      setCurrentOption(null);
    }
  };

  const renderItem = ({item, index}) => {
    switch (item?.optionType) {
      case SearchFilterOptions.valueTypes.parent:
        return (
          <FilterChangeList
            filter={item}
            isChild={index > 0}
            onApply={handleApply}
            onClear={handleClear}
            onSelect={handleSelect}
          />
        );
      case SearchFilterOptions.valueTypes.option:
        return (
          <FilterChangeRadioGroup
            filter={item}
            isChild={index > 0}
            onChangeValue={handleChangeValue}
            onApply={handleApply}
            onClear={handleClear}
            onBack={handleBack}
          />
        );
      case SearchFilterOptions.valueTypes.range:
        return (
          <FilterChangeSlider
            filter={item}
            isChild={index > 0}
            onApply={handleApplyRange}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={286}
      isHideHeader
      onClose={handleClose}
    >
      <FlatList
        ref={flatListRef}
        style={styles.container}
        data={pages}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        pagingEnabled
        horizontal
        decelerationRate="normal"
        scrollEventThrottle={10}
        renderItem={renderItem}
        viewabilityConfig={handleViewConfigRef.current}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />
    </BottomSheetModal>
  );
};

export default FilterChangeSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: '100%',
    backgroundColor: colors.primaryCardBackground,
  },
}));
