import React, { ChangeEvent, useState } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploaderProps {
  onTextLoad?: (text: string) => void;
}

export default function FileUploader({ onTextLoad }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError(null);

    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      onTextLoad?.(text);
    };
    reader.onerror = () => {
      setError('Unable to read the selected file.');
    };
    reader.readAsText(selectedFile);
  }

  return (
    <div>
      <label
        htmlFor="file-upload"
        style={{
          cursor: 'pointer',
          color: '#263a4a',
          backgroundColor: '#cad9e4',
          padding: '8px 16px',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <UploadFileIcon style={{ color: '#263a4a' }} />
        Upload File
      </label>
      <input
        type="file"
        id="file-upload"
        accept=".txt,.md,.json,.js,.ts,.tsx"
        onChange={handleFileChange}
        style={{ display: 'none'}}
      />
      {error && <div style={{ marginTop: '8px', color: 'red' }}>{error}</div>}
    </div>
  );
}