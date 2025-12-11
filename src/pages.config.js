import Home from './pages/Home';
import Contacts from './pages/Contacts';
import Conversations from './pages/Conversations';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Templates from './pages/Templates';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Contacts": Contacts,
    "Conversations": Conversations,
    "Dashboard": Dashboard,
    "Pipeline": Pipeline,
    "Settings": Settings,
    "Team": Team,
    "Templates": Templates,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};