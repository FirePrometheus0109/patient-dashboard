import PatientPage from './pages/PatientPage';
import backgroundImage from './assets/background.png';
import { Toaster } from 'sonner';

function App() {

  return (
    <>
      <div 
        className="min-h-screen bg-background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto p-6 h-screen">
          <div className="h-full">
            <PatientPage />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;