import { NodeDef, NodeGroups } from '../types';
import { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  format?: string;
  min?: string;
  minFunction?: string;
  max?: string;
  maxFunction?: string;
  step?: string;
  stepFunction?: string;
};

export const def: NodeDef = {
  tag: 'r-range',
  name: 'range',
  attrs: [
    attr('value'),
    attr('change', 'only'),
    attr('format', false),
    attr('min', true, '0'),
    attr('max', true, '100'),
    attr('step', true, '1'),
  ],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
