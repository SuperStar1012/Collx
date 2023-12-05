export default ({navigation}) => ({
  navigateDatabaseSearchAll: (params) => {
    navigation.navigate('DatabaseSearchAllResult', params);
  },

  navigateArticleSearchAll: (params) => {
    navigation.navigate('ArticleSearchAllResult', params);
  },

  navigateSaleSearchAll: (params) => {
    navigation.navigate('SaleSearchAllResult', params);
  },

  navigateSearchFilters: (params) => {
    navigation.navigate('SearchFilters', params);
  },

});
