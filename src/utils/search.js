import _ from 'lodash';

import {Constants, SearchFilterOptions} from 'globals';

export const getSortByQuery = query => {
  let label = '';

  if (!query) {
    return '';
  }

  Object.keys(Constants.cardSearchCategories).map(key => {
    if (query[key]) {
      label += query[key] + ' ';
    }
  });

  return label;
};

export const getFilterOptions = (filterOptions, selectedOption, categoryValue) => {
  const result = {
    filterOptions,
    categoryOption: null,
  };

  const {name, value: filterValue} = selectedOption || {};

  const index = filterOptions.findIndex(filterItem => filterItem.name == name);

  if (index > -1) {
    let options = _.cloneDeep(filterOptions);

    if (name === SearchFilterOptions.filterNames.grade) {
      // For Grade
      const gradeOptions = options[index];
      const subOptions = [...gradeOptions.options];

      if (filterValue) {
        filterValue.map(item => {
          const {name: subName, value, lowValue, highValue} = item;
          const subIndex = subOptions.findIndex(subItem => subItem.label === subName);

          if (subIndex > -1) {
            if (value) {
              subOptions[subIndex].value = value;
            } else if (lowValue && highValue) {
              const gradesOption = {
                ...subOptions[subIndex],
                lowValue,
                highValue,
              };
              subOptions[subIndex] = gradesOption;
            }
          }
        });
      } else {
        subOptions.map((item, index) => {
          if (item.label === SearchFilterOptions.filterNames.grades) {
            subOptions[index].value = SearchFilterOptions.filterValues.allGrades;
            subOptions[index].lowValue = 0;
            subOptions[index].highValue = 0;
          } else {
            subOptions[index].value = item.child.options[0].value;
          }
        });
      }

      const gradedOption = filterValue?.find(item => item.name === SearchFilterOptions.filterNames.graded);

      options[index] = {
        ...gradeOptions,
        options: subOptions,
        value: gradedOption?.value || gradeOptions.options[0].value,
      }
    } else {
      options[index] = {
        ...filterOptions[index],
        value: filterValue || filterOptions[index].options[0].value,
      }
    }

    result.filterOptions = options || null;

    // extra
    if (name === SearchFilterOptions.filterNames.category && categoryValue !== filterValue) {
      result.categoryOption = filterOptions[index].options.find(item => item.value === filterValue);
    }
  }

  return result;
};

export const decodeQuery = (query) => {
  if (!query) {
    return '';
  }
  return decodeURIComponent(query);
};
