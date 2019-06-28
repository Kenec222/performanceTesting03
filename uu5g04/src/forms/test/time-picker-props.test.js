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

import React from "react";
import createReactClass from "create-react-class";
import UU5 from "uu5g04";
import enzymeToJson from "enzyme-to-json";
import {shallow, mount, render} from 'enzyme';
import renderer from 'react-test-renderer';
import "uu5g04-bricks";
import "uu5g04-forms";
import TestTools from "../../core/test/test-tools.js";

//`${TagName}`
const TagName = "UU5.Forms.TimePicker";

const MixinPropsFunction = createReactClass({

  mixins: [
    UU5.Common.BaseMixin,
  ],

  getInitialState: () => {
    return {
      isCalled: false,
      value: '',
      message: '',
      feedback: 'initial'
    };
  },


  onFocusHandler(event) {
    alert("onFocus event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onBlurHandler(event) {
    alert("onBlur event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onEnterHandler(event) {
    alert("onEnter event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  validateOnChangeHandler(event) {
    alert("ValidateOnChange event has been called.");
    this.setState({isCalled: true});
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  render() {
    return (
      <UU5.Forms.TimePicker
        id={"checkID"}
        label="Fill your name"
        value={this.state.value}
        feedback={this.state.feedback}
        message={this.state.message}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        onEnter={this.onEnterHandler}
        validateOnChange={true}
        onChange={this.onChangeHandler}
        onValidate={this.onValidateHandler}
        onChangeFeedback={this.onChangeFeedbackHandler}
        onClick={this.onClickHandler}
      />
    );
  }
});


const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Forms.TextInputMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Forms.InputMixin"
  ],
  props: {
    value: {
      values: ["10:30", "10:30 PM"]
    },
    iconOpen:  {
      values: ["mdi-calendar"]
    },
    iconClosed: {
      values: ["uu5-minus"]
    },
    format: {
      values: ["12", "24"]
    },
    seconds: {
      values: [true, false]
    },
    nanMessage: {
      values: ["Prosím zadejte validní čas."]
    },
    valueType: {
      values: ["string", "date", null]
    },
  },
  requiredProps: {
    //The component does not have any required props
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};

describe(`${TagName} props`, () => {
  TestTools.testProperties(TagName, CONFIG);
});


describe(`${TagName} props function -> InputMixin`, () => {

  it('onChange()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate('change', {target: {value: "12:00"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChange event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/12:00/);
    expect(wrapper.instance().state.message).toMatch(/Is valid./);
    expect(wrapper.instance().state.feedback).toMatch(/success/);
    expect(wrapper).toMatchSnapshot();
  });

  it('onValidate()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate('validate', {target: {value: "12:00"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onValidate event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/12:00/);
    expect(wrapper.instance().state.message).toMatch(/Is valid./);
    expect(wrapper.instance().state.feedback).toMatch(/success/);
    expect(wrapper).toMatchSnapshot();
  });

  it('onChangeFeedback()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate('changeFeedback', {target: {value: "12:00"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChangeFeedback event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/12:00/);
    expect(wrapper.instance().state.message).toMatch(/Is valid./);
    expect(wrapper.instance().state.feedback).toMatch(/success/);
    expect(wrapper).toMatchSnapshot();
  });

});


describe(`${TagName} props function -> Text.InputMixin`, () => {


  it('onFocus()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate('focus', {target: {value: "12:00"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onFocus event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onFocus event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/12:00/);
    expect(wrapper.instance().state.message).toMatch(/Is valid./);
    expect(wrapper.instance().state.feedback).toMatch(/success/);
    expect(wrapper).toMatchSnapshot();
  });

  it('onBlur()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate('blur', {target: {value: "12:00"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onBlur event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onBlur event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/12:00/);
    expect(wrapper.instance().state.message).toMatch(/Is valid./);
    expect(wrapper.instance().state.feedback).toMatch(/success/);
    expect(wrapper).toMatchSnapshot();
  });


  it('onEnter()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate('enter', {target: {value: "12:00"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onEnter event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onEnter event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/12:00/);
    expect(wrapper.instance().state.message).toMatch(/Is valid./);
    expect(wrapper.instance().state.feedback).toMatch(/success/);
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * You can not simulate events that do not start with it on. For example, onChange, onChangeFeedback.
   * Therefore, the validateonChange event is simulated here so that it is set to true, and event onValidate sets the message and feedback to error,
   * success if the component is valid. Valid component means that it is not empty and has the correct format.
   */

  it('validateOnChange() - input is invalid', () => {
    const wrapper = shallow(
      <UU5.Forms.TimePicker
        label="Start of event"
        validateOnChange
        id={"uuID01"}
        onValidate={opt => {
          let feedback;
          const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (pattern.test(opt.value)) {
            feedback = {
              feedback: 'success',
              message: 'Is valid.',
              value: opt.value
            };
          } else {
            feedback = {
              feedback: 'error',
              message: 'Not valid.',
              value: opt.value
            };
          }

          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Not valid.");
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper).toMatchSnapshot();
  });

  it('validateOnChange() - input is valid', () => {
    const wrapper = shallow(
      <UU5.Forms.TimePicker
        label="Start of event"
        id={"uuID02"}
        value={"12:00"}
        validateOnChange
        onValidate={opt => {
          let feedback;
          const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (pattern.test(opt.value)) {
            feedback = {
              feedback: 'success',
              message: 'Is valid.',
              value: opt.value
            };
          } else {
            feedback = {
              feedback: 'error',
              message: 'Not valid.',
              value: opt.value
            };
          }

          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.value).toMatch(/12:00/);
    expect(wrapper).toMatchSnapshot();
  });

});


describe(`${TagName} default props check`, () => {
  it(`${TagName}`, () => {
    const wrapper = shallow(
      <UU5.Forms.TimePicker
        id={"uuID"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().props.value).toBe("");
    expect(wrapper.instance().props.iconOpen).toMatch(/mdi-clock-outline/);
    expect(wrapper.instance().props.iconClosed).toMatch(/mdi-clock-outline/)
    expect(wrapper.instance().props.format).toBe("24")
    expect(wrapper.instance().props.nanMessage).toMatch(/Please insert a valid time./)
    expect(wrapper.instance().props.seconds).toBeFalsy();
    expect(wrapper.instance().props.valueType).toBeNull();
  });
});

describe(`${TagName} Mixins default values of props`, () => {

  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.TimePicker
        id={"uuID"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.inputAttrs).toBe(null);
    expect(wrapper.instance().props.size).toEqual("m");
    expect(wrapper.instance().props.readOnly).toBeFalsy();
    expect(wrapper.instance().props.feedback).toEqual("initial");
    expect(wrapper.instance().props.message).toBe(null);
    expect(wrapper.instance().props.label).toBe(null);
    expect(wrapper.instance().props.onChange).toBe(null);
    expect(wrapper.instance().props.onValidate).toBe(null);
    expect(wrapper.instance().props.onChangeFeedback).toBe(undefined);
    expect(wrapper.instance().props.inputColWidth).toEqual("xs12 s7");
    expect(wrapper.instance().props.labelColWidth).toEqual("xs12 s5");
  });

  it(`UU5.Forms.TextInputMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.TimePicker
        id={"uuID"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.placeholder).toBe(null);
    expect(wrapper.instance().props.required).toBeFalsy();
    expect(wrapper.instance().props.requiredMessage).toBe(null);
    expect(wrapper.instance().props.focusMessage).toBe(null);
    expect(wrapper.instance().props.patternMessage).toBe(null);
    expect(wrapper.instance().props.autocompleteItems).toBe(null);
    expect(wrapper.instance().props.onFocus).toBe(null);
    expect(wrapper.instance().props.onBlur).toBe(null);
    expect(wrapper.instance().props.onEnter).toBe(null);
    expect(wrapper.instance().props.validateOnChange).toBeFalsy();
  });


  it(`UU5.Commons.Base_Elementary_Pure_Color`, () => {
    const wrapper = shallow(
      <UU5.Forms.TimePicker
        id={"uuID"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    //Check UU5.Common.Elementary.Mixin default props
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().props.controlled).toBeTruthy;
    //Check UU5.Common.PureRender.Mixin default values
    expect(wrapper.instance().props.pureRender).toBeFalsy();
    //Check default values of props BaseMixin.
    expect(wrapper.instance().props.id).toEqual("uuID");
    expect(wrapper.instance().props.name).toBe(null);
    expect(wrapper.instance().props.tooltip).toBe(null);
    expect(wrapper.instance().props.className).toBe(null);
    expect(wrapper.instance().props.style).toBe(null);
    expect(wrapper.instance().props.mainAttrs).toBe(null);
    expect(wrapper.instance().props.parent).toBe(null);
    expect(wrapper.instance().props.ref_).toBe(null);
    expect(wrapper.instance().props.noIndex).toBeFalsy();
    //check default css class of colorSchemaMixin
    expect(wrapper.instance().props.colorSchema).toBe(null);
  });
});

