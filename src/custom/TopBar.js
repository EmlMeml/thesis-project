import FileUploader from './../custom/FileUploader.tsx';

export default function TopBar({ onFileLoad }) {
  return (
    <div style={{ backgroundColor: '#466c89', color: '#f4f7fa', height:'72px', alignItems:'center', display:'flex', justifyContent:'center' }}>
      <h1>Ripple</h1>
      <div style={{ position: 'relative', left:'240px'}}>
        <FileUploader onTextLoad={onFileLoad} />
      </div>
      
    </div>
  );
}
