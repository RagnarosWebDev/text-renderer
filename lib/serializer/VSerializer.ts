import {VNode} from "../dom";


export type VNodeSerializerType = (data: any, childRender: (data: any) => VNode) => VNode;

export class VSerializer {
    private typeConverters: Map<string, VNodeSerializerType>;

    constructor() {
        this.typeConverters = new Map<string, VNodeSerializerType>();
    }

    addType(type: string, serializer: VNodeSerializerType) {
        this.typeConverters.set(type, serializer);
    }

    removeType(type: string) {
        this.typeConverters.delete(type);
    }

    serialize(text: string): VNode[] {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
            const nodes: VNode[] = [];
            for (const item of data) {
                nodes.push(this.parseNode(item))
            }
            return nodes;
        }

        return [this.parseNode(data)];
    }

    parseNode(data: any): VNode {
        if (!data.type) {
            throw new Error("У поля нет свойства type")
        }

        const converter = this.typeConverters.get(data.type);

        if (!converter) {
            throw new Error("Converter for this type not exists")
        }

        return converter(data, this.parseNode.bind(this));
    }
}