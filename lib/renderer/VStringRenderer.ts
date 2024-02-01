import {VRenderer} from "./VRenderer.ts";
import {VNode} from "../dom";

export class VStringRenderer extends VRenderer<string> {
    constructor(nodes: VNode[]) {
        super(nodes);
    }

    render(): string {
        return this.nodes.map(e => e.render()).join("");
    }
}