import React, { Component } from "react";
import { Modal } from "antd";

import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/css-hint";
import "antd/dist/antd.css";
import { observer, inject } from "mobx-react";

import "../utils/styleMirror.css";
import { replaceStyle } from "../utils/helper";
import { MARKDOWN_THEME_ID } from "../utils/constant";
import THEMES from "../theme/index";

@inject("content")
@inject("navbar")
@observer
class StyleEditor extends Component {
  constructor(props) {
    super(props);
    this.focus = false;
  }

  getStyleInstance = instance => {
    if (instance) {
      this.styleEditor = instance.editor;
      this.styleEditor.on("keyup", (cm, e) => {
        if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 189) {
          cm.showHint(e);
        }
      });
    }
  };

  showConfirm = () => {
    Modal.confirm({
      title: "是否想自定义主题？",
      content: "确定后将复制当前主题并切换为自定义",
      cancelText: "取消",
      okText: "确定",
      onOk: () => {
        const { markdownId } = this.props.navbar;
        const style =
          `/*自定义样式，实时生效*/\n\n` + THEMES.markdown[markdownId];
        replaceStyle(MARKDOWN_THEME_ID, style);
        this.props.content.setCustomStyle(style);
        this.props.navbar.setMarkdownName("自定义");
        this.props.navbar.setMarkdownId("custom");
      },
      onCancel: () => {}
    });
  };

  changeStyle = (editor, changeObj) => {
    // focus状态很重要，初始化时被调用则不会进入条件
    if (this.focus && this.props.navbar.markdownId !== "custom") {
      this.showConfirm();
    } else if (this.focus) {
      const style = editor.getValue();
      replaceStyle(MARKDOWN_THEME_ID, style);
      this.props.content.setCustomStyle(style);
    }
  };

  handleFocus = e => {
    this.focus = true;
  };

  handleBlur = e => {
    this.focus = false;
  };

  render() {
    return (
      <CodeMirror
        value={this.props.content.style}
        options={{
          theme: "style-mirror",
          keyMap: "sublime",
          mode: "css",
          lineWrapping: true,
          lineNumbers: false
        }}
        id="css-editor"
        onChange={this.changeStyle}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        ref={this.getStyleInstance}
      />
    );
  }
}

export default StyleEditor;
