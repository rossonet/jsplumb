import {extend, PointArray, PointXY, SortFunction} from "./core"

export function isArray(a: any): boolean {
    return Array.isArray(a)
}

export function isNumber(n: any): boolean {
    return Object.prototype.toString.call(n) === "[object Number]"
}

export function isString(s: any): boolean {
    return typeof s === "string"
}

export function isBoolean(s: any): boolean {
    return typeof s === "boolean"
}

export function isNull(s: any): boolean {
    return s == null
}

export function isObject(o: any): boolean {
    return o == null ? false : Object.prototype.toString.call(o) === "[object Object]"
}

export function isDate(o: any): o is Date {
    return Object.prototype.toString.call(o) === "[object Date]"
}

export function isFunction(o: any): o is Function {
    return Object.prototype.toString.call(o) === "[object Function]"
}

export function isNamedFunction(o: any): boolean {
    return isFunction(o) && o.name != null && o.name.length > 0
}

export function isEmpty(o: any): boolean {
    for (let i in o) {
        if (o.hasOwnProperty(i)) {
            return false
        }
    }
    return true
}

export const IS = {
    anObject: (o: any): boolean => {
        return o == null ? false : Object.prototype.toString.call(o) === "[object Object]"
    },
    aString:(o:any):boolean => isString(o)
}

export function clone(a: any): any {
    if (isString(a)) {
        return "" + a
    }
    else if (isBoolean(a)) {
        return !!a
    }
    else if (isDate(a)) {
        return new Date(a.getTime())
    }
    else if (isFunction(a)) {
        return a
    }
    else if (isArray(a)) {
        let b = []
        for (let i = 0; i < a.length; i++) {
            b.push(clone(a[i]))
        }
        return b
    }
    else if (IS.anObject(a)) {
        let c = {}
        for (let j in a) {
            c[j] = clone(a[j])
        }
        return c
    }
    else {
        return a
    }
}

export function merge(a: any, b: any, collations?: any, overwrites?:any) {
    // first change the collations array - if present - into a lookup table, because its faster.
    let cMap = {}, ar: any, i: any, oMap = {}
    collations = collations || []
    overwrites = overwrites || []
    for (i = 0; i < collations.length; i++) {
        cMap[collations[i]] = true
    }
    for (i = 0; i < overwrites.length; i++) {
        oMap[overwrites[i]] = true
    }

    let c = clone(a)
    for (i in b) {
        if (c[i] == null || oMap[i]) {
            c[i] = b[i]
        }
        else if (isString(b[i]) || isBoolean(b[i])) {
            if (!cMap[i]) {
                c[i] = b[i]; // if we dont want to collate, just copy it in.
            }
            else {
                ar = []
                // if c's object is also an array we can keep its values.
                ar.push.apply(ar, isArray(c[i]) ? c[i] : [c[i]])
                ar.push.apply(ar, isBoolean(b[i]) ? b[i] : [b[i]])
                c[i] = ar
            }
        }
        else {
            if (isArray(b[i])) {
                ar = []
                // if c's object is also an array we can keep its values.
                if (isArray(c[i])) {
                    ar.push.apply(ar, c[i])
                }
                ar.push.apply(ar, b[i])
                c[i] = ar
            }
            else if (IS.anObject(b[i])) {
                // overwrite c's value with an object if it is not already one.
                if (!IS.anObject(c[i])) {
                    c[i] = {}
                }
                for (let j in b[i]) {
                    c[i][j] = b[i][j]
                }
            }
        }

    }
    return c
}

export function replace(inObj: any, path: string, value: any) {
    if (inObj == null) {
        return
    }
    let q = inObj, t = q
    path.replace(/([^\.])+/g, (term: string, lc: any, pos: any, str: any): string => {
        let array = term.match(/([^\[0-9]+){1}(\[)([0-9+])/),
            last = pos + term.length >= str.length,
            _getArray = function () {
                return t[array[1]] || (function () {
                        t[array[1]] = []
                        return t[array[1]]
                    })()
            }

        if (last) {
            // set term = value on current t, creating term as array if necessary.
            if (array) {
                _getArray()[array[3]] = value
            }
            else {
                t[term] = value
            }
        }
        else {
            // set to current t[term], creating t[term] if necessary.
            if (array) {
                let a = _getArray()
                t = a[array[3]] || (function () {
                        a[array[3]] = {}
                        return a[array[3]]
                    })()
            }
            else {
                t = t[term] || (function () {
                        t[term] = {}
                        return t[term]
                    })()
            }
        }

        return ""
    })

    return inObj
}

//
// chain a list of functions, supplied by [ object, method name, args ], and return on the first
// one that returns the failValue. if none return the failValue, return the successValue.
//
export function functionChain(successValue: any, failValue: any, fns: Array<Array<any>>): any {
    for (let i = 0; i < fns.length; i++) {
        const o = fns[i][0][fns[i][1]].apply(fns[i][0], fns[i][2])
        if (o === failValue) {
            return o
        }
    }
    return successValue
}

/**
 *
 * Take the given model and expand out any parameters. 'functionPrefix' is optional, and if present, helps jsplumb figure out what to do if a value is a Function.
 * if you do not provide it (and doNotExpandFunctions is null, or false), jsplumb will run the given values through any functions it finds, and use the function's
 * output as the value in the result. if you do provide the prefix, only functions that are named and have this prefix
 * will be executed; other functions will be passed as values to the output.
 *
 * @param model
 * @param values
 * @param functionPrefix
 * @param doNotExpandFunctions
 * @returns {any}
 */
export function populate(model: any, values: any, functionPrefix?: string, doNotExpandFunctions?: boolean): any {
    // for a string, see if it has parameter matches, and if so, try to make the substitutions.
    const getValue = (fromString: string) => {
        let matches = fromString.match(/(\${.*?})/g)
        if (matches != null) {
            for (let i = 0; i < matches.length; i++) {
                let val = values[matches[i].substring(2, matches[i].length - 1)] || ""
                if (val != null) {
                    fromString = fromString.replace(matches[i], val)
                }
            }
        }
        return fromString
    }

    // process one entry.
    const _one = (d: any): any => {
        if (d != null) {
            if (isString(d)) {
                return getValue(d)
            }
            else if (isFunction(d) && !doNotExpandFunctions && (functionPrefix == null || (d.name || "").indexOf(functionPrefix) === 0)) {
                return d(values)
            }
            else if (isArray(d)) {
                let r = []
                for (let i = 0; i < d.length; i++) {
                    r.push(_one(d[i]))
                }
                return r
            }
            else if (IS.anObject(d)) {
                let s = {}
                for (let j in d) {
                    s[j] = _one(d[j])
                }
                return s
            }
            else {
                return d
            }
        }
    }

    return _one(model)
}

export function findWithFunction<T>(a: Array<T>, f: (_a: T) => boolean): number {
    if (a) {
        for (let i = 0; i < a.length; i++) {
            if (f(a[i])) {
                return i
            }
        }
    }
    return -1
}

export function removeWithFunction<T>(a: Array<T>, f: (_a: T) => boolean): boolean {
    const idx = findWithFunction(a, f)
    if (idx > -1) {
        a.splice(idx, 1)
    }
    return idx !== -1
}

export function remove<T>(l: Array<T>, v: T): boolean {
    const idx = l.indexOf(v)
    if (idx > -1) {
        l.splice(idx, 1)
    }
    return idx !== -1
}

export function addWithFunction<T>(list: Array<T>, item: T, hashFunction: (_a: T) => boolean): void {
    if (findWithFunction(list, hashFunction) === -1) {
        list.push(item)
    }
}

export function addToList(map: any, key: string, value: any, insertAtStart?: boolean): Array<any> {
    let l = map[key]
    if (l == null) {
        l = []
        map[key] = l
    }
    l[insertAtStart ? "unshift" : "push"](value)
    return l
}

export function suggest(list: Array<any>, item: any, insertAtHead?: boolean): boolean {
    if (list.indexOf(item) === -1) {
        if (insertAtHead) {
            list.unshift(item)
        } else {
            list.push(item)
        }
        return true
    }
    return false
}


const lut:Array<string> = []
for (let i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }

export function uuid():string {
    const d0 = Math.random()*0xffffffff|0
    const d1 = Math.random()*0xffffffff|0
    const d2 = Math.random()*0xffffffff|0
    const d3 = Math.random()*0xffffffff|0
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
        lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff]
}

export function rotatePoint(point:Array<number>, center:PointArray, rotation:number):[number, number, number, number] {
    const radial = [ point[0] - center[0], point[1]- center[1]],
        cr = Math.cos(rotation / 360 * Math.PI * 2),
        sr = Math.sin(rotation / 360 * Math.PI * 2)

    return [
        (radial[0] * cr) - (radial[1] * sr) + center[0],
        (radial[1] * cr) + (radial[0] * sr) + center[1],
        cr,
        sr
    ]
}

export interface RotatedPointXY extends PointXY {
    cr:number
    sr:number
}

export function rotatePointXY(point:PointXY, center:PointXY, rotation:number):RotatedPointXY {
    const r = rotatePoint([point.x, point.y], [center.x, center.y], rotation)
    return {
        x:r[0],
        y:r[1],
        cr:r[2],
        sr:r[3]
    }
}

export function rotateAnchorOrientation(orientation:[number, number], rotation:any):[number, number] {
    const r = rotatePoint(orientation, [0,0], rotation)
    return [
        Math.round(r[0]),
        Math.round(r[1])
    ]
}

export function fastTrim(s: string): string {
    if (s == null) {
        return null
    }
    let str = s.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length
    while (ws.test(str.charAt(--i))) {
    }
    return str.slice(0, i + 1)
}

export function each(obj: any, fn: Function) {
    obj = obj.length == null || typeof obj === "string" ? [obj] : obj
    for (let i = 0; i < obj.length; i++) {
        fn(obj[i])
    }
}

export function map(obj: any, fn: Function) {
    let o = []
    for (let i = 0; i < obj.length; i++) {
        o.push(fn(obj[i]))
    }
    return o
}

export function mergeWithParents(type: Array<string> | string, map: any, parentAttribute?: string): any {

    parentAttribute = parentAttribute || "parent"

    let _def = (id: string): any => {
        return id ? map[id] : null
    }

    let _parent = (def: any): any => {
        return def ? _def(def[parentAttribute]) : null
    }

    let _one = (parent: any, def: any): any => {
        if (parent == null) {
            return def
        }
        else {
            let overrides = [ "anchor", "anchors", "cssClass", "connector", "paintStyle", "hoverPaintStyle", "endpoint", "endpoints"]
            if (def.mergeStrategy === "override") {
                Array.prototype.push.apply(overrides, [ "events", "overlays"])
            }
            let d = merge(parent, def, [], overrides)
            return _one(_parent(parent), d)
        }
    }

    let _getDef = (t: any): any => {
        if (t == null) {
            return {}
        }
        if (typeof t === "string") {
            return _def(t)
        }
        else if (t.length) {
            let done = false, i = 0, _dd
            while (!done && i < t.length) {
                _dd = _getDef(t[i])
                if (_dd) {
                    done = true
                }
                else {
                    i++
                }
            }
            return _dd
        }
    }

    let d = _getDef(type)
    if (d) {
        return _one(_parent(d), d)
    }
    else {
        return {}
    }
}

export const logEnabled: boolean = true

export function log(...args: string[]): void {
    if (logEnabled && typeof console !== "undefined") {
        try {
            const msg = arguments[arguments.length - 1]
            console.log(msg)
        }
        catch (e) {
        }
    }
}

/**
 * Wraps one function with another, creating a placeholder for the
 * wrapped function if it was null. this is used to wrap the various
 * drag/drop event functions - to allow jsPlumb to be notified of
 * important lifecycle events without imposing itself on the user's
 * drag/drop functionality.
 * @method wrap
 * @param {Function} wrappedFunction original function to wrap; may be null.
 * @param {Function} newFunction function to wrap the original with.
 * @param {Object} [returnOnThisValue] Optional. Indicates that the wrappedFunction should
 * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
 * note that this is a simple comparison and only works for primitives right now.
 */
export function wrap(wrappedFunction: Function, newFunction: Function, returnOnThisValue?: any) {
    return function () {
        let r = null
        try {
            if (newFunction != null) {
                r = newFunction.apply(this, arguments)
            }
        } catch (e) {
            log("jsPlumb function failed : " + e)
        }
        if ((wrappedFunction != null) && (returnOnThisValue == null || (r !== returnOnThisValue))) {
            try {
                r = wrappedFunction.apply(this, arguments)
            } catch (e) {
                log("wrapped function failed : " + e)
            }
        }
        return r
    }
}

export function sortHelper<T> (_array:Array<T>, _fn:SortFunction<T>):Array<T> {
    return _array.sort(_fn)
}

export function _mergeOverrides (def:any, values:any):any {
    let m = extend({}, def)
    for (let i in values) {
        if (values[i]) {
            m[i] = values[i]
        }
    }
    return m
}

export type MapFunction<T, Q> = (v:T) => Q

export interface Optional<T> {
    isDefined:()=>boolean
    ifPresent:( fn: (v:T) => any) => void
    map:(fn:MapFunction<T, any>) => any
}

export function optional<T>(obj:T):Optional<T> {
    return {
        isDefined:()=> obj != null,
        ifPresent:(fn:(v:T) => any) => {
            if (obj != null) {
                fn(obj)
            }
        },
        //map:(fn:(v:T) => Q):Q => {
        map:(fn:MapFunction<T, any>) => {
            if(obj!= null) {
                return fn(obj)
            } else {
                return null
            }
        }
    }
}

