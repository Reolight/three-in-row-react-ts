import Game from "./components/Game"
import Home from "./components/Home"
import Menu from "./components/Menu"
import DomainC from "./Domain/component/DomainC"

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/Menu/:player',
        element: <Menu />
    },
    {
        path: '/Game/:stage',
        element: <Game />
    },
    {
        path: '/Domain/:player',
        element: <DomainC />
    }
]

export default AppRoutes