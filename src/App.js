import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Header } from './components/header/Header';
import { PageContent } from './components/page/PageContent';

function App() {
  return (
    <div id="AppContainer">
      <BrowserRouter>
        <Header />
        <PageContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
