import resolveConditions from "../sources/data/Conditioner";
import Cell from "./Cell";
import Effector from "./Effector";
import Field from "./Field";
import { Orientation } from "./interfaces/Conditions";
import Effect from "./interfaces/Effect";
import {Position} from "./interfaces/Position";

interface ChainCascade{
    direction: Cell[]
    pos: number
}

export default class Chain{
    cells: Cell[] = []
    center?: Cell
    orientation?: Orientation
    type: string = ""
    id: number = 0

    static chain_center?: Position
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

    static makeCenter(pos: Position){
        if (Chain.isOpened && Chain.activeChain){
            Chain.chain_center = pos
        }
        else console.error(`Attempt to set center when chain is not opened`)
    }

    private static merge(base: Chain){
        console.debug(`merging chains ${base.id} << ${Chain.activeChain!.id}`)
        Chain.unic = false
        let m = Chain.activeChain!
        Chain.activeChain = base
        if (m.orientation !== Chain.activeChain.orientation)
            Chain.activeChain.orientation = "n"
        m.cells.forEach(cell => {
            if (!Chain.activeChain!.cells.find(c => c.sprite.id === cell.sprite.id)) Chain.add(cell)
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

    static open(cells: Cell[], orientation: Orientation){
        if (Chain.isOpened) { console.warn(`Can't open new chain while old one is opened!`); return}
        console.debug(`opened at ${cells[0].pos.y}:${cells[0].pos.x}`)
        Chain.activeChain = {
            cells: cells, type: cells[0].sprite.name,
            id: Chain.count++,
            orientation: orientation
        }
        
        Chain.isOpened = true
        Chain.unic = true;
        Chain.checkIdentity(cells)
    }

    static add(cell: Cell){
        if (!Chain.isOpened) { console.warn(`Can't add while chain is closed!`); return}
        if (cell.sprite.name !== Chain.activeChain!.type)
            {console.warn(`Sprite ${cell.pos.y}:${cell.pos.x} has another type`); return}
        if (Chain.activeChain!.cells.find(c => cell.sprite.id === c.sprite.id )){
            console.warn(`Sprite ID ${cell.sprite.id} - ${cell.pos.y}:${cell.pos.x} is already in chain`); return
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
        if (Chain.chain_center){
            const center = Chain.activeChain!.cells.find(cell => cell.pos === Chain.chain_center)
            if (!center) console.warn(`There is no cell at position marked as chain center!`)
                else Chain.activeChain!.center = center
        }

        Chain.mapChain()
        console.debug(`Active chain closed, count of chains now: ${Chain.chains.length}`)
        Chain.activeChain = {} as Chain
        Chain.chain_center = {} as Position
        Chain.isOpened = false
    }

    /**
     *  Marks cells to destroy content later. Includes effect raise
     */
    static releaseRecollection(f: Field) {
        console.debug(`this chains will be destroyed: `, Chain.chains)
        
        while (Chain.chains.length > 0){
            const chain: Chain = Chain.chains.pop()!
            
            chain.cells.forEach(cell => { 
                cell.markForDelete()
            })
            
            let effect: Effect | undefined = resolveConditions({
                chain_type: chain.type,
                number_in_chain: chain.cells.length,
                orientation: chain.orientation!
            })
            
            if (!effect) continue
            effect.orientation = chain.orientation
            Effector.spawn(f, effect, chain.center ?? chain.cells[0])         
        }

        Chain.count = 0;
    }
}