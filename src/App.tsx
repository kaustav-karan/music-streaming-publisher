import SongUploadForm from "./components/SongUploadForm";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen subpixel-antialiased bg-gray-200">
      <div className="">
        <h1 className="mx-auto text-3xl font-bold text-center">
          Music Publisher
        </h1>
        <SongUploadForm />
      </div>
    </div>
  );
}

export default App;
