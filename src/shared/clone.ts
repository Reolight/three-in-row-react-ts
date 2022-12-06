const cloner = require ('rfdc/default')

export default function clone<T>(obj: T): T{
    return cloner(obj) as T
}