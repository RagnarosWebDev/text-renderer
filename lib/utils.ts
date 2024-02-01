
let currentId = 0;

export const createId = () => {
    currentId++;
    return currentId;
}

export const renderVId = (id: number) => {
    return `data-id="${id}"`
}

export type NodeEvent = (node: Element) => void;
export type IndexedNodeEvent = (node: Element, nextSelectedId?: number) => void;