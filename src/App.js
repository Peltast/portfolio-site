import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SiteLayout from './portfolio/siteLayout';
import HomePage from './portfolio/homePage';
import ProjectPage from './portfolio/projectPage';


import './css/App.css';
import './css/theme.css';


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={ <SiteLayout /> }>

                    <Route index element={ <HomePage /> } />
                    
                    <Route path="projectPage/:waidas" element={ <ProjectPage projectKey="waidas" /> } />

                    <Route path="projectPage" element={ <ProjectPage /> } />
                    
                </Route>

            </Routes>
        </BrowserRouter>
  );
}

export default App;
