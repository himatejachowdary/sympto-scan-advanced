
/**
 * Converts a Blob object to a base64 encoded string.
 * @param blob The Blob object (e.g., from a file input).
 * @returns A promise that resolves with the base64 string, without the data URL prefix.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // result is a data URL like "data:image/jpeg;base64,...."
      // We only want the part after the comma.
      const base64String = reader.result?.toString().split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert blob to base64.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};
