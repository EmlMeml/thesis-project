import FileUploader from './../custom/FileUploader.tsx';

export default function TopBar({ onFileLoad }) {
  return (
    <div style={{ backgroundColor: '#252e5b', color: '#fff', height:'56px', alignItems:'center', display:'flex', justifyContent:'center' }}>
      <h1>Tell Me a Story...</h1>
      <div style={{ position: 'absolute', right: '16px'}}>
        <FileUploader onTextLoad={onFileLoad} />
      </div>
      
    </div>
  );
}
