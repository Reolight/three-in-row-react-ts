import Game from "./components/Game"
import Home from "./components/Home"
import Menu from "./components/Menu"

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/Menu',
        element: <Menu />
    },
    {
        path: 'Menu/Game/:stage',
        element: <Game />
    }
]

export default AppRoutes