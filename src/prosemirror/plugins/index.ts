import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { collab } from 'prosemirror-collab';
import { Schema } from 'prosemirror-model';
import { columnResizing, tableEditing, goToNextCell } from 'prosemirror-tables';
import { nodeNames, schemas } from '@curvenote/schema';
import { Plugin } from 'prosemirror-state';
import { autocomplete } from 'prosemirror-autocomplete';
import suggestion from './suggestion';
import { buildBasicKeymap, buildCommentKeymap, buildKeymap, captureTab } from '../keymap';

import inputrules from '../inputrules';
import { store } from '../../connect';
import { editablePlugin } from './editable';
import { handleSuggestion } from '../../store/suggestion/actions';
import commentsPlugin from './comments';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
import getPromptPlugin from './prompts';

const ALL_TRIGGERS = /(?:^|\s|\n|[^\d\w])(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{)|(?:\[\[))$/;
const NO_VARIABLE = /(?:^|\s|\n|[^\d\w])(:|\/|(?:\{\{)|(?:\[\[))$/;

function tablesPlugins(schema: Schema) {
  // Don't add plugins if they are not in the schema
  if (!schema.nodes[nodeNames.table]) return [];
  return [
    columnResizing({}),
    tableEditing(),
    keymap({
      Tab: goToNextCell(1),
      'Shift-Tab': goToNextCell(-1),
    }),
  ];
}

export function getPlugins(
  schemaPreset: schemas.UseSchema,
  schema: Schema,
  stateKey: any,
  version: number,
  startEditable: boolean,
): Plugin[] {
  if (schemaPreset === 'comment') {
    return [
      editablePlugin(startEditable),
      // ...suggestion(
      //   (action) => store.dispatch(handleSuggestion(action)),
      //   NO_VARIABLE,
      //   // Cancel on space after some of the triggers
      //   (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
      // ),
      ...inputrules(schema),
      keymap(buildCommentKeymap(stateKey, schema)),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      history(),
    ];
  }
  return [
    editablePlugin(startEditable),
    // ...suggestion(
    //   (action) => store.dispatch(handleSuggestion(action)),
    //   schema.nodes.variable ? ALL_TRIGGERS : NO_VARIABLE,
    //   // Cancel on space after some of the triggers
    //   (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
    // ),
    // TODO: move this to comment for first iteration
    ...autocomplete({
      triggers: [
        { name: 'mention', trigger: '@', cancelOnFirstSpace: false },
        {
          name: 'suggestion',
          trigger: schema.nodes.variable ? ALL_TRIGGERS : NO_VARIABLE,
          cancelOnFirstSpace: true,
        },
      ],
      reducer(action) {
        if (action.type?.name === 'suggestion') {
          console.log('suggestion', action);
          return store.dispatch(handleSuggestion(action));
        }
        console.log('mention', action);
        return false;
      },
    }),
    getPromptPlugin(),
    getImagePlaceholderPlugin(),
    ...inputrules(schema),
    keymap(buildKeymap(stateKey, schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    collab({ version }),
    ...tablesPlugins(schema), // put this plugin near the end of the array of plugins, since it handles mouse and arrow key events in tables rather broadly
    history(),
    keymap(captureTab()),
  ];
}

export function getInlinePlugins(schema: Schema): Plugin[] {
  return [
    editablePlugin(true),
    commentsPlugin(),
    ...inputrules(schema),
    keymap(buildBasicKeymap(schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
  ];
}
