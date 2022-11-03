import Cell from "./Cell";
import Position from "./interfaces/Position";

interface ChainCascade{
    direction: Cell[]
    pos: number
}

export default class Chain{
    cells: Cell[] = []
    type: string = ""
    id: number = 0

    static count: number = 0
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
        console.debug(`merging chains ${base.id} << ${Chain.activeChain!.id}`)
        Chain.unic = false
        let m = Chain.activeChain!
        Chain.activeChain = base
        m.cells.forEach(cell => {
            if (!Chain.activeChain!.cells.find(c => c === cell)) Chain.add(cell)
        })
    }

    private static checkIdentity(part: Cell[]){
        for (let i = 0; i < part.length; i++){
            const chain = Chain.mapped[part[i].pos.y][part[i].pos.x]
            if (chain && chain.type === Chain.activeChain!.type && chain.id != Chain.activeChain!.id)
            {
                Chain.merge(chain)
                break
            }
        }
    }

    static open(cells: Cell[]){
        if (Chain.isOpened) { console.warn(`Can't open new chain while old one is opened!`); return}
        console.debug(`opened at ${cells[0].pos.y}:${cells[0].pos.x}`)
        Chain.activeChain = {cells: cells, type: cells[0].sprite.name, id: Chain.count++}
        Chain.isOpened = true
        Chain.unic = true;
        Chain.checkIdentity(cells)
    }

    static add(cell: Cell){
        if (!Chain.isOpened) { console.warn(`Can't add while chain is closed!`); return}
        if (cell.sprite.name !== Chain.activeChain!.type)
            {console.warn(`Sprite ${cell.pos.y}:${cell.pos.x} has another type`); return}
        if (Chain.activeChain!.cells.find(c => cell.pos === c.pos )){
            console.warn(`Sprite ${cell.pos.y}:${cell.pos.x} is already in chain`); return
        }

        console.log(`added: ${cell.pos.y}:${cell.pos.x}`)
        Chain.activeChain?.cells.push(cell)
        Chain.checkIdentity([cell])
    }
    
    private static mapChain(){
        Chain.activeChain!.cells.forEach(cell => Chain.mapped[cell.pos.y][cell.pos.x] = Chain.activeChain!)
    }

    static close() {
        if (!Chain.isOpened) {console.warn(`attempt to close not opened chain!`); return}
        if (Chain.unic) {Chain.chains.push(Chain.activeChain!)}
        Chain.mapChain()
        console.debug(`Active chain closed, count of chains now: ${Chain.chains.length}`)
        Chain.activeChain = {} as Chain
        Chain.isOpened = false
    }

    static releaseRecollection(): Chain[]{
        const recollection : Chain[] = Chain.chains
        Chain.chains = []
        Chain.mapped = []
        Chain.count = 0;
        Chain.chains.forEach(chain => chain.cells.forEach(cell => cell.markedForDelete = true))
        console.debug(recollection)
        return recollection
    }
}