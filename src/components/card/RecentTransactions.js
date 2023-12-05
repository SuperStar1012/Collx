import React from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import moment from 'moment';

import {Button, CardGrade, CardCondition} from 'components';

import {Constants, SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {
  openUrl,
  openEbayUrl,
  isValidUrl,
  getConditionAbbreviation,
} from 'utils';
import {useActions} from 'actions';

const exclamationIcon = require('assets/icons/exclamation.png');

const tableFlexArr=[1.3, 1, 0.5, 1.15, 1];

const RecentTransactions = ({
  flag,
  card,
  byCondition,
  gradeName,
  tradingCardIdForIssue,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const queryCard = useFragment(graphql`
    fragment RecentTransactions_card on Card {
      id
      year
      number
      set {
        name
      }
      ...on SportCard {
        player {
          name
        }
      }
    }`,
    card
  );

  const recentSales = useFragment(graphql`
    fragment RecentTransactions_sales on RecentSalesByCondition {
      sales {
        id
        date
        soldFor {
          formattedAmount
        }
        ...on ExternalSingleCardSale {
          source {
            from
            url
          }
        }
        ...on InternalSingleCardSale {
          tradingCard {
            id
          }
        }
      }
      condition {
        name
        gradingScale {
          name
        }
      }
    }`,
    byCondition
  );

  const getCellTextStyle = columnIndex => {
    if (columnIndex === 1) {
      return {color: Colors.lightBlue};
    } else if (columnIndex === 3) {
      return {fontWeight: Fonts.bold};
    }
    return {};
  };

  const getLabel = label => {
    if (label === 'EBAY') {
      return 'eBay';
    }
    return label;
  };

  const handleOpenUrl = url => {
    if (url && isValidUrl(url)) {
      openUrl(url);
    }
  };

  const handleOpenTraidingCard = traidingCardId => {
    if (traidingCardId) {
      actions.pushTradingCardDetail(traidingCardId);
    }
  };

  const handleReportPrice = (saleId) => {
    actions.navigateReportIssueDetail({
      forInput: {
        saleId,
      },
      issueType: SchemaTypes.issueType.PRICE,
      tradingCardIdForIssue, // Remove later
      isCloseBack: true,
    });
  };

  const renderGrade = (data, index, gradingScale) => {
    if (gradingScale === Constants.cardGradingScaleRaw) {
      return (
        <CardCondition
          key={index}
          style={[styles.gradeContainer, styles.conditionContainer]}
          textStyle={styles.textCondition}
          condition={`${gradingScale}: ${getConditionAbbreviation(data)}`}
        />
      );
    }

    return (
      <CardGrade
        key={index}
        isRecentGrade={true}
        style={styles.gradeContainer}
        grade={data}
      />
    );
  };

  const renderCell = (item, index, sale, gradingScale) => {
    if (index === 1) {
      // link
      const {url} = sale.source || {};
      const {id} = sale.tradingCard || {};
      return (
        <Button
          labelStyle={[
            styles.textCell,
            (url || id) ? getCellTextStyle(index) : {},
          ]}
          label={getLabel(item)}
          onPress={() => url ? handleOpenUrl(url) : handleOpenTraidingCard(id)}
        />
      );
    } else if (index === 2) {
      // report
      return (
        <Button
          iconStyle={styles.iconReport}
          icon={exclamationIcon}
          onPress={() => handleReportPrice(sale.id)}
        />
      );
    } else if (index === 3) {
      // grade / condition
      return renderGrade(item, index, gradingScale);
    }

    return item;
  };

  const renderRecentSalesButton = () => {
    if (!flag) return null;
    if (!queryCard.year || !queryCard.set?.name || !queryCard.number || !queryCard.player?.name || !gradeName) {
      return null;
    }

    return (
      <Button
        style={styles.recentSalesButton}
        label={recentSales?.sales.length > 0 ? 'More Recent Sales' : 'Recent Sales on eBay'}
        labelStyle={styles.textRecentSales}
        scale={Button.scaleSize.One}
        onPress={() => openEbayUrl(queryCard, gradeName, true)}
      />
    );
  };

  const renderTable = () => {
    if (!recentSales?.sales) {
      return null;
    }

    return (
      <>
        {flag ? (
          <View style={styles.headerContainer}>
            <Text style={styles.textTitle}>Recent Transactions</Text>
          </View>
        ) : null}
        <Table
          style={styles.tableContainer}
          borderStyle={styles.tableBorder}
        >
          <Row
            data={Constants.cardRecentTransactionsHeader}
            flexArr={tableFlexArr}
            style={styles.tableHeader}
            textStyle={styles.textTableHeader}
          />
          {recentSales.sales.map((sale, index) => {
            const rowValues = [
              moment(sale.date).format(Constants.dateFormat),
              sale.source?.from || Constants.internalCardSaleSource,
              'Report',
              recentSales.condition.name,
              sale.soldFor.formattedAmount,
            ];
            return (
              <TableWrapper key={index} style={styles.tableWrapper}>
                {rowValues.map((cellItem, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    flex={tableFlexArr[cellIndex]}
                    data={renderCell(cellItem, cellIndex, sale, recentSales.condition.gradingScale.name)}
                    textStyle={{
                      ...styles.textCell,
                      ...getCellTextStyle(cellIndex),
                    }}
                  />
                ))}
              </TableWrapper>
            );
          })}
        </Table>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderTable()}
      {renderRecentSalesButton()}
    </View>
  );
};

export default RecentTransactions;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  tableContainer: {
    marginBottom: 12,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: colors.lightGrayText,
  },
  tableHeader: {
    height: 40,
    backgroundColor: colors.secondaryCardBackground,
  },
  textTableHeader: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
  tableWrapper: {
    height: 40,
    flexDirection: 'row',
  },
  iconReport: {
    width: 22,
    height: 22,
    tintColor: colors.primary,
  },
  textCell: {
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.004,
    color: colors.primaryText,
    textAlign: 'center',
  },
  viewAllButton: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
    marginTop: 8,
  },
  textViewAll: {
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.004,
    color: colors.primary,
  },
  iconChevronRight: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
  gradeContainer: {
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  conditionContainer: {
    backgroundColor: colors.rawConditionBackground,
  },
  textCondition: {
    color: Colors.white,
  },
  recentSalesButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  textRecentSales: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primary,
  },
}));