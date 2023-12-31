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
import UU5 from "uu5g04";
import "uu5g04-bricks";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const MyNumberHandler = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({ isCalled: true });
  },
  render() {
    return <UU5.Bricks.Number id={"uuID"} value={5223.65663} onChange={this.onChangeHandler} />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    value: {
      values: [225658.14522],
    },
    //onChange:
    thousandSeparator: {
      values: [",", ".", " "],
    },
    decimalSeparator: {
      values: [",", ".", " "],
    },
    maxDecimalLength: {
      values: [5],
    },
    minDecimalLength: {
      values: [10],
    },
    rounded: {
      values: [-5, -2, 0],
    },
  },
  requiredProps: {
    value: 225658.14522,
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Number`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Number, CONFIG);
});

describe(`UU5.Bricks.Number`, () => {
  it(`UU5.Bricks.Number - onChange props()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyNumberHandler />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("change");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChange event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper).toMatchSnapshot();
  });
});
