import {SchemaTypes} from 'globals';

export const getReportTitle = issueType => {
  if (issueType === SchemaTypes.issueType.USER) {
    return 'Report User';
  } else if (issueType === SchemaTypes.issueType.COMMENT) {
    return 'Report Comment';
  }

  return 'Report Issue';
};
