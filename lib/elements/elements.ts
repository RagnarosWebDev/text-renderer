import {VChildrenNode, VNode} from "../dom/VNode.ts";
import {renderVId} from "../utils.ts";

export class ANode extends VChildrenNode<VNode> {
    link: string;

    constructor(children: VNode[], link: string) {
        super(children);
        this.link = link;
        this.type = 'link';
    }

    render(): string {
        return `<a href="${this.link}" ${renderVId(this.id)}>${this.renderChildren()}</a>`;
    }

    updateNode(node: Omit<Partial<typeof this>, 'id' | 'type' | 'children'>) {
        this.link = node.link ?? this.link;
    }
}
export class ImageNode extends VNode {
    src: string;
    alt: string;

    constructor(src: string, alt: string) {
        super();
        this.type = 'image';
        this.src = src;
        this.alt = alt;
    }

    render(): string {
        return `<img src="${this.src}" ${renderVId(this.id)} alt="${this.alt}"/>`;
    }

    updateNode(node: Omit<Partial<typeof this>, 'id' | 'type' | 'children'>) {
        this.src = node.src ?? this.src;
        this.alt = node.alt ?? this.alt;
    }
}
export class TextNode extends VNode {
    text: string;
    constructor(text: string) {
        super();
        this.type = 'text';
        this.text = text;
    }

    render(): string {
        return `<div ${renderVId(this.id)}>${this.text}</div>`;
    }

    updateNode(node: Omit<Partial<typeof this>, 'id' | 'type' | 'children'>) {
        this.text = node.text ?? this.text;
    }
}