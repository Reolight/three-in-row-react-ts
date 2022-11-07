import Game from "./components/Game"
import Home from "./components/Home"
import Menu from "./components/Menu"

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
    }
]

export default AppRoutes