import Cell from "./Cell";
import Position from "./interfaces/Position";

interface ChainCascade{
    direction: Cell[]
    pos: number
}

export default class Chain{
    cells: Cell[] = []

    static chains: Chain[] = []
    static mapped: Chain[][] = []
    static unic: boolean;
    static isOpened: boolean = false;

    static activeChain? : Chain

    static sizePrepare(rows: number){
        Chain.mapped = []
        for (let i = 0; i < rows; i++){
            Chain.mapped[i] = []
        }
    }

    private static merge(base: Chain){
        console.debug(`merging chains`)
        Chain.unic = false
        let m = Chain.activeChain!
        Chain.activeChain = base
        m.cells.forEach(cell => {
            if (Chain.activeChain!.cells.find(c => c === cell)) Chain.add(cell)
        })
    }

    private static checkIdentity(part: Cell[]){
        for (let i = 0; i < part.length; i++){
            if (Chain.mapped[part[i].pos.y][part[i].pos.x] && 
                    Chain.mapped[part[i].pos.y][part[i].pos.x] !== Chain.activeChain)
            {
                Chain.merge(Chain.mapped[part[i].pos.y][part[i].pos.x])
                break
            }
        }
    }

    static open(cells: Cell[]){
        if (Chain.isOpened) { console.warn(`Can't open new chain while old one is opened!`); return}
        console.debug(`opened at ${cells[0].pos.y}:${cells[0].pos.x}`)
        Chain.activeChain = {cells: cells}
        Chain.isOpened = true
        Chain.unic = true;
        Chain.checkIdentity(cells)
    }

    static add(cell: Cell){
        if (!Chain.isOpened) { console.warn(`Can't add while chain is closed!`); return}
        console.log(`added: ${cell.pos.y}:${cell.pos.x}`)
        Chain.activeChain?.cells.push(cell)
        Chain.checkIdentity([cell])
    }
    
    static close() {
        if (!Chain.isOpened) {console.warn(`attempt to close not opened chain!`); return}
        if (Chain.unic) {Chain.chains.push(Chain.activeChain!)}
        console.debug(`Active chain closed, count of chains now: ${Chain.chains.length}`)
        Chain.activeChain = {} as Chain
        Chain.isOpened = false
    }

    static releaseRecollection(): Chain[]{
        const recollection : Chain[] = Chain.chains
        Chain.chains = []
        Chain.mapped = []
        Chain.chains.forEach(chain => chain.cells.forEach(cell => cell.markedForDelete = true))
        return recollection
    }
}