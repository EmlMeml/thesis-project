import React, { ChangeEvent, useState } from 'react';

export default function FileUploader() {
        
    const [file, setFile] = useState<File | null>(null);
    
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if(e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    return <div>
            <input type="file" id="file-upload" onChange={handleFileChange}/>
            {file && <p>Selected file: {file.name}</p>}
        </div>;
    }