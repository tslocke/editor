import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { v4 as uuid } from 'uuid';
import MenuIcon from '../../../components/Menu/Icon';
import { AlignOptions } from '../../../types';
import {
  setNodeViewAlign, setNodeViewDelete, setNodeViewWidth, updateNodeAttrsOnView,
} from '../../../store/actions';
import SelectWidth from './SelectWidth';
import TextAction from './TextAction';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
    flexWrap: 'nowrap',
  },
}));

type Props = {
  view: EditorView;
  showCaption?: boolean;
};

const AlignActions = (props: Props) => {
  const { view, showCaption } = props;
  const classes = useStyles();
  const [labelOpen, setLabelOpen] = useState(false);
  const { node, from } = view.state.selection as NodeSelection;
  // If the node changes, set open label to false
  useEffect(() => setLabelOpen(false), [node]);
  const {
    align, width, numbered, caption, label,
  } = node.attrs;

  const onAlign = setNodeViewAlign(node, view, from);
  const doAlign = (a: AlignOptions) => () => onAlign(a);
  const onWidth = setNodeViewWidth(node, view, from);
  const onNumbered = () => updateNodeAttrsOnView(
    view, { node, pos: from }, (label === '' ? { numbered: !numbered, label: uuid().split('-')[0] } : { numbered: !numbered }),
  );
  const onCaption = () => updateNodeAttrsOnView(
    view, { node, pos: from }, (label === '' && !caption ? { caption: !caption, label: uuid().split('-')[0] } : { caption: !caption }),
  );
  const onLabel = (t: string) => updateNodeAttrsOnView(
    view, { node, pos: from }, (t === '' ? { label: uuid().split('-')[0] } : { label: t }),
  );
  const onDelete = setNodeViewDelete(node, view, from);

  const validateId = async (t: string) => {
    if (t === '') return true;
    const r = /^([a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])$/;
    return r.test(t);
  };

  if (!isNodeSelection(view.state.selection)) return null;

  // Reposition the popper
  window.scrollBy(0, 1); window.scrollBy(0, -1);

  if (labelOpen) {
    return (
      <TextAction
        text={label}
        onCancel={() => setLabelOpen(false)}
        onSubmit={(t) => { onLabel(t); setLabelOpen(false); }}
        validate={validateId}
        help="The ID must be at least two characters and start with a letter, it may have dashes inside."
      />
    );
  }

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <MenuIcon kind="left" active={align === 'left'} onClick={doAlign('left')} />
      <MenuIcon kind="center" active={align === 'center'} onClick={doAlign('center')} />
      <MenuIcon kind="right" active={align === 'right'} onClick={doAlign('right')} />
      <MenuIcon kind="divider" />
      <SelectWidth width={width} onWidth={onWidth} />
      {showCaption && (
        <>
          <MenuIcon kind="divider" />
          <MenuIcon kind="caption" active={caption} onClick={onCaption} />
          {caption && (
            <>
              <MenuIcon kind="label" active onClick={() => setLabelOpen(true)} />
              <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
            </>
          )}
        </>
      )}
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

AlignActions.defaultProps = {
  showCaption: false,
};

export default AlignActions;
