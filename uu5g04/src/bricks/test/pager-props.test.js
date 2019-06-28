/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from 'react';
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";

const TagName = "UU5.Bricks.Pager";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    leftLink: {
      values: [{href: "#leftlink", text: "Předchozí článek", icon: "uu5-plus"}]
    },
    rightLink: {
      values: [{href: "#rightlink", text: "Další článek", icon: "uu5-plus"}]
    },
    upLink: {
      values: [{href: "#uplink", text: "Nahoru", icon: "uu5-plus"}]
    },
    downLink: {
      values: [{href: "#downlink", text: "Dolů", icon: "uu5-plus"}]
    },
    background: {
      values: [true, false]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.Column id={"uuID2"} level="3" colWidth="xs12 s4 m4" header="Links">
          <UU5.Bricks.Pager id={"uuID3"} leftLink={{ href: "#", text: "previous", icon: "mdi-arrow-left" }} />
          <UU5.Bricks.Pager id={"uuID4"} rightLink={{ href: "#", text: "next", icon: "mdi-arrow-right" }} />
          <UU5.Bricks.Pager id={"uuID5"} upLink={{ href: "#", text: "up", icon: "mdi-arrow-up" }} />
          <UU5.Bricks.Pager id={"uuID6"} downLink={{ href: "#", text: "down", icon: "mdi-arrow-down" }} />
        </UU5.Bricks.Column>
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});









