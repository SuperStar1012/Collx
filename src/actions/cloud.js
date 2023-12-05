import {uploadFileToCloud} from 'store/apis/file';

export function createCloudActions() {
  return {
    uploadFileToCloud: async (uploadUrl, filePath, {onComplete, onError} = {}) => {
      const response = await uploadFileToCloud(uploadUrl, filePath);

      if (!response) {
        // No error
        onComplete();
        return;
      }

      onError(response.Error?.Code, response.Error?.Message);
      return;
    },
  };
}
