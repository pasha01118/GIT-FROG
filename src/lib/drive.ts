// Google Drive Cloud Storage Integration Manager

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

export const driveService = {
  /**
   * Save a security audit report or policy backup to user's Google Drive
   */
  async uploadReportToDrive(
    accessToken: string,
    filename: string,
    content: string,
    mimeType: string = 'text/markdown'
  ): Promise<DriveFileItem> {
    const metadata = {
      name: filename,
      mimeType: mimeType,
      description: 'Git-Frog Guardian Security & Audit Backup'
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: mimeType }));

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: form
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Drive Upload Failed (${response.status}): ${errText}`);
    }

    return await response.json();
  },

  /**
   * List Git-Frog audit files saved in user's Google Drive
   */
  async listGitFrogFiles(accessToken: string): Promise<DriveFileItem[]> {
    const query = "name contains 'Git-Frog' or description contains 'Git-Frog'";
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)&pageSize=20&orderBy=modifiedTime%20desc`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to list Drive files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  }
};
