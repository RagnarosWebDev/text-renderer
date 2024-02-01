import {createId} from "../utils.ts";


export abstract class VNode {
    type: string;
    id: number
    constructor(id?: number) {
        this.id = id ?? createId();
    }

    abstract render(): string;
    abstract updateNode(node: Omit<Partial<typeof this>, 'id' | 'type' | 'children'>): void;
}

export abstract class VChildrenNode<T extends VNode> extends VNode {
    children: T[];

    constructor(children: T[], id?: number) {
        super(id);
        this.children = children;
    }

    renderChildren() {
        return this.children.map(e => e.render()).join("");
    }
}

