import {VNode} from "../dom";


export abstract class VRenderer<T> {
    nodes: VNode[];

    constructor(nodes: VNode[]) {
        this.nodes = nodes;
    }

    abstract render(): T;
}