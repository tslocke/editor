import React, { useCallback } from 'react';
import { makeStyles, createStyles, Grid, Menu } from '@material-ui/core';
import { schemas } from '@curvenote/schema';
import { findParentNode } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs, wrapInHeading } from '../../store/actions';
import { getEditorState } from '../../store/selectors';
import { positionPopper } from './utils';
import MenuAction from '../Menu/Action';
import Keyboard from '../Keyboard';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            width: 'fit-content',
            fontSize: 20,
            flexWrap: 'nowrap',
        },
    });
});
var ABOVE_MODALS = { zIndex: 1301 };
var HeadingActions = function (props) {
    var _a, _b, _c, _d;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var state = useSelector(function (s) { var _a; return (_a = getEditorState(s, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var parent = (state === null || state === void 0 ? void 0 : state.selection) &&
        findParentNode(function (n) { return n.type.name === schemas.nodeNames.heading; })(state === null || state === void 0 ? void 0 : state.selection);
    var node = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : (_b = state === null || state === void 0 ? void 0 : state.selection) === null || _b === void 0 ? void 0 : _b.node;
    var pos = (_c = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _c !== void 0 ? _c : (_d = state === null || state === void 0 ? void 0 : state.selection) === null || _d === void 0 ? void 0 : _d.from;
    var _e = React.useState(null), anchorEl = _e[0], setAnchorEl = _e[1];
    var onOpen = useCallback(function (event) { return setAnchorEl(event.currentTarget); }, []);
    var onClose = useCallback(function () { return setAnchorEl(null); }, []);
    if (!node || pos == null)
        return null;
    var _f = node.attrs, numbered = _f.numbered, level = _f.level;
    var onNumbered = function () {
        return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { numbered: !numbered }, false));
    };
    var onLevel = function (l) { return function () {
        onClose();
        if (!(state === null || state === void 0 ? void 0 : state.schema))
            return;
        if (l === 0) {
            dispatch(wrapInHeading(state === null || state === void 0 ? void 0 : state.schema, 0));
            return;
        }
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { level: l }, false));
    }; };
    positionPopper();
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "expand", onClick: onOpen, "aria-controls": "insert-menu", text: "Heading " + level }),
        React.createElement(Menu, { id: "insert-menu", anchorEl: anchorEl, open: Boolean(anchorEl), onClose: onClose, style: ABOVE_MODALS },
            React.createElement(MenuAction, { action: onLevel(0), selected: level === 0, title: "Paragraph" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-0" })),
            React.createElement(MenuAction, { action: onLevel(1), selected: level === 1, title: "Heading 1" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-1" })),
            React.createElement(MenuAction, { action: onLevel(2), selected: level === 2, title: "Heading 2" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-2" })),
            React.createElement(MenuAction, { action: onLevel(3), selected: level === 3, title: "Heading 3" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-3" })),
            React.createElement(MenuAction, { action: onLevel(4), selected: level === 4, title: "Heading 4" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-4" })),
            React.createElement(MenuAction, { action: onLevel(5), selected: level === 5, title: "Heading 5" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-5" })),
            React.createElement(MenuAction, { action: onLevel(6), selected: level === 6, title: "Heading 6" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-6" }))),
        React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered })));
};
export default HeadingActions;
//# sourceMappingURL=HeadingActions.js.map