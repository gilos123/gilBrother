import Layout from "./Layout.jsx";

import Home from "./Home";

import Training from "./Training";

import Arena from "./Arena";

import LevelTester from "./LevelTester";

import Badges from "./Badges";

import SightReadingMenu from "./SightReadingMenu";

import Settings from "./Settings";

import MiniLessons from "./MiniLessons";

import RhythmTrainingMenu from "./RhythmTrainingMenu";

import DrumlineMemory from "./DrumlineMemory";

import About from "./About";

import DrumlineMemoryMenu from "./DrumlineMemoryMenu";

import EarTrainingMenu from "./EarTrainingMenu";

import EarTrainingInAction from "./EarTrainingInAction";

import EarTrainingInActionLevel from "./EarTrainingInActionLevel";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Training: Training,
    
    Arena: Arena,
    
    LevelTester: LevelTester,
    
    Badges: Badges,
    
    SightReadingMenu: SightReadingMenu,
    
    Settings: Settings,
    
    MiniLessons: MiniLessons,
    
    RhythmTrainingMenu: RhythmTrainingMenu,
    
    DrumlineMemory: DrumlineMemory,
    
    About: About,
    
    DrumlineMemoryMenu: DrumlineMemoryMenu,
    
    EarTrainingMenu: EarTrainingMenu,
    
    EarTrainingInAction: EarTrainingInAction,
    
    EarTrainingInActionLevel: EarTrainingInActionLevel,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Training" element={<Training />} />
                
                <Route path="/Arena" element={<Arena />} />
                
                <Route path="/LevelTester" element={<LevelTester />} />
                
                <Route path="/Badges" element={<Badges />} />
                
                <Route path="/SightReadingMenu" element={<SightReadingMenu />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/MiniLessons" element={<MiniLessons />} />
                
                <Route path="/RhythmTrainingMenu" element={<RhythmTrainingMenu />} />
                
                <Route path="/DrumlineMemory" element={<DrumlineMemory />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/DrumlineMemoryMenu" element={<DrumlineMemoryMenu />} />
                
                <Route path="/EarTrainingMenu" element={<EarTrainingMenu />} />
                
                <Route path="/EarTrainingInAction" element={<EarTrainingInAction />} />
                
                <Route path="/EarTrainingInActionLevel" element={<EarTrainingInActionLevel />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}