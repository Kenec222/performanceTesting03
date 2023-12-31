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

//@@viewOn:revision
// coded: Petr Bišof, 30.09.2020
// reviewed: Filip Janovský, 30.09.2020 - approved
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./forms-ns.js";
import TextInput from "./internal/text-input.js";
import TextInputMixin from "./mixins/text-input-mixin.js";
import DateTools from "./internal/date-tools.js";
import Context from "./form-context.js";
import withUserPreferences from "../common/user-preferences.js";
import withUserPreferencesDateAdapter from "./internal/with-user-preferences-date-adapter.js";

import "./calendar.less";
import "./date-picker.less";
//@@viewOff:imports

let DatePicker = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "DatePicker", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ScreenSizeMixin,
      TextInputMixin,
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("DatePicker"),
      classNames: {
        main: ns.css("datepicker"),
        open: ns.css("datepicker-open"),
        menu: ns.css("input-menu"),
        screenSizeBehaviour: ns.css("screen-size-behaviour"),
        popover: ns.css("datepicker-popover"),
      },
      defaults: {
        inputColWidth: "xs12 s4 m4 l3 xl3",
      },
      lsi: () => UU5.Environment.Lsi.Forms.message,
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      dateFrom: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      dateTo: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      iconOpen: UU5.PropTypes.string,
      iconClosed: UU5.PropTypes.string,
      format: UU5.PropTypes.string,
      country: UU5.PropTypes.string,
      nanMessage: UU5.PropTypes.any,
      beforeRangeMessage: UU5.PropTypes.any,
      afterRangeMessage: UU5.PropTypes.any,
      parseDate: UU5.PropTypes.func,
      disableBackdrop: UU5.PropTypes.bool,
      valueType: UU5.PropTypes.oneOf(["string", "date", "iso"]),
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
      hideFormatPlaceholder: UU5.PropTypes.bool,
      hideWeekNumber: UU5.PropTypes.bool,
      showTodayButton: UU5.PropTypes.bool,
      step: UU5.PropTypes.oneOf(["days", "months", "years"]),
      monthNameFormat: UU5.PropTypes.oneOf(["abbr", "roman"]),
      popoverLocation: UU5.PropTypes.oneOf(["local", "portal"]),
      weekStartDay: UU5.PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7]),
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        dateFrom: null,
        dateTo: null,
        iconOpen: "mdi-calendar",
        iconClosed: "mdi-calendar",
        format: null,
        country: null,
        nanMessage: {
          cs: "Prosím zadejte čas a datum ve správném formátu.",
          en: "Please insert a valid date and time.",
        },
        beforeRangeMessage: {
          cs: "Datum a čas jsou mimo rozsah.",
          en: "Date and time is out of range.",
        },
        afterRangeMessage: {
          cs: "Datum a čas jsou mimo rozsah.",
          en: "Date and time is out of range.",
        },
        parseDate: null,
        icon: "mdi-calendar",
        disableBackdrop: false,
        valueType: null,
        openToContent: "xs",
        hideFormatPlaceholder: false,
        hideWeekNumber: false,
        showTodayButton: false,
        step: "days",
        monthNameFormat: "roman",
        popoverLocation: "local", // "local" <=> backward-compatible behaviour
        weekStartDay: 1,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._formattingValues = {};
      this._setFormattingValues(this.props);
      return {};
    },

    UNSAFE_componentWillMount() {
      this._hasFocus = false;
      let value = this._getIncomingValue(this.props.value);
      value = this._getDateString(value) || value;

      value = this._getDateString(value);
      let validationResult = this._validateDate({ value });
      if (validationResult.feedback === "initial") {
        let customValidationResult = this._validateOnChange({ value, event: null, component: this });
        if (customValidationResult) {
          this._updateState(customValidationResult);
        } else {
          validationResult.feedback = this.props.feedback || validationResult.feedback;
          validationResult.message = this.props.message || validationResult.message;
          this._updateState(validationResult);
        }
      } else {
        this._updateState(validationResult);
      }

      return this;
    },

    componentDidMount() {
      UU5.Environment.EventListener.registerDateTime(this.getId(), this._change);
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        this._setFormattingValues(nextProps);
        let value = this._getIncomingValue(nextProps.value);
        value = this._hasInputFocus() && !(value instanceof Date) ? value : this._getDateString(value) || value;

        value = this._getDateString(value);
        let validationResult = this._validateDate({ value });
        if (validationResult.feedback === "initial") {
          let customValidationResult = this._validateOnChange({ value, event: null, component: this }, true);
          if (customValidationResult) {
            this._updateState(customValidationResult);
          } else {
            validationResult.feedback = nextProps.feedback || validationResult.feedback;
            validationResult.message = nextProps.message || validationResult.message;
            this._updateState(validationResult, true);
          }
        } else {
          this._updateState(validationResult, true);
        }
      }

      return this;
    },

    componentWillUnmount() {
      this._removeEvent();
      UU5.Environment.EventListener.unregisterDateTime(this.getId(), this._change);
    },

    componentDidUpdate(prevProps, prevState) {
      if (this.isOpen()) {
        if (
          (this.state.screenSize === "xs" && prevState.screenSize !== "xs") ||
          (this.state.screenSize !== "xs" && prevState.screenSize === "xs")
        ) {
          this._open();
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    toggle(setStateCallback) {
      this.setState((state) => {
        if (state.open) {
          this._removeEvent();
        } else {
          this._stopPropagation = true;
          this._addEvent();
        }
        return { open: !state.open };
      }, setStateCallback);
      return this;
    },

    parseDate(stringDate) {
      return this._parseDate(stringDate);
    },

    parseDateDefault(stringDate) {
      return UU5.Common.Tools.parseDate(stringDate, {
        format: this._formattingValues.format,
        country: this._formattingValues.country,
      });
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    setFeedback_(feedback, message, value, setStateCallback) {
      value = this._hasInputFocus() && !(value instanceof Date) ? value : this._getDateString(value) || value;
      this.setFeedbackDefault(feedback, message, value, setStateCallback);
    },

    setValue_(value, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";
      value = this._parseDate(value);
      value = this._hasInputFocus() && !(value instanceof Date) ? value : this._getDateString(value) || value;
      if (this._checkRequired({ value })) {
        let validationResult = this._validateDate({ value });
        if (validationResult.feedback === "initial" && !this._validateOnChange({ value }, false)) {
          _callCallback = false;
          this._updateState(validationResult, false, setStateCallback);
        }
      }

      if (_callCallback) {
        // function _validateOnChange always calls a provided callback, therefore
        // this is a workaround to secure that we call it only once and a setState callback
        this.setState({}, setStateCallback);
      }

      return this;
    },

    getValue_() {
      let date;

      if (this.props.valueType == "date") {
        if (this.state.value instanceof Date) {
          date = this.state.value;
        } else {
          date = this._parseDate(this.state.value);
        }
      } else if (this.props.valueType == "string") {
        date = this._getDateString(this.state.value);
      } else {
        if (this.state.value instanceof Date) {
          date = this.state.value;
        } else {
          date = this._parseDate(this.state.value);
        }
      }

      return this._getOutcomingValue(date);
    },

    onChangeDefault_(opt, setStateCallback) {
      let type = opt._data.type;
      this._onChangeDefault(opt, type == "picker", setStateCallback);
    },

    onBlurDefault_(opt) {
      let value = opt._data ? opt._data.value : opt.value;
      let formatedValue = this._getDateString(value);
      if (this._checkRequired({ value: formatedValue || value }) && !this.props.validateOnChange) {
        opt.value = this._getOutcomingValue(value);
        opt.required = this.props.required;
        let validationResult = this._validateDate(opt);
        if (validationResult.feedback === "initial") validationResult = this.getBlurFeedback(opt);
        validationResult = { feedback: "initial", message: null, ...validationResult };
        this._updateState({ ...validationResult, value });
      } else {
        this.setState({ value: formatedValue || value });
      }
    },

    onFocusDefault_(opt) {
      let result = this.getFocusFeedback(opt);

      result && this._updateState(result);
    },

    open_(setStateCallback) {
      this._addEvent();
      this.openDefault(() => this._open(setStateCallback));
    },

    close_(setStateCallback) {
      // remove event listeners in _close function
      this.closeDefault(() => this._close(false, setStateCallback));
    },
    //@@viewOff:overriding

    //@@viewOn:private
    // Used to hold current values of props/state which is used for formatting.
    // These values are used on various places and its value has to be always
    // updated (e.g. in functions called from willReceiveProps)
    _setFormattingValues(props) {
      let formattingKeys = [
        "format",
        "country",
        "step",
        "parseDate",
        "valueType",
        "dateFrom",
        "dateTo",
        "onChangeFeedback",
      ];

      for (let i = 0; i < formattingKeys.length; i++) {
        let key = formattingKeys[i];
        let value = props[key];
        if (key === "country" && !value) value = UU5.Common.Tools.getLanguage();
        this._formattingValues[key] = value;
      }
    },

    _getOutcomingValue(value) {
      if (value) {
        if (this._formattingValues.step === "years" || this._formattingValues.step === "months") {
          let dateObject = this._parseDate(value);
          value = DateTools.getShortenedValueDateString(dateObject, "-", this._formattingValues.step === "years");
        } else if (this._formattingValues.valueType === "date") {
          value = this._parseDate(value);
        } else if (this._formattingValues.valueType === "iso") {
          let dateObject = this._parseDate(value);
          value = DateTools.toISODateOnlyString(dateObject);
        } else {
          // value = value;
        }
      }

      return value;
    },

    _getIncomingValue(value) {
      if (value) {
        let dateObject;

        if (value instanceof Date) {
          dateObject = value;
        } else {
          dateObject = this._parseDate(value, this._formattingValues.format, this._formattingValues.country);
        }

        value = dateObject;
      }

      return value;
    },

    _getEventPath(e) {
      let path = [];
      let node = e.target;
      while (node != document.body && node != document.documentElement && node) {
        path.push(node);
        node = node.parentNode;
      }
      return path;
    },

    _findTarget(e) {
      let labelMatch = `[id="${this.getId()}"] label`;
      let inputMatch = `[id="${this.getId()}"] input`;
      let pickerMatch = `[id="${this.getId()}-popover"] .uu5-forms-input-menu`;
      let result = {
        component: false,
        input: false,
        label: false,
        picker: false,
      };
      let eventPath = this._getEventPath(e);
      eventPath.every((item) => {
        let functionType = item.matches ? "matches" : "msMatchesSelector";
        if (item[functionType]) {
          if (item[functionType](labelMatch)) {
            result.label = true;
            result.component = true;
          } else if (item[functionType](inputMatch)) {
            result.input = true;
            result.component = true;
          } else if (item[functionType](pickerMatch)) {
            result.picker = true;
            result.component = true;
          } else if (item === this._root) {
            result.component = true;
            return false;
          }
          return true;
        } else {
          return false;
        }
      });

      return result;
    },

    _addKeyEvents() {
      let handleKeyDown = (e) => {
        if (e.which === 13) {
          // enter
          e.preventDefault();
        } else if (e.which === 40) {
          // bottom
          e.preventDefault();
        } else if (e.which === 27) {
          // esc
          e.preventDefault();
        }
      };

      let handleKeyUp = (e) => {
        let focusResult = this._findTarget(e);
        let doBlur = !focusResult.component;
        let opt = { value: this.state.value, event: e, component: this };
        if (e.which === 13) {
          // enter
          if (!this.isOpen()) {
            this.open();
          } else {
            this._close(true, () => this.focus());
          }
        } else if (e.which === 40) {
          // bottom
          e.preventDefault();
          if (!this.isOpen()) {
            this.open();
          }
        } else if (e.which === 9) {
          // tab
          if (doBlur) {
            if (this.isOpen()) {
              this._close(false, () => this._onBlur(opt));
            } else {
              this._onBlur(opt);
            }
          }
        } else if (e.which === 27) {
          // esc
          if (this.isOpen()) {
            this._close(true, () => this.focus());
          }
        }
      };

      UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), (e) => handleKeyDown(e));
      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), (e) => handleKeyUp(e));
    },

    _removeKeyEvents() {
      UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
    },

    _handleClick(e) {
      // This function can be called twice if clicking inside the component but it doesnt do anything in that case
      let clickData = this._findTarget(e);
      let canClose = !clickData.picker && this.isOpen();
      let canBlur = !clickData.picker && !clickData.input;
      let opt = { value: this.state.value, event: e, component: this };

      if (canClose) {
        // checked if clicked into component's input
        if (UU5.Common.DOM.findNode(this.getInput()).contains(e.target)) {
          // if is clicked into input we dont want to close popover
          //Prevent double handle of click by handleClick method otherwise this click closes and reopens popover
          e.stopPropagation();
        } else if (!this.props.disableBackdrop) {
          this._close(!canBlur, canBlur ? () => this._onBlur(opt) : undefined);
        } else if (canBlur) {
          this._onBlur(opt);
        }
      } else if (canBlur) {
        this._onBlur(opt);
      }
    },

    _handleFocus(e) {
      let opt = { value: this.state.value, event: e, component: this };
      this._onFocus(opt);
    },

    _addEvent() {
      window.addEventListener("click", this._handleClick, true);
    },

    _removeEvent() {
      window.removeEventListener("click", this._handleClick, true);
    },

    _change(opt) {
      this._onChangeFormat(opt);
    },

    _onChangeFormat(opt, setStateCallback) {
      let format = opt.format === undefined ? this._formattingValues.format : opt.format;
      let country =
        opt.country === undefined
          ? this._formattingValues.country
          : opt.country
          ? opt.country.toLowerCase()
          : opt.country;
      let dateValue = this._parseDate(this.state.value); // create date object with previous formatting settings
      this._formattingValues.format = format;
      this._formattingValues.country = country;
      let value = this._getDateString(dateValue);
      this._updateState({ value }, false, setStateCallback);
    },

    _onOpen(setStateCallback) {
      if (this._popover) {
        this._popover.open(
          {
            onClose: this._onClose,
            aroundElement: this._textInput.findDOMNode(),
            position: "bottom",
            offset: this._shouldOpenToContent() ? 0 : 4,
            preventPositioning: this._shouldOpenToContent(),
          },
          setStateCallback
        );
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onClose(setStateCallback) {
      if (this._popover) {
        this._popover.close(setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _close(persistListeners, setStateCallback) {
      if (!persistListeners) this._removeEvent();
      this.closeDefault(() => this._onClose(setStateCallback));
    },

    _open(setStateCallback) {
      this._addEvent();
      this.openDefault(() => this._onOpen(setStateCallback));
    },

    _shouldOpenToContent() {
      let result = false;

      if (typeof this.props.openToContent === "string") {
        let screenSize = this.getScreenSize();
        this.props.openToContent
          .trim()
          .split(" ")
          .some((size) => {
            if (screenSize == size) {
              result = true;
              return true;
            } else {
              return false;
            }
          });
      } else if (typeof this.props.openToContent === "boolean") {
        result = this.props.openToContent;
      }

      return result;
    },

    _updateState(newState, preventOnChangeFeedback, setStateCallback) {
      if (newState.value !== undefined) {
        if (newState.value === null) {
          newState.value = "";
        } else if (newState.value instanceof Date) {
          newState.value = this._getDateString(newState.value);
        }
      } else {
        newState.value = this.state.value;
      }

      if (newState.message === undefined) {
        newState.message = this.state.message || null;
      }

      if (
        !preventOnChangeFeedback &&
        "feedback" in newState &&
        this.state.feedback !== newState.feedback &&
        typeof this._formattingValues.onChangeFeedback === "function"
      ) {
        this._formattingValues.onChangeFeedback({
          feedback: newState.feedback,
          message: newState.message,
          value: this._getOutcomingValue(newState.value),
          component: this,
        });
      }

      this.setState(newState, setStateCallback);
    },

    _onChange(e) {
      let opt = {
        value: e.target.value,
        event: e,
        component: this,
        required: this.props.required,
        _data: { type: "input", required: this.props.required, value: e.target.value },
      };
      let date = this._parseDate(opt.value);
      let formatedDate = date ? this._getDateString(date) : null;

      if (!opt.value || formatedDate) {
        if (!this.isComputedDisabled() && !this.isReadOnly()) {
          let result = this.getChangeFeedback(opt);
          opt._data.result = result;
          if (this.props.valueType == "date") {
            opt.value = date;
          }
          opt.value = this._getOutcomingValue(opt.value);
          if (!this._hasFocus) this._onFocus(opt); // make sure that the component knows that it has focus
          if (typeof this.props.onChange === "function") {
            this.props.onChange(opt);
          } else {
            this.onChangeDefault(opt);
          }
        }
      } else {
        if (!this._hasFocus) {
          this._onFocus(opt); // make sure that the component knows that it has focus
          opt = { ...opt, value: e.target.value };
        }
        this._updateState({ value: opt.value });
      }
      return this;
    },

    _onChangeDefault(opt, closeOnChange, setStateCallback) {
      let value = opt._data ? opt._data.value : opt.value;
      let _callCallback = typeof setStateCallback === "function";
      let callback = () => {
        if (closeOnChange) {
          this._onBlur(opt);
          if (opt._data.setToday !== true) {
            this.close(setStateCallback);
          }
        } else if (typeof setStateCallback === "function") {
          setStateCallback();
        }
      };

      if (this.props.validateOnChange) {
        opt = { ...opt, value: opt._data.value };
        if (this._checkRequired(opt)) {
          let validationResult = this._validateDate(opt);
          if (validationResult.feedback === "initial" && !this._validateOnChange(opt)) {
            _callCallback = false;
            this._updateState(validationResult, false, callback);
          }
        }
      } else {
        if (value) {
          if (this._checkRequired({ value })) {
            opt.required = this.props.required;
            opt = {
              ...opt,
              required: this.props.required,
              value,
              feedback: this.getFeedback(),
              message: this.getMessage(),
            };
            let result = this.getChangeFeedback(opt);
            _callCallback = false;
            this._updateState(result, closeOnChange, callback);
          }
        } else {
          _callCallback = false;
          this.setState({ value }, callback);
        }
      }

      if (_callCallback) {
        callback();
      }
    },

    _onFocus(opt) {
      if (!this._hasFocus) {
        this._addKeyEvents();
        this._hasFocus = true;

        if (opt._data) {
          opt._data.value = opt.value;
          opt.value = this._getOutcomingValue(opt.value);
        } else {
          opt._data = { value: opt.value };
          opt.value = this._getOutcomingValue(opt.value);
        }

        if (!this.isReadOnly() && !this.isComputedDisabled()) {
          this._addEvent();
          if (typeof this.props.onFocus === "function") {
            this.props.onFocus(opt);
          } else {
            this.onFocusDefault(opt);
          }
        }
      }
    },

    _onBlur(opt) {
      if (this._hasFocus) {
        this._removeKeyEvents();
        this._hasFocus = false;

        if (opt._data) {
          opt._data.value = opt._data.value || opt.value;
          opt.value = this._getOutcomingValue(opt.value);
        } else {
          opt._data = { value: opt.value };
          opt.value = this._getOutcomingValue(opt.value);
        }

        if (typeof this.props.onBlur === "function") {
          this.props.onBlur(opt);
        } else {
          this.onBlurDefault(opt);
        }
      }
    },

    _hasInputFocus() {
      let result = false;

      if (this._textInput) {
        result = this._textInput.hasFocus();
      }

      return result;
    },

    _getDate(date) {
      if (typeof date === "string") {
        date = this._parseDate(date);
      }
      return date;
    },

    _validateDate(opt) {
      let result = { ...opt };
      let date = this._parseDate(opt.value ? opt.value : this.state.value);
      result.feedback = result.feedback || "initial";
      result.message = result.message || null;

      if (opt.value && !date) {
        result.feedback = "error";
        result.message = this.props.nanMessage;
      }

      if (date) {
        let dateFrom = this._getDateFrom(result.dateFrom);
        let dateTo = this._getDateTo(result.dateTo);
        if (dateFrom && date < dateFrom) {
          result.feedback = "error";
          result.message = this.props.beforeRangeMessage;
        } else if (dateTo && date > dateTo) {
          result.feedback = "error";
          result.message = this.props.afterRangeMessage;
        } else {
          result.feedback = result.feedback || "initial";
          result.message = result.message || null;
        }
      }

      return result;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";
      let result;

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value, ["", null, undefined])) {
        opt.component = this;
        opt.required = this.props.required;
        opt.value = this._getOutcomingValue(opt.value);

        result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result && typeof result === "object") {
          if (result.value) {
            result.value = this._getDateString(result.value);
          }
          if (result.feedback) {
            _callCallback = false;
            this._updateState(result, false, setStateCallback);
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return result;
    },

    _getFeedbackIcon() {
      return this.isOpen() ? this.props.iconOpen : this.props.iconClosed;
    },

    _onCalendarChange(opt) {
      let date = this._getDateString(opt.value);
      let setToday = opt._data.setToday ? { setToday: true } : null;
      opt = {
        value: opt.value,
        event: opt.event,
        component: this,
        _data: { type: "picker", value: date, ...setToday },
      };

      if (this.props.valueType === null || this.props.valueType == "string") {
        opt.value = date;
      }
      opt.value = this._getOutcomingValue(opt.value);

      if (!this._hasValueChanged(this.state.value, date, ["", null, undefined])) {
        this.setState({ open: false });
      } else {
        if (typeof this.props.onChange === "function") {
          this.setState({ open: false }, () => this.props.onChange(opt));
        } else {
          this.onChangeDefault(opt);
        }
      }
      return this;
    },

    _getDateFrom() {
      let dateFrom;
      if (this._formattingValues.dateFrom) {
        if (typeof this._formattingValues.dateFrom === "string") {
          dateFrom = this._parseDate(this._formattingValues.dateFrom);
        } else if (this._formattingValues.dateFrom instanceof Date) {
          dateFrom = this._formattingValues.dateFrom;
        }
      }
      return dateFrom;
    },

    _getDateTo() {
      let dateTo;
      if (this._formattingValues.dateTo) {
        if (typeof this._formattingValues.dateTo === "string") {
          dateTo = this._parseDate(this._formattingValues.dateTo);
        } else if (this._formattingValues.dateTo instanceof Date) {
          dateTo = this._formattingValues.dateTo;
        }
      }
      return dateTo;
    },

    _getCalendarProps() {
      let date = this._parseDate(this.state.value);

      return {
        className: this.getClassName().menu,
        value: date,
        dateFrom: this._getDateFrom(),
        dateTo: this._getDateTo(),
        hidden: !this.isOpen(),
        hideWeekNumber: this.props.hideWeekNumber,
        onChange: this._onCalendarChange,
        colorSchema: this.getColorSchema(),
        showTodayButton: this.props.showTodayButton,
        step: this.props.step,
        monthNameFormat: this.props.monthNameFormat,
        weekStartDay: this.props.weekStartDay,
      };
    },

    _getDateString(value) {
      if (typeof value === "string") {
        // Value has to be parsed to date object so that the getDateString function can return it in a correct format as a string
        value = this._parseDate(value);
      }

      let isoDateOnlyString = value instanceof Date ? DateTools.toISODateOnlyString(value) : value;
      return UU5.Common.Tools.getDateString(isoDateOnlyString, {
        format: this._formattingValues.format,
        country: this._formattingValues.country,
      });
    },

    _parseDate(dateString) {
      let date = null;

      if (this._formattingValues.parseDate && typeof this._formattingValues.parseDate === "function") {
        date = this._formattingValues.parseDate(dateString);
      } else {
        date = this._parseDateDefault(dateString);
      }

      return date;
    },

    _parseDateDefault(stringDate) {
      return UU5.Common.Tools.parseDate(stringDate, {
        format: this._formattingValues.format,
        country: this._formattingValues.country,
      });
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();
      attrs.id = this.getId();

      if (this.isOpen()) {
        attrs.className += " " + this.getClassName().open;
      }

      if (this._shouldOpenToContent()) {
        attrs.className += " " + this.getClassName().screenSizeBehaviour;
      }

      if (!this.isReadOnly() && !this.isComputedDisabled()) {
        let allowOpening = true;
        let handleMobileClick = (e) => {
          if (this.isOpen()) {
            e.target.focus();
            this.close();
          } else {
            document.activeElement.blur();
            e.target.blur();
          }

          UU5.Common.Tools.scrollToTarget(
            this.getId() + "-input",
            false,
            UU5.Environment._fixedOffset + 20,
            this._findScrollElement(this._root)
          );
        };

        let handleClick = (e) => {
          let clickData = this._findTarget(e.nativeEvent);
          if (this._shouldOpenToContent() && clickData.input) {
            handleMobileClick(e);
          }
          let opt = { value: this.state.value, event: e, component: this };
          if (clickData.input) {
            e.preventDefault();
            if (allowOpening && !this.isOpen()) {
              this.open(() => this._onFocus(opt));
            } else if (!this.isOpen()) {
              this._onFocus(opt);
            } else if (this.props.disableBackdrop) {
              this.close();
            }
            allowOpening = true;
          } else if (clickData.label) {
            allowOpening = false;
          }
        };

        attrs.onClick = (e) => {
          handleClick(e);
        };
      }

      return attrs;
    },

    _getPlaceholder() {
      let format = this._formattingValues.format || UU5.Environment.dateTimeFormat[this._formattingValues.country];
      format && (format = format.replace(/Y+/, "YYYY").replace(/y+/, "yy"));
      let placeholder;
      if (this.props.placeholder && format && !this.props.hideFormatPlaceholder) {
        placeholder = this.props.placeholder + " - " + format;
      } else if (format && !this.props.hideFormatPlaceholder) {
        placeholder = format;
      } else {
        placeholder = this.props.placeholder;
      }
      return placeholder;
    },

    _getPopoverProps() {
      let props = {};

      props.ref_ = (ref) => (this._popover = ref);
      props.forceRender = true;
      props.disableBackdrop = true;
      props.shown = this.isOpen();
      props.location = !this._shouldOpenToContent() ? this.props.popoverLocation : "local";
      props.id = this.getId() + "-popover";
      props.className = this.getClassName("popover");
      if (this.props.popoverLocation === "portal") {
        props.className += " " + this.getClassName("input", "UU5.Forms.InputMixin") + this.props.size;
      }

      return props;
    },

    _getInputValue() {
      let value = this.state.value;

      if (this.props.step === "months" || this.props.step === "years") {
        value = this._parseDate(value);
        if (value) {
          value = DateTools.getShortenedInputDateString(value, "/", this.props.step === "years");
        }
      }

      return value || this.state.value;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      let inputAttrs = this.props.inputAttrs;
      inputAttrs = UU5.Common.Tools.merge({ autoComplete: "off" }, inputAttrs);
      inputAttrs.className === "" ? delete inputAttrs.className : null;

      return (
        <div {...this._getMainAttrs()} ref={(comp) => (this._root = comp)}>
          {this.getLabel(inputId)}
          {this.getInputWrapper([
            <TextInput
              id={inputId}
              name={this.props.name || inputId}
              value={this._getInputValue()}
              placeholder={this._getPlaceholder()}
              type="text"
              onChange={this._onChange}
              onFocus={!this.isReadOnly() && !this.isComputedDisabled() ? this._handleFocus : null}
              onKeyDown={this.onKeyDown}
              mainAttrs={inputAttrs}
              disabled={this.isComputedDisabled()}
              readonly={this.isReadOnly()}
              icon={this._getFeedbackIcon()}
              iconClickable={false}
              loading={this.isLoading()}
              ref_={(item) => (this._textInput = item)}
              feedback={this.getFeedback()}
              borderRadius={this.props.borderRadius}
              elevation={this.props.elevation}
              bgStyle={this.props.bgStyle}
              inputWidth={this._getInputWidth()}
              colorSchema={this.props.colorSchema}
              size={this.props.size}
            />,
            <UU5.Bricks.Popover {...this._getPopoverProps()}>
              {this.isOpen() ? <UU5.Bricks.Calendar {...this._getCalendarProps()} /> : null}
            </UU5.Bricks.Popover>,
          ])}
        </div>
      );
    },
    //@@viewOff:render
  })
);

DatePicker = withUserPreferencesDateAdapter(DatePicker);
DatePicker = withUserPreferences(DatePicker, { weekStartDay: "weekStartDay", _dateFormat: "shortDateFormat" });
const Datepicker = DatePicker;

export { DatePicker, Datepicker };
export default DatePicker;
