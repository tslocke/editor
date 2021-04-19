import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
declare class MathView {
    dom: HTMLElement;
    editor: HTMLElement;
    math: HTMLElement;
    inline: boolean;
    innerView: EditorView;
    node: Node;
    outerView: EditorView;
    getPos: (() => number);
    constructor(node: Node, view: EditorView, getPos: (() => number), inline: boolean);
    selectNode(): void;
    deselectNode(): void;
    dispatchInner(tr: Transaction): void;
    update(node: Node): boolean;
    renderMath(): void;
    destroy(): void;
    stopEvent(event: any): boolean;
    ignoreMutation(): boolean;
}
export default MathView;
