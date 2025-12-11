import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Templates from './pages/Templates';
import Team from './pages/Team';
import Conversations from './pages/Conversations';
import Pipeline from './pages/Pipeline';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Contacts": Contacts,
    "Templates": Templates,
    "Team": Team,
    "Conversations": Conversations,
    "Pipeline": Pipeline,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};