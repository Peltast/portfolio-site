import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SiteLayout from './portfolio/siteLayout';
import HomePage from './portfolio/homePage';
import ProjectPage from './portfolio/projectPage';

import './css/theme.css';

function App() {

    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={ <SiteLayout /> }>

                    <Route index element={ <HomePage /> } />
                    
                    <Route path="projectPage/" element={ <ProjectPage projectKey="waid" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="waidr" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="waidas" /> } />

                    <Route path="projectPage/" element={ <ProjectPage projectKey="aboutface" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="jidan" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="ygtta" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="yotwm_proto" /> } />
                    
                    <Route path="projectPage/" element={ <ProjectPage projectKey="ggj2018" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="ggj2019" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="ggj2020" /> } />
                    <Route path="projectPage/" element={ <ProjectPage projectKey="pgj2019" /> } />

                    <Route path="projectPage" element={ <ProjectPage /> } />
                    
                </Route>

            </Routes>
        </BrowserRouter>
  );
}

export default App;
