'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('events');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventAsPromised = function (_EventEmitter) {
  _inherits(EventAsPromised, _EventEmitter);

  function EventAsPromised() {
    _classCallCheck(this, EventAsPromised);

    return _possibleConstructorReturn(this, (EventAsPromised.__proto__ || Object.getPrototypeOf(EventAsPromised)).call(this));
  }

  _createClass(EventAsPromised, [{
    key: 'getEventLength',
    value: function getEventLength(name) {
      if (this._events[name] && !this._events[name][0]) return 1;
      if (this._events[name]) return this._events[name].length;
      return 0;
    }
  }, {
    key: 'on',
    value: function on(name, fn) {
      return _get(EventAsPromised.prototype.__proto__ || Object.getPrototypeOf(EventAsPromised.prototype), 'on', this).call(this, name, function (_ref) {
        var args = _ref.args,
            internalEvent = _ref.internalEvent;

        return Promise.resolve(fn.apply(undefined, _toConsumableArray(args))).then(function (result) {
          return internalEvent.emit(`${name}_internal`, result);
        }).catch(function (err) {
          return internalEvent.emit(`${name}_internal_error`, err);
        });
      });
    }
  }, {
    key: 'emit',
    value: function emit() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var name = args[0];
      args.shift();
      var internalEvent = new _events.EventEmitter();
      return new Promise(function (resolve, reject) {
        var data = [];
        var awaiting = _this2.getEventLength(name);
        if (!awaiting) return resolve([]);
        _get(EventAsPromised.prototype.__proto__ || Object.getPrototypeOf(EventAsPromised.prototype), 'emit', _this2).call(_this2, name, { args, internalEvent });
        internalEvent.on(`${name}_internal`, function (result) {
          data.push(result);
          if (data.length === awaiting) {
            return resolve(data);
          }
        });
        internalEvent.on(`${name}_internal_error`, reject);
      });
    }
  }]);

  return EventAsPromised;
}(_events.EventEmitter);

exports.default = EventAsPromised;
module.exports = exports['default'];