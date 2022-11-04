import Game from "./components/Game"
import Menu from "./components/Menu"

const AppRoutes = [
    {
        index: true,
        element: <Menu />
    },
    {
        path: '/Game/:stage',
        element: <Game />
    }
]

export default AppRoutes