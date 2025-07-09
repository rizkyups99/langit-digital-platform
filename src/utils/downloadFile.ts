/**
 * Downloads a file with progress tracking using fetch API
 * Throws error if download fails instead of falling back to new tab
 * @param url - The URL to download from
 * @param filename - The desired filename
 * @param onProgress - Callback function to track download progress (0-100)
 */
export const downloadLocalFileWithProgress = async (
  url: string, 
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    console.log(`Starting download with progress: ${filename}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    // Read the response stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      received += value.length;
      
      // Update progress if total size is known
      if (total > 0 && onProgress) {
        const progress = Math.round((received / total) * 100);
        onProgress(progress);
      }
    }

    // Create blob from chunks
    const blob = new Blob(chunks);
    const blobUrl = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    URL.revokeObjectURL(blobUrl);
    
    // Set progress to 100% when complete
    if (onProgress) {
      onProgress(100);
    }
    
    console.log(`Download completed: ${filename}`);
    
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

/**
 * Opens a file URL in a new browser tab
 * Used for cloud files that should open externally
 * @param url - The URL to open
 */
export const openExternalFileInNewTab = (url: string): void => {
  try {
    console.log(`Opening external file in new tab: ${url}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to open external file:', error);
    throw error;
  }
};

/**
 * Sanitizes filename to remove invalid characters
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove or replace invalid filename characters
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid chars with underscore
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing spaces
};

/**
 * Adds appropriate file extension if not present
 */
export const ensureFileExtension = (filename: string, url: string): string => {
  // If filename already has an extension, return as is
  if (/\.[a-zA-Z0-9]+$/.test(filename)) {
    return filename;
  }
  
  // Try to determine extension from URL
  const urlExtension = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  if (urlExtension) {
    return `${filename}.${urlExtension[1]}`;
  }
  
  // Default extensions based on common file types
  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes('audio') || lowerFilename.includes('mp3')) {
    return `${filename}.mp3`;
  }
  if (lowerFilename.includes('pdf') || lowerFilename.includes('ebook')) {
    return `${filename}.pdf`;
  }
  if (lowerFilename.includes('video')) {
    return `${filename}.mp4`;
  }
  
  // Return filename as is if we can't determine extension
  return filename;
};

/**
 * Main download function with filename processing for local files
 * @param url - The URL to download from
 * @param title - The title to use as filename
 * @param onProgress - Callback function to track download progress (0-100)
 */
export const downloadFileWithTitle = async (
  url: string, 
  title: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  const sanitizedTitle = sanitizeFilename(title);
  const filenameWithExtension = ensureFileExtension(sanitizedTitle, url);
  
  await downloadLocalFileWithProgress(url, filenameWithExtension, onProgress);
};