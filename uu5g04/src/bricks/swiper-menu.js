/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./swiper-menu.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "swiper-menu", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.NestingLevelMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Swiper.Menu"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("swiper-menu"),
      left: ns.css("swiper-menu-left"),
      right: ns.css("swiper-menu-right"),
      open: ns.css("swiper-menu-open"),
    },
    defaults: {
      parentTagName: "UU5.Bricks.Swiper",
    },
    errors: {
      invalidParent: "Parent of this component is not Swiper.",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pullRight: UU5.PropTypes.bool,
    _open: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      pullRight: false,
      _open: false,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  UNSAFE_componentWillMount: function () {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isSwiper)) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    var mainAttrs = this.getMainAttrs();

    mainAttrs.className += " " + (this.props.pullRight ? this.getClassName().right : this.getClassName().left);
    this.props._open && (mainAttrs.className += " " + this.getClassName().open);

    return this.getNestingLevel() ? (
      <div {...mainAttrs}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  },
  //@@viewOff:render
});
