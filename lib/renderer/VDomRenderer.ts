import {VRenderer} from "./VRenderer.ts";
import {VChildrenNode, VNode} from "../dom/VNode.ts";
import {IndexedNodeEvent, NodeEvent} from "../utils.ts";
import {TextNode} from "../elements";

export class VDomRenderer extends VRenderer<void> {
    root: HTMLElement;
    onVNodeUnmounted?: IndexedNodeEvent;
    onVNodeMounted?: NodeEvent;
    observer: MutationObserver;

    constructor(nodes: VNode[], root: HTMLElement, onVNodeMounted?: NodeEvent, onVNodeUnmounted?: IndexedNodeEvent) {
        super(nodes);
        this.root = root;
        this.onVNodeMounted = onVNodeMounted;
        this.onVNodeUnmounted = onVNodeUnmounted;
        this.observer = new MutationObserver((e) => {
            for (let index = 0; index < e.length; index++) {
                const record = e[index];
                for (const child of record.removedNodes) {
                    if (!(child instanceof Element)) continue;

                    const stringedId = child.attributes.getNamedItem('data-id')?.value;

                    if (!stringedId) continue;

                    this._removeNode(Number(stringedId), child);
                }

            }
        });

        this.observer.observe(root, {
            childList: true,
            subtree: true,
        })
    }

    render(): void {
        this.root.innerHTML = this.nodes.map(e => e.render()).join('');

        this.root.querySelectorAll('[data-id]').forEach(e => {
            this.onVNodeMounted && this.onVNodeMounted(e);
        })
    }


    insertAfter(node: VNode, nodeId: number) {
        const child = this._findHtmlNodeById(nodeId);

        if (child == null && this.nodes.length != 0) {
            throw new Error("Node with current id not exists")
        }

        const parentHtml = child ? child.parentElement! : this.root;

        let newEl = document.createElement('div');
        newEl.innerHTML = node.render();

        const current = newEl.children[0];

        if (current == null) {
            throw new Error("Node not rendered")
        }

        const parentNodeId = parentHtml.attributes.getNamedItem('data-id')?.value;
        let listToAppend = this.nodes;

        if (parentNodeId) {
            const parentVNode = this.findNodeById(Number(parentNodeId));

            if (!(parentVNode instanceof VChildrenNode)) {
                throw new Error("Parent vnode is not VChildrenNode")
            }

            listToAppend = parentVNode.children;
        }

        const index = Array.prototype.indexOf.call(parentHtml.children, child) + 1;

        this.onVNodeMounted && this.onVNodeMounted(current);
        current.querySelectorAll('[data-id]').forEach(e => {
            this.onVNodeMounted && this.onVNodeMounted(e);
        })

        parentHtml.insertBefore(current, parentHtml.childNodes.item(index))
        listToAppend.splice(index, 0, node);

        return node;
    }
    removeNode(id: number) {
        const html = this._findHtmlNodeById(id);

        if (html == null) {
            return
        }

        html.remove();
    }
    updateNode<T extends VNode>(id: number, newNode: Partial<Omit<T, 'id' | 'type'>>) {
        const node = this.findNodeById(id)

        if (node == null) {
            throw new Error('Node is empty')
        }

        const htmlNode = this._findHtmlNodeById(node.id);

        if (htmlNode == null) {
            throw new Error('Html node is empty')
        }

        if (typeof node != typeof newNode) {
            throw new Error('Node type is not equals')
        }

        node.updateNode({
            ...newNode,
            id: undefined,
            type: undefined,
            children: undefined,
        });

        htmlNode.outerHTML = node.render()
    }


    patchTextNodes(id: number) {
        const node = this.findNodeById(id)!;
        if (node instanceof VChildrenNode) {
            for (const child of node.children) {
                this.patchTextNodes(child.id);
            }
        }

        if (node instanceof TextNode) {
            const htmlNode = document.querySelector(`[data-id="${node.id}"]`);
            if (!htmlNode) return;
            node.updateNode(new TextNode(htmlNode.innerHTML));
        }
    }
    findNodeById(id: number): VNode | null {
        const nodes: VNode[] = [...this.nodes]

        while (nodes.length != 0) {
            const node = nodes.shift();

            if (node == undefined) {
                throw new Error("undefined in node array")
            }

            if (node.id == id) {
                return node;
            }

            if (node instanceof VChildrenNode) {
                nodes.push(...node.children)
            }
        }

        return null;
    }
    private _removeNode(id: number, elem: Element, nodes: VNode[] = this.nodes): boolean {
        for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];

            if (node.id == id) {
                const nodeId = nodes[index - 1]?.id;
                nodes.splice(index, 1);
                this.onVNodeUnmounted && this.onVNodeUnmounted(elem, nodeId);
                return true
            }

            if (node instanceof VChildrenNode) {
                if (this._removeNode(id, elem, node.children))
                    return true;
            }
        }

        return false;
    }
    private _findHtmlNodeById(id: number): HTMLElement | null {
        return this.root.querySelector(`[data-id="${id}"]`);
    }

}