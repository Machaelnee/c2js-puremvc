(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * Created by zxh on 15/10/9.
 */
"use strict"

var puremvc = require('puremvc').puremvc;
var StartupCommand = require('./controller/command/StartupCommand.js');

var RunGameCommand = require('./controller/command/RunGameCommand.js');

var AppFacade = puremvc.define(
    // CLASS INFO
    {
        name: 'AppFacade',
        parent: puremvc.Facade,
        constructor: function (multitonKey) {
            puremvc.Facade.call(this, multitonKey);
        }
    },

    // INSTANCE MEMBERS
    {
        initializeController: function () {
            puremvc.Facade.prototype.initializeController.call(this);
            this.registerCommand(AppFacade.STARTUP, StartupCommand);
            this.registerCommand(Command.RUN_GAME, RunGameCommand);
        },

        initializeModel: function () {
            puremvc.Facade.prototype.initializeModel.call(this);
        },

        initializeView: function () {
            puremvc.Facade.prototype.initializeView.call(this);
        },

        startup: function () {
            this.sendNotification(AppFacade.STARTUP);
        }
    },

    // STATIC MEMBERS
    {
        getInstance: function(multitonKey) {
            var instanceMap = puremvc.Facade.instanceMap;
            var instance = instanceMap[multitonKey];
            if (instance) {
                return instance;
            }
            return instanceMap[multitonKey] = new AppFacade(multitonKey);
        },
        NAME: 'AppFacade',
        STARTUP: 'StartUp'
    }
);

module.exports = AppFacade;

global.g_app = AppFacade;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./controller/command/RunGameCommand.js":6,"./controller/command/StartupCommand.js":7,"puremvc":24}],2:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */

require('./resource.js');
require('./define/Message.js');
require('./define/Command.js');

(function() {
    cc.game.onStart = function(){

        cc.log("cc.game.onStart--1");
        cc.view.enableRetina(false);
        cc.view.adjustViewPort(true);
        cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.FIXED_WIDTH);
        cc.view.resizeWithBrowserSize(true);

        var AppFacade = require('./AppFacade.js');
        var key = 'SLG_WOW';
        AppFacade.getInstance(key).startup();
    };
    cc.game.run();
})();
},{"./AppFacade.js":1,"./define/Command.js":8,"./define/Message.js":9,"./resource.js":13}],3:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */

var puremvc = require('puremvc').puremvc;
var LogoMediator = require('../../view/mediator/LogoMediator.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepControllerCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        execute: function (notification) {
            cc.log('PrepControllerCommand execute');
            this.facade.sendNotification(Messages.RUN_SCENE, {name:LogoMediator.NAME});
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepControllerCommand'
    }
);

},{"../../view/mediator/LogoMediator.js":21,"puremvc":24}],4:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */

var puremvc = require('puremvc').puremvc;
var GameProxy = require('../../model/proxy/GameProxy.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepModelCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        execute: function (notification) {
            //在此获取数据,注册Proxy
            this.facade.registerProxy(new GameProxy());
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepModelCommand'
    }
);


},{"../../model/proxy/GameProxy.js":12,"puremvc":24}],5:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */

var puremvc = require('puremvc').puremvc;
var SceneMediator = require('../../view/mediator/SceneMediator.js');
var LoginMediator = require('../../view/mediator/LogoMediator.js');
var CityMediator = require('../../view/mediator/CityMediator.js');


module.exports = puremvc.define (
    // CLASS INFO
    {
        name: 'controller.command.PrepViewCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        execute: function (notification) {
            cc.log('PrepViewCommand execute');
            this.facade.registerMediator(new SceneMediator());
            this.facade.registerMediator(new LoginMediator());
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepViewCommand'
    }
);
},{"../../view/mediator/CityMediator.js":18,"../../view/mediator/LogoMediator.js":21,"../../view/mediator/SceneMediator.js":22,"puremvc":24}],6:[function(require,module,exports){
/**
 * Created by zxh on 15/10/16.
 */
/**
 * Created by zxh on 15/10/9.
 */
"use strict";

var puremvc = require('puremvc').puremvc;
var GameProxy = require('../../model/proxy/GameProxy.js');
var GameMediator = require('../../view/mediator/GameMediator.js');
var CityMediator = require('../../view/mediator/CityMediator.js');
var CountryMediator = require('../../view/mediator/CountryMediator.js');

module.exports = puremvc.define(
    // CLASS INFO
    {
        name: 'controller.command.InitGame',
        parent: puremvc.SimpleCommand
    },

    // INSTANCE MEMBERS
    {
        execute: function() {
            //注册数据代理
            //this.facade.registerProxy(new GameProxy());
            //注册游戏初始必须的中介
            var gameMediator = new GameMediator();
            this.facade.registerMediator(gameMediator);
            this.facade.registerMediator(new CityMediator());
            this.facade.registerMediator(new CountryMediator());

            gameMediator.switchLayer();
        }
    },

    // STATIC MEMBERS
    {
        NAME: Command.RUN_GAME
    }

);

},{"../../model/proxy/GameProxy.js":12,"../../view/mediator/CityMediator.js":18,"../../view/mediator/CountryMediator.js":19,"../../view/mediator/GameMediator.js":20,"puremvc":24}],7:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */
"use strict";

var puremvc = require('puremvc').puremvc;
var PrepModelCommand = require('./PrepModelCommand.js');
var PrepViewCommand = require('./PrepViewCommand.js');
var PrepControllerCommand = require('./PrepControllerCommand.js');

module.exports = puremvc.define(
    // CLASS INFO
    {
        name: 'controller.command.StartupCommand',
        parent: puremvc.MacroCommand
    },

    // INSTANCE MEMBERS
    {
        initializeMacroCommand: function() {
            this.addSubCommand(PrepModelCommand);
            this.addSubCommand(PrepViewCommand);
            this.addSubCommand(PrepControllerCommand);
        }
    },

    // STATIC MEMBERS
    {
        NAME: 'StartupCommand'
    }

);

},{"./PrepControllerCommand.js":3,"./PrepModelCommand.js":4,"./PrepViewCommand.js":5,"puremvc":24}],8:[function(require,module,exports){
(function (global){
/**
 * Created by zxh on 15/10/21.
 */

var Command = {
    RUN_GAME: 1000,
};

global.Command = Command;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
(function (global){
/**
 * Created by zxh on 15/10/13.
 */


var Messages  = {
    RUN_SCENE: 1,        //
    SHOW_VIEW: 2,        //{name:}
    ENTER_CITY: 3,       //进入主城
    GAME_DATA_CHANGE:5,
    ENTER_COUNTRY: 6,     //进入国家
    LOAD_COMPLETE: 7
};


global.Messages = Messages;





}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
/**
 * Created by zxh on 15/10/10.
 */

var sz = sz || {};

sz.UILoader = cc.Class.extend({
    _eventPrefix: '_on',
    _memberPrefix: '_',
    _widgetEvents: [],
    /**
     * 加载UI文件
     * @param target将  jsonFile加载出的节点绑定到的目标
     * @param jsonFile  cocostudio UI编辑器生成的json文件
     */
    widgetFromJsonFile: function(target, jsonFile, options) {
        cc.assert(target && jsonFile);
        if (!options) {
            options = {};
        }

        this._eventPrefix  =  options.eventPrefix || sz.UILoader.DEFAULT_EVENT_PREFIX;
        this._memberPrefix = options.memberPrefix || sz.UILoader.DEFAULT_MEMBER_PREFIX;
        //绑定自身
        if (target instanceof cc.Node) {
            this._bindMenbers(target, target);
        }

        //绑定jsonFile
        if (!jsonFile) {
            return;
        }

        var json = cc.loader.getRes(jsonFile);
        var version = json.version || json.Version;
        var rootNode;
        if (version[0] == 1) {
            rootNode = ccs.uiReader.widgetFromJsonFile(jsonFile);
        } else if (version[0] == 2){
            rootNode = ccs.csLoader.createNode(jsonFile);
        }

        if (!rootNode) {
            cc.log("Load json file failed");
        }

        if (rootNode.setTouchEnabled) {
            rootNode.setTouchEnabled(false);
        }

        target.rootNode = rootNode;
        rootNode.setName("rootNode");
        if (target instanceof cc.Node) {
            target.addChild(rootNode);
        }

        this._bindMenbers(rootNode, target);
        return rootNode;
    },

    bindNode: function(node, target) {
        if (!target) {
            return false;
        }
        //this._eventPrefix  =  options.eventPrefix || sz.UILoader.DEFAULT_EVENT_PREFIX;
        //this._memberPrefix = options.memberPrefix || sz.UILoader.DEFAULT_MEMBER_PREFIX;
        var nodeName = node.getName();

        var isMatch = nodeName.substr(0, this._memberPrefix.length) === this._memberPrefix;
        //控件名存在，绑定到target上
        if (isMatch) {
            if (!target[nodeName]) {
                target[nodeName] = node;
            }
            this._registerWidgetEvent(target, node);
        }else if (node.setTouchEnabled){
            node.setTouchEnabled(false);
        }

        if (target.onLoaderBinded) {
            target.onLoaderBinded(node, isMatch);
        }
        return isMatch;
    },
    /**
     * 递归对rootWidget下的子节点进行成员绑定
     * @param rootWidget
     * @param target
     * @private
     */
    _bindMenbers: function(rootWidget, target) {
        var widgetName,
            children = rootWidget.getChildren();

        var self = this;
        children.forEach(function(widget) {
            widgetName = widget.getName();

            //不绑定rootNode节点，因为已经绑定过了
            if (widgetName === "rootNode") {
                return;
            }

            var isMatch = widgetName.substr(0, self._memberPrefix.length) === self._memberPrefix;
            //控件名存在，绑定到target上
            //var prefix = widgetName.substr(0, self._memberPrefix.length);
            if (isMatch) {
                target[widgetName] = widget;
                self._registerWidgetEvent(target, widget);
            }else if (widget.setTouchEnabled){
                widget.setTouchEnabled(false);
            }

            if (target.onLoaderBinded && target !== rootWidget) {
                target.onLoaderBinded(widget, isMatch);
            }

            //绑定子控件,可以实现: a._b._c._d 访问子控件
            if (!rootWidget[widgetName]) {
                rootWidget[widgetName] = widget;
            }

            //如果还有子节点，递归进去
            if (widget.getChildrenCount()) {
                self._bindMenbers(widget, target);
            }

        });
    },

    /**
     * 获取控件事件
     * @param widget
     * @returns {*}
     */
    _getWidgetEvent: function(widget) {
        var bindWidgetEvent = null;
        var events = sz.UILoader.widgetEvents;
        for (var i = 0; i < events.length; i++) {
            bindWidgetEvent = events[i];
            if (bindWidgetEvent && widget instanceof bindWidgetEvent.widgetType) {
                break;
            }
        }
        return bindWidgetEvent;
    },

    /**
     * 注册控件事件
     * @param target
     * @param widget
     * @private
     */
    _registerWidgetEvent: function(target, widget) {

        //截取前缀,首字母大定
        var eventName = this.getWidgetEventName(widget, "Event");
        var isBindEvent = false;
        if (target[eventName]) {
            isBindEvent = true;
        } else {
            //取事控件件名
            var widgetEvent = this._getWidgetEvent(widget);
            if (!widgetEvent) {
                sz.uiloader.registerTouchEvent(widget, target);
                return;
            }
            //检查事件函数,生成事件名数组
            var eventNameArray = [];
            for (var i = 0; i < widgetEvent.events.length; i++) {
                eventName = this.getWidgetEventName(widget, widgetEvent.events[i]);//newName + widgetEvent.events[i];
                eventNameArray.push(eventName);
                if (typeof target[eventName] === "function") {
                    isBindEvent = true;
                }
            }
        }

        //事件响应函数
        var self = this;
        var eventFunc = function(sender, type) {
            var callBack;
            var funcName;
            if (eventNameArray) {
                funcName = eventNameArray[type];
                callBack = target[funcName];
            } else {
                callBack = target[eventName];
            }

            if (callBack && self._widgetEvents) {
                if (self.execWidgetEvent(sender, type) === false) {
                    return;
                }
            }

            //开始
            if (type === ccui.Widget.TOUCH_BEGAN) {
                var time = sz.UILoader.DEFAULT_TOUCH_LONG_TIME;
                if (callBack) {
                    time = callBack.call(target, sender, type);
                }

                //检测长按事件
                funcName = sz.uiloader.getWidgetEventName(sender, sz.UILoader.TOUCH_LONG_EVENT);
                var touchLong = target[funcName];

                if (touchLong) {
                    time = time || sz.UILoader.DEFAULT_TOUCH_LONG_TIME;
                    if (time >= 0 && time < 5) {
                        target.scheduleOnce(touchLong, time);
                        target.__touchLong = true;
                    }

                }
                return;
            }

            //TouchMoved时解除长按事件
            if (type === ccui.Widget.TOUCH_MOVED) {
                funcName = sz.uiloader.getWidgetEventName(sender, sz.UILoader.TOUCH_LONG_EVENT);
                var scheduleFunc = target[funcName];
                if (scheduleFunc && target.__touchLong) {
                    var pt1 = sender.getTouchBeganPosition();
                    var pt2 = sender.getTouchMovePosition();
                    if (Math.abs(pt1.x - pt2.x) > 15 || Math.abs(pt1.y - pt2.y) > 15) {
                        target.unschedule(scheduleFunc);
                        cc.log("TouchMoved: 解除长按事件");
                        target.__touchLong = false;
                    }
                }

            }

            //长按解除
            if (type === ccui.Widget.TOUCH_ENDED || type === ccui.Widget.TOUCH_CANCELED) {
                funcName = sz.uiloader.getWidgetEventName(sender, sz.UILoader.TOUCH_LONG_EVENT);
                var scheduleFunc = target[funcName];
                if (scheduleFunc && target.__touchLong) {
                    //target._touchLong = false;
                    cc.log("TouchEned: 解除长按事件");
                    target.unschedule(scheduleFunc);
                }
            }

            //事件回调
            if (callBack) {
                callBack.call(target, sender, type);
            }
        };

        //注册事件监听
        if (isBindEvent) {
            widget.setTouchEnabled(true);
            if (widget.addEventListener) {
                widget.addEventListener(eventFunc, target);
            } else {
                widget.addTouchEventListener(eventFunc, target);
            }
        }
    },

    execWidgetEvent: function(sender, type) {
        var ret;
        this._widgetEvents.forEach(function(item) {
            if(item.widgetEvent.call(item.target, sender, type) === false){
                ret = false;
            }
        },this);

        return ret;
    },

    /**
     * 控件事件捕获, 可以由子类重写此函数
     * @param sender
     * @param type
     * @private
     */
    //_onWidgetEvent: function(sender, type) {
    //
    //}

    //_onNodeEvent: function(sender, type) {
    //
    //}

    /**
     * @param widget
     * @param event
     * @returns {string}
     */
    getWidgetEventName: function(widget, event) {
        cc.assert(widget);
        var name = widget.getName();
        if (name) {
            name = name[this._memberPrefix.length].toUpperCase() + name.slice(this._memberPrefix.length + 1);
        }
        if (event) {
            return this._eventPrefix + name + event;
        } else {
            return this._eventPrefix + name;
        }
    },

    registerWidgetEvent: function(target, widgetEvent) {
        if (typeof widgetEvent === "function") {
            this._widgetEvents.push({target: target ,widgetEvent: widgetEvent});
        }
    },

    removeWidgetEvent: function(target) {
        for (var i = 0; i < this._widgetEvents.length; i++) {
            if (this._widgetEvents[i].target === target) {
                this._widgetEvents.splice(i,1);
                break;
            }
        }
    }
});

//事件前缀
sz.UILoader.DEFAULT_EVENT_PREFIX = "_on";
//成员前缀
sz.UILoader.DEFAULT_MEMBER_PREFIX = "_";
//默认长按触发时间
sz.UILoader.DEFAULT_TOUCH_LONG_TIME = 0.5;
//长按事件名
sz.UILoader.TOUCH_LONG_EVENT = "TouchLong";
//触摸事件
sz.UILoader.touchEvents = ["TouchBegan", "TouchMoved", "TouchEnded", "TouchCanceled", sz.UILoader.TOUCH_LONG_EVENT];
//控件事件列表
sz.UILoader.widgetEvents = [
    //Button
    {widgetType: ccui.Button, events: sz.UILoader.touchEvents},
    //ImageView
    {widgetType: ccui.ImageView, events: sz.UILoader.touchEvents},
    //TextFiled
    {widgetType: ccui.TextField, events: ["AttachWithIME", "DetachWithIME", "InsertText", "DeleteBackward"]},
    //CheckBox
    {widgetType: ccui.CheckBox, events: ["Selected", "Unselected"]},
    //ListView
    {widgetType: ccui.ListView, events:["SelectedItem"]},
    //Panel
    {widgetType: ccui.Layout, events: sz.UILoader.touchEvents},
    //BMFont
    {widgetType: ccui.TextBMFont, events: sz.UILoader.touchEvents},
    //Text
    {widgetType: ccui.Text, events: sz.UILoader.touchEvents},
    //last must null
    null
];

sz.uiloader = new sz.UILoader();

/**
 * cc.node触摸事件注册函数
 * @param node
 * @param target
 * @param touchEvent
 * @param swallowTouches
 * @returns {*}
 */
sz.uiloader.registerTouchEvent = function(node, target, touchEvent, swallowTouches) {

    if (!node instanceof cc.Node ) {
        cc.log('param "node" is not cc.Node type');
        return null;
    }

    if (node instanceof ccui.Widget) {
        cc.log('param "node" Can not be ccui.Widget type');
        return null;
    }

    target = target || node;

    if (swallowTouches === undefined) {
        swallowTouches = true;
    }

    var touchListener = cc.EventListener.create({
        event: touchEvent || cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: swallowTouches ? true : false
    });

    var nodeEvents = ['onTouchBegan', 'onTouchMoved', 'onTouchEnded'];
    nodeEvents.forEach(function(eventName, index) {

        touchListener[eventName] = function() {
            var touchNode = arguments[1].getCurrentTarget();
            var event = sz.uiloader.getWidgetEventName(touchNode, sz.UILoader.touchEvents[index]);
            if (!target[event]) {
                return false;
            }

            if (index === 0) {
                var point = arguments[0].getLocation();
                point = touchNode.convertToNodeSpace(point);
                var rect = cc.rect(0,0, touchNode.width, touchNode.height);
                if (!cc.rectContainsPoint(rect, point)) {
                    return false;
                }
            }

            var args = Array.prototype.slice.call(arguments);
            args.unshift(touchNode);
            var ret = target[event].apply(target, args);

            //todo: 响应uiload hook事件
            //if (sz.uiloader._onNodeEvent) {
            //    sz.uiloader._onNodeEvent(target, args[1], args[2]);
            //}

            if (index === 0) {
                return ret ? true : false;
            }
        };
    });

    cc.eventManager.addListener(touchListener, node);
    return touchListener;
};

module.exports = sz;

},{}],11:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
    if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
    for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
    }
    return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
        this._callbacks = this._callbacks || {};
        (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
            .push(fn);
        return this;
    };

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
    function on() {
        this.off(event, on);
        fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
    Emitter.prototype.removeListener =
        Emitter.prototype.removeAllListeners =
            Emitter.prototype.removeEventListener = function(event, fn){
                this._callbacks = this._callbacks || {};

                // all
                if (0 == arguments.length) {
                    this._callbacks = {};
                    return this;
                }

                // specific event
                var callbacks = this._callbacks['$' + event];
                if (!callbacks) return this;

                // remove all handlers
                if (1 == arguments.length) {
                    delete this._callbacks['$' + event];
                    return this;
                }

                // remove specific handler
                var cb;
                for (var i = 0; i < callbacks.length; i++) {
                    cb = callbacks[i];
                    if (cb === fn || cb.fn === fn) {
                        callbacks.splice(i, 1);
                        break;
                    }
                }
                return this;
            };

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];

    if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i].apply(this, args);
        }
    }

    return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
    return !! this.listeners(event).length;
};
},{}],12:[function(require,module,exports){
/**
 * Created by zxh on 15/10/16.
 */

"use strict";

var puremvc = require('puremvc').puremvc;
var _ = require('underscore');
module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'model.proxy.GameProxy',
        parent: puremvc.Proxy,

        constructor: function () {
            puremvc.Proxy.call(this);

            this.loadData();
        }
    },

    // INSTANCE MEMBERS
    {
        gold: 0,
        food: 0,
        wood: 0,
        intervalId: null,

        loadData: function() {
            var self = this;
            var time = 0;
            //模拟异步加载数据
            setTimeout(function() {
                time += 10;
                self.gold = 1000;
                self.food = 1000;
                self.wood = 1000;
                self.sendNotification(Messages.LOAD_COMPLETE);

                self.asyncData();
            }, 5000);
        },

        asyncData: function() {
            var self = this;
            this.intervalId = setInterval(function() {
                self.gold += _.random(-100, 100);
                self.food += _.random(-100, 100);
                self.wood += _.random(-100, 100);

                self.sendNotification(Messages.GAME_DATA_CHANGE);
            }, 2000);
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'GameProxy'
    }
);


},{"puremvc":24,"underscore":27}],13:[function(require,module,exports){
(function (global){
var res = {
    HelloWorld_png : "res/HelloWorld.png",
    LI07_jpg: "res/ui/Login/LI07.jpg",
    Login_json: "res/ui/Login.json",
    Layer_json: "res/ui/Layer.json",
    BaS31_png: "res/ui/Login/BaS31.png",
    BaS32_png: "res/ui/Login/BaS32.png",
    MainMenu_json: "res/ui/MainMenu.json",
    MM01_png: "res/ui/MainMenu/MM01.png",
    MM02_png: "res/ui/MainMenu/MM02.png",
    MM03_png: "res/ui/MainMenu/MM03.png",
    MM04_png: "res/ui/MainMenu/MM04.png",
    MM05_png: "res/ui/MainMenu/MM05.png",
    MM06_png: "res/ui/MainMenu/MM06.png",
    MM07_png: "res/ui/MainMenu/MM07.png",
    MM08_png: "res/ui/MainMenu/MM08.png",
    MM09_png: "res/ui/MainMenu/MM09.png",
    MM10_png: "res/ui/MainMenu/MM10.png",
    MM12_png: "res/ui/MainMenu/MM12.png",
    MM13_png: "res/ui/MainMenu/MM13.png",
    MM14_png: "res/ui/MainMenu/MM14.png",
    MM15_png: "res/ui/MainMenu/MM15.png",
    MM16_png: "res/ui/MainMenu/MM16.png",
    MM17_png: "res/ui/MainMenu/MM17.png",
    MM18_png: "res/ui/MainMenu/MM18.png",
    MM19_png: "res/ui/MainMenu/MM19.png",
    MM20_png: "res/ui/MainMenu/MM20.png",
    MM21_png: "res/ui/MainMenu/MM21.png",
    MM22_png: "res/ui/MainMenu/MM22.png",
    MM23_png: "res/ui/MainMenu/MM23.png",
    MM24_png: "res/ui/MainMenu/MM24.png",
    CountryLayer_json: "res/ui/ContryLayer.json",
    World_1_png: "res/ui/World/World_1.png",
    World_1_plist: "res/ui/World/World_1.plist",
    World_4_plist: "res/ui/World/World_4.plist",
    World_4_png: "res/ui/World/World_4.png",
    WorldMap_tmx: "res/ui/WorldMap.tmx",
    tile_iso_offset_png: "res/ui/tile_iso_offset.png",
    tile_iso_offset_tmx: "res/ui/tile_iso_offset.tmx",
    iso_png: "res/ui/iso.png",
    iso_test1_tmx: "res/ui/iso-test1.tmx"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

global.G_RES = {
    res: res,
    resources: g_resources
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */

var BaseLayer = require('../widget/BaseLayer.js');

module.exports = BaseLayer.extend({
    ctor: function() {
        this.hasFrame = true;
        this._super();
        this.colorFrame.setColor(cc.color.WHITE);
    }
});
},{"../widget/BaseLayer.js":23}],15:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */

var BaseLayer = require('../widget/BaseLayer.js');
var _ = require('underscore');
module.exports = BaseLayer.extend({
    map: null,
    _isMoved: null,
    ctor: function() {
        this._super();
        var map = new cc.TMXTiledMap(G_RES.res.WorldMap_tmx);
        this.addChild(map, 0);

        map.scale = 0.2;
        //map.anchorX = 0.5;
        //map.anchorY = 0.5;
        map.x = -map.mapWidth * map.tileWidth / 2 + cc.winSize.width / 2;//-map.getBoundingBox().width / 2 + cc.winSize.width / 2;
        map.y = -map.mapHeight * map.tileHeight + cc.winSize.height;  //map.y = -map.getBoundingBox().height + cc.winSize.height / 2;
        this.map = map;

        //this.moveTotile(cc.p(50, 50));
    },

    _onTouchMoved: function(sender, touch) {

        var diff = touch.getDelta();
        var currentPos = this.map.getPosition();
        currentPos = cc.pAdd(diff, currentPos);
        this.map.setPosition(currentPos);
        cc.log("moved:" + JSON.stringify(currentPos));
        this._isMoved = true;

        var p = this.convertTotile(currentPos);
        cc.log(cc.formatStr("tile %d,%d", p.x, p.y));
    },

    _onTouchEnded: function() {
        if (!this._isMoved) {
            this.moveTotile(cc.p(_.random(0, 100), _.random(0, 100)));
        }
        this._isMoved = false;
    },

    moveTotile: function(position) {
        cc.log(">>" + JSON.stringify(position));
        var map = this.map;
        var mapSize = map.getMapSize();
        var tileWidth = map.getBoundingBox().width / map.getMapSize().width;
        var tileHeight = map.getBoundingBox().height / map.getMapSize().height;

        var variable1 = -(position.x + mapSize.width / 2 - mapSize.height) * tileWidth * tileHeight ;
        var variable2 = -(-position.y + mapSize.width / 2 + mapSize.height) * tileWidth * tileHeight ;

        var posx = (variable1 + variable2) / 2 / tileHeight + cc.winSize.width / 2;
        var posy = (variable2 - variable1) / 2 / tileWidth + cc.winSize.height;

        cc.log(cc.formatStr("screen %d,%d", posx, posy));

        var p = this.convertTotile(cc.p(posx, posy));
        cc.log("tile %d,%d", p.x, p.y);
        return map.setPosition(posx, posy);

    },

    convertTotile: function(position) {
        var map = this.map;

        position.x -= cc.winSize.width / 2;
        position.y -= cc.winSize.height;

        var  mapSize = map.getMapSize();
        var  tileWidth = map.getBoundingBox().width / map.getMapSize().width;
        var  tileHeight = map.getBoundingBox().height / map.getMapSize().height;
        //var posx = mapSize.width / 2 + position.x / tileWidth;
        //var posy = mapSize.height + position.y / tileHeight;
        var row = position.y / tileHeight;
        var col = position.x / tileWidth;

        var posx = mapSize.width + row + col + mapSize.width / 2;
        var posy = mapSize.height + row + col + mapSize.width / 2;

        return cc.p(posx, posy);
    }
});
},{"../widget/BaseLayer.js":23,"underscore":27}],16:[function(require,module,exports){
/**
 * Created by zxh on 15/10/15.
 */

var BaseLayer = require('../widget/BaseLayer.js');
module.exports = BaseLayer.extend({
    data: null,
    ctor: function() {
        this._super();
        this.loadUI(G_RES.res.MainMenu_json);
    },

    setData: function(data) {
        this.data = data;
        this._food.setString("食物:" + data.food);
        this._wood.string = "木材:" + data.wood;
        this._gold.string = "金币:" + data.gold;
    },


    _onHomeTouchEnded: function() {
        //cc.log("_onHomeTouchEnded");
        if (this.switchLayer) {
            this.switchLayer();
        }
    },

    _onTaskTouchEnded: function() {
        cc.log("_onTaskTouchEnded");
    }


});
},{"../widget/BaseLayer.js":23}],17:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */
var BaseLayer = require('../widget/BaseLayer.js');
var Emitter = require('../../lib/emitter.js');

module.exports = BaseLayer.extend({
    ctor: function() {
        this.hasFrame = true;
        this._super();
        this.loadUI(G_RES.res.Login_json);
    },

    _onTouchEnded: function() {
        this.enterGame();
    }

});

},{"../../lib/emitter.js":11,"../widget/BaseLayer.js":23}],18:[function(require,module,exports){
/**
 * Created by zxh on 15/10/15.
 */
var puremvc = require('puremvc').puremvc;
var CityLayer = require('../component/CityLayer.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.CityMediator',
        parent: puremvc.Mediator,
        constructor: function () {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }
    },
    // INSTANCE MEMBERS
    {

        init: function() {
            if (!this.viewComponent) {
                this.viewComponent = new CityLayer();
                this.viewComponent.retain();
            }
        },

        /** @override */
        listNotificationInterests: function () {
            return [
                Messages.ENTER_CITY,
                Messages.ENTER_COUNTRY
            ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case Messages.ENTER_CITY:
                    this.facade.sendNotification(Messages.SHOW_VIEW, {
                        name:this.constructor.NAME,
                        zOrder: 1
                    });
                    break;
                case Messages.ENTER_COUNTRY:
                    this.viewComponent.removeFromParent();
            }
        },

        /** @override */
        onRegister: function () {

        },

        /** @override */
        onRemove: function () {

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'CityMediator'
    }
);
},{"../component/CityLayer.js":14,"puremvc":24}],19:[function(require,module,exports){
/**
 * Created by zxh on 15/10/16.
 */

var puremvc = require('puremvc').puremvc;
var CountryLayer = require('../component/CountryLayer.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.CountryMediator',
        parent: puremvc.Mediator,
        constructor: function () {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }
    },
    // INSTANCE MEMBERS
    {

        init: function() {
            if (!this.viewComponent) {
                this.viewComponent = new CountryLayer();
                this.viewComponent.retain();
            }
        },

        getRes: function() {
            return [
                G_RES.res.World_1_png,
                G_RES.res.World_4_png,
                G_RES.res.WorldMap_tmx
            ]
        },

        /** @override */
        listNotificationInterests: function () {
            return [
                Messages.ENTER_COUNTRY,
                Messages.ENTER_CITY
            ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case Messages.ENTER_COUNTRY:
                    this.facade.sendNotification(Messages.SHOW_VIEW, {
                        name:this.constructor.NAME,
                        zOrder: 1
                    });
                    break;
                case Messages.ENTER_CITY:
                    if (this.viewComponent && this.viewComponent.getParent()) {
                        this.viewComponent.removeFromParent();
                    }
            }
        },

        /** @override */
        onRegister: function () {

        },

        /** @override */
        onRemove: function () {

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'CountryMediator'
    }
);
},{"../component/CountryLayer.js":15,"puremvc":24}],20:[function(require,module,exports){
/**
 * Created by zxh on 15/10/16.
 */

/**
 * Created by zxh on 15/10/15.
 */
var puremvc = require('puremvc').puremvc;
var GameLayer = require('../component/GameLayer.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.GameMediator',
        parent: puremvc.Mediator,
        constructor: function () {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }
    },
    // INSTANCE MEMBERS
    {
        onRegister: function() {
            this._gameProxy = this.facade.retrieveProxy('GameProxy');
        },

        cityLayer: null,
        childMediator: null,
        init: function() {
            if (!this.viewComponent) {
                this.viewComponent = new GameLayer();
                this.viewComponent.setData(this._gameProxy);
                this.viewComponent.retain();

                this.viewComponent.switchLayer = this.switchLayer.bind(this);
            }
        },

        switchLayer: function() {
            if (this.childMediator === 1) {
                this.facade.sendNotification(Messages.ENTER_COUNTRY);
            } else {
                this.facade.sendNotification(Messages.ENTER_CITY);
            }
        },

        /** @override */
        listNotificationInterests: function () {
            return [
                Messages.ENTER_CITY,
                Messages.ENTER_COUNTRY,
                Messages.GAME_DATA_CHANGE
            ];
        },

        /** @override */
        handleNotification: function (notification) {


            var self = this;
            var gameViewHandle = function() {
                if (self.viewComponent && self.viewComponent.getParent()) {
                    return;
                }

                self.facade.sendNotification(Messages.SHOW_VIEW, {
                    name:self.constructor.NAME,
                    zOrder: 10
                });
            };

            switch (notification.getName()) {
                case Messages.ENTER_CITY:
                    this.childMediator = 1;
                    gameViewHandle();
                    break;

                case Messages.ENTER_COUNTRY:
                    this.childMediator = 2;
                    gameViewHandle();
                    break;
                case Messages.GAME_DATA_CHANGE:
                    this.viewComponent.setData(this._gameProxy);
            }
      }
    },
    // STATIC MEMBERS
    {
        NAME: 'GameMediator'
    }
);
},{"../component/GameLayer.js":16,"puremvc":24}],21:[function(require,module,exports){
/**
 * Created by zxh on 15/10/10.
 */

var puremvc = require('puremvc').puremvc;
var LogoLayer = require('../component/LogoLayer.js');


module.exports = puremvc.define(
    // CLASS INFO
    {
        name: 'view.mediator.LoginMediator',
        parent: puremvc.Mediator,
        constructor: function () {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }
    },
    // INSTANCE MEMBERS
    {

        init: function() {
            this.viewComponent = new LogoLayer();
            var self = this;
            //this.viewComponent.enterGame = function() {
            //    self.sendNotification(Command.RUN_GAME);
            //}
        },

        getRes: function() {
            return G_RES.resources;
        },

        /** @override */
        listNotificationInterests: function () {
            return [
                Command.RUN_GAME,
                Messages.LOAD_COMPLETE
            ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case Command.RUN_GAME:
                    this.facade.removeMediator(this.constructor.NAME);
                    break;
                case Messages.LOAD_COMPLETE:
                    this.sendNotification(Command.RUN_GAME);
                    break;

            }
        },

        /** @override */
        onRegister: function () {
        },

        /** @override */
        onRemove: function () {
            if (this.viewComponent) {
                this.viewComponent.removeFromParent();
                this.viewComponent = null;
            }
        },
    },
    // STATIC MEMBERS
    {
        NAME: 'LoginMediator'
    }
);
},{"../component/LogoLayer.js":17,"puremvc":24}],22:[function(require,module,exports){
/**
 * Created by zxh on 15/10/9.
 */

var puremvc = require('puremvc').puremvc;
var _ = require('underscore');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.SceneMediator',
        parent: puremvc.Mediator,
        constructor: function () {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {

        /** @override */
        listNotificationInterests: function () {
            return [
                Messages.RUN_SCENE,
                Messages.SHOW_VIEW
            ];
        },

        /** @override */
        handleNotification: function (notification) {


            switch (notification.getName()) {
                case Messages.RUN_SCENE:
                    var name = notification.getBody().name;
                    var viewMediator = this.facade.retrieveMediator(name);
                    this.runScene(viewMediator);
                    break;
                case Messages.SHOW_VIEW:
                    this.showLayer(notification.getBody());
            }
        },

        runScene: function(viewMediator) {

            var self = this,
                res = viewMediator.getRes();

            var handleRunScene = function() {
                viewMediator.init();
                var scene = self.getViewComponent();
                if (!scene) {
                    self.viewComponent = new cc.Scene();
                    scene = self.getViewComponent();
                }

                var child = viewMediator.getViewComponent();
                scene.addChild(child);
                cc.director.runScene(scene);
            };

            if (!cc.sys.isNative && !_.isEmpty(res)) {
                cc.loader.load(res, handleRunScene);
            } else {
                handleRunScene();
            }
        },

        showLayer: function(body) {
            var res,
                parentMediator = this,
                viewMediator = this.facade.retrieveMediator(body.name);

            if (_.isString(body.parent)) {
                parentMediator = this.facade.retrieveMediator(body.parent);
                cc.assert(parentMediator, "不能检索到" + body.parent);
            }

            if (viewMediator.getRes) {
                res = viewMediator.getRes();
            }

            var handleCreateLayer = function() {
                if (_.isFunction(viewMediator.init)) {
                    viewMediator.init();
                }

                var childLayer = viewMediator.getViewComponent();
                parentMediator.getViewComponent().addChild(childLayer, body.zOrder);
            };

            if (!cc.sys.isNative && !_.isEmpty(res)) {
                cc.loader.load(res, handleCreateLayer);
            } else {
                handleCreateLayer();
            }
        }

    },
    // STATIC MEMBERS
    {
        NAME: 'SceneMediator'
    }
);

},{"puremvc":24,"underscore":27}],23:[function(require,module,exports){
/**
 * Created by zxh on 15/10/10.
 */

/**
 （1）半透明背景层；
 （2）点击事件，控制这个层是否可透过点击；
 （3）弹出时是否带弹出动画（如提示弹框Tips，或功能页Page所需要的弹出动画）；
 （4）拓展方法（如，当前页面加载cocostudio的文件的方法，内存控制管理等）
 */
var sz = require('../../lib/UILoader.js');

BaseLayer = cc.Layer.extend({
    isShowAction:       false,      //是否以动画显示
    hasFrame:           false,      //是否显示背景
    colorFrame:         null,       //颜色背景
    ctor: function() {
        this._super();
        //创建半透明窗口
        this.createFrame();
        //显示动画
        this.showAction();
    },

    onEnter: function() {
        this._super();
        //注册触摸事件
        sz.uiloader.registerTouchEvent(this);
    },

    setMediator: function(mediator) {
        this.mediator = mediator;
    },

    createFrame: function() {
        if(this.hasFrame) {
            this.colorFrame = new cc.LayerColor(cc.color(0, 0, 0, 200));
            this.addChild(this.colorFrame, -1);
        }
    },

    showAction: function() {
        if (this.isShowAction) {
            this.setScale(0.8);
            var scaleTo1 = new cc.ScaleTo(0.1, 1.1).easing(cc.easeIn(2));
            var scaleTo2 = new cc.ScaleTo(0.1, 1);
            var sequence = new cc.Sequence(scaleTo1, scaleTo2);
            this.runAction(sequence);
        }
    },

    loadUI: function(uiFile) {
        var root = sz.uiloader.widgetFromJsonFile(this, uiFile);
        //自动适应屏幕
        root.setContentSize(cc.winSize);
        ccui.helper.doLayout(root)
    },

    setColor: function(value) {
        if (this.colorFrame) {
            this.colorFrame.setColor(value);
        }
    },

    _onTouchBegan: function() {
        return this._onTouchMoved || this._onTouchEnded ? true : false;
    }
});

module.exports = BaseLayer;
},{"../../lib/UILoader.js":10}],24:[function(require,module,exports){
exports.puremvc = require("./lib/puremvc-1.0.1-mod.js");
exports.puremvc.statemachine = require("./lib/puremvc-statemachine-1.0-mod.js");
},{"./lib/puremvc-1.0.1-mod.js":25,"./lib/puremvc-statemachine-1.0-mod.js":26}],25:[function(require,module,exports){
/**
 * @fileOverview
 * PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author david.foley@puremvc.org 
 */


 	/* implementation begin */
	
	
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Observer
 * 
 * A base Observer implementation.
 * 
 * An Observer is an object that encapsulates information
 * about an interested object with a method that should 
 * be called when a particular Notification is broadcast. 
 * 
 * In PureMVC, the Observer class assumes these responsibilities:
 * 
 * - Encapsulate the notification (callback) method of the interested object.
 * - Encapsulate the notification context (this) of the interested object.
 * - Provide methods for setting the notification method and context.
 * - Provide a method for notifying the interested object.
 * 
 * 
 * The notification method on the interested object should take 
 * one parameter of type Notification.
 * 
 * 
 * @param {Function} notifyMethod 
 *  the notification method of the interested object
 * @param {Object} notifyContext 
 *  the notification context of the interested object
 * @constructor
 */
function Observer (notifyMethod, notifyContext)
{
    this.setNotifyMethod(notifyMethod);
    this.setNotifyContext(notifyContext);
};

/**
 * Set the Observers notification method.
 * 
 * The notification method should take one parameter of type Notification
 * @param {Function} notifyMethod
 *  the notification (callback) method of the interested object.
 * @return {void}
 */
Observer.prototype.setNotifyMethod= function (notifyMethod)
{
    this.notify= notifyMethod;
};

/**
 * Set the Observers notification context.
 * 
 * @param {Object} notifyContext
 *  the notification context (this) of the interested object.
 * 
 * @return {void}
 */
Observer.prototype.setNotifyContext= function (notifyContext)
{
    this.context= notifyContext;
};

/**
 * Get the Function that this Observer will invoke when it is notified.
 * 
 * @private
 * @return {Function}
 */
Observer.prototype.getNotifyMethod= function ()
{
    return this.notify;
};

/**
 * Get the Object that will serve as the Observers callback execution context
 * 
 * @private
 * @return {Object}
 */
Observer.prototype.getNotifyContext= function ()
{
    return this.context;
};

/**
 * Notify the interested object.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to pass to the interested objects notification method
 * @return {void}
 */
Observer.prototype.notifyObserver= function (notification)
{
    this.getNotifyMethod().call(this.getNotifyContext(), notification);
};

/**
 * Compare an object to this Observers notification context.
 * 
 * @param {Object} object
 *  
 * @return {boolean}
 */
Observer.prototype.compareNotifyContext= function (object)
{
    return object === this.context;
};

/**
 * The Observers callback Function
 * 
 * @private
 * @type {Function}
 */
Observer.prototype.notify= null;

/**
 * The Observers callback Object
 * @private
 * @type {Object}
 */
Observer.prototype.context= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Notification
 * 
 * A base Notification implementation.
 * 
 * PureMVC does not rely upon underlying event models such as the one provided 
 * with the DOM or other browser centric W3C event models.
 * 
 * The Observer Pattern as implemented within PureMVC exists to support 
 * event-driven communication between the application and the actors of the MVC 
 * triad.
 * 
 * Notifications are not meant to be a replacement for events in the browser. 
 * Generally, Mediator implementors place event listeners on their view 
 * components, which they then handle in the usual way. This may lead to the 
 * broadcast of Notifications to trigger commands or to communicate with other 
 * Mediators. {@link puremvc.Proxy Proxy},
 * {@link puremvc.SimpleCommand SimpleCommand}
 * and {@link puremvc.MacroCommand MacroCommand}
 * instances communicate with each other and 
 * {@link puremvc.Mediator Mediator}s
 * by broadcasting Notifications.
 * 
 * A key difference between browser events and PureMVC Notifications is that
 * events follow the 'Chain of Responsibility' pattern, 'bubbling' up the 
 * display hierarchy until some parent component handles the event, while 
 * PureMVC Notification follow a 'Publish/Subscribe' pattern. PureMVC classes 
 * need not be related to each other in a parent/child relationship in order to 
 * communicate with one another using Notifications.
 * 
 * @constructor 
 * @param {string} name
 *  The Notification name
 * @param {Object} [body]
 *  The Notification body
 * @param {Object} [type]
 *  The Notification type
 */
function Notification(name, body, type)
{
    this.name= name;
    this.body= body;
    this.type= type;
};

/**
 * Get the name of the Notification instance
 *
 * @return {string}
 *  The name of the Notification instance
 */
Notification.prototype.getName= function()
{
    return this.name;
};

/**
 * Set this Notifications body. 
 * @param {Object} body
 * @return {void}
 */
Notification.prototype.setBody= function(body)
{
    this.body= body;
};

/**
 * Get the Notification body.
 *
 * @return {Object}
 */
Notification.prototype.getBody= function()
{
    return this.body
};

/**
 * Set the type of the Notification instance.
 *
 * @param {Object} type
 * @return {void}
 */
Notification.prototype.setType= function(type)
{
    this.type= type;
};

/**
 * Get the type of the Notification instance.
 * 
 * @return {Object}
 */
Notification.prototype.getType= function()
{
    return this.type;
};

/**
 * Get a string representation of the Notification instance
 *
 * @return {string}
 */
Notification.prototype.toString= function()
{
    var msg= "Notification Name: " + this.getName();
    msg+= "\nBody:" + ((this.body == null ) ? "null" : this.body.toString());
    msg+= "\nType:" + ((this.type == null ) ? "null" : this.type);
    return msg;
};

/**
 * The Notifications name.
 *
 * @type {string}
 * @private
 */
Notification.prototype.name= null;

/**
 * The Notifications type.
 *
 * @type {string}
 * @private
 */
Notification.prototype.type= null;

/**
 * The Notifications body.
 *
 * @type {Object}
 * @private
 */
Notification.prototype.body= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Notifier
 * 
 * A Base Notifier implementation.
 * 
 * {@link puremvc.MacroCommand MacroCommand}, 
 * {@link puremvc.SimpleCommand SimpleCommand}, 
 * {@link puremvc.Mediator Mediator} and 
 * {@link puremvc.Proxy Proxy}
 * all have a need to send Notifications
 * 
 * The Notifier interface provides a common method called #sendNotification that 
 * relieves implementation code of the necessity to actually construct 
 * Notifications.
 * 
 * The Notifier class, which all of the above mentioned classes
 * extend, provides an initialized reference to the 
 * {@link puremvc.Facade Facade}
 * Multiton, which is required for the convienience method
 * for sending Notifications but also eases implementation as these
 * classes have frequent 
 * {@link puremvc.Facade Facade} interactions 
 * and usually require access to the facade anyway.
 * 
 * NOTE: In the MultiCore version of the framework, there is one caveat to
 * notifiers, they cannot send notifications or reach the facade until they
 * have a valid multitonKey. 
 * 
 * The multitonKey is set:
 *   - on a Command when it is executed by the Controller
 *   - on a Mediator is registered with the View
 *   - on a Proxy is registered with the Model. 
 * 
 * @constructor
 */
function Notifier()
{
};

/**
 * Create and send a Notification.
 *
 * Keeps us from having to construct new Notification instances in our 
 * implementation code.
 * 
 * @param {string} notificationName
 *  A notification name
 * @param {Object} [body]
 *  The body of the notification
 * @param {string} [type]
 *  The notification type
 * @return {void}
 */
Notifier.prototype.sendNotification = function(notificationName, body, type)
{
    var facade = this.getFacade();
    if(facade)
    {
        facade.sendNotification(notificationName, body, type);
    }
};


/**
 * @protected
 * A reference to this Notifier's Facade. This reference will not be available
 * until #initializeNotifier has been called. 
 * 
 * @type {puremvc.Facade}
 */
Notifier.prototype.facade;

/**
 * Initialize this Notifier instance.
 * 
 * This is how a Notifier gets its multitonKey. 
 * Calls to #sendNotification or to access the
 * facade will fail until after this method 
 * has been called.
 * 
 * Mediators, Command or Proxies may override
 * this method in order to send notifications
 * or access the Multiton Facade instance as
 * soon as possible. They CANNOT access the facade
 * in their constructors, since this method will not
 * yet have been called.
 * 
 *
 * @param {string} key
 *  The Notifiers multiton key;
 * @return {void}
 */
Notifier.prototype.initializeNotifier = function(key)
{
    this.multitonKey = String(key);
    this.facade= this.getFacade();
};

/**
 * Retrieve the Multiton Facade instance
 *
 *
 * @protected
 * @return {puremvc.Facade}
 */
Notifier.prototype.getFacade = function()
{
    if(this.multitonKey == null)
    {
        throw new Error(Notifier.MULTITON_MSG);
    };

    return Facade.getInstance(this.multitonKey);
};

/**
 * @ignore
 * The Notifiers internal multiton key.
 *
 * @protected
 * @type string
 */
Notifier.prototype.multitonKey = null;

/**
 * @ignore
 * The error message used if the Notifier is not initialized correctly and
 * attempts to retrieve its own multiton key
 *
 * @static
 * @protected
 * @const
 * @type string
 */
Notifier.MULTITON_MSG = "multitonKey for this Notifier not yet initialized!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.SimpleCommand
 * @extends puremvc.Notifier
 *
 * SimpleCommands encapsulate the business logic of your application. Your 
 * subclass should override the #execute method where your business logic will
 * handle the 
 * {@link puremvc.Notification Notification}
 * 
 * Take a look at 
 * {@link puremvc.Facade#registerCommand Facade's registerCommand}
 * or {@link puremvc.Controller#registerCommand Controllers registerCommand}
 * methods to see how to add commands to your application.
 * 
 * @constructor
 */
function SimpleCommand () { };

SimpleCommand.prototype= new Notifier;
SimpleCommand.prototype.constructor= SimpleCommand;

/**
 * Fulfill the use-case initiated by the given Notification
 * 
 * In the Command Pattern, an application use-case typically begins with some
 * user action, which results in a Notification is handled by the business logic
 * in the #execute method of a command.
 * 
 * @param {puremvc.Notification} notification
 *  The notification to handle.
 * @return {void}
 */
SimpleCommand.prototype.execute= function (notification) { };
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.MacroCommand
 * @extends puremvc.Notifier
 * 
 * A base command implementation that executes other commands, such as
 * {@link puremvc.SimpleCommand SimpleCommand}
 * or {@link puremvc.MacroCommand MacroCommand}
 * subclasses.
 *  
 * A MacroCommand maintains an list of
 * command constructor references called *SubCommands*.
 * 
 * When #execute is called, the MacroCommand
 * instantiates and calls #execute on each of its *SubCommands* in turn.
 * Each *SubCommand* will be passed a reference to the original
 * {@link puremvc.Notification Notification} 
 * that was passed to the MacroCommands #execute method
 * 
 * Unlike {@link puremvc.SimpleCommand SimpleCommand}, 
 * your subclass should not override #execute but instead, should 
 * override the #initializeMacroCommand method, calling #addSubCommand once for 
 * each *SubCommand* to be executed.
 * 
 * If your subclass does define a constructor, be sure to call "super" like so
 * 
 *     function MyMacroCommand ()
 *     {
 *         MacroCommand.call(this);
 *     };
 * @constructor
 */
function MacroCommand()
{
    this.subCommands= [];
    this.initializeMacroCommand();
};

/* subclass Notifier */
MacroCommand.prototype= new Notifier;
MacroCommand.prototype.constructor= MacroCommand;

/**
 * @private
 * @type {Array.<puremvc.SimpleCommand|puremvc.MacroCommand>}
 */
MacroCommand.prototype.subCommands= null;

/**
 * @protected
 * Initialize the MacroCommand.
 * 
 * In your subclass, override this method to 
 * initialize the MacroCommand's *SubCommand*  
 * list with command class references like 
 * this:
 * 
 *     // Initialize MyMacroCommand
 *     MyMacroCommand.prototype.initializeMacroCommand= function ()
 *     {
 *         this.addSubCommand( com.me.myapp.controller.FirstCommand );
 *         this.addSubCommand( com.me.myapp.controller.SecondCommand );
 *         this.addSubCommand( com.me.myapp.controller.ThirdCommand );
 *     };
 * 
 * Note that *SubCommand*s may be any command implementor,
 * MacroCommands or SimpleCommands are both acceptable.
 * @return {void}
 */
MacroCommand.prototype.initializeMacroCommand= function() {}

/**
 * @protected
 * Add a *SubCommand*
 * 
 * The *SubCommand*s will be called in First In / First Out (FIFO) order
 * @param {Function} commandClassRef
 *  A reference to a subclassed SimpleCommand or MacroCommand constructor
 */
MacroCommand.prototype.addSubCommand= function(commandClassRef)
{
    this.subCommands.push(commandClassRef);
};

/**
 * Execute this MacroCommands *SubCommands*
 * 
 * The *SubCommand*s will be called in First In / First Out (FIFO) order
 * @param {puremvc.Notification} note
 *  The Notification object to be passed to each *SubCommand*
 */
MacroCommand.prototype.execute= function(note)
{
    // SIC- TODO optimize
    while(this.subCommands.length > 0)
    {
        var ref= this.subCommands.shift();
        var cmd= new ref;
        cmd.initializeNotifier(this.multitonKey);
        cmd.execute(note);
    }
};
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Mediator
 * @extends puremvc.Notifier
 * 
 * A base Mediator implementation.
 *
 * In PureMVC, Mediator classes are used to mediate communication between a view 
 * component and the rest of the application.
 *
 * A Mediator should listen to its view components for events, and handle them 
 * by sending notifications (to be handled by other Mediators, 
 * {@link puremvc.SimpleCommand SimpleCommands} 
 * or
 * {@link puremvc.MacroCommand MacroCommands}) 
 * or passing data from the view component directly to a 
 * {@link puremvc.Proxy Proxy}, such as submitting 
 * the contents of a form to a service.
 * 
 * Mediators should not perform business logic, maintain state or other 
 * information for its view component, or break the encapsulation of the view 
 * component by manipulating the view component's children. It should only call 
 * methods or set properties on the view component.
 *  
 * The view component should encapsulate its own behavior and implementation by 
 * exposing methods and properties that the Mediator can call without having to 
 * know about the view component's children.
 * 
 * @constructor
 * @param {string} [mediatorName]
 *  The Mediators name. The Mediators static #NAME value is used by default
 * @param {Object} [viewComponent]
 *  The Mediators {@link #setViewComponent viewComponent}.
 */
function Mediator (mediatorName, viewComponent)
{
    this.mediatorName= mediatorName || this.constructor.NAME;
    this.viewComponent=viewComponent;  
};

/**
 * @static
 * The name of the Mediator.
 * 
 * Typically, a Mediator will be written to serve one specific control or group
 * of controls and so, will not have a need to be dynamically named.
 * 
 * @type {string}
 */
Mediator.NAME= "Mediator";

/* subclass */
Mediator.prototype= new Notifier;
Mediator.prototype.constructor= Mediator;

/**
 * Get the name of the Mediator
 * 
 * @return {string}
 *  The Mediator name
 */
Mediator.prototype.getMediatorName= function ()
{
    return this.mediatorName;
};

/**
 * Set the Mediators view component. This could
 * be a HTMLElement, a bespoke UiComponent wrapper
 * class, a MooTools Element, a jQuery result or a
 * css selector, depending on which DOM abstraction 
 * library you are using.
 * 
 * 
 * @param {Object} the view component
 * @return {void}
 */
Mediator.prototype.setViewComponent= function (viewComponent)
{
    this.viewComponent= viewComponent;
};

/**
 * Get the Mediators view component.
 * 
 * Additionally, an optional explicit getter can be
 * be defined in the subclass that defines the 
 * view components, providing a more semantic interface
 * to the Mediator.
 * 
 * This is different from the AS3 implementation in
 * the sense that no casting is required from the
 * object supplied as the view component.
 * 
 *     MyMediator.prototype.getComboBox= function ()
 *     {
 *         return this.viewComponent;  
 *     }
 * 
 * @return {Object}
 *  The view component
 */
Mediator.prototype.getViewComponent= function ()
{
    return this.viewComponent;
};

/**
 * List the Notification names this Mediator is interested
 * in being notified of.
 * 
 * @return {Array} 
 *  The list of Notification names.
 */
Mediator.prototype.listNotificationInterests= function ()
{
    return [];
};

/**
 * Handle Notifications.
 * 
 * Typically this will be handled in a switch statement
 * with one 'case' entry per Notification the Mediator
 * is interested in
 * 
 * @param {puremvc.Notification} notification
 * @return {void}
 */
Mediator.prototype.handleNotification= function (notification)
{
    return;
};

/**
 * Called by the View when the Mediator is registered
 * @return {void}
 */
Mediator.prototype.onRegister= function ()
{
    return;
};

/**
 * Called by the View when the Mediator is removed
 */
Mediator.prototype.onRemove= function ()
{
    return;
};

/**
 * @ignore
 * The Mediators name. Should only be accessed by Mediator subclasses.
 * 
 * @protected
 * @type string
 */
Mediator.prototype.mediatorName= null;

/**
 * @ignore
 * The Mediators viewComponent. Should only be accessed by Mediator subclasses.
 * 
 * @protected
 * @type Object
 */
Mediator.prototype.viewComponent=null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Proxy
 * @extends puremvc.Notifier
 *
 * A base Proxy implementation. 
 * 
 * In PureMVC, Proxy classes are used to manage parts of the application's data 
 * model.
 * 
 * A Proxy might simply manage a reference to a local data object, in which case 
 * interacting with it might involve setting and getting of its data in 
 * synchronous fashion.
 * 
 * Proxy classes are also used to encapsulate the application's interaction with 
 * remote services to save or retrieve data, in which case, we adopt an 
 * asyncronous idiom; setting data (or calling a method) on the Proxy and 
 * listening for a 
 * {@link puremvc.Notification Notification} 
 * to be sent  when the Proxy has retrieved the data from the service. 
 * 
 * 
 * @param {string} [proxyName]
 *  The Proxy's name. If none is provided, the Proxy will use its constructors
 *  NAME property.
 * @param {Object} [data]
 *  The Proxy's data object
 * @constructor
 */
function Proxy(proxyName, data)
{
    this.proxyName= proxyName || this.constructor.NAME;
    if(data != null)
    {
        this.setData(data);
    }
};


Proxy.NAME= "Proxy";

Proxy.prototype= new Notifier;
Proxy.prototype.constructor= Proxy;

/**
 * Get the Proxy's name.
 *
 * @return {string}
 */
Proxy.prototype.getProxyName= function()
{
    return this.proxyName;
};

/**
 * Set the Proxy's data object
 *
 * @param {Object} data
 * @return {void}
 */
Proxy.prototype.setData= function(data)
{
    this.data= data;
};

/**
 * Get the Proxy's data object
 *
 * @return {Object}
 */
Proxy.prototype.getData= function()
{
    return this.data;
};

/**
 * Called by the {@link puremvc.Model Model} when
 * the Proxy is registered.
 *
 * @return {void}
 */
Proxy.prototype.onRegister= function()
{
    return;
};

/**
 * Called by the {@link puremvc.Model Model} when
 * the Proxy is removed.
 * 
 * @return {void}
 */
Proxy.prototype.onRemove= function()
{
    return;
};

/**
 * @ignore
 * The Proxys name.
 *
 * @protected
 * @type String
 */
Proxy.prototype.proxyName= null;

/**
 * @ignore
 * The Proxy's data object.
 *
 * @protected
 * @type Object
 */
Proxy.prototype.data= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Facade
 * Facade exposes the functionality of the Controller, Model and View
 * actors to client facing code. 
 * 
 * This Facade implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static Factory method, 
 * passing the unique key for this instance to #getInstance
 *
 * @constructor
 * @param {string} key
 * 	The multiton key to use to retrieve the Facade instance.
 * @throws {Error} 
 *  If an attempt is made to instantiate Facade directly
 */
function Facade(key)
{
    if(Facade.instanceMap[key] != null)
    {
        throw new Error(Facade.MULTITON_MSG);
    }

    this.initializeNotifier(key);
    Facade.instanceMap[key] = this;
    this.initializeFacade();
};

/**
 * Initialize the Multiton Facade instance.
 * 
 * Called automatically by the constructor. Override in your subclass to any
 * subclass specific initializations. Be sure to call the 'super' 
 * initializeFacade method, though
 * 
 *     MyFacade.prototype.initializeFacade= function ()
 *     {
 *         Facade.call(this);
 *     };
 * @protected
 * @return {void}
 */
Facade.prototype.initializeFacade = function()
{
    this.initializeModel();
    this.initializeController();
    this.initializeView();
};

/**
 * Facade Multiton Factory method. 
 * Note that this method will return null if supplied a
 * null or undefined multiton key.
 * 
 * @param {string} key
 * 	The multiton key use to retrieve a particular Facade instance
 * @return {puremvc.Facade}
 */
Facade.getInstance = function(key)
{
	if (null == key)
		return null;
		
    if(Facade.instanceMap[key] == null)
    {
        Facade.instanceMap[key] = new Facade(key);
    }

    return Facade.instanceMap[key];
};

/**
 * Initialize the {@link puremvc.Controller Controller}.
 * 
 * Called by the #initializeFacade method.
 * 
 * Override this method in your subclass of Facade
 * if one or both of the following are true:

 * - You wish to initialize a different Controller
 * - You have 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or {@link puremvc.MacroCommand MacroCommand}s
 * to register with the Controllerat startup.   
 * 
 * If you don't want to initialize a different Controller, 
 * call the 'super' initializeControlle method at the beginning of your
 * method, then register commands.
 * 
 *     MyFacade.prototype.initializeController= function ()
 *     {
 *         Facade.prototype.initializeController.call(this);
 *         this.registerCommand(AppConstants.A_NOTE_NAME, ABespokeCommand)
 *     }
 * 
 * @protected
 * @return {void}
 */
Facade.prototype.initializeController = function()
{
    if(this.controller != null)
        return;

    this.controller = Controller.getInstance(this.multitonKey);
};

/**
 * @protected
 * Initialize the {@link puremvc.Model Model};
 * 
 * Called by the #initializeFacade method.
 * Override this method in your subclass of Facade if one of the following are
 * true:
 * 
 * - You wish to initialize a different Model.
 * 
 * - You have {@link puremvc.Proxy Proxy}s to 
 *   register with the Model that do not retrieve a reference to the Facade at 
 *   construction time.
 * 
 * If you don't want to initialize a different Model
 * call 'super' #initializeModel at the beginning of your method, then register 
 * Proxys.
 * 
 * Note: This method is *rarely* overridden; in practice you are more
 * likely to use a command to create and registerProxys with the Model>, 
 * since Proxys with mutable data will likely
 * need to send Notifications and thus will likely want to fetch a reference to 
 * the Facade during their construction. 
 * 
 * @return {void}
 */
Facade.prototype.initializeModel = function()
{
    if(this.model != null)
        return;

    this.model = Model.getInstance(this.multitonKey);
};

/**
 * @protected
 * 
 * Initialize the {@link puremvc.View View}.
 * 
 * Called by the #initializeFacade method.
 * 
 * Override this method in your subclass of Facade if one or both of the 
 * following are true:
 *
 * - You wish to initialize a different View.
 * - You have Observers to register with the View
 * 
 * If you don't want to initialize a different View 
 * call 'super' #initializeView at the beginning of your
 * method, then register Mediator instances.
 * 
 *     MyFacade.prototype.initializeView= function ()
 *     {
 *         Facade.prototype.initializeView.call(this);
 *         this.registerMediator(new MyMediator());
 *     };
 * 
 * Note: This method is *rarely* overridden; in practice you are more
 * likely to use a command to create and register Mediators
 * with the View, since Mediator instances will need to send 
 * Notifications and thus will likely want to fetch a reference 
 * to the Facade during their construction. 
 * @return {void}
 */
Facade.prototype.initializeView = function()
{
    if(this.view != null)
        return;

    this.view = View.getInstance(this.multitonKey);
};

/**
 * Register a command with the Controller by Notification name
 * @param {string} notificationName
 *  The name of the Notification to associate the command with
 * @param {Function} commandClassRef
 *  A reference ot the commands constructor.
 * @return {void}
 */
Facade.prototype.registerCommand = function(notificationName, commandClassRef)
{
    this.controller.registerCommand(notificationName, commandClassRef);
};

/**
 * Remove a previously registered command to Notification mapping from the
 * {@link puremvc.Controller#removeCommand Controller}
 * @param {string} notificationName
 *  The name of the the Notification to remove from the command mapping for.
 * @return {void}
 */
Facade.prototype.removeCommand = function(notificationName)
{
    this.controller.removeCommand(notificationName);
};

/**
 * Check if a command is registered for a given notification.
 * 
 * @param {string} notificationName
 *  A Notification name
 * @return {boolean}
 *  Whether a comman is currently registered for the given notificationName
 */
Facade.prototype.hasCommand = function(notificationName)
{
    return this.controller.hasCommand(notificationName);
};

/**
 * Register a Proxy with the {@link puremvc.Model#registerProxy Model}
 * by name.
 * 
 * @param {puremvc.Proxy} proxy
 *  The Proxy instance to be registered with the Model.
 * @return {void}
 */
Facade.prototype.registerProxy = function(proxy)
{
    this.model.registerProxy(proxy);
};

/**
 * Retrieve a Proxy from the Model
 * 
 * @param {string} proxyName
 * @return {puremvc.Proxy}
 */
Facade.prototype.retrieveProxy = function(proxyName)
{
    return this.model.retrieveProxy(proxyName);
};

/**
 * Remove a Proxy from the Model by name
 * @param {string} proxyName
 *  The name of the Proxy
 * @return {puremvc.Proxy}
 *  The Proxy that was removed from the Model
 */
Facade.prototype.removeProxy = function(proxyName)
{
    var proxy = null;
    if(this.model != null)
    {
        proxy = this.model.removeProxy(proxyName);
    }

    return proxy;
};

/**
 * Check it a Proxy is registered.
 * @param {string} proxyName
 *  A Proxy name
 * @return {boolean}
 *  Whether a Proxy is currently registered with the given proxyName
 */
Facade.prototype.hasProxy = function(proxyName)
{
    return this.model.hasProxy(proxyName);
};

/**
 * Register a Mediator with with the View.
 * 
 * @param {puremvc.Mediator} mediator
 *  A reference to the Mediator to register
 * @return {void}
 */
Facade.prototype.registerMediator = function(mediator)
{
    if(this.view != null)
    {
        this.view.registerMediator(mediator);
    }
};

/**
 * Retrieve a Mediator from the View by name
 * 
 * @param {string} mediatorName
 *  The Mediators name
 * @return {puremvc.Mediator}
 *  The retrieved Mediator
 */
Facade.prototype.retrieveMediator = function(mediatorName)
{
    return this.view.retrieveMediator(mediatorName);
};

/**
 * Remove a Mediator from the View.
 * 
 * @param {string} mediatorName
 *  The name of the Mediator to remove.
 * @return {puremvc.Mediator}
 *  The removed Mediator
 */
Facade.prototype.removeMediator = function(mediatorName)
{
    var mediator = null;
    if(this.view != null)
    {
        mediator = this.view.removeMediator(mediatorName);
    }

    return mediator;
};

/**
 * Check if a Mediator is registered or not.
 * 
 * @param {string} mediatorName
 *  A Mediator name
 * @return {boolean}
 *  Whether a Mediator is registered with the given mediatorName
 */
Facade.prototype.hasMediator = function(mediatorName)
{
    return this.view.hasMediator(mediatorName);
};

/**
 * Create and send a 
 * {@link puremvc.Notification Notification}
 * 
 * Keeps us from having to construct new Notification instances in our
 * implementation
 * 
 * @param {string} notificationName
 *  The name of the Notification to send
 * @param {Object} [body]
 *  The body of the notification
 * @param {string} [type]
 *  The type of the notification
 * @return {void}
 */
Facade.prototype.sendNotification = function(notificationName, body, type)
{
    this.notifyObservers(new Notification(notificationName, body, type));
};

/**
 * Notify {@link puremvc.Observer Observer}s
 * 
 * This method is left public mostly for backward compatibility, and to allow
 * you to send custom notification classes using the facade.
 * 
 * Usually you should just call sendNotification and pass the parameters, never 
 * having to construct the notification yourself.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to send
 * @return {void}
 */
Facade.prototype.notifyObservers = function(notification)
{
    if(this.view != null)
    {
        this.view.notifyObservers(notification);
    }
};

/**
 * Initialize the Facades Notifier capabilities by setting the Multiton key for 
 * this facade instance.
 * 
 * Not called directly, but instead from the constructor when #getInstance is 
 * invoked. It is necessary to be public in order to implement Notifier
 * 
 * @param {string} key
 * @return {void}
 */
Facade.prototype.initializeNotifier = function(key)
{
    this.multitonKey = key;
};

/**
 * Check if a *Core* is registered or not
 *
 * @static
 * @param {string} key
 *  The multiton key for the *Core* in question
 * @return {boolean}
 *  Whether a *Core* is registered with the given key
 */
Facade.hasCore = function(key)
{
    return Facade.instanceMap[key] != null;
};

/**
 * Remove a *Core* 
 * 
 * Remove the Model, View, Controller and Facade for a given key.
 *
 * @static
 * @param {string} key
 * @return {void}
 */
Facade.removeCore = function(key)
{
    if(Facade.instanceMap[key] == null)
        return;

    Model.removeModel(key);
    View.removeView(key);
    Controller.removeController(key);
    delete Facade.instanceMap[key];
};

/**
 * @ignore
 * The Facades corresponding Controller
 *
 * @protected
 * @type puremvc.Controller
 */
Facade.prototype.controller = null;

/**
 * @ignore
 * The Facades corresponding Model instance
 *
 * @protected
 * @type puremvc.Model
 */
Facade.prototype.model = null;

/**
 * @ignore
 * The Facades correspnding View instance.
 *
 * @protected
 * @type puremvc.View
 */
Facade.prototype.view = null;

/**
 * @ignore
 * The Facades multiton key.
 *
 * @protected
 * @type string
 */
Facade.prototype.multitonKey = null;

/**
 * @ignore
 * The Multiton Facade instance map.
 * @static
 * @protected
 * @type Array
 */
Facade.instanceMap = [];

/**
 * @ignore
 * Messages Constants
 * @protected
 * @type {string}
 * @const
 * @static
 */
Facade.MULTITON_MSG = "Facade instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.View
 * 
 * A Multiton View implementation.
 * 
 * In PureMVC, the View class assumes these responsibilities
 * 
 * - Maintain a cache of {@link puremvc.Mediator Mediator}
 *   instances.
 * 
 * - Provide methods for registering, retrieving, and removing 
 *   {@link puremvc.Mediator Mediator}.
 * 
 * - Notifiying {@link puremvc.Mediator Mediator} when they are registered or 
 *   removed.
 * 
 * - Managing the observer lists for each {@link puremvc.Notification Notification}  
 *   in the application.
 * 
 * - Providing a method for attaching {@link puremvc.Observer Observer} to an 
 *   {@link puremvc.Notification Notification}'s observer list.
 * 
 * - Providing a method for broadcasting a {@link puremvc.Notification Notification}.
 * 
 * - Notifying the {@link puremvc.Observer Observer}s of a given 
 *   {@link puremvc.Notification Notification} when it broadcast.
 * 
 * This View implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static Multiton 
 * Factory #getInstance method.
 * 
 * @param {string} key
 * @constructor
 * @throws {Error} 
 *  if instance for this Multiton key has already been constructed
 */
function View(key)
{
    if(View.instanceMap[key] != null)
    {
        throw new Error(View.MULTITON_MSG);
    };

    this.multitonKey = key;
    View.instanceMap[this.multitonKey] = this;
    this.mediatorMap = [];
    this.observerMap = [];
    this.initializeView();
};

/**
 * @protected
 * Initialize the Singleton View instance
 * 
 * Called automatically by the constructor, this is your opportunity to
 * initialize the Singleton instance in your subclass without overriding the
 * constructor
 * 
 * @return {void}
 */
View.prototype.initializeView = function()
{
    return;
};

/**
 * View Singleton Factory method.
 * Note that this method will return null if supplied a null 
 * or undefined multiton key.
 *  
 * @return {puremvc.View}
 *  The Singleton instance of View
 */
View.getInstance = function(key)
{
	if (null == key)
		return null;
		
    if(View.instanceMap[key] == null)
    {
        View.instanceMap[key] = new View(key);
    };

    return View.instanceMap[key];
};

/**
 * Register an Observer to be notified of Notifications with a given name
 * 
 * @param {string} notificationName
 *  The name of the Notifications to notify this Observer of
 * @param {puremvc.Observer} observer
 *  The Observer to register.
 * @return {void}
 */
View.prototype.registerObserver = function(notificationName, observer)
{
    if(this.observerMap[notificationName] != null)
    {
        this.observerMap[notificationName].push(observer);
    }
    else
    {
        this.observerMap[notificationName] = [observer];
    }
};

/**
 * Notify the Observersfor a particular Notification.
 * 
 * All previously attached Observers for this Notification's
 * list are notified and are passed a reference to the INotification in 
 * the order in which they were registered.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to notify Observers of
 * @return {void}
 */
View.prototype.notifyObservers = function(notification)
{
    // SIC
    if(this.observerMap[notification.getName()] != null)
    {
        var observers_ref = this.observerMap[notification.getName()], observers = [], observer

        for(var i = 0; i < observers_ref.length; i++)
        {
            observer = observers_ref[i];
            observers.push(observer);
        }

        for(var i = 0; i < observers.length; i++)
        {
            observer = observers[i];
            observer.notifyObserver(notification);
        }
    }
};

/**
 * Remove the Observer for a given notifyContext from an observer list for
 * a given Notification name
 * 
 * @param {string} notificationName
 *  Which observer list to remove from
 * @param {Object} notifyContext
 *  Remove the Observer with this object as its notifyContext
 * @return {void}
 */
View.prototype.removeObserver = function(notificationName, notifyContext)
{
    // SIC
    var observers = this.observerMap[notificationName];
    for(var i = 0; i < observers.length; i++)
    {
        if(observers[i].compareNotifyContext(notifyContext) == true)
        {
            observers.splice(i, 1);
            break;
        }
    }

    if(observers.length == 0)
    {
        delete this.observerMap[notificationName];
    }
};

/**
 * Register a Mediator instance with the View.
 * 
 * Registers the Mediator so that it can be retrieved by name,
 * and further interrogates the Mediator for its 
 * {@link puremvc.Mediator#listNotificationInterests interests}.
 *
 * If the Mediator returns any Notification
 * names to be notified about, an Observer is created encapsulating 
 * the Mediator instance's 
 * {@link puremvc.Mediator#handleNotification handleNotification}
 * method and registering it as an Observer for all Notifications the 
 * Mediator is interested in.
 * 
 * @param {puremvc.Mediator} 
 *  a reference to the Mediator instance
 */
View.prototype.registerMediator = function(mediator)
{
    if(this.mediatorMap[mediator.getMediatorName()] != null)
    {
        return;
    }

    mediator.initializeNotifier(this.multitonKey);
    // register the mediator for retrieval by name
    this.mediatorMap[mediator.getMediatorName()] = mediator;

    // get notification interests if any
    var interests = mediator.listNotificationInterests();

    // register mediator as an observer for each notification
    if(interests.length > 0)
    {
        // create observer referencing this mediators handleNotification method
        var observer = new Observer(mediator.handleNotification, mediator);
        for(var i = 0; i < interests.length; i++)
        {
            this.registerObserver(interests[i], observer);
        }
    }

    mediator.onRegister();
}

/**
 * Retrieve a Mediator from the View
 * 
 * @param {string} mediatorName
 *  The name of the Mediator instance to retrieve
 * @return {puremvc.Mediator}
 *  The Mediator instance previously registered with the given mediatorName
 */
View.prototype.retrieveMediator = function(mediatorName)
{
    return this.mediatorMap[mediatorName];
};

/**
 * Remove a Mediator from the View.
 * 
 * @param {string} mediatorName
 *  Name of the Mediator instance to be removed
 * @return {puremvc.Mediator}
 *  The Mediator that was removed from the View
 */
View.prototype.removeMediator = function(mediatorName)
{
    var mediator = this.mediatorMap[mediatorName];
    if(mediator)
    {
        // for every notification the mediator is interested in...
        var interests = mediator.listNotificationInterests();
        for(var i = 0; i < interests.length; i++)
        {
            // remove the observer linking the mediator to the notification
            // interest
            this.removeObserver(interests[i], mediator);
        }

        // remove the mediator from the map
        delete this.mediatorMap[mediatorName];

        // alert the mediator that it has been removed
        mediator.onRemove();
    }

    return mediator;
};

/**
 * Check if a Mediator is registered or not.
 * 
 * @param {string} mediatorName
 * @return {boolean}
 *  Whether a Mediator is registered with the given mediatorname
 */
View.prototype.hasMediator = function(mediatorName)
{
    return this.mediatorMap[mediatorName] != null;
};

/**
 * Remove a View instance
 * 
 * @return {void}
 */
View.removeView = function(key)
{
    delete View.instanceMap[key];
};

/**
 * @ignore
 * The Views internal mapping of mediator names to mediator instances
 *
 * @type Array
 * @protected
 */
View.prototype.mediatorMap = null;

/**
 * @ignore
 * The Views internal mapping of Notification names to Observer lists
 *
 * @type Array
 * @protected
 */
View.prototype.observerMap = null;

/**
 * @ignore
 * The internal map used to store multiton View instances
 *
 * @type Array
 * @protected
 */
View.instanceMap = [];

/**
 * @ignore
 * The Views internal multiton key.
 *
 * @type string
 * @protected
 */
View.prototype.multitonKey = null;

/**
 * @ignore
 * The error message used if an attempt is made to instantiate View directly
 *
 * @type string
 * @protected
 * @const
 * @static
 */
View.MULTITON_MSG = "View instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Model
 *
 * A Multiton Model implementation.
 *
 * In PureMVC, the Model class provides
 * access to model objects (Proxies) by named lookup.
 *
 * The Model assumes these responsibilities:
 *
 * - Maintain a cache of {@link puremvc.Proxy Proxy}
 *   instances.
 * - Provide methods for registering, retrieving, and removing
 *   {@link puremvc.Proxy Proxy} instances.
 *
 * Your application must register 
 * {@link puremvc.Proxy Proxy} instances with the Model. 
 * Typically, you use a 
 * {@link puremvc.SimpleCommand SimpleCommand} 
 * or
 * {@link puremvc.MacroCommand MacroCommand} 
 * to create and register Proxy instances once the Facade has initialized the 
 * *Core* actors.
 *
 * This Model implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the 
 * {@link #getInstance static Multiton Factory method} 
 * @constructor
 * @param {string} key
 *  The Models multiton key
 * @throws {Error}
 *  An error is thrown if this multitons key is already in use by another instance
 */
function Model(key)
{
    if(Model.instanceMap[key])
    {
        throw new Error(Model.MULTITON_MSG);
    }

    this.multitonKey= key;
    Model.instanceMap[key]= this;
    this.proxyMap= [];
    this.initializeModel();
};

/**
 * Initialize the Model instance.
 * 
 * Called automatically by the constructor, this
 * is your opportunity to initialize the Singleton
 * instance in your subclass without overriding the
 * constructor.
 * 
 * @return void
 */
Model.prototype.initializeModel= function(){};


/**
 * Model Multiton Factory method.
 * Note that this method will return null if supplied a null 
 * or undefined multiton key.
 *  
 * @param {string} key
 *  The multiton key for the Model to retrieve
 * @return {puremvc.Model}
 *  the instance for this Multiton key 
 */
Model.getInstance= function(key)
{
	if (null == key)
		return null;
		
    if(Model.instanceMap[key] == null)
    {
        Model.instanceMap[key]= new Model(key);
    }

    return Model.instanceMap[key];
};

/**
 * Register a Proxy with the Model
 * @param {puremvc.Proxy}
 */
Model.prototype.registerProxy= function(proxy)
{
    proxy.initializeNotifier(this.multitonKey);
    this.proxyMap[proxy.getProxyName()]= proxy;
    proxy.onRegister();
};

/**
 * Retrieve a Proxy from the Model
 * 
 * @param {string} proxyName
 * @return {puremvc.Proxy}
 *  The Proxy instance previously registered with the provided proxyName
 */
Model.prototype.retrieveProxy= function(proxyName)
{
    return this.proxyMap[proxyName];
};

/**
 * Check if a Proxy is registered
 * @param {string} proxyName
 * @return {boolean}
 *  whether a Proxy is currently registered with the given proxyName.
 */
Model.prototype.hasProxy= function(proxyName)
{
    return this.proxyMap[proxyName] != null;
};

/**
 * Remove a Proxy from the Model.
 * 
 * @param {string} proxyName
 *  The name of the Proxy instance to remove
 * @return {puremvc.Proxy}
 *  The Proxy that was removed from the Model
 */
Model.prototype.removeProxy= function(proxyName)
{
    var proxy= this.proxyMap[proxyName];
    if(proxy)
    {
        this.proxyMap[proxyName]= null;
        proxy.onRemove();
    }

    return proxy;
};

/**
 * @static
 * Remove a Model instance.
 * 
 * @param {string} key
 * @return {void}
 */
Model.removeModel= function(key)
{
    delete Model.instanceMap[key];
};

/**
 * @ignore
 * The map used by the Model to store Proxy instances.
 *
 * @protected
 * @type Array
 */
Model.prototype.proxyMap= null;

/**
 * @ignore
 * The map used by the Model to store multiton instances
 *
 * @protected
 * @static
 * @type Array
 */
Model.instanceMap= [];

/**
 * @ignore
 * The Models multiton key.
 *
 * @protected
 * @type string
 */
Model.prototype.multitonKey;

/**
 * @ignore
 * Messages Constants
 * 
 * @static
 * @type {string}
 */
Model.MULTITON_MSG= "Model instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Controller
 * 
 * In PureMVC, the Controller class follows the 'Command and Controller' 
 * strategy, and assumes these responsibilities:
 * 
 * - Remembering which
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or 
 * {@link puremvc.MacroCommand MacroCommand}s
 * are intended to handle which 
 * {@link puremvc.Notification Notification}s
 * - Registering itself as an 
 * {@link puremvc.Observer Observer} with
 * the {@link puremvc.View View} for each 
 * {@link puremvc.Notification Notification}
 * that it has an 
 * {@link puremvc.SimpleCommand SimpleCommand} 
 * or {@link puremvc.MacroCommand MacroCommand} 
 * mapping for.
 * - Creating a new instance of the proper 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or 
 * {@link puremvc.MacroCommand MacroCommand}s
 * to handle a given 
 * {@link puremvc.Notification Notification} 
 * when notified by the
 * {@link puremvc.View View}.
 * - Calling the command's execute method, passing in the 
 * {@link puremvc.Notification Notification}.
 *
 * Your application must register 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or {@link puremvc.MacroCommand MacroCommand}s 
 * with the Controller.
 *
 * The simplest way is to subclass 
 * {@link puremvc.Facade Facade},
 * and use its 
 * {@link puremvc.Facade#initializeController initializeController} 
 * method to add your registrations.
 *
 * @constructor
 * This Controller implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static #getInstance factory method, 
 * passing the unique key for this instance to it.
 * @param {string} key
 * @throws {Error}
 *  If instance for this Multiton key has already been constructed
 */
function Controller(key)
{
    if(Controller.instanceMap[key] != null)
    {
        throw new Error(Controller.MULTITON_MSG);
    }

    this.multitonKey= key;
    Controller.instanceMap[this.multitonKey]= this;
    this.commandMap= new Array();
    this.initializeController();
}

/**
 * @protected
 * 
 * Initialize the multiton Controller instance.
 *
 * Called automatically by the constructor.
 *
 * Note that if you are using a subclass of View
 * in your application, you should *also* subclass Controller
 * and override the initializeController method in the
 * following way.
 * 
 *     MyController.prototype.initializeController= function ()
 *     {
 *         this.view= MyView.getInstance(this.multitonKey);
 *     };
 * 
 * @return {void}
 */
Controller.prototype.initializeController= function()
{
    this.view= View.getInstance(this.multitonKey);
};

/**
 * The Controllers multiton factory method. 
 * Note that this method will return null if supplied a null 
 * or undefined multiton key. 
 *
 * @param {string} key
 *  A Controller's multiton key
 * @return {puremvc.Controller}
 *  the Multiton instance of Controller
 */
Controller.getInstance= function(key)
{
	if (null == key)
		return null;
		
    if(null == this.instanceMap[key])
    {
        this.instanceMap[key]= new this(key);
    }

    return this.instanceMap[key];
};

/**
 * If a SimpleCommand or MacroCommand has previously been registered to handle
 * the given Notification then it is executed.
 *
 * @param {puremvc.Notification} note
 * @return {void}
 */
Controller.prototype.executeCommand= function(note)
{
    var commandClassRef= this.commandMap[note.getName()];
    if(commandClassRef == null)
        return;

    var commandInstance= new commandClassRef();
    commandInstance.initializeNotifier(this.multitonKey);
    commandInstance.execute(note);
};

/**
 * Register a particular SimpleCommand or MacroCommand class as the handler for 
 * a particular Notification.
 *
 * If an command already been registered to handle Notifications with this name, 
 * it is no longer used, the new command is used instead.
 *
 * The Observer for the new command is only created if this the irst time a
 * command has been regisered for this Notification name.
 *
 * @param {string} notificationName
 *  the name of the Notification
 * @param {Function} commandClassRef
 *  a command constructor
 * @return {void}
 */
Controller.prototype.registerCommand= function(notificationName, commandClassRef)
{
    if(this.commandMap[notificationName] == null)
    {
        this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
    }

    this.commandMap[notificationName]= commandClassRef;
};

/**
 * Check if a command is registered for a given Notification
 *
 * @param {string} notificationName
 * @return {boolean}
 *  whether a Command is currently registered for the given notificationName.
 */
Controller.prototype.hasCommand= function(notificationName)
{
    return this.commandMap[notificationName] != null;
};

/**
 * Remove a previously registered command to
 * {@link puremvc.Notification Notification}
 * mapping.
 *
 * @param {string} notificationName
 *  the name of the Notification to remove the command mapping for
 * @return {void}
 */
Controller.prototype.removeCommand= function(notificationName)
{
    if(this.hasCommand(notificationName))
    {
        this.view.removeObserver(notificationName, this);
        this.commandMap[notificationName]= null;
    }
};

/**
 * @static
 * Remove a Controller instance.
 *
 * @param {string} key 
 *  multitonKey of Controller instance to remove
 * @return {void}
 */
Controller.removeController= function(key)
{
    delete this.instanceMap[key];
};

/**
 * Local reference to the Controller's View
 * 
 * @protected
 * @type {puremvc.View}
 */
Controller.prototype.view= null;

/**
 * Note name to command constructor mappings
 * 
 * @protected
 * @type {Object}
 */
Controller.prototype.commandMap= null;

/**
 * The Controller's multiton key
 * 
 * @protected
 * @type {string}
 */
Controller.prototype.multitonKey= null;

/**
 * Multiton key to Controller instance mappings
 * 
 * @static
 * @protected
 * @type {Object}
 */
Controller.instanceMap= [];

/**
 * @ignore
 * 
 * Messages constants
 * @static
 * @protected
 * @type {string}
 */
Controller.MULTITON_MSG= "controller key for this Multiton key already constructed"
/*
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @hide
 * A an internal helper class used to assist classlet implementation. This
 * class is not accessible by client code.
 */
var OopHelp=
{
    /*
     * @private
     * A reference to the global scope. We use this rather than window
     * in order to support both browser based and non browser baed 
     * JavaScript interpreters.
     * @type {Object}
     */
	global: (function(){return this})()
    
    /*
     * @private
     * Extend one Function's prototype by another, emulating classic
     * inheritance.
     * 
     * @param {Function} child
     *  The Function to extend (subclass)
     * 
     * @param {Function} parent
     *  The Function to extend from (superclass)
     * 
     * @return {Function}
     * 
     *  A reference to the extended Function (subclass)
     */
,   extend: function (child, parent)
    {
        if ('function' !== typeof child)
            throw new TypeError('#extend- child should be Function');            
        
        if ('function' !== typeof parent)
            throw new TypeError('#extend- parent should be Function');
            
        if (parent === child)
            return;
            
        var Transitive= new Function;
        Transitive.prototype= parent.prototype;
        child.prototype= new Transitive;
        return child.prototype.constructor= child;
    }
    
    /*
     * @private
     * Decoarate one object with the properties of another. 
     * 
     * @param {Object} object
     *  The object to decorate.
     * 
     * @param {Object} traits
     *  The object providing the properites that the first object
     *  will be decorated with. Note that only properties defined on 
     *  this object will be copied- i.e. inherited properties will
     *  be ignored.
     * 
     * @return {Object}
     *  THe decorated object (first argument)
     */
,   decorate: function (object, traits)
    {   
        for (var accessor in traits)
        {
            object[accessor]= traits[accessor];
        }    
        
        return object;
    }
};


/**
 * @member puremvc
 * 
 * Declare a namespace and optionally make an Object the referent
 * of that namespace.
 * 
 *     console.assert(null == window.tld, 'No tld namespace');
 *     // declare the tld namespace
 *     puremvc.declare('tld');
 *     console.assert('object' === typeof tld, 'The tld namespace was declared');
 * 
 *     // the method returns a reference to last namespace node in a created hierarchy
 *     var reference= puremvc.declare('tld.domain.app');
 *     console.assert(reference === tld.domain.app)
 *    
 *     // of course you can also declare your own objects as well
 *     var AppConstants=
 *         {
 * 	           APP_NAME: 'tld.domain.app.App'
 *         };
 * 
 *     puremvc.declare('tld.domain.app.AppConstants', AppConstants);
 *     console.assert(AppConstants === tld.domain.app.AppConstants
 * 	   , 'AppConstants was exported to the namespace');
 * 
 * Note that you can also #declare within a closure. That way you
 * can selectively export Objects to your own namespaces without
 * leaking variables into the global scope.
 *    
 *     (function(){
 *         // this var is not accessible outside of this
 *         // closures call scope
 *         var hiddenValue= 'defaultValue';
 * 
 *         // export an object that references the hidden
 *         // variable and which can mutate it
 *         puremvc.declare
 *         (
 *              'tld.domain.app.backdoor'
 * 
 *         ,    {
 *                  setValue: function (value)
 *                  {
 *                      // assigns to the hidden var
 *                      hiddenValue= value;
 *                  }
 * 
 *         ,        getValue: function ()
 *                  {
 *                      // reads from the hidden var
 *                      return hiddenValue;
 *                  }
 *              }
 *         );
 *     })();
 *     // indirectly retrieve the hidden variables value
 *     console.assert('defaultValue' === tld.domain.app.backdoor.getValue());
 *     // indirectly set the hidden variables value
 *     tld.domain.app.backdoor.setValue('newValue');
 *     // the hidden var was mutated
 *     console.assert('newValue' === tld.domain.app.backdoor.getValue());
 * 
 * On occasion, primarily during testing, you may want to use declare, 
 * but not have the global object be the namespace root. In these cases you
 * can supply the optional third scope argument.
 * 
 *     var localScope= {}
 *     ,   object= {}
 * 
 *     puremvc.declare('mock.object', object, localScope);
 * 
 *     console.assert(null == window.mock, 'mock namespace is not in global scope');
 *     console.assert(object === localScope.mock.object, 'mock.object is available in localScope');    
 * 
 * @param {string} string
 *  A qualified object name, e.g. 'com.example.Class'
 * 
 * @param {Object} [object]
 *  An object to make the referent of the namespace. 
 * 
 * @param {Object} [scope]
 *  The namespace's root node. If not supplied, the global
 *  scope will be namespaces root node.
 * 
 * @return {Object}
 * 
 *  A reference to the last node of the Object hierarchy created.
 */
function declare (qualifiedName, object, scope)
{
    var nodes= qualifiedName.split('.')
    ,   node= scope || OopHelp.global
    ,   lastNode
    ,   newNode
    ,   nodeName;
                
    for (var i= 0, n= nodes.length; i < n; i++)
    {
        lastNode= node;
        nodeName= nodes[i];
        
        node= (null == node[nodeName] ? node[nodeName] = {} : node[nodeName]);
    }
                    
    if (null == object)
        return node;
                        
    return lastNode[nodeName]= object;
};




/**
 * @member puremvc
 * 
 * Define a new classlet. Current editions of JavaScript do not have classes,
 * but they can be emulated, and this method does this for you, saving you
 * from having to work with Function prototype directly. The method does
 * not extend any Native objects and is entirely opt in. Its particularly
 * usefull if you want to make your PureMvc applications more portable, by
 * decoupling them from a specific OOP abstraction library.
 * 
 * 
 *     puremvc.define
 *     (
 *         // the first object supplied is a class descriptor. None of these
 *         // properties are added to your class, the exception being the
 *         // constructor property, which if supplied, will be your classes
 *         // constructor.
 *         {
 *             // your classes namespace- if supplied, it will be 
 *             // created for you
 *             name: 'com.example.UserMediator'
 * 
 *             // your classes parent class. If supplied, inheritance 
 *             // will be taken care of for you
 *         ,   parent: puremvc.Mediator
 * 
 *             // your classes constructor. If not supplied, one will be 
 *             // created for you
 *         ,   constructor: function UserMediator (component)
 *             {
 *                  puremvc.Mediator.call(this, this.constructor.NAME, component);  
 *             }
 *         }
 *         
 *         // the second object supplied defines your class traits, that is
 *         // the properties that will be defined on your classes prototype
 *         // and thereby on all instances of this class
 *     ,   {
 *             businessMethod: function ()
 *             {
 *                 // impl 
 *             }
 *         }
 * 
 *         // the third object supplied defines your classes 'static' traits
 *         // that is, the methods and properties which will be defined on
 *         // your classes constructor
 *     ,   {
 *             NAME: 'userMediator'
 *         }
 *     );
 * 
 * @param {Object} [classinfo]
 *  An object describing the class. This object can have any or all of
 *  the following properties:
 * 
 *  - name: String  
 *      The classlets name. This can be any arbitrary qualified object
 *      name. 'com.example.Classlet' or simply 'MyClasslet' for example 
 *      The method will automatically create an object hierarchy refering
 *      to your class for you. Note that you will need to capture the 
 *      methods return value to retrieve a reference to your class if the
 *      class name property is not defined.

 *  - parent: Function
 *      The classlets 'superclass'. Your class will be extended from this
 *      if supplied.
 * 
 *  - constructor: Function
 *      The classlets constructor. Note this is *not* a post construct 
 *      initialize method, but your classes constructor Function.
 *      If this attribute is not defined, a constructor will be created for 
 *      you automatically. If you have supplied a parent class
 *      value and not defined the classes constructor, the automatically
 *      created constructor will invoke the super class constructor
 *      automatically. If you have supplied your own constructor and you
 *      wish to invoke it's super constructor, you must do this manually, as
 *      there is no reference to the classes parent added to the constructor
 *      prototype.
 *      
 *  - scope: Object.
 *      For use in advanced scenarios. If the name attribute has been supplied,
 *      this value will be the root of the object hierarchy created for you.
 *      Use it do define your own class hierarchies in private scopes,
 *      accross iFrames, in your unit tests, or avoid collision with third
 *      party library namespaces.
 * 
 * @param {Object} [traits]
 *  An Object, the properties of which will be added to the
 *  class constructors prototype.
 * 
 * @param {Object} [staitcTraits]
 *  An Object, the properties of which will be added directly
 *  to this class constructor
 * 
 * @return {Function}
 *  A reference to the classlets constructor
 */
function define (classInfo, traits, staticTraits)
{
    if (!classInfo)
    {
        classInfo= {}
    }

    var className= classInfo.name
    ,   classParent= classInfo.parent
    ,   doExtend= 'function' === typeof classParent
    ,   classConstructor
    ,   classScope= classInfo.scope || null
    ,   prototype

    if ('parent' in classInfo && !doExtend)
    {
        throw new TypeError('Class parent must be Function');
    }
        
    if (classInfo.hasOwnProperty('constructor'))
    {
        classConstructor= classInfo.constructor
        if ('function' !== typeof classConstructor)
        {
            throw new TypeError('Class constructor must be Function')
        }   
    }
    else // there is no constructor, create one
    {
        if (doExtend) // ensure to call the super constructor
        {
            classConstructor= function ()
            {
                classParent.apply(this, arguments);
            }
        }
        else // just create a Function
        {
            classConstructor= new Function;
        } 
    }

    if (doExtend)
    {
        OopHelp.extend(classConstructor, classParent);
    }
    
    if (traits)
    {
        prototype= classConstructor.prototype
        OopHelp.decorate(prototype, traits);
        // reassign constructor 
        prototype.constructor= classConstructor;
    }
    
    if (staticTraits)
    {
        OopHelp.decorate(classConstructor, staticTraits)
    }
    
    if (className)
    {
        if ('string' !== typeof className)
        {
            throw new TypeError('Class name must be primitive string');
        }
            
        declare (className, classConstructor, classScope);
    }    
    
    return classConstructor;            
};


	
 	/* implementation end */
 	 
 	// define the puremvc global namespace and export the actors
var puremvc =
 	{
 		View: View
 	,	Model: Model
 	,	Controller: Controller
 	,	SimpleCommand: SimpleCommand
 	,	MacroCommand: MacroCommand
 	,	Facade: Facade
 	,	Mediator: Mediator
 	,	Observer: Observer
 	,	Notification: Notification
 	,	Notifier: Notifier
 	,	Proxy: Proxy
 	,	define: define
 	,	declare: declare
 	};



module.exports = puremvc;
},{}],26:[function(require,module,exports){
/**
 * @fileOverview
 * PureMVC State Machine Utility JS Native Port by Saad Shams
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author saad.shams@puremvc.org 
 */

var puremvc = require( './puremvc-1.0.1-mod.js' );
    
/**
 * Constructor
 *
 * Defines a State.
 * @method State
 * @param {string} name id the id of the state
 * @param {string} entering an optional notification name to be sent when entering this state
 * @param {string} exiting an optional notification name to be sent when exiting this state
 * @param {string} changed an optional notification name to be sent when fully transitioned to this state
 * @return 
 */

function State(name, entering, exiting, changed) {  
    this.name = name;
    if(entering) this.entering = entering;
    if(exiting) this.exiting = exiting;
    if(changed) this.changed = changed;
    this.transitions = {};
}

/**
 * Define a transition.
 * @method defineTrans
 * @param {string} action the name of the StateMachine.ACTION Notification type.
 * @param {string} target the name of the target state to transition to.
 * @return 
 */
State.prototype.defineTrans = function(action, target) {
    if(this.getTarget(action) != null) return;
    this.transitions[action] = target;
}

/**
 * Remove a previously defined transition.
 * @method removeTrans
 * @param {string} action
 * @return 
 */
State.prototype.removeTrans = function(action) {
    delete this.transitions[action];
}

/**
 * Get the target state name for a given action.
 * @method getTarget
 * @param {string} action
 * @return State
 */
/**
 * 
 */
State.prototype.getTarget = function(action) {
    return this.transitions[action] ? this.transitions[action] : null;
}

// The state name
State.prototype.name = null;

// The notification to dispatch when entering the state
State.prototype.entering = null;

// The notification to dispatch when exiting the state
State.prototype.exiting = null;

// The notification to dispatch when the state has actually changed
State.prototype.changed = null;

/**
 *  Transition map of actions to target states
 */ 
State.prototype.transitions = null;
    

    
 /**
 * A Finite State Machine implimentation.
 * <P>
 * Handles regisistration and removal of state definitions, 
 * which include optional entry and exit commands for each 
 * state.</P>
 */

/**
 * Constructor
 *
 * @method StateMachine
 * @return 
 */
function StateMachine() {
    puremvc.Mediator.call(this, StateMachine.NAME, null);
    this.states = {};
}
    
StateMachine.prototype = new puremvc.Mediator;
StateMachine.prototype.constructor = StateMachine;

/**
 * Transitions to initial state once registered with Facade
 * @method onRegister
 * @return 
 */
StateMachine.prototype.onRegister = function() {
    if(this.initial) this.transitionTo(this.initial, null);
}

/**
 * Registers the entry and exit commands for a given state.
 * @method registerState
 * @param {State} state the state to which to register the above commands
 * @param {boolean} initial boolean telling if this is the initial state of the system
 * @return 
 */
StateMachine.prototype.registerState = function(state, initial) {
    if(state == null || this.states[state.name] != null) return;
    this.states[state.name] = state;
    if(initial) this.initial = state;
}

/**
 * Remove a state mapping. Removes the entry and exit commands for a given state as well as the state mapping itself.
 * @method removeState
 * @param {string} stateName
 * @return 
 */
StateMachine.prototype.removeState = function(stateName) {
    var state = this.states[stateName];
    if(state == null) return;
    this.states[stateName] = null;
}

/**
 * Transitions to the given state from the current state.
 * <P>
 * Sends the <code>exiting</code> notification for the current state 
 * followed by the <code>entering</code> notification for the new state.
 * Once finally transitioned to the new state, the <code>changed</code> 
 * notification for the new state is sent.</P>
 * <P>
 * If a data parameter is provided, it is included as the body of all
 * three state-specific transition notes.</P>
 * <P>
 * Finally, when all the state-specific transition notes have been
 * sent, a <code>StateMachine.CHANGED</code> note is sent, with the
 * new <code>State</code> object as the <code>body</code> and the name of the 
 * new state in the <code>type</code>.
 *
 * @method transitionTo
 * @param {State} nextState the next State to transition to.
 * @param {Object} data is the optional Object that was sent in the <code>StateMachine.ACTION</code> notification body
 * @return 
 */
StateMachine.prototype.transitionTo = function(nextState, data) {
    // Going nowhere?
    if(nextState == null) return;
    
    // Clear the cancel flag
    this.canceled = false;
    
    // Exit the current State 
    if(this.getCurrentState() && this.getCurrentState().exiting) 
        this.sendNotification(this.getCurrentState().exiting, data, nextState.name);
    
    // Check to see whether the exiting guard has canceled the transition
    if(this.canceled) {
        this.canceled = false;
        return;
    }
    
    // Enter the next State 
    if(nextState.entering)
        this.sendNotification(nextState.entering, data);
    
    // Check to see whether the entering guard has canceled the transition
    if(this.canceled) {
        this.canceled = false;
        return;
    }
    
    // change the current state only when both guards have been passed
    this.setCurrentState(nextState);
    
    // Send the notification configured to be sent when this specific state becomes current 
    if(nextState.changed) {
        this.sendNotification(this.getCurrentState().changed, data);
    }
    
    // Notify the app generally that the state changed and what the new state is 
    this.sendNotification(StateMachine.CHANGED, this.getCurrentState(), this.getCurrentState().name);
}

/**
 * Notification interests for the StateMachine.
 * @method listNotificationInterests
 * @return {Array} Array of Notifications
 */

StateMachine.prototype.listNotificationInterests = function() {
    return [
        StateMachine.ACTION,
        StateMachine.CANCEL
    ];
}

/**
 * Handle notifications the <code>StateMachine</code> is interested in.
 * <P>
 * <code>StateMachine.ACTION</code>: Triggers the transition to a new state.<BR>
 * <code>StateMachine.CANCEL</code>: Cancels the transition if sent in response to the exiting note for the current state.<BR>
 *
 * @method handleNotification
 * @param {Notification} notification
 * @return 
 */
StateMachine.prototype.handleNotification = function(notification) {
    switch(notification.getName()) {
        case StateMachine.ACTION:
            var action = notification.getType();
            var target = this.getCurrentState().getTarget(action);
            var newState = this.states[target];
            if(newState) this.transitionTo(newState, notification.getBody());
            break;
            
        case StateMachine.CANCEL:
            this.canceled = true;
            break;
    }
}

/**
 * Get the current state.
 * @method getCurrentState
 * @return a State defining the machine's current state
 */
StateMachine.prototype.getCurrentState = function() {
    return this.viewComponent;
}

/**
 * Set the current state.
 * @method setCurrentState
 * @param {State} state
 * @return 
 */
StateMachine.prototype.setCurrentState = function(state) {
    this.viewComponent = state;
}

/**
 * Map of States objects by name.
 */
StateMachine.prototype.states = null;

/**
 * The initial state of the FSM.
 */
StateMachine.prototype.initial = null;

/**
 * The transition has been canceled.
 */
StateMachine.prototype.canceled = null;
    
StateMachine.NAME = "StateMachine";

/**
 * Action Notification name. 
 */ 
StateMachine.ACTION = StateMachine.NAME + "/notes/action";

/**
 *  Changed Notification name  
 */ 
StateMachine.CHANGED = StateMachine.NAME + "/notes/changed";

/**
 *  Cancel Notification name  
 */ 
StateMachine.CANCEL = StateMachine.NAME + "/notes/cancel";
    
    
/**
 * Creates and registers a StateMachine described in JSON.
 * 
 * <P>
 * This allows reconfiguration of the StateMachine 
 * without changing any code, as well as making it 
 * easier than creating all the <code>State</code> 
 * instances and registering them with the 
 * <code>StateMachine</code> at startup time.
 * 
 * @ see State
 * @ see StateMachine
 */

/**
 * Constructor
 * @method FSMInjector
 * @param {Object} fsm JSON Object
 * @return 
 */
function FSMInjector(fsm) {
    puremvc.Notifier.call(this);
    this.fsm = fsm;
}
  
FSMInjector.prototype = new puremvc.Notifier;
FSMInjector.prototype.constructor = FSMInjector;

/**
 * Inject the <code>StateMachine</code> into the PureMVC apparatus.
 * <P>
 * Creates the <code>StateMachine</code> instance, registers all the states
 * and registers the <code>StateMachine</code> with the <code>IFacade</code>.
 * @method inject
 * @return 
 */
FSMInjector.prototype.inject = function() {
    // Create the StateMachine
    var stateMachine = new puremvc.statemachine.StateMachine();
    
    // Register all the states with the StateMachine
    var states = this.getStates();
    for(var i=0; i<states.length; i++) {
        stateMachine.registerState(states[i], this.isInitial(states[i].name));
    }
    
    // Register the StateMachine with the facade
    this.facade.registerMediator(stateMachine);
}

/**
 * Get the state definitions.
 * <P>
 * Creates and returns the array of State objects 
 * from the FSM on first call, subsequently returns
 * the existing array.</P>
 *
 * @method getStates
 * @return {Array} Array of States
 */
FSMInjector.prototype.getStates = function() {
    if(this.stateList == null) {
        this.stateList = [];

        var stateDefs = this.fsm.state ? this.fsm.state : [];
        for(var i=0; i<stateDefs.length; i++) {
            var stateDef = stateDefs[i];
            var state = this.createState(stateDef);
            this.stateList.push(state);
        }
    }
    return this.stateList;
}

/**
 * Creates a <code>State</code> instance from its JSON definition.
 * @method createState
 * @param {Object} stateDef JSON Object
 * @return {State} 
 */
/**

 */
FSMInjector.prototype.createState = function(stateDef) {
    // Create State object
    var name = stateDef['@name'];
    var exiting = stateDef['@exiting'];
    var entering = stateDef['@entering'];
    var changed = stateDef['@changed'];
    var state = new puremvc.statemachine.State(name, entering, exiting, changed);
    
    // Create transitions
    var transitions = stateDef.transition ? stateDef.transition : [];
    for(var i=0; i<transitions.length; i++) {
        var transDef = transitions[i];
        state.defineTrans(transDef['@action'], transDef['@target']);
    }
    return state;
}

/**
 * Is the given state the initial state?
 * @method isInitial
 * @param {string} stateName
 * @return {boolean}
 */
FSMInjector.prototype.isInitial = function(stateName) {
    var initial = this.fsm['@initial'];
    return stateName == initial;
}

// The JSON FSM definition
FSMInjector.prototype.fsm = null;

// The List of State objects
FSMInjector.prototype.stateList = null;


puremvc.statemachine =
{
    State: State
    ,	StateMachine: StateMachine
    ,	FSMInjector: FSMInjector
};

module.exports = puremvc.statemachine;
},{"./puremvc-1.0.1-mod.js":25}],27:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImpzL0FwcEZhY2FkZS5qcyIsImpzL2FwcC5qcyIsImpzL2NvbnRyb2xsZXIvY29tbWFuZC9QcmVwQ29udHJvbGxlckNvbW1hbmQuanMiLCJqcy9jb250cm9sbGVyL2NvbW1hbmQvUHJlcE1vZGVsQ29tbWFuZC5qcyIsImpzL2NvbnRyb2xsZXIvY29tbWFuZC9QcmVwVmlld0NvbW1hbmQuanMiLCJqcy9jb250cm9sbGVyL2NvbW1hbmQvUnVuR2FtZUNvbW1hbmQuanMiLCJqcy9jb250cm9sbGVyL2NvbW1hbmQvU3RhcnR1cENvbW1hbmQuanMiLCJqcy9kZWZpbmUvQ29tbWFuZC5qcyIsImpzL2RlZmluZS9NZXNzYWdlLmpzIiwianMvbGliL1VJTG9hZGVyLmpzIiwianMvbGliL2VtaXR0ZXIuanMiLCJqcy9tb2RlbC9wcm94eS9HYW1lUHJveHkuanMiLCJqcy9yZXNvdXJjZS5qcyIsImpzL3ZpZXcvY29tcG9uZW50L0NpdHlMYXllci5qcyIsImpzL3ZpZXcvY29tcG9uZW50L0NvdW50cnlMYXllci5qcyIsImpzL3ZpZXcvY29tcG9uZW50L0dhbWVMYXllci5qcyIsImpzL3ZpZXcvY29tcG9uZW50L0xvZ29MYXllci5qcyIsImpzL3ZpZXcvbWVkaWF0b3IvQ2l0eU1lZGlhdG9yLmpzIiwianMvdmlldy9tZWRpYXRvci9Db3VudHJ5TWVkaWF0b3IuanMiLCJqcy92aWV3L21lZGlhdG9yL0dhbWVNZWRpYXRvci5qcyIsImpzL3ZpZXcvbWVkaWF0b3IvTG9nb01lZGlhdG9yLmpzIiwianMvdmlldy9tZWRpYXRvci9TY2VuZU1lZGlhdG9yLmpzIiwianMvdmlldy93aWRnZXQvQmFzZUxheWVyLmpzIiwibm9kZV9tb2R1bGVzL3B1cmVtdmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHVyZW12Yy9saWIvcHVyZW12Yy0xLjAuMS1tb2QuanMiLCJub2RlX21vZHVsZXMvcHVyZW12Yy9saWIvcHVyZW12Yy1zdGF0ZW1hY2hpbmUtMS4wLW1vZC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeDVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB6eGggb24gMTUvMTAvOS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCJcblxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcbnZhciBTdGFydHVwQ29tbWFuZCA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9jb21tYW5kL1N0YXJ0dXBDb21tYW5kLmpzJyk7XG5cbnZhciBSdW5HYW1lQ29tbWFuZCA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9jb21tYW5kL1J1bkdhbWVDb21tYW5kLmpzJyk7XG5cbnZhciBBcHBGYWNhZGUgPSBwdXJlbXZjLmRlZmluZShcbiAgICAvLyBDTEFTUyBJTkZPXG4gICAge1xuICAgICAgICBuYW1lOiAnQXBwRmFjYWRlJyxcbiAgICAgICAgcGFyZW50OiBwdXJlbXZjLkZhY2FkZSxcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIChtdWx0aXRvbktleSkge1xuICAgICAgICAgICAgcHVyZW12Yy5GYWNhZGUuY2FsbCh0aGlzLCBtdWx0aXRvbktleSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZUNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHB1cmVtdmMuRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckNvbW1hbmQoQXBwRmFjYWRlLlNUQVJUVVAsIFN0YXJ0dXBDb21tYW5kKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kKENvbW1hbmQuUlVOX0dBTUUsIFJ1bkdhbWVDb21tYW5kKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplTW9kZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHB1cmVtdmMuRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplTW9kZWwuY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplVmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHVyZW12Yy5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVWaWV3LmNhbGwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhcnR1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zZW5kTm90aWZpY2F0aW9uKEFwcEZhY2FkZS5TVEFSVFVQKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xuICAgIHtcbiAgICAgICAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uKG11bHRpdG9uS2V5KSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2VNYXAgPSBwdXJlbXZjLkZhY2FkZS5pbnN0YW5jZU1hcDtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGluc3RhbmNlTWFwW211bHRpdG9uS2V5XTtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZU1hcFttdWx0aXRvbktleV0gPSBuZXcgQXBwRmFjYWRlKG11bHRpdG9uS2V5KTtcbiAgICAgICAgfSxcbiAgICAgICAgTkFNRTogJ0FwcEZhY2FkZScsXG4gICAgICAgIFNUQVJUVVA6ICdTdGFydFVwJ1xuICAgIH1cbik7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwRmFjYWRlO1xuXG5nbG9iYWwuZ19hcHAgPSBBcHBGYWNhZGU7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC85LlxuICovXG5cbnJlcXVpcmUoJy4vcmVzb3VyY2UuanMnKTtcbnJlcXVpcmUoJy4vZGVmaW5lL01lc3NhZ2UuanMnKTtcbnJlcXVpcmUoJy4vZGVmaW5lL0NvbW1hbmQuanMnKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIGNjLmdhbWUub25TdGFydCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgY2MubG9nKFwiY2MuZ2FtZS5vblN0YXJ0LS0xXCIpO1xuICAgICAgICBjYy52aWV3LmVuYWJsZVJldGluYShmYWxzZSk7XG4gICAgICAgIGNjLnZpZXcuYWRqdXN0Vmlld1BvcnQodHJ1ZSk7XG4gICAgICAgIGNjLnZpZXcuc2V0RGVzaWduUmVzb2x1dGlvblNpemUoNjQwLCA5NjAsIGNjLlJlc29sdXRpb25Qb2xpY3kuRklYRURfV0lEVEgpO1xuICAgICAgICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZSh0cnVlKTtcblxuICAgICAgICB2YXIgQXBwRmFjYWRlID0gcmVxdWlyZSgnLi9BcHBGYWNhZGUuanMnKTtcbiAgICAgICAgdmFyIGtleSA9ICdTTEdfV09XJztcbiAgICAgICAgQXBwRmFjYWRlLmdldEluc3RhbmNlKGtleSkuc3RhcnR1cCgpO1xuICAgIH07XG4gICAgY2MuZ2FtZS5ydW4oKTtcbn0pKCk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC85LlxuICovXG5cbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XG52YXIgTG9nb01lZGlhdG9yID0gcmVxdWlyZSgnLi4vLi4vdmlldy9tZWRpYXRvci9Mb2dvTWVkaWF0b3IuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxuKFxuICAgIC8vIENMQVNTIElORk9cbiAgICB7XG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuUHJlcENvbnRyb2xsZXJDb21tYW5kJyxcbiAgICAgICAgcGFyZW50OnB1cmVtdmMuU2ltcGxlQ29tbWFuZFxuICAgIH0sXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xuICAgIHtcbiAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgY2MubG9nKCdQcmVwQ29udHJvbGxlckNvbW1hbmQgZXhlY3V0ZScpO1xuICAgICAgICAgICAgdGhpcy5mYWNhZGUuc2VuZE5vdGlmaWNhdGlvbihNZXNzYWdlcy5SVU5fU0NFTkUsIHtuYW1lOkxvZ29NZWRpYXRvci5OQU1FfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXG4gICAge1xuICAgICAgICBOQU1FOiAnUHJlcENvbnRyb2xsZXJDb21tYW5kJ1xuICAgIH1cbik7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzkuXG4gKi9cblxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcbnZhciBHYW1lUHJveHkgPSByZXF1aXJlKCcuLi8uLi9tb2RlbC9wcm94eS9HYW1lUHJveHkuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxuKFxuICAgIC8vIENMQVNTIElORk9cbiAgICB7XG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuUHJlcE1vZGVsQ29tbWFuZCcsXG4gICAgICAgIHBhcmVudDpwdXJlbXZjLlNpbXBsZUNvbW1hbmRcbiAgICB9LFxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIC8v5Zyo5q2k6I635Y+W5pWw5o2uLOazqOWGjFByb3h5XG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3RlclByb3h5KG5ldyBHYW1lUHJveHkoKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXG4gICAge1xuICAgICAgICBOQU1FOiAnUHJlcE1vZGVsQ29tbWFuZCdcbiAgICB9XG4pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzkuXG4gKi9cblxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcbnZhciBTY2VuZU1lZGlhdG9yID0gcmVxdWlyZSgnLi4vLi4vdmlldy9tZWRpYXRvci9TY2VuZU1lZGlhdG9yLmpzJyk7XG52YXIgTG9naW5NZWRpYXRvciA9IHJlcXVpcmUoJy4uLy4uL3ZpZXcvbWVkaWF0b3IvTG9nb01lZGlhdG9yLmpzJyk7XG52YXIgQ2l0eU1lZGlhdG9yID0gcmVxdWlyZSgnLi4vLi4vdmlldy9tZWRpYXRvci9DaXR5TWVkaWF0b3IuanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lIChcbiAgICAvLyBDTEFTUyBJTkZPXG4gICAge1xuICAgICAgICBuYW1lOiAnY29udHJvbGxlci5jb21tYW5kLlByZXBWaWV3Q29tbWFuZCcsXG4gICAgICAgIHBhcmVudDpwdXJlbXZjLlNpbXBsZUNvbW1hbmRcbiAgICB9LFxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIGNjLmxvZygnUHJlcFZpZXdDb21tYW5kIGV4ZWN1dGUnKTtcbiAgICAgICAgICAgIHRoaXMuZmFjYWRlLnJlZ2lzdGVyTWVkaWF0b3IobmV3IFNjZW5lTWVkaWF0b3IoKSk7XG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKG5ldyBMb2dpbk1lZGlhdG9yKCkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xuICAgIHtcbiAgICAgICAgTkFNRTogJ1ByZXBWaWV3Q29tbWFuZCdcbiAgICB9XG4pOyIsIi8qKlxuICogQ3JlYXRlZCBieSB6eGggb24gMTUvMTAvMTYuXG4gKi9cbi8qKlxuICogQ3JlYXRlZCBieSB6eGggb24gMTUvMTAvOS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XG52YXIgR2FtZVByb3h5ID0gcmVxdWlyZSgnLi4vLi4vbW9kZWwvcHJveHkvR2FtZVByb3h5LmpzJyk7XG52YXIgR2FtZU1lZGlhdG9yID0gcmVxdWlyZSgnLi4vLi4vdmlldy9tZWRpYXRvci9HYW1lTWVkaWF0b3IuanMnKTtcbnZhciBDaXR5TWVkaWF0b3IgPSByZXF1aXJlKCcuLi8uLi92aWV3L21lZGlhdG9yL0NpdHlNZWRpYXRvci5qcycpO1xudmFyIENvdW50cnlNZWRpYXRvciA9IHJlcXVpcmUoJy4uLy4uL3ZpZXcvbWVkaWF0b3IvQ291bnRyeU1lZGlhdG9yLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmUoXG4gICAgLy8gQ0xBU1MgSU5GT1xuICAgIHtcbiAgICAgICAgbmFtZTogJ2NvbnRyb2xsZXIuY29tbWFuZC5Jbml0R2FtZScsXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5TaW1wbGVDb21tYW5kXG4gICAgfSxcblxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy/ms6jlhozmlbDmja7ku6PnkIZcbiAgICAgICAgICAgIC8vdGhpcy5mYWNhZGUucmVnaXN0ZXJQcm94eShuZXcgR2FtZVByb3h5KCkpO1xuICAgICAgICAgICAgLy/ms6jlhozmuLjmiI/liJ3lp4vlv4XpobvnmoTkuK3ku4tcbiAgICAgICAgICAgIHZhciBnYW1lTWVkaWF0b3IgPSBuZXcgR2FtZU1lZGlhdG9yKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKGdhbWVNZWRpYXRvcik7XG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKG5ldyBDaXR5TWVkaWF0b3IoKSk7XG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKG5ldyBDb3VudHJ5TWVkaWF0b3IoKSk7XG5cbiAgICAgICAgICAgIGdhbWVNZWRpYXRvci5zd2l0Y2hMYXllcigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXG4gICAge1xuICAgICAgICBOQU1FOiBDb21tYW5kLlJVTl9HQU1FXG4gICAgfVxuXG4pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC85LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcbnZhciBQcmVwTW9kZWxDb21tYW5kID0gcmVxdWlyZSgnLi9QcmVwTW9kZWxDb21tYW5kLmpzJyk7XG52YXIgUHJlcFZpZXdDb21tYW5kID0gcmVxdWlyZSgnLi9QcmVwVmlld0NvbW1hbmQuanMnKTtcbnZhciBQcmVwQ29udHJvbGxlckNvbW1hbmQgPSByZXF1aXJlKCcuL1ByZXBDb250cm9sbGVyQ29tbWFuZC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lKFxuICAgIC8vIENMQVNTIElORk9cbiAgICB7XG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuU3RhcnR1cENvbW1hbmQnLFxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuTWFjcm9Db21tYW5kXG4gICAgfSxcblxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemVNYWNyb0NvbW1hbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKFByZXBNb2RlbENvbW1hbmQpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKFByZXBWaWV3Q29tbWFuZCk7XG4gICAgICAgICAgICB0aGlzLmFkZFN1YkNvbW1hbmQoUHJlcENvbnRyb2xsZXJDb21tYW5kKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xuICAgIHtcbiAgICAgICAgTkFNRTogJ1N0YXJ0dXBDb21tYW5kJ1xuICAgIH1cblxuKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB6eGggb24gMTUvMTAvMjEuXG4gKi9cblxudmFyIENvbW1hbmQgPSB7XG4gICAgUlVOX0dBTUU6IDEwMDAsXG59O1xuXG5nbG9iYWwuQ29tbWFuZCA9IENvbW1hbmQ7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC8xMy5cbiAqL1xuXG5cbnZhciBNZXNzYWdlcyAgPSB7XG4gICAgUlVOX1NDRU5FOiAxLCAgICAgICAgLy9cbiAgICBTSE9XX1ZJRVc6IDIsICAgICAgICAvL3tuYW1lOn1cbiAgICBFTlRFUl9DSVRZOiAzLCAgICAgICAvL+i/m+WFpeS4u+WfjlxuICAgIEdBTUVfREFUQV9DSEFOR0U6NSxcbiAgICBFTlRFUl9DT1VOVFJZOiA2LCAgICAgLy/ov5vlhaXlm73lrrZcbiAgICBMT0FEX0NPTVBMRVRFOiA3XG59O1xuXG5cbmdsb2JhbC5NZXNzYWdlcyA9IE1lc3NhZ2VzO1xuXG5cblxuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzEwLlxuICovXG5cbnZhciBzeiA9IHN6IHx8IHt9O1xuXG5zei5VSUxvYWRlciA9IGNjLkNsYXNzLmV4dGVuZCh7XG4gICAgX2V2ZW50UHJlZml4OiAnX29uJyxcbiAgICBfbWVtYmVyUHJlZml4OiAnXycsXG4gICAgX3dpZGdldEV2ZW50czogW10sXG4gICAgLyoqXG4gICAgICog5Yqg6L29VUnmlofku7ZcbiAgICAgKiBAcGFyYW0gdGFyZ2V05bCGICBqc29uRmlsZeWKoOi9veWHuueahOiKgueCuee7keWumuWIsOeahOebruagh1xuICAgICAqIEBwYXJhbSBqc29uRmlsZSAgY29jb3N0dWRpbyBVSee8lui+keWZqOeUn+aIkOeahGpzb27mlofku7ZcbiAgICAgKi9cbiAgICB3aWRnZXRGcm9tSnNvbkZpbGU6IGZ1bmN0aW9uKHRhcmdldCwganNvbkZpbGUsIG9wdGlvbnMpIHtcbiAgICAgICAgY2MuYXNzZXJ0KHRhcmdldCAmJiBqc29uRmlsZSk7XG4gICAgICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZXZlbnRQcmVmaXggID0gIG9wdGlvbnMuZXZlbnRQcmVmaXggfHwgc3ouVUlMb2FkZXIuREVGQVVMVF9FVkVOVF9QUkVGSVg7XG4gICAgICAgIHRoaXMuX21lbWJlclByZWZpeCA9IG9wdGlvbnMubWVtYmVyUHJlZml4IHx8IHN6LlVJTG9hZGVyLkRFRkFVTFRfTUVNQkVSX1BSRUZJWDtcbiAgICAgICAgLy/nu5Hlrproh6rouqtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIGNjLk5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2JpbmRNZW5iZXJzKHRhcmdldCwgdGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v57uR5a6aanNvbkZpbGVcbiAgICAgICAgaWYgKCFqc29uRmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGpzb24gPSBjYy5sb2FkZXIuZ2V0UmVzKGpzb25GaWxlKTtcbiAgICAgICAgdmFyIHZlcnNpb24gPSBqc29uLnZlcnNpb24gfHwganNvbi5WZXJzaW9uO1xuICAgICAgICB2YXIgcm9vdE5vZGU7XG4gICAgICAgIGlmICh2ZXJzaW9uWzBdID09IDEpIHtcbiAgICAgICAgICAgIHJvb3ROb2RlID0gY2NzLnVpUmVhZGVyLndpZGdldEZyb21Kc29uRmlsZShqc29uRmlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodmVyc2lvblswXSA9PSAyKXtcbiAgICAgICAgICAgIHJvb3ROb2RlID0gY2NzLmNzTG9hZGVyLmNyZWF0ZU5vZGUoanNvbkZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyb290Tm9kZSkge1xuICAgICAgICAgICAgY2MubG9nKFwiTG9hZCBqc29uIGZpbGUgZmFpbGVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvb3ROb2RlLnNldFRvdWNoRW5hYmxlZCkge1xuICAgICAgICAgICAgcm9vdE5vZGUuc2V0VG91Y2hFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldC5yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgICAgICByb290Tm9kZS5zZXROYW1lKFwicm9vdE5vZGVcIik7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBjYy5Ob2RlKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRkQ2hpbGQocm9vdE5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYmluZE1lbmJlcnMocm9vdE5vZGUsIHRhcmdldCk7XG4gICAgICAgIHJldHVybiByb290Tm9kZTtcbiAgICB9LFxuXG4gICAgYmluZE5vZGU6IGZ1bmN0aW9uKG5vZGUsIHRhcmdldCkge1xuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vdGhpcy5fZXZlbnRQcmVmaXggID0gIG9wdGlvbnMuZXZlbnRQcmVmaXggfHwgc3ouVUlMb2FkZXIuREVGQVVMVF9FVkVOVF9QUkVGSVg7XG4gICAgICAgIC8vdGhpcy5fbWVtYmVyUHJlZml4ID0gb3B0aW9ucy5tZW1iZXJQcmVmaXggfHwgc3ouVUlMb2FkZXIuREVGQVVMVF9NRU1CRVJfUFJFRklYO1xuICAgICAgICB2YXIgbm9kZU5hbWUgPSBub2RlLmdldE5hbWUoKTtcblxuICAgICAgICB2YXIgaXNNYXRjaCA9IG5vZGVOYW1lLnN1YnN0cigwLCB0aGlzLl9tZW1iZXJQcmVmaXgubGVuZ3RoKSA9PT0gdGhpcy5fbWVtYmVyUHJlZml4O1xuICAgICAgICAvL+aOp+S7tuWQjeWtmOWcqO+8jOe7keWumuWIsHRhcmdldOS4ilxuICAgICAgICBpZiAoaXNNYXRjaCkge1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRbbm9kZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25vZGVOYW1lXSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlcldpZGdldEV2ZW50KHRhcmdldCwgbm9kZSk7XG4gICAgICAgIH1lbHNlIGlmIChub2RlLnNldFRvdWNoRW5hYmxlZCl7XG4gICAgICAgICAgICBub2RlLnNldFRvdWNoRW5hYmxlZChmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0Lm9uTG9hZGVyQmluZGVkKSB7XG4gICAgICAgICAgICB0YXJnZXQub25Mb2FkZXJCaW5kZWQobm9kZSwgaXNNYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzTWF0Y2g7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDpgJLlvZLlr7lyb290V2lkZ2V05LiL55qE5a2Q6IqC54K56L+b6KGM5oiQ5ZGY57uR5a6aXG4gICAgICogQHBhcmFtIHJvb3RXaWRnZXRcbiAgICAgKiBAcGFyYW0gdGFyZ2V0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYmluZE1lbmJlcnM6IGZ1bmN0aW9uKHJvb3RXaWRnZXQsIHRhcmdldCkge1xuICAgICAgICB2YXIgd2lkZ2V0TmFtZSxcbiAgICAgICAgICAgIGNoaWxkcmVuID0gcm9vdFdpZGdldC5nZXRDaGlsZHJlbigpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbih3aWRnZXQpIHtcbiAgICAgICAgICAgIHdpZGdldE5hbWUgPSB3aWRnZXQuZ2V0TmFtZSgpO1xuXG4gICAgICAgICAgICAvL+S4jee7keWumnJvb3ROb2Rl6IqC54K577yM5Zug5Li65bey57uP57uR5a6a6L+H5LqGXG4gICAgICAgICAgICBpZiAod2lkZ2V0TmFtZSA9PT0gXCJyb290Tm9kZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXNNYXRjaCA9IHdpZGdldE5hbWUuc3Vic3RyKDAsIHNlbGYuX21lbWJlclByZWZpeC5sZW5ndGgpID09PSBzZWxmLl9tZW1iZXJQcmVmaXg7XG4gICAgICAgICAgICAvL+aOp+S7tuWQjeWtmOWcqO+8jOe7keWumuWIsHRhcmdldOS4ilxuICAgICAgICAgICAgLy92YXIgcHJlZml4ID0gd2lkZ2V0TmFtZS5zdWJzdHIoMCwgc2VsZi5fbWVtYmVyUHJlZml4Lmxlbmd0aCk7XG4gICAgICAgICAgICBpZiAoaXNNYXRjaCkge1xuICAgICAgICAgICAgICAgIHRhcmdldFt3aWRnZXROYW1lXSA9IHdpZGdldDtcbiAgICAgICAgICAgICAgICBzZWxmLl9yZWdpc3RlcldpZGdldEV2ZW50KHRhcmdldCwgd2lkZ2V0KTtcbiAgICAgICAgICAgIH1lbHNlIGlmICh3aWRnZXQuc2V0VG91Y2hFbmFibGVkKXtcbiAgICAgICAgICAgICAgICB3aWRnZXQuc2V0VG91Y2hFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldC5vbkxvYWRlckJpbmRlZCAmJiB0YXJnZXQgIT09IHJvb3RXaWRnZXQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQub25Mb2FkZXJCaW5kZWQod2lkZ2V0LCBpc01hdGNoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/nu5HlrprlrZDmjqfku7Ys5Y+v5Lul5a6e546wOiBhLl9iLl9jLl9kIOiuv+mXruWtkOaOp+S7tlxuICAgICAgICAgICAgaWYgKCFyb290V2lkZ2V0W3dpZGdldE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcm9vdFdpZGdldFt3aWRnZXROYW1lXSA9IHdpZGdldDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/lpoLmnpzov5jmnInlrZDoioLngrnvvIzpgJLlvZLov5vljrtcbiAgICAgICAgICAgIGlmICh3aWRnZXQuZ2V0Q2hpbGRyZW5Db3VudCgpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fYmluZE1lbmJlcnMod2lkZ2V0LCB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDojrflj5bmjqfku7bkuovku7ZcbiAgICAgKiBAcGFyYW0gd2lkZ2V0XG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgX2dldFdpZGdldEV2ZW50OiBmdW5jdGlvbih3aWRnZXQpIHtcbiAgICAgICAgdmFyIGJpbmRXaWRnZXRFdmVudCA9IG51bGw7XG4gICAgICAgIHZhciBldmVudHMgPSBzei5VSUxvYWRlci53aWRnZXRFdmVudHM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBiaW5kV2lkZ2V0RXZlbnQgPSBldmVudHNbaV07XG4gICAgICAgICAgICBpZiAoYmluZFdpZGdldEV2ZW50ICYmIHdpZGdldCBpbnN0YW5jZW9mIGJpbmRXaWRnZXRFdmVudC53aWRnZXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJpbmRXaWRnZXRFdmVudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5rOo5YaM5o6n5Lu25LqL5Lu2XG4gICAgICogQHBhcmFtIHRhcmdldFxuICAgICAqIEBwYXJhbSB3aWRnZXRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9yZWdpc3RlcldpZGdldEV2ZW50OiBmdW5jdGlvbih0YXJnZXQsIHdpZGdldCkge1xuXG4gICAgICAgIC8v5oiq5Y+W5YmN57yALOmmluWtl+avjeWkp+WumlxuICAgICAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5nZXRXaWRnZXRFdmVudE5hbWUod2lkZ2V0LCBcIkV2ZW50XCIpO1xuICAgICAgICB2YXIgaXNCaW5kRXZlbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRhcmdldFtldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBpc0JpbmRFdmVudCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WPluS6i+aOp+S7tuS7tuWQjVxuICAgICAgICAgICAgdmFyIHdpZGdldEV2ZW50ID0gdGhpcy5fZ2V0V2lkZ2V0RXZlbnQod2lkZ2V0KTtcbiAgICAgICAgICAgIGlmICghd2lkZ2V0RXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzei51aWxvYWRlci5yZWdpc3RlclRvdWNoRXZlbnQod2lkZ2V0LCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5qOA5p+l5LqL5Lu25Ye95pWwLOeUn+aIkOS6i+S7tuWQjeaVsOe7hFxuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZUFycmF5ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldEV2ZW50LmV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IHRoaXMuZ2V0V2lkZ2V0RXZlbnROYW1lKHdpZGdldCwgd2lkZ2V0RXZlbnQuZXZlbnRzW2ldKTsvL25ld05hbWUgKyB3aWRnZXRFdmVudC5ldmVudHNbaV07XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lQXJyYXkucHVzaChldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W2V2ZW50TmFtZV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBpc0JpbmRFdmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy/kuovku7blk43lupTlh73mlbBcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZXZlbnRGdW5jID0gZnVuY3Rpb24oc2VuZGVyLCB0eXBlKSB7XG4gICAgICAgICAgICB2YXIgY2FsbEJhY2s7XG4gICAgICAgICAgICB2YXIgZnVuY05hbWU7XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBmdW5jTmFtZSA9IGV2ZW50TmFtZUFycmF5W3R5cGVdO1xuICAgICAgICAgICAgICAgIGNhbGxCYWNrID0gdGFyZ2V0W2Z1bmNOYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbEJhY2sgPSB0YXJnZXRbZXZlbnROYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNhbGxCYWNrICYmIHNlbGYuX3dpZGdldEV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmV4ZWNXaWRnZXRFdmVudChzZW5kZXIsIHR5cGUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+W8gOWni1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09IGNjdWkuV2lkZ2V0LlRPVUNIX0JFR0FOKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBzei5VSUxvYWRlci5ERUZBVUxUX1RPVUNIX0xPTkdfVElNRTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbEJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IGNhbGxCYWNrLmNhbGwodGFyZ2V0LCBzZW5kZXIsIHR5cGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8v5qOA5rWL6ZW/5oyJ5LqL5Lu2XG4gICAgICAgICAgICAgICAgZnVuY05hbWUgPSBzei51aWxvYWRlci5nZXRXaWRnZXRFdmVudE5hbWUoc2VuZGVyLCBzei5VSUxvYWRlci5UT1VDSF9MT05HX0VWRU5UKTtcbiAgICAgICAgICAgICAgICB2YXIgdG91Y2hMb25nID0gdGFyZ2V0W2Z1bmNOYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmICh0b3VjaExvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IHRpbWUgfHwgc3ouVUlMb2FkZXIuREVGQVVMVF9UT1VDSF9MT05HX1RJTUU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lID49IDAgJiYgdGltZSA8IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zY2hlZHVsZU9uY2UodG91Y2hMb25nLCB0aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fX3RvdWNoTG9uZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vVG91Y2hNb3ZlZOaXtuino+mZpOmVv+aMieS6i+S7tlxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IGNjdWkuV2lkZ2V0LlRPVUNIX01PVkVEKSB7XG4gICAgICAgICAgICAgICAgZnVuY05hbWUgPSBzei51aWxvYWRlci5nZXRXaWRnZXRFdmVudE5hbWUoc2VuZGVyLCBzei5VSUxvYWRlci5UT1VDSF9MT05HX0VWRU5UKTtcbiAgICAgICAgICAgICAgICB2YXIgc2NoZWR1bGVGdW5jID0gdGFyZ2V0W2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoc2NoZWR1bGVGdW5jICYmIHRhcmdldC5fX3RvdWNoTG9uZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHQxID0gc2VuZGVyLmdldFRvdWNoQmVnYW5Qb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHQyID0gc2VuZGVyLmdldFRvdWNoTW92ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhwdDEueCAtIHB0Mi54KSA+IDE1IHx8IE1hdGguYWJzKHB0MS55IC0gcHQyLnkpID4gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC51bnNjaGVkdWxlKHNjaGVkdWxlRnVuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5sb2coXCJUb3VjaE1vdmVkOiDop6PpmaTplb/mjInkuovku7ZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX190b3VjaExvbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+mVv+aMieino+mZpFxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IGNjdWkuV2lkZ2V0LlRPVUNIX0VOREVEIHx8IHR5cGUgPT09IGNjdWkuV2lkZ2V0LlRPVUNIX0NBTkNFTEVEKSB7XG4gICAgICAgICAgICAgICAgZnVuY05hbWUgPSBzei51aWxvYWRlci5nZXRXaWRnZXRFdmVudE5hbWUoc2VuZGVyLCBzei5VSUxvYWRlci5UT1VDSF9MT05HX0VWRU5UKTtcbiAgICAgICAgICAgICAgICB2YXIgc2NoZWR1bGVGdW5jID0gdGFyZ2V0W2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoc2NoZWR1bGVGdW5jICYmIHRhcmdldC5fX3RvdWNoTG9uZykge1xuICAgICAgICAgICAgICAgICAgICAvL3RhcmdldC5fdG91Y2hMb25nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcIlRvdWNoRW5lZDog6Kej6Zmk6ZW/5oyJ5LqL5Lu2XCIpO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQudW5zY2hlZHVsZShzY2hlZHVsZUZ1bmMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/kuovku7blm57osINcbiAgICAgICAgICAgIGlmIChjYWxsQmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxCYWNrLmNhbGwodGFyZ2V0LCBzZW5kZXIsIHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5rOo5YaM5LqL5Lu255uR5ZCsXG4gICAgICAgIGlmIChpc0JpbmRFdmVudCkge1xuICAgICAgICAgICAgd2lkZ2V0LnNldFRvdWNoRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgICAgIGlmICh3aWRnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHdpZGdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50RnVuYywgdGFyZ2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2lkZ2V0LmFkZFRvdWNoRXZlbnRMaXN0ZW5lcihldmVudEZ1bmMsIHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZXhlY1dpZGdldEV2ZW50OiBmdW5jdGlvbihzZW5kZXIsIHR5cGUpIHtcbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgdGhpcy5fd2lkZ2V0RXZlbnRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaWYoaXRlbS53aWRnZXRFdmVudC5jYWxsKGl0ZW0udGFyZ2V0LCBzZW5kZXIsIHR5cGUpID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5o6n5Lu25LqL5Lu25o2V6I63LCDlj6/ku6XnlLHlrZDnsbvph43lhpnmraTlh73mlbBcbiAgICAgKiBAcGFyYW0gc2VuZGVyXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIC8vX29uV2lkZ2V0RXZlbnQ6IGZ1bmN0aW9uKHNlbmRlciwgdHlwZSkge1xuICAgIC8vXG4gICAgLy99XG5cbiAgICAvL19vbk5vZGVFdmVudDogZnVuY3Rpb24oc2VuZGVyLCB0eXBlKSB7XG4gICAgLy9cbiAgICAvL31cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB3aWRnZXRcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFdpZGdldEV2ZW50TmFtZTogZnVuY3Rpb24od2lkZ2V0LCBldmVudCkge1xuICAgICAgICBjYy5hc3NlcnQod2lkZ2V0KTtcbiAgICAgICAgdmFyIG5hbWUgPSB3aWRnZXQuZ2V0TmFtZSgpO1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgbmFtZSA9IG5hbWVbdGhpcy5fbWVtYmVyUHJlZml4Lmxlbmd0aF0udG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UodGhpcy5fbWVtYmVyUHJlZml4Lmxlbmd0aCArIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50UHJlZml4ICsgbmFtZSArIGV2ZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50UHJlZml4ICsgbmFtZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZWdpc3RlcldpZGdldEV2ZW50OiBmdW5jdGlvbih0YXJnZXQsIHdpZGdldEV2ZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2lkZ2V0RXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhpcy5fd2lkZ2V0RXZlbnRzLnB1c2goe3RhcmdldDogdGFyZ2V0ICx3aWRnZXRFdmVudDogd2lkZ2V0RXZlbnR9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVXaWRnZXRFdmVudDogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fd2lkZ2V0RXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fd2lkZ2V0RXZlbnRzW2ldLnRhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2lkZ2V0RXZlbnRzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8v5LqL5Lu25YmN57yAXG5zei5VSUxvYWRlci5ERUZBVUxUX0VWRU5UX1BSRUZJWCA9IFwiX29uXCI7XG4vL+aIkOWRmOWJjee8gFxuc3ouVUlMb2FkZXIuREVGQVVMVF9NRU1CRVJfUFJFRklYID0gXCJfXCI7XG4vL+m7mOiupOmVv+aMieinpuWPkeaXtumXtFxuc3ouVUlMb2FkZXIuREVGQVVMVF9UT1VDSF9MT05HX1RJTUUgPSAwLjU7XG4vL+mVv+aMieS6i+S7tuWQjVxuc3ouVUlMb2FkZXIuVE9VQ0hfTE9OR19FVkVOVCA9IFwiVG91Y2hMb25nXCI7XG4vL+inpuaRuOS6i+S7tlxuc3ouVUlMb2FkZXIudG91Y2hFdmVudHMgPSBbXCJUb3VjaEJlZ2FuXCIsIFwiVG91Y2hNb3ZlZFwiLCBcIlRvdWNoRW5kZWRcIiwgXCJUb3VjaENhbmNlbGVkXCIsIHN6LlVJTG9hZGVyLlRPVUNIX0xPTkdfRVZFTlRdO1xuLy/mjqfku7bkuovku7bliJfooahcbnN6LlVJTG9hZGVyLndpZGdldEV2ZW50cyA9IFtcbiAgICAvL0J1dHRvblxuICAgIHt3aWRnZXRUeXBlOiBjY3VpLkJ1dHRvbiwgZXZlbnRzOiBzei5VSUxvYWRlci50b3VjaEV2ZW50c30sXG4gICAgLy9JbWFnZVZpZXdcbiAgICB7d2lkZ2V0VHlwZTogY2N1aS5JbWFnZVZpZXcsIGV2ZW50czogc3ouVUlMb2FkZXIudG91Y2hFdmVudHN9LFxuICAgIC8vVGV4dEZpbGVkXG4gICAge3dpZGdldFR5cGU6IGNjdWkuVGV4dEZpZWxkLCBldmVudHM6IFtcIkF0dGFjaFdpdGhJTUVcIiwgXCJEZXRhY2hXaXRoSU1FXCIsIFwiSW5zZXJ0VGV4dFwiLCBcIkRlbGV0ZUJhY2t3YXJkXCJdfSxcbiAgICAvL0NoZWNrQm94XG4gICAge3dpZGdldFR5cGU6IGNjdWkuQ2hlY2tCb3gsIGV2ZW50czogW1wiU2VsZWN0ZWRcIiwgXCJVbnNlbGVjdGVkXCJdfSxcbiAgICAvL0xpc3RWaWV3XG4gICAge3dpZGdldFR5cGU6IGNjdWkuTGlzdFZpZXcsIGV2ZW50czpbXCJTZWxlY3RlZEl0ZW1cIl19LFxuICAgIC8vUGFuZWxcbiAgICB7d2lkZ2V0VHlwZTogY2N1aS5MYXlvdXQsIGV2ZW50czogc3ouVUlMb2FkZXIudG91Y2hFdmVudHN9LFxuICAgIC8vQk1Gb250XG4gICAge3dpZGdldFR5cGU6IGNjdWkuVGV4dEJNRm9udCwgZXZlbnRzOiBzei5VSUxvYWRlci50b3VjaEV2ZW50c30sXG4gICAgLy9UZXh0XG4gICAge3dpZGdldFR5cGU6IGNjdWkuVGV4dCwgZXZlbnRzOiBzei5VSUxvYWRlci50b3VjaEV2ZW50c30sXG4gICAgLy9sYXN0IG11c3QgbnVsbFxuICAgIG51bGxcbl07XG5cbnN6LnVpbG9hZGVyID0gbmV3IHN6LlVJTG9hZGVyKCk7XG5cbi8qKlxuICogY2Mubm9kZeinpuaRuOS6i+S7tuazqOWGjOWHveaVsFxuICogQHBhcmFtIG5vZGVcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEBwYXJhbSB0b3VjaEV2ZW50XG4gKiBAcGFyYW0gc3dhbGxvd1RvdWNoZXNcbiAqIEByZXR1cm5zIHsqfVxuICovXG5zei51aWxvYWRlci5yZWdpc3RlclRvdWNoRXZlbnQgPSBmdW5jdGlvbihub2RlLCB0YXJnZXQsIHRvdWNoRXZlbnQsIHN3YWxsb3dUb3VjaGVzKSB7XG5cbiAgICBpZiAoIW5vZGUgaW5zdGFuY2VvZiBjYy5Ob2RlICkge1xuICAgICAgICBjYy5sb2coJ3BhcmFtIFwibm9kZVwiIGlzIG5vdCBjYy5Ob2RlIHR5cGUnKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBjY3VpLldpZGdldCkge1xuICAgICAgICBjYy5sb2coJ3BhcmFtIFwibm9kZVwiIENhbiBub3QgYmUgY2N1aS5XaWRnZXQgdHlwZScpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwgbm9kZTtcblxuICAgIGlmIChzd2FsbG93VG91Y2hlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN3YWxsb3dUb3VjaGVzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgdG91Y2hMaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgZXZlbnQ6IHRvdWNoRXZlbnQgfHwgY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgICBzd2FsbG93VG91Y2hlczogc3dhbGxvd1RvdWNoZXMgPyB0cnVlIDogZmFsc2VcbiAgICB9KTtcblxuICAgIHZhciBub2RlRXZlbnRzID0gWydvblRvdWNoQmVnYW4nLCAnb25Ub3VjaE1vdmVkJywgJ29uVG91Y2hFbmRlZCddO1xuICAgIG5vZGVFdmVudHMuZm9yRWFjaChmdW5jdGlvbihldmVudE5hbWUsIGluZGV4KSB7XG5cbiAgICAgICAgdG91Y2hMaXN0ZW5lcltldmVudE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdG91Y2hOb2RlID0gYXJndW1lbnRzWzFdLmdldEN1cnJlbnRUYXJnZXQoKTtcbiAgICAgICAgICAgIHZhciBldmVudCA9IHN6LnVpbG9hZGVyLmdldFdpZGdldEV2ZW50TmFtZSh0b3VjaE5vZGUsIHN6LlVJTG9hZGVyLnRvdWNoRXZlbnRzW2luZGV4XSk7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFtldmVudF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwb2ludCA9IGFyZ3VtZW50c1swXS5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgIHBvaW50ID0gdG91Y2hOb2RlLmNvbnZlcnRUb05vZGVTcGFjZShwb2ludCk7XG4gICAgICAgICAgICAgICAgdmFyIHJlY3QgPSBjYy5yZWN0KDAsMCwgdG91Y2hOb2RlLndpZHRoLCB0b3VjaE5vZGUuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBpZiAoIWNjLnJlY3RDb250YWluc1BvaW50KHJlY3QsIHBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBhcmdzLnVuc2hpZnQodG91Y2hOb2RlKTtcbiAgICAgICAgICAgIHZhciByZXQgPSB0YXJnZXRbZXZlbnRdLmFwcGx5KHRhcmdldCwgYXJncyk7XG5cbiAgICAgICAgICAgIC8vdG9kbzog5ZON5bqUdWlsb2FkIGhvb2vkuovku7ZcbiAgICAgICAgICAgIC8vaWYgKHN6LnVpbG9hZGVyLl9vbk5vZGVFdmVudCkge1xuICAgICAgICAgICAgLy8gICAgc3oudWlsb2FkZXIuX29uTm9kZUV2ZW50KHRhcmdldCwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICAvL31cblxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih0b3VjaExpc3RlbmVyLCBub2RlKTtcbiAgICByZXR1cm4gdG91Y2hMaXN0ZW5lcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3o7XG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICAgIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICAgIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgICAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG4gICAgRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgICAgICAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxuICAgICAgICAgICAgLnB1c2goZm4pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgdGhpcy5vZmYoZXZlbnQsIG9uKTtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBvbi5mbiA9IGZuO1xuICAgIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG4gICAgRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuICAgICAgICBFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgICAgICAgICAgRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgLy8gYWxsXG4gICAgICAgICAgICAgICAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgICAgICAgICAgICAgICB2YXIgY2I7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcblxuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgIHJldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gICAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59OyIsIi8qKlxuICogQ3JlYXRlZCBieSB6eGggb24gMTUvMTAvMTYuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcbihcbiAgICAvLyBDTEFTUyBJTkZPXG4gICAge1xuICAgICAgICBuYW1lOiAnbW9kZWwucHJveHkuR2FtZVByb3h5JyxcbiAgICAgICAgcGFyZW50OiBwdXJlbXZjLlByb3h5LFxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwdXJlbXZjLlByb3h5LmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMubG9hZERhdGEoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXG4gICAge1xuICAgICAgICBnb2xkOiAwLFxuICAgICAgICBmb29kOiAwLFxuICAgICAgICB3b29kOiAwLFxuICAgICAgICBpbnRlcnZhbElkOiBudWxsLFxuXG4gICAgICAgIGxvYWREYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciB0aW1lID0gMDtcbiAgICAgICAgICAgIC8v5qih5ouf5byC5q2l5Yqg6L295pWw5o2uXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRpbWUgKz0gMTA7XG4gICAgICAgICAgICAgICAgc2VsZi5nb2xkID0gMTAwMDtcbiAgICAgICAgICAgICAgICBzZWxmLmZvb2QgPSAxMDAwO1xuICAgICAgICAgICAgICAgIHNlbGYud29vZCA9IDEwMDA7XG4gICAgICAgICAgICAgICAgc2VsZi5zZW5kTm90aWZpY2F0aW9uKE1lc3NhZ2VzLkxPQURfQ09NUExFVEUpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5hc3luY0RhdGEoKTtcbiAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFzeW5jRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmdvbGQgKz0gXy5yYW5kb20oLTEwMCwgMTAwKTtcbiAgICAgICAgICAgICAgICBzZWxmLmZvb2QgKz0gXy5yYW5kb20oLTEwMCwgMTAwKTtcbiAgICAgICAgICAgICAgICBzZWxmLndvb2QgKz0gXy5yYW5kb20oLTEwMCwgMTAwKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuc2VuZE5vdGlmaWNhdGlvbihNZXNzYWdlcy5HQU1FX0RBVEFfQ0hBTkdFKTtcbiAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xuICAgIHtcbiAgICAgICAgTkFNRTogJ0dhbWVQcm94eSdcbiAgICB9XG4pO1xuXG4iLCJ2YXIgcmVzID0ge1xuICAgIEhlbGxvV29ybGRfcG5nIDogXCJyZXMvSGVsbG9Xb3JsZC5wbmdcIixcbiAgICBMSTA3X2pwZzogXCJyZXMvdWkvTG9naW4vTEkwNy5qcGdcIixcbiAgICBMb2dpbl9qc29uOiBcInJlcy91aS9Mb2dpbi5qc29uXCIsXG4gICAgTGF5ZXJfanNvbjogXCJyZXMvdWkvTGF5ZXIuanNvblwiLFxuICAgIEJhUzMxX3BuZzogXCJyZXMvdWkvTG9naW4vQmFTMzEucG5nXCIsXG4gICAgQmFTMzJfcG5nOiBcInJlcy91aS9Mb2dpbi9CYVMzMi5wbmdcIixcbiAgICBNYWluTWVudV9qc29uOiBcInJlcy91aS9NYWluTWVudS5qc29uXCIsXG4gICAgTU0wMV9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDEucG5nXCIsXG4gICAgTU0wMl9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDIucG5nXCIsXG4gICAgTU0wM19wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDMucG5nXCIsXG4gICAgTU0wNF9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDQucG5nXCIsXG4gICAgTU0wNV9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDUucG5nXCIsXG4gICAgTU0wNl9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDYucG5nXCIsXG4gICAgTU0wN19wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDcucG5nXCIsXG4gICAgTU0wOF9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDgucG5nXCIsXG4gICAgTU0wOV9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMDkucG5nXCIsXG4gICAgTU0xMF9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTAucG5nXCIsXG4gICAgTU0xMl9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTIucG5nXCIsXG4gICAgTU0xM19wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTMucG5nXCIsXG4gICAgTU0xNF9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTQucG5nXCIsXG4gICAgTU0xNV9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTUucG5nXCIsXG4gICAgTU0xNl9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTYucG5nXCIsXG4gICAgTU0xN19wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTcucG5nXCIsXG4gICAgTU0xOF9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTgucG5nXCIsXG4gICAgTU0xOV9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMTkucG5nXCIsXG4gICAgTU0yMF9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMjAucG5nXCIsXG4gICAgTU0yMV9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMjEucG5nXCIsXG4gICAgTU0yMl9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMjIucG5nXCIsXG4gICAgTU0yM19wbmc6IFwicmVzL3VpL01haW5NZW51L01NMjMucG5nXCIsXG4gICAgTU0yNF9wbmc6IFwicmVzL3VpL01haW5NZW51L01NMjQucG5nXCIsXG4gICAgQ291bnRyeUxheWVyX2pzb246IFwicmVzL3VpL0NvbnRyeUxheWVyLmpzb25cIixcbiAgICBXb3JsZF8xX3BuZzogXCJyZXMvdWkvV29ybGQvV29ybGRfMS5wbmdcIixcbiAgICBXb3JsZF8xX3BsaXN0OiBcInJlcy91aS9Xb3JsZC9Xb3JsZF8xLnBsaXN0XCIsXG4gICAgV29ybGRfNF9wbGlzdDogXCJyZXMvdWkvV29ybGQvV29ybGRfNC5wbGlzdFwiLFxuICAgIFdvcmxkXzRfcG5nOiBcInJlcy91aS9Xb3JsZC9Xb3JsZF80LnBuZ1wiLFxuICAgIFdvcmxkTWFwX3RteDogXCJyZXMvdWkvV29ybGRNYXAudG14XCIsXG4gICAgdGlsZV9pc29fb2Zmc2V0X3BuZzogXCJyZXMvdWkvdGlsZV9pc29fb2Zmc2V0LnBuZ1wiLFxuICAgIHRpbGVfaXNvX29mZnNldF90bXg6IFwicmVzL3VpL3RpbGVfaXNvX29mZnNldC50bXhcIixcbiAgICBpc29fcG5nOiBcInJlcy91aS9pc28ucG5nXCIsXG4gICAgaXNvX3Rlc3QxX3RteDogXCJyZXMvdWkvaXNvLXRlc3QxLnRteFwiXG59O1xuXG52YXIgZ19yZXNvdXJjZXMgPSBbXTtcbmZvciAodmFyIGkgaW4gcmVzKSB7XG4gICAgZ19yZXNvdXJjZXMucHVzaChyZXNbaV0pO1xufVxuXG5nbG9iYWwuR19SRVMgPSB7XG4gICAgcmVzOiByZXMsXG4gICAgcmVzb3VyY2VzOiBnX3Jlc291cmNlc1xufTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzkuXG4gKi9cblxudmFyIEJhc2VMYXllciA9IHJlcXVpcmUoJy4uL3dpZGdldC9CYXNlTGF5ZXIuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlTGF5ZXIuZXh0ZW5kKHtcbiAgICBjdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5oYXNGcmFtZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuY29sb3JGcmFtZS5zZXRDb2xvcihjYy5jb2xvci5XSElURSk7XG4gICAgfVxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC85LlxuICovXG5cbnZhciBCYXNlTGF5ZXIgPSByZXF1aXJlKCcuLi93aWRnZXQvQmFzZUxheWVyLmpzJyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbm1vZHVsZS5leHBvcnRzID0gQmFzZUxheWVyLmV4dGVuZCh7XG4gICAgbWFwOiBudWxsLFxuICAgIF9pc01vdmVkOiBudWxsLFxuICAgIGN0b3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB2YXIgbWFwID0gbmV3IGNjLlRNWFRpbGVkTWFwKEdfUkVTLnJlcy5Xb3JsZE1hcF90bXgpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKG1hcCwgMCk7XG5cbiAgICAgICAgbWFwLnNjYWxlID0gMC4yO1xuICAgICAgICAvL21hcC5hbmNob3JYID0gMC41O1xuICAgICAgICAvL21hcC5hbmNob3JZID0gMC41O1xuICAgICAgICBtYXAueCA9IC1tYXAubWFwV2lkdGggKiBtYXAudGlsZVdpZHRoIC8gMiArIGNjLndpblNpemUud2lkdGggLyAyOy8vLW1hcC5nZXRCb3VuZGluZ0JveCgpLndpZHRoIC8gMiArIGNjLndpblNpemUud2lkdGggLyAyO1xuICAgICAgICBtYXAueSA9IC1tYXAubWFwSGVpZ2h0ICogbWFwLnRpbGVIZWlnaHQgKyBjYy53aW5TaXplLmhlaWdodDsgIC8vbWFwLnkgPSAtbWFwLmdldEJvdW5kaW5nQm94KCkuaGVpZ2h0ICsgY2Mud2luU2l6ZS5oZWlnaHQgLyAyO1xuICAgICAgICB0aGlzLm1hcCA9IG1hcDtcblxuICAgICAgICAvL3RoaXMubW92ZVRvdGlsZShjYy5wKDUwLCA1MCkpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaE1vdmVkOiBmdW5jdGlvbihzZW5kZXIsIHRvdWNoKSB7XG5cbiAgICAgICAgdmFyIGRpZmYgPSB0b3VjaC5nZXREZWx0YSgpO1xuICAgICAgICB2YXIgY3VycmVudFBvcyA9IHRoaXMubWFwLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIGN1cnJlbnRQb3MgPSBjYy5wQWRkKGRpZmYsIGN1cnJlbnRQb3MpO1xuICAgICAgICB0aGlzLm1hcC5zZXRQb3NpdGlvbihjdXJyZW50UG9zKTtcbiAgICAgICAgY2MubG9nKFwibW92ZWQ6XCIgKyBKU09OLnN0cmluZ2lmeShjdXJyZW50UG9zKSk7XG4gICAgICAgIHRoaXMuX2lzTW92ZWQgPSB0cnVlO1xuXG4gICAgICAgIHZhciBwID0gdGhpcy5jb252ZXJ0VG90aWxlKGN1cnJlbnRQb3MpO1xuICAgICAgICBjYy5sb2coY2MuZm9ybWF0U3RyKFwidGlsZSAlZCwlZFwiLCBwLngsIHAueSkpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEVuZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc01vdmVkKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUb3RpbGUoY2MucChfLnJhbmRvbSgwLCAxMDApLCBfLnJhbmRvbSgwLCAxMDApKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faXNNb3ZlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBtb3ZlVG90aWxlOiBmdW5jdGlvbihwb3NpdGlvbikge1xuICAgICAgICBjYy5sb2coXCI+PlwiICsgSlNPTi5zdHJpbmdpZnkocG9zaXRpb24pKTtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMubWFwO1xuICAgICAgICB2YXIgbWFwU2l6ZSA9IG1hcC5nZXRNYXBTaXplKCk7XG4gICAgICAgIHZhciB0aWxlV2lkdGggPSBtYXAuZ2V0Qm91bmRpbmdCb3goKS53aWR0aCAvIG1hcC5nZXRNYXBTaXplKCkud2lkdGg7XG4gICAgICAgIHZhciB0aWxlSGVpZ2h0ID0gbWFwLmdldEJvdW5kaW5nQm94KCkuaGVpZ2h0IC8gbWFwLmdldE1hcFNpemUoKS5oZWlnaHQ7XG5cbiAgICAgICAgdmFyIHZhcmlhYmxlMSA9IC0ocG9zaXRpb24ueCArIG1hcFNpemUud2lkdGggLyAyIC0gbWFwU2l6ZS5oZWlnaHQpICogdGlsZVdpZHRoICogdGlsZUhlaWdodCA7XG4gICAgICAgIHZhciB2YXJpYWJsZTIgPSAtKC1wb3NpdGlvbi55ICsgbWFwU2l6ZS53aWR0aCAvIDIgKyBtYXBTaXplLmhlaWdodCkgKiB0aWxlV2lkdGggKiB0aWxlSGVpZ2h0IDtcblxuICAgICAgICB2YXIgcG9zeCA9ICh2YXJpYWJsZTEgKyB2YXJpYWJsZTIpIC8gMiAvIHRpbGVIZWlnaHQgKyBjYy53aW5TaXplLndpZHRoIC8gMjtcbiAgICAgICAgdmFyIHBvc3kgPSAodmFyaWFibGUyIC0gdmFyaWFibGUxKSAvIDIgLyB0aWxlV2lkdGggKyBjYy53aW5TaXplLmhlaWdodDtcblxuICAgICAgICBjYy5sb2coY2MuZm9ybWF0U3RyKFwic2NyZWVuICVkLCVkXCIsIHBvc3gsIHBvc3kpKTtcblxuICAgICAgICB2YXIgcCA9IHRoaXMuY29udmVydFRvdGlsZShjYy5wKHBvc3gsIHBvc3kpKTtcbiAgICAgICAgY2MubG9nKFwidGlsZSAlZCwlZFwiLCBwLngsIHAueSk7XG4gICAgICAgIHJldHVybiBtYXAuc2V0UG9zaXRpb24ocG9zeCwgcG9zeSk7XG5cbiAgICB9LFxuXG4gICAgY29udmVydFRvdGlsZTogZnVuY3Rpb24ocG9zaXRpb24pIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMubWFwO1xuXG4gICAgICAgIHBvc2l0aW9uLnggLT0gY2Mud2luU2l6ZS53aWR0aCAvIDI7XG4gICAgICAgIHBvc2l0aW9uLnkgLT0gY2Mud2luU2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgdmFyICBtYXBTaXplID0gbWFwLmdldE1hcFNpemUoKTtcbiAgICAgICAgdmFyICB0aWxlV2lkdGggPSBtYXAuZ2V0Qm91bmRpbmdCb3goKS53aWR0aCAvIG1hcC5nZXRNYXBTaXplKCkud2lkdGg7XG4gICAgICAgIHZhciAgdGlsZUhlaWdodCA9IG1hcC5nZXRCb3VuZGluZ0JveCgpLmhlaWdodCAvIG1hcC5nZXRNYXBTaXplKCkuaGVpZ2h0O1xuICAgICAgICAvL3ZhciBwb3N4ID0gbWFwU2l6ZS53aWR0aCAvIDIgKyBwb3NpdGlvbi54IC8gdGlsZVdpZHRoO1xuICAgICAgICAvL3ZhciBwb3N5ID0gbWFwU2l6ZS5oZWlnaHQgKyBwb3NpdGlvbi55IC8gdGlsZUhlaWdodDtcbiAgICAgICAgdmFyIHJvdyA9IHBvc2l0aW9uLnkgLyB0aWxlSGVpZ2h0O1xuICAgICAgICB2YXIgY29sID0gcG9zaXRpb24ueCAvIHRpbGVXaWR0aDtcblxuICAgICAgICB2YXIgcG9zeCA9IG1hcFNpemUud2lkdGggKyByb3cgKyBjb2wgKyBtYXBTaXplLndpZHRoIC8gMjtcbiAgICAgICAgdmFyIHBvc3kgPSBtYXBTaXplLmhlaWdodCArIHJvdyArIGNvbCArIG1hcFNpemUud2lkdGggLyAyO1xuXG4gICAgICAgIHJldHVybiBjYy5wKHBvc3gsIHBvc3kpO1xuICAgIH1cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSB6eGggb24gMTUvMTAvMTUuXG4gKi9cblxudmFyIEJhc2VMYXllciA9IHJlcXVpcmUoJy4uL3dpZGdldC9CYXNlTGF5ZXIuanMnKTtcbm1vZHVsZS5leHBvcnRzID0gQmFzZUxheWVyLmV4dGVuZCh7XG4gICAgZGF0YTogbnVsbCxcbiAgICBjdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sb2FkVUkoR19SRVMucmVzLk1haW5NZW51X2pzb24pO1xuICAgIH0sXG5cbiAgICBzZXREYXRhOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMuX2Zvb2Quc2V0U3RyaW5nKFwi6aOf54mpOlwiICsgZGF0YS5mb29kKTtcbiAgICAgICAgdGhpcy5fd29vZC5zdHJpbmcgPSBcIuacqOadkDpcIiArIGRhdGEud29vZDtcbiAgICAgICAgdGhpcy5fZ29sZC5zdHJpbmcgPSBcIumHkeW4gTpcIiArIGRhdGEuZ29sZDtcbiAgICB9LFxuXG5cbiAgICBfb25Ib21lVG91Y2hFbmRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vY2MubG9nKFwiX29uSG9tZVRvdWNoRW5kZWRcIik7XG4gICAgICAgIGlmICh0aGlzLnN3aXRjaExheWVyKSB7XG4gICAgICAgICAgICB0aGlzLnN3aXRjaExheWVyKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uVGFza1RvdWNoRW5kZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5sb2coXCJfb25UYXNrVG91Y2hFbmRlZFwiKTtcbiAgICB9XG5cblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC85LlxuICovXG52YXIgQmFzZUxheWVyID0gcmVxdWlyZSgnLi4vd2lkZ2V0L0Jhc2VMYXllci5qcycpO1xudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvZW1pdHRlci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VMYXllci5leHRlbmQoe1xuICAgIGN0b3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmhhc0ZyYW1lID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sb2FkVUkoR19SRVMucmVzLkxvZ2luX2pzb24pO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEVuZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbnRlckdhbWUoKTtcbiAgICB9XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC8xNS5cbiAqL1xudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcbnZhciBDaXR5TGF5ZXIgPSByZXF1aXJlKCcuLi9jb21wb25lbnQvQ2l0eUxheWVyLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcbihcbiAgICAvLyBDTEFTUyBJTkZPXG4gICAge1xuICAgICAgICBuYW1lOiAndmlldy5tZWRpYXRvci5DaXR5TWVkaWF0b3InLFxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuTWVkaWF0b3IsXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwdXJlbXZjLk1lZGlhdG9yLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xuICAgIHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy52aWV3Q29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50ID0gbmV3IENpdHlMYXllcigpO1xuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbXBvbmVudC5yZXRhaW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKiogQG92ZXJyaWRlICovXG4gICAgICAgIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgTWVzc2FnZXMuRU5URVJfQ0lUWSxcbiAgICAgICAgICAgICAgICBNZXNzYWdlcy5FTlRFUl9DT1VOVFJZXG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICAgICAgaGFuZGxlTm90aWZpY2F0aW9uOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5nZXROYW1lKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VzLkVOVEVSX0NJVFk6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmFjYWRlLnNlbmROb3RpZmljYXRpb24oTWVzc2FnZXMuU0hPV19WSUVXLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOnRoaXMuY29uc3RydWN0b3IuTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHpPcmRlcjogMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlcy5FTlRFUl9DT1VOVFJZOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xuICAgICAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXG4gICAge1xuICAgICAgICBOQU1FOiAnQ2l0eU1lZGlhdG9yJ1xuICAgIH1cbik7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHp4aCBvbiAxNS8xMC8xNi5cbiAqL1xuXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xudmFyIENvdW50cnlMYXllciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudC9Db3VudHJ5TGF5ZXIuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxuKFxuICAgIC8vIENMQVNTIElORk9cbiAgICB7XG4gICAgICAgIG5hbWU6ICd2aWV3Lm1lZGlhdG9yLkNvdW50cnlNZWRpYXRvcicsXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvcixcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXG4gICAge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnZpZXdDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQgPSBuZXcgQ291bnRyeUxheWVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50LnJldGFpbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIEdfUkVTLnJlcy5Xb3JsZF8xX3BuZyxcbiAgICAgICAgICAgICAgICBHX1JFUy5yZXMuV29ybGRfNF9wbmcsXG4gICAgICAgICAgICAgICAgR19SRVMucmVzLldvcmxkTWFwX3RteFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICAgICAgbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBNZXNzYWdlcy5FTlRFUl9DT1VOVFJZLFxuICAgICAgICAgICAgICAgIE1lc3NhZ2VzLkVOVEVSX0NJVFlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xuICAgICAgICBoYW5kbGVOb3RpZmljYXRpb246IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIHN3aXRjaCAobm90aWZpY2F0aW9uLmdldE5hbWUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZXMuRU5URVJfQ09VTlRSWTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWNhZGUuc2VuZE5vdGlmaWNhdGlvbihNZXNzYWdlcy5TSE9XX1ZJRVcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6dGhpcy5jb25zdHJ1Y3Rvci5OQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgek9yZGVyOiAxXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VzLkVOVEVSX0NJVFk6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZpZXdDb21wb25lbnQgJiYgdGhpcy52aWV3Q29tcG9uZW50LmdldFBhcmVudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xuICAgICAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKiogQG92ZXJyaWRlICovXG4gICAgICAgIG9uUmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIE5BTUU6ICdDb3VudHJ5TWVkaWF0b3InXG4gICAgfVxuKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzE2LlxuICovXG5cbi8qKlxuICogQ3JlYXRlZCBieSB6eGggb24gMTUvMTAvMTUuXG4gKi9cbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XG52YXIgR2FtZUxheWVyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50L0dhbWVMYXllci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXG4oXG4gICAgLy8gQ0xBU1MgSU5GT1xuICAgIHtcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuR2FtZU1lZGlhdG9yJyxcbiAgICAgICAgcGFyZW50OiBwdXJlbXZjLk1lZGlhdG9yLFxuICAgICAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHVyZW12Yy5NZWRpYXRvci5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IuTkFNRSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZVByb3h5ID0gdGhpcy5mYWNhZGUucmV0cmlldmVQcm94eSgnR2FtZVByb3h5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2l0eUxheWVyOiBudWxsLFxuICAgICAgICBjaGlsZE1lZGlhdG9yOiBudWxsLFxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy52aWV3Q29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50ID0gbmV3IEdhbWVMYXllcigpO1xuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbXBvbmVudC5zZXREYXRhKHRoaXMuX2dhbWVQcm94eSk7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50LnJldGFpbigpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50LnN3aXRjaExheWVyID0gdGhpcy5zd2l0Y2hMYXllci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN3aXRjaExheWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkTWVkaWF0b3IgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZhY2FkZS5zZW5kTm90aWZpY2F0aW9uKE1lc3NhZ2VzLkVOVEVSX0NPVU5UUlkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZhY2FkZS5zZW5kTm90aWZpY2F0aW9uKE1lc3NhZ2VzLkVOVEVSX0NJVFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICAgICAgbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBNZXNzYWdlcy5FTlRFUl9DSVRZLFxuICAgICAgICAgICAgICAgIE1lc3NhZ2VzLkVOVEVSX0NPVU5UUlksXG4gICAgICAgICAgICAgICAgTWVzc2FnZXMuR0FNRV9EQVRBX0NIQU5HRVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiogQG92ZXJyaWRlICovXG4gICAgICAgIGhhbmRsZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuXG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBnYW1lVmlld0hhbmRsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLnZpZXdDb21wb25lbnQgJiYgc2VsZi52aWV3Q29tcG9uZW50LmdldFBhcmVudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLmZhY2FkZS5zZW5kTm90aWZpY2F0aW9uKE1lc3NhZ2VzLlNIT1dfVklFVywge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOnNlbGYuY29uc3RydWN0b3IuTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgek9yZGVyOiAxMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc3dpdGNoIChub3RpZmljYXRpb24uZ2V0TmFtZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlcy5FTlRFUl9DSVRZOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkTWVkaWF0b3IgPSAxO1xuICAgICAgICAgICAgICAgICAgICBnYW1lVmlld0hhbmRsZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZXMuRU5URVJfQ09VTlRSWTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZE1lZGlhdG9yID0gMjtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZVZpZXdIYW5kbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlcy5HQU1FX0RBVEFfQ0hBTkdFOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQuc2V0RGF0YSh0aGlzLl9nYW1lUHJveHkpO1xuICAgICAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIE5BTUU6ICdHYW1lTWVkaWF0b3InXG4gICAgfVxuKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzEwLlxuICovXG5cbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XG52YXIgTG9nb0xheWVyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50L0xvZ29MYXllci5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmUoXG4gICAgLy8gQ0xBU1MgSU5GT1xuICAgIHtcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuTG9naW5NZWRpYXRvcicsXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvcixcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXG4gICAge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50ID0gbmV3IExvZ29MYXllcigpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLy90aGlzLnZpZXdDb21wb25lbnQuZW50ZXJHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyAgICBzZWxmLnNlbmROb3RpZmljYXRpb24oQ29tbWFuZC5SVU5fR0FNRSk7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIEdfUkVTLnJlc291cmNlcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKiogQG92ZXJyaWRlICovXG4gICAgICAgIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgQ29tbWFuZC5SVU5fR0FNRSxcbiAgICAgICAgICAgICAgICBNZXNzYWdlcy5MT0FEX0NPTVBMRVRFXG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICAgICAgaGFuZGxlTm90aWZpY2F0aW9uOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5nZXROYW1lKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIENvbW1hbmQuUlVOX0dBTUU6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmFjYWRlLnJlbW92ZU1lZGlhdG9yKHRoaXMuY29uc3RydWN0b3IuTkFNRSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZXMuTE9BRF9DT01QTEVURTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kTm90aWZpY2F0aW9uKENvbW1hbmQuUlVOX0dBTUUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICAgICAgb25SZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZpZXdDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xuICAgIHtcbiAgICAgICAgTkFNRTogJ0xvZ2luTWVkaWF0b3InXG4gICAgfVxuKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzkuXG4gKi9cblxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXG4oXG4gICAgLy8gQ0xBU1MgSU5GT1xuICAgIHtcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuU2NlbmVNZWRpYXRvcicsXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvcixcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcbiAgICB7XG5cbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xuICAgICAgICBsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIE1lc3NhZ2VzLlJVTl9TQ0VORSxcbiAgICAgICAgICAgICAgICBNZXNzYWdlcy5TSE9XX1ZJRVdcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xuICAgICAgICBoYW5kbGVOb3RpZmljYXRpb246IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcblxuXG4gICAgICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5nZXROYW1lKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VzLlJVTl9TQ0VORTpcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBub3RpZmljYXRpb24uZ2V0Qm9keSgpLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3TWVkaWF0b3IgPSB0aGlzLmZhY2FkZS5yZXRyaWV2ZU1lZGlhdG9yKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blNjZW5lKHZpZXdNZWRpYXRvcik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZXMuU0hPV19WSUVXOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dMYXllcihub3RpZmljYXRpb24uZ2V0Qm9keSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBydW5TY2VuZTogZnVuY3Rpb24odmlld01lZGlhdG9yKSB7XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICByZXMgPSB2aWV3TWVkaWF0b3IuZ2V0UmVzKCk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVSdW5TY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZpZXdNZWRpYXRvci5pbml0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHNjZW5lID0gc2VsZi5nZXRWaWV3Q29tcG9uZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFzY2VuZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQgPSBuZXcgY2MuU2NlbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmUgPSBzZWxmLmdldFZpZXdDb21wb25lbnQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSB2aWV3TWVkaWF0b3IuZ2V0Vmlld0NvbXBvbmVudCgpO1xuICAgICAgICAgICAgICAgIHNjZW5lLmFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5ydW5TY2VuZShzY2VuZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIWNjLnN5cy5pc05hdGl2ZSAmJiAhXy5pc0VtcHR5KHJlcykpIHtcbiAgICAgICAgICAgICAgICBjYy5sb2FkZXIubG9hZChyZXMsIGhhbmRsZVJ1blNjZW5lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlUnVuU2NlbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzaG93TGF5ZXI6IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgICAgICAgIHZhciByZXMsXG4gICAgICAgICAgICAgICAgcGFyZW50TWVkaWF0b3IgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHZpZXdNZWRpYXRvciA9IHRoaXMuZmFjYWRlLnJldHJpZXZlTWVkaWF0b3IoYm9keS5uYW1lKTtcblxuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoYm9keS5wYXJlbnQpKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50TWVkaWF0b3IgPSB0aGlzLmZhY2FkZS5yZXRyaWV2ZU1lZGlhdG9yKGJvZHkucGFyZW50KTtcbiAgICAgICAgICAgICAgICBjYy5hc3NlcnQocGFyZW50TWVkaWF0b3IsIFwi5LiN6IO95qOA57Si5YiwXCIgKyBib2R5LnBhcmVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2aWV3TWVkaWF0b3IuZ2V0UmVzKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gdmlld01lZGlhdG9yLmdldFJlcygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGFuZGxlQ3JlYXRlTGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZpZXdNZWRpYXRvci5pbml0KSkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3TWVkaWF0b3IuaW5pdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjaGlsZExheWVyID0gdmlld01lZGlhdG9yLmdldFZpZXdDb21wb25lbnQoKTtcbiAgICAgICAgICAgICAgICBwYXJlbnRNZWRpYXRvci5nZXRWaWV3Q29tcG9uZW50KCkuYWRkQ2hpbGQoY2hpbGRMYXllciwgYm9keS56T3JkZXIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCFjYy5zeXMuaXNOYXRpdmUgJiYgIV8uaXNFbXB0eShyZXMpKSB7XG4gICAgICAgICAgICAgICAgY2MubG9hZGVyLmxvYWQocmVzLCBoYW5kbGVDcmVhdGVMYXllcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhbmRsZUNyZWF0ZUxheWVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcbiAgICB7XG4gICAgICAgIE5BTUU6ICdTY2VuZU1lZGlhdG9yJ1xuICAgIH1cbik7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgenhoIG9uIDE1LzEwLzEwLlxuICovXG5cbi8qKlxuIO+8iDHvvInljYrpgI/mmI7og4zmma/lsYLvvJtcbiDvvIgy77yJ54K55Ye75LqL5Lu277yM5o6n5Yi26L+Z5Liq5bGC5piv5ZCm5Y+v6YCP6L+H54K55Ye777ybXG4g77yIM++8ieW8ueWHuuaXtuaYr+WQpuW4puW8ueWHuuWKqOeUu++8iOWmguaPkOekuuW8ueahhlRpcHPvvIzmiJblip/og73pobVQYWdl5omA6ZyA6KaB55qE5by55Ye65Yqo55S777yJ77ybXG4g77yINO+8ieaLk+WxleaWueazle+8iOWmgu+8jOW9k+WJjemhtemdouWKoOi9vWNvY29zdHVkaW/nmoTmlofku7bnmoTmlrnms5XvvIzlhoXlrZjmjqfliLbnrqHnkIbnrYnvvIlcbiAqL1xudmFyIHN6ID0gcmVxdWlyZSgnLi4vLi4vbGliL1VJTG9hZGVyLmpzJyk7XG5cbkJhc2VMYXllciA9IGNjLkxheWVyLmV4dGVuZCh7XG4gICAgaXNTaG93QWN0aW9uOiAgICAgICBmYWxzZSwgICAgICAvL+aYr+WQpuS7peWKqOeUu+aYvuekulxuICAgIGhhc0ZyYW1lOiAgICAgICAgICAgZmFsc2UsICAgICAgLy/mmK/lkKbmmL7npLrog4zmma9cbiAgICBjb2xvckZyYW1lOiAgICAgICAgIG51bGwsICAgICAgIC8v6aKc6Imy6IOM5pmvXG4gICAgY3RvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIC8v5Yib5bu65Y2K6YCP5piO56qX5Y+jXG4gICAgICAgIHRoaXMuY3JlYXRlRnJhbWUoKTtcbiAgICAgICAgLy/mmL7npLrliqjnlLtcbiAgICAgICAgdGhpcy5zaG93QWN0aW9uKCk7XG4gICAgfSxcblxuICAgIG9uRW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAvL+azqOWGjOinpuaRuOS6i+S7tlxuICAgICAgICBzei51aWxvYWRlci5yZWdpc3RlclRvdWNoRXZlbnQodGhpcyk7XG4gICAgfSxcblxuICAgIHNldE1lZGlhdG9yOiBmdW5jdGlvbihtZWRpYXRvcikge1xuICAgICAgICB0aGlzLm1lZGlhdG9yID0gbWVkaWF0b3I7XG4gICAgfSxcblxuICAgIGNyZWF0ZUZyYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5oYXNGcmFtZSkge1xuICAgICAgICAgICAgdGhpcy5jb2xvckZyYW1lID0gbmV3IGNjLkxheWVyQ29sb3IoY2MuY29sb3IoMCwgMCwgMCwgMjAwKSk7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuY29sb3JGcmFtZSwgLTEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNob3dBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pc1Nob3dBY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NhbGUoMC44KTtcbiAgICAgICAgICAgIHZhciBzY2FsZVRvMSA9IG5ldyBjYy5TY2FsZVRvKDAuMSwgMS4xKS5lYXNpbmcoY2MuZWFzZUluKDIpKTtcbiAgICAgICAgICAgIHZhciBzY2FsZVRvMiA9IG5ldyBjYy5TY2FsZVRvKDAuMSwgMSk7XG4gICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBuZXcgY2MuU2VxdWVuY2Uoc2NhbGVUbzEsIHNjYWxlVG8yKTtcbiAgICAgICAgICAgIHRoaXMucnVuQWN0aW9uKHNlcXVlbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsb2FkVUk6IGZ1bmN0aW9uKHVpRmlsZSkge1xuICAgICAgICB2YXIgcm9vdCA9IHN6LnVpbG9hZGVyLndpZGdldEZyb21Kc29uRmlsZSh0aGlzLCB1aUZpbGUpO1xuICAgICAgICAvL+iHquWKqOmAguW6lOWxj+W5lVxuICAgICAgICByb290LnNldENvbnRlbnRTaXplKGNjLndpblNpemUpO1xuICAgICAgICBjY3VpLmhlbHBlci5kb0xheW91dChyb290KVxuICAgIH0sXG5cbiAgICBzZXRDb2xvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sb3JGcmFtZSkge1xuICAgICAgICAgICAgdGhpcy5jb2xvckZyYW1lLnNldENvbG9yKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uVG91Y2hNb3ZlZCB8fCB0aGlzLl9vblRvdWNoRW5kZWQgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUxheWVyOyIsImV4cG9ydHMucHVyZW12YyA9IHJlcXVpcmUoXCIuL2xpYi9wdXJlbXZjLTEuMC4xLW1vZC5qc1wiKTtcbmV4cG9ydHMucHVyZW12Yy5zdGF0ZW1hY2hpbmUgPSByZXF1aXJlKFwiLi9saWIvcHVyZW12Yy1zdGF0ZW1hY2hpbmUtMS4wLW1vZC5qc1wiKTsiLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBSZXVzZSBnb3Zlcm5lZCBieSBDcmVhdGl2ZSBDb21tb25zIEF0dHJpYnV0aW9uIDMuMCBcbiAqIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMC91cy9cbiAqIEBhdXRob3IgZGF2aWQuZm9sZXlAcHVyZW12Yy5vcmcgXG4gKi9cblxuXG4gXHQvKiBpbXBsZW1lbnRhdGlvbiBiZWdpbiAqL1xuXHRcblx0XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5PYnNlcnZlclxuICogXG4gKiBBIGJhc2UgT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24uXG4gKiBcbiAqIEFuIE9ic2VydmVyIGlzIGFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyBpbmZvcm1hdGlvblxuICogYWJvdXQgYW4gaW50ZXJlc3RlZCBvYmplY3Qgd2l0aCBhIG1ldGhvZCB0aGF0IHNob3VsZCBcbiAqIGJlIGNhbGxlZCB3aGVuIGEgcGFydGljdWxhciBOb3RpZmljYXRpb24gaXMgYnJvYWRjYXN0LiBcbiAqIFxuICogSW4gUHVyZU1WQywgdGhlIE9ic2VydmVyIGNsYXNzIGFzc3VtZXMgdGhlc2UgcmVzcG9uc2liaWxpdGllczpcbiAqIFxuICogLSBFbmNhcHN1bGF0ZSB0aGUgbm90aWZpY2F0aW9uIChjYWxsYmFjaykgbWV0aG9kIG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIC0gRW5jYXBzdWxhdGUgdGhlIG5vdGlmaWNhdGlvbiBjb250ZXh0ICh0aGlzKSBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3QuXG4gKiAtIFByb3ZpZGUgbWV0aG9kcyBmb3Igc2V0dGluZyB0aGUgbm90aWZpY2F0aW9uIG1ldGhvZCBhbmQgY29udGV4dC5cbiAqIC0gUHJvdmlkZSBhIG1ldGhvZCBmb3Igbm90aWZ5aW5nIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIFxuICogXG4gKiBUaGUgbm90aWZpY2F0aW9uIG1ldGhvZCBvbiB0aGUgaW50ZXJlc3RlZCBvYmplY3Qgc2hvdWxkIHRha2UgXG4gKiBvbmUgcGFyYW1ldGVyIG9mIHR5cGUgTm90aWZpY2F0aW9uLlxuICogXG4gKiBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG5vdGlmeU1ldGhvZCBcbiAqICB0aGUgbm90aWZpY2F0aW9uIG1ldGhvZCBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBub3RpZnlDb250ZXh0IFxuICogIHRoZSBub3RpZmljYXRpb24gY29udGV4dCBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3RcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPYnNlcnZlciAobm90aWZ5TWV0aG9kLCBub3RpZnlDb250ZXh0KVxue1xuICAgIHRoaXMuc2V0Tm90aWZ5TWV0aG9kKG5vdGlmeU1ldGhvZCk7XG4gICAgdGhpcy5zZXROb3RpZnlDb250ZXh0KG5vdGlmeUNvbnRleHQpO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIE9ic2VydmVycyBub3RpZmljYXRpb24gbWV0aG9kLlxuICogXG4gKiBUaGUgbm90aWZpY2F0aW9uIG1ldGhvZCBzaG91bGQgdGFrZSBvbmUgcGFyYW1ldGVyIG9mIHR5cGUgTm90aWZpY2F0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBub3RpZnlNZXRob2RcbiAqICB0aGUgbm90aWZpY2F0aW9uIChjYWxsYmFjaykgbWV0aG9kIG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5zZXROb3RpZnlNZXRob2Q9IGZ1bmN0aW9uIChub3RpZnlNZXRob2QpXG57XG4gICAgdGhpcy5ub3RpZnk9IG5vdGlmeU1ldGhvZDtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBPYnNlcnZlcnMgbm90aWZpY2F0aW9uIGNvbnRleHQuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBub3RpZnlDb250ZXh0XG4gKiAgdGhlIG5vdGlmaWNhdGlvbiBjb250ZXh0ICh0aGlzKSBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3QuXG4gKiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5zZXROb3RpZnlDb250ZXh0PSBmdW5jdGlvbiAobm90aWZ5Q29udGV4dClcbntcbiAgICB0aGlzLmNvbnRleHQ9IG5vdGlmeUNvbnRleHQ7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgRnVuY3Rpb24gdGhhdCB0aGlzIE9ic2VydmVyIHdpbGwgaW52b2tlIHdoZW4gaXQgaXMgbm90aWZpZWQuXG4gKiBcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLmdldE5vdGlmeU1ldGhvZD0gZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm4gdGhpcy5ub3RpZnk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgT2JqZWN0IHRoYXQgd2lsbCBzZXJ2ZSBhcyB0aGUgT2JzZXJ2ZXJzIGNhbGxiYWNrIGV4ZWN1dGlvbiBjb250ZXh0XG4gKiBcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5nZXROb3RpZnlDb250ZXh0PSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XG59O1xuXG4vKipcbiAqIE5vdGlmeSB0aGUgaW50ZXJlc3RlZCBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogIFRoZSBOb3RpZmljYXRpb24gdG8gcGFzcyB0byB0aGUgaW50ZXJlc3RlZCBvYmplY3RzIG5vdGlmaWNhdGlvbiBtZXRob2RcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5ub3RpZnlPYnNlcnZlcj0gZnVuY3Rpb24gKG5vdGlmaWNhdGlvbilcbntcbiAgICB0aGlzLmdldE5vdGlmeU1ldGhvZCgpLmNhbGwodGhpcy5nZXROb3RpZnlDb250ZXh0KCksIG5vdGlmaWNhdGlvbik7XG59O1xuXG4vKipcbiAqIENvbXBhcmUgYW4gb2JqZWN0IHRvIHRoaXMgT2JzZXJ2ZXJzIG5vdGlmaWNhdGlvbiBjb250ZXh0LlxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gKiAgXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5PYnNlcnZlci5wcm90b3R5cGUuY29tcGFyZU5vdGlmeUNvbnRleHQ9IGZ1bmN0aW9uIChvYmplY3QpXG57XG4gICAgcmV0dXJuIG9iamVjdCA9PT0gdGhpcy5jb250ZXh0O1xufTtcblxuLyoqXG4gKiBUaGUgT2JzZXJ2ZXJzIGNhbGxiYWNrIEZ1bmN0aW9uXG4gKiBcbiAqIEBwcml2YXRlXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5ub3RpZnk9IG51bGw7XG5cbi8qKlxuICogVGhlIE9ic2VydmVycyBjYWxsYmFjayBPYmplY3RcbiAqIEBwcml2YXRlXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5PYnNlcnZlci5wcm90b3R5cGUuY29udGV4dD0gbnVsbDtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk5vdGlmaWNhdGlvblxuICogXG4gKiBBIGJhc2UgTm90aWZpY2F0aW9uIGltcGxlbWVudGF0aW9uLlxuICogXG4gKiBQdXJlTVZDIGRvZXMgbm90IHJlbHkgdXBvbiB1bmRlcmx5aW5nIGV2ZW50IG1vZGVscyBzdWNoIGFzIHRoZSBvbmUgcHJvdmlkZWQgXG4gKiB3aXRoIHRoZSBET00gb3Igb3RoZXIgYnJvd3NlciBjZW50cmljIFczQyBldmVudCBtb2RlbHMuXG4gKiBcbiAqIFRoZSBPYnNlcnZlciBQYXR0ZXJuIGFzIGltcGxlbWVudGVkIHdpdGhpbiBQdXJlTVZDIGV4aXN0cyB0byBzdXBwb3J0IFxuICogZXZlbnQtZHJpdmVuIGNvbW11bmljYXRpb24gYmV0d2VlbiB0aGUgYXBwbGljYXRpb24gYW5kIHRoZSBhY3RvcnMgb2YgdGhlIE1WQyBcbiAqIHRyaWFkLlxuICogXG4gKiBOb3RpZmljYXRpb25zIGFyZSBub3QgbWVhbnQgdG8gYmUgYSByZXBsYWNlbWVudCBmb3IgZXZlbnRzIGluIHRoZSBicm93c2VyLiBcbiAqIEdlbmVyYWxseSwgTWVkaWF0b3IgaW1wbGVtZW50b3JzIHBsYWNlIGV2ZW50IGxpc3RlbmVycyBvbiB0aGVpciB2aWV3IFxuICogY29tcG9uZW50cywgd2hpY2ggdGhleSB0aGVuIGhhbmRsZSBpbiB0aGUgdXN1YWwgd2F5LiBUaGlzIG1heSBsZWFkIHRvIHRoZSBcbiAqIGJyb2FkY2FzdCBvZiBOb3RpZmljYXRpb25zIHRvIHRyaWdnZXIgY29tbWFuZHMgb3IgdG8gY29tbXVuaWNhdGUgd2l0aCBvdGhlciBcbiAqIE1lZGlhdG9ycy4ge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9LFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfVxuICogYW5kIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9XG4gKiBpbnN0YW5jZXMgY29tbXVuaWNhdGUgd2l0aCBlYWNoIG90aGVyIGFuZCBcbiAqIHtAbGluayBwdXJlbXZjLk1lZGlhdG9yIE1lZGlhdG9yfXNcbiAqIGJ5IGJyb2FkY2FzdGluZyBOb3RpZmljYXRpb25zLlxuICogXG4gKiBBIGtleSBkaWZmZXJlbmNlIGJldHdlZW4gYnJvd3NlciBldmVudHMgYW5kIFB1cmVNVkMgTm90aWZpY2F0aW9ucyBpcyB0aGF0XG4gKiBldmVudHMgZm9sbG93IHRoZSAnQ2hhaW4gb2YgUmVzcG9uc2liaWxpdHknIHBhdHRlcm4sICdidWJibGluZycgdXAgdGhlIFxuICogZGlzcGxheSBoaWVyYXJjaHkgdW50aWwgc29tZSBwYXJlbnQgY29tcG9uZW50IGhhbmRsZXMgdGhlIGV2ZW50LCB3aGlsZSBcbiAqIFB1cmVNVkMgTm90aWZpY2F0aW9uIGZvbGxvdyBhICdQdWJsaXNoL1N1YnNjcmliZScgcGF0dGVybi4gUHVyZU1WQyBjbGFzc2VzIFxuICogbmVlZCBub3QgYmUgcmVsYXRlZCB0byBlYWNoIG90aGVyIGluIGEgcGFyZW50L2NoaWxkIHJlbGF0aW9uc2hpcCBpbiBvcmRlciB0byBcbiAqIGNvbW11bmljYXRlIHdpdGggb25lIGFub3RoZXIgdXNpbmcgTm90aWZpY2F0aW9ucy5cbiAqIFxuICogQGNvbnN0cnVjdG9yIFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqICBUaGUgTm90aWZpY2F0aW9uIG5hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYm9keV1cbiAqICBUaGUgTm90aWZpY2F0aW9uIGJvZHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdHlwZV1cbiAqICBUaGUgTm90aWZpY2F0aW9uIHR5cGVcbiAqL1xuZnVuY3Rpb24gTm90aWZpY2F0aW9uKG5hbWUsIGJvZHksIHR5cGUpXG57XG4gICAgdGhpcy5uYW1lPSBuYW1lO1xuICAgIHRoaXMuYm9keT0gYm9keTtcbiAgICB0aGlzLnR5cGU9IHR5cGU7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9uIGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICogIFRoZSBuYW1lIG9mIHRoZSBOb3RpZmljYXRpb24gaW5zdGFuY2VcbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5nZXROYW1lPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbn07XG5cbi8qKlxuICogU2V0IHRoaXMgTm90aWZpY2F0aW9ucyBib2R5LiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBib2R5XG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLnNldEJvZHk9IGZ1bmN0aW9uKGJvZHkpXG57XG4gICAgdGhpcy5ib2R5PSBib2R5O1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIE5vdGlmaWNhdGlvbiBib2R5LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5nZXRCb2R5PSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMuYm9keVxufTtcblxuLyoqXG4gKiBTZXQgdGhlIHR5cGUgb2YgdGhlIE5vdGlmaWNhdGlvbiBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zZXRUeXBlPSBmdW5jdGlvbih0eXBlKVxue1xuICAgIHRoaXMudHlwZT0gdHlwZTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSB0eXBlIG9mIHRoZSBOb3RpZmljYXRpb24gaW5zdGFuY2UuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5nZXRUeXBlPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbn07XG5cbi8qKlxuICogR2V0IGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBOb3RpZmljYXRpb24gaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUudG9TdHJpbmc9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgbXNnPSBcIk5vdGlmaWNhdGlvbiBOYW1lOiBcIiArIHRoaXMuZ2V0TmFtZSgpO1xuICAgIG1zZys9IFwiXFxuQm9keTpcIiArICgodGhpcy5ib2R5ID09IG51bGwgKSA/IFwibnVsbFwiIDogdGhpcy5ib2R5LnRvU3RyaW5nKCkpO1xuICAgIG1zZys9IFwiXFxuVHlwZTpcIiArICgodGhpcy50eXBlID09IG51bGwgKSA/IFwibnVsbFwiIDogdGhpcy50eXBlKTtcbiAgICByZXR1cm4gbXNnO1xufTtcblxuLyoqXG4gKiBUaGUgTm90aWZpY2F0aW9ucyBuYW1lLlxuICpcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLm5hbWU9IG51bGw7XG5cbi8qKlxuICogVGhlIE5vdGlmaWNhdGlvbnMgdHlwZS5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS50eXBlPSBudWxsO1xuXG4vKipcbiAqIFRoZSBOb3RpZmljYXRpb25zIGJvZHkuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuYm9keT0gbnVsbDtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk5vdGlmaWVyXG4gKiBcbiAqIEEgQmFzZSBOb3RpZmllciBpbXBsZW1lbnRhdGlvbi5cbiAqIFxuICoge0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH0sIFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfSwgXG4gKiB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciBNZWRpYXRvcn0gYW5kIFxuICoge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9XG4gKiBhbGwgaGF2ZSBhIG5lZWQgdG8gc2VuZCBOb3RpZmljYXRpb25zXG4gKiBcbiAqIFRoZSBOb3RpZmllciBpbnRlcmZhY2UgcHJvdmlkZXMgYSBjb21tb24gbWV0aG9kIGNhbGxlZCAjc2VuZE5vdGlmaWNhdGlvbiB0aGF0IFxuICogcmVsaWV2ZXMgaW1wbGVtZW50YXRpb24gY29kZSBvZiB0aGUgbmVjZXNzaXR5IHRvIGFjdHVhbGx5IGNvbnN0cnVjdCBcbiAqIE5vdGlmaWNhdGlvbnMuXG4gKiBcbiAqIFRoZSBOb3RpZmllciBjbGFzcywgd2hpY2ggYWxsIG9mIHRoZSBhYm92ZSBtZW50aW9uZWQgY2xhc3Nlc1xuICogZXh0ZW5kLCBwcm92aWRlcyBhbiBpbml0aWFsaXplZCByZWZlcmVuY2UgdG8gdGhlIFxuICoge0BsaW5rIHB1cmVtdmMuRmFjYWRlIEZhY2FkZX1cbiAqIE11bHRpdG9uLCB3aGljaCBpcyByZXF1aXJlZCBmb3IgdGhlIGNvbnZpZW5pZW5jZSBtZXRob2RcbiAqIGZvciBzZW5kaW5nIE5vdGlmaWNhdGlvbnMgYnV0IGFsc28gZWFzZXMgaW1wbGVtZW50YXRpb24gYXMgdGhlc2VcbiAqIGNsYXNzZXMgaGF2ZSBmcmVxdWVudCBcbiAqIHtAbGluayBwdXJlbXZjLkZhY2FkZSBGYWNhZGV9IGludGVyYWN0aW9ucyBcbiAqIGFuZCB1c3VhbGx5IHJlcXVpcmUgYWNjZXNzIHRvIHRoZSBmYWNhZGUgYW55d2F5LlxuICogXG4gKiBOT1RFOiBJbiB0aGUgTXVsdGlDb3JlIHZlcnNpb24gb2YgdGhlIGZyYW1ld29yaywgdGhlcmUgaXMgb25lIGNhdmVhdCB0b1xuICogbm90aWZpZXJzLCB0aGV5IGNhbm5vdCBzZW5kIG5vdGlmaWNhdGlvbnMgb3IgcmVhY2ggdGhlIGZhY2FkZSB1bnRpbCB0aGV5XG4gKiBoYXZlIGEgdmFsaWQgbXVsdGl0b25LZXkuIFxuICogXG4gKiBUaGUgbXVsdGl0b25LZXkgaXMgc2V0OlxuICogICAtIG9uIGEgQ29tbWFuZCB3aGVuIGl0IGlzIGV4ZWN1dGVkIGJ5IHRoZSBDb250cm9sbGVyXG4gKiAgIC0gb24gYSBNZWRpYXRvciBpcyByZWdpc3RlcmVkIHdpdGggdGhlIFZpZXdcbiAqICAgLSBvbiBhIFByb3h5IGlzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgTW9kZWwuIFxuICogXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTm90aWZpZXIoKVxue1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYW5kIHNlbmQgYSBOb3RpZmljYXRpb24uXG4gKlxuICogS2VlcHMgdXMgZnJvbSBoYXZpbmcgdG8gY29uc3RydWN0IG5ldyBOb3RpZmljYXRpb24gaW5zdGFuY2VzIGluIG91ciBcbiAqIGltcGxlbWVudGF0aW9uIGNvZGUuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgQSBub3RpZmljYXRpb24gbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IFtib2R5XVxuICogIFRoZSBib2R5IG9mIHRoZSBub3RpZmljYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAqICBUaGUgbm90aWZpY2F0aW9uIHR5cGVcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5zZW5kTm90aWZpY2F0aW9uID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgYm9keSwgdHlwZSlcbntcbiAgICB2YXIgZmFjYWRlID0gdGhpcy5nZXRGYWNhZGUoKTtcbiAgICBpZihmYWNhZGUpXG4gICAge1xuICAgICAgICBmYWNhZGUuc2VuZE5vdGlmaWNhdGlvbihub3RpZmljYXRpb25OYW1lLCBib2R5LCB0eXBlKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogQSByZWZlcmVuY2UgdG8gdGhpcyBOb3RpZmllcidzIEZhY2FkZS4gVGhpcyByZWZlcmVuY2Ugd2lsbCBub3QgYmUgYXZhaWxhYmxlXG4gKiB1bnRpbCAjaW5pdGlhbGl6ZU5vdGlmaWVyIGhhcyBiZWVuIGNhbGxlZC4gXG4gKiBcbiAqIEB0eXBlIHtwdXJlbXZjLkZhY2FkZX1cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmZhY2FkZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoaXMgTm90aWZpZXIgaW5zdGFuY2UuXG4gKiBcbiAqIFRoaXMgaXMgaG93IGEgTm90aWZpZXIgZ2V0cyBpdHMgbXVsdGl0b25LZXkuIFxuICogQ2FsbHMgdG8gI3NlbmROb3RpZmljYXRpb24gb3IgdG8gYWNjZXNzIHRoZVxuICogZmFjYWRlIHdpbGwgZmFpbCB1bnRpbCBhZnRlciB0aGlzIG1ldGhvZCBcbiAqIGhhcyBiZWVuIGNhbGxlZC5cbiAqIFxuICogTWVkaWF0b3JzLCBDb21tYW5kIG9yIFByb3hpZXMgbWF5IG92ZXJyaWRlXG4gKiB0aGlzIG1ldGhvZCBpbiBvcmRlciB0byBzZW5kIG5vdGlmaWNhdGlvbnNcbiAqIG9yIGFjY2VzcyB0aGUgTXVsdGl0b24gRmFjYWRlIGluc3RhbmNlIGFzXG4gKiBzb29uIGFzIHBvc3NpYmxlLiBUaGV5IENBTk5PVCBhY2Nlc3MgdGhlIGZhY2FkZVxuICogaW4gdGhlaXIgY29uc3RydWN0b3JzLCBzaW5jZSB0aGlzIG1ldGhvZCB3aWxsIG5vdFxuICogeWV0IGhhdmUgYmVlbiBjYWxsZWQuXG4gKiBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiAgVGhlIE5vdGlmaWVycyBtdWx0aXRvbiBrZXk7XG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Ob3RpZmllci5wcm90b3R5cGUuaW5pdGlhbGl6ZU5vdGlmaWVyID0gZnVuY3Rpb24oa2V5KVxue1xuICAgIHRoaXMubXVsdGl0b25LZXkgPSBTdHJpbmcoa2V5KTtcbiAgICB0aGlzLmZhY2FkZT0gdGhpcy5nZXRGYWNhZGUoKTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIE11bHRpdG9uIEZhY2FkZSBpbnN0YW5jZVxuICpcbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAcmV0dXJuIHtwdXJlbXZjLkZhY2FkZX1cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmdldEZhY2FkZSA9IGZ1bmN0aW9uKClcbntcbiAgICBpZih0aGlzLm11bHRpdG9uS2V5ID09IG51bGwpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoTm90aWZpZXIuTVVMVElUT05fTVNHKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEZhY2FkZS5nZXRJbnN0YW5jZSh0aGlzLm11bHRpdG9uS2V5KTtcbn07XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIE5vdGlmaWVycyBpbnRlcm5hbCBtdWx0aXRvbiBrZXkuXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgc3RyaW5nXG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5tdWx0aXRvbktleSA9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIGVycm9yIG1lc3NhZ2UgdXNlZCBpZiB0aGUgTm90aWZpZXIgaXMgbm90IGluaXRpYWxpemVkIGNvcnJlY3RseSBhbmRcbiAqIGF0dGVtcHRzIHRvIHJldHJpZXZlIGl0cyBvd24gbXVsdGl0b24ga2V5XG4gKlxuICogQHN0YXRpY1xuICogQHByb3RlY3RlZFxuICogQGNvbnN0XG4gKiBAdHlwZSBzdHJpbmdcbiAqL1xuTm90aWZpZXIuTVVMVElUT05fTVNHID0gXCJtdWx0aXRvbktleSBmb3IgdGhpcyBOb3RpZmllciBub3QgeWV0IGluaXRpYWxpemVkIVwiO1xuLyoqXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGNsYXNzIHB1cmVtdmMuU2ltcGxlQ29tbWFuZFxuICogQGV4dGVuZHMgcHVyZW12Yy5Ob3RpZmllclxuICpcbiAqIFNpbXBsZUNvbW1hbmRzIGVuY2Fwc3VsYXRlIHRoZSBidXNpbmVzcyBsb2dpYyBvZiB5b3VyIGFwcGxpY2F0aW9uLiBZb3VyIFxuICogc3ViY2xhc3Mgc2hvdWxkIG92ZXJyaWRlIHRoZSAjZXhlY3V0ZSBtZXRob2Qgd2hlcmUgeW91ciBidXNpbmVzcyBsb2dpYyB3aWxsXG4gKiBoYW5kbGUgdGhlIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn1cbiAqIFxuICogVGFrZSBhIGxvb2sgYXQgXG4gKiB7QGxpbmsgcHVyZW12Yy5GYWNhZGUjcmVnaXN0ZXJDb21tYW5kIEZhY2FkZSdzIHJlZ2lzdGVyQ29tbWFuZH1cbiAqIG9yIHtAbGluayBwdXJlbXZjLkNvbnRyb2xsZXIjcmVnaXN0ZXJDb21tYW5kIENvbnRyb2xsZXJzIHJlZ2lzdGVyQ29tbWFuZH1cbiAqIG1ldGhvZHMgdG8gc2VlIGhvdyB0byBhZGQgY29tbWFuZHMgdG8geW91ciBhcHBsaWNhdGlvbi5cbiAqIFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFNpbXBsZUNvbW1hbmQgKCkgeyB9O1xuXG5TaW1wbGVDb21tYW5kLnByb3RvdHlwZT0gbmV3IE5vdGlmaWVyO1xuU2ltcGxlQ29tbWFuZC5wcm90b3R5cGUuY29uc3RydWN0b3I9IFNpbXBsZUNvbW1hbmQ7XG5cbi8qKlxuICogRnVsZmlsbCB0aGUgdXNlLWNhc2UgaW5pdGlhdGVkIGJ5IHRoZSBnaXZlbiBOb3RpZmljYXRpb25cbiAqIFxuICogSW4gdGhlIENvbW1hbmQgUGF0dGVybiwgYW4gYXBwbGljYXRpb24gdXNlLWNhc2UgdHlwaWNhbGx5IGJlZ2lucyB3aXRoIHNvbWVcbiAqIHVzZXIgYWN0aW9uLCB3aGljaCByZXN1bHRzIGluIGEgTm90aWZpY2F0aW9uIGlzIGhhbmRsZWQgYnkgdGhlIGJ1c2luZXNzIGxvZ2ljXG4gKiBpbiB0aGUgI2V4ZWN1dGUgbWV0aG9kIG9mIGEgY29tbWFuZC5cbiAqIFxuICogQHBhcmFtIHtwdXJlbXZjLk5vdGlmaWNhdGlvbn0gbm90aWZpY2F0aW9uXG4gKiAgVGhlIG5vdGlmaWNhdGlvbiB0byBoYW5kbGUuXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5TaW1wbGVDb21tYW5kLnByb3RvdHlwZS5leGVjdXRlPSBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7IH07XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5NYWNyb0NvbW1hbmRcbiAqIEBleHRlbmRzIHB1cmVtdmMuTm90aWZpZXJcbiAqIFxuICogQSBiYXNlIGNvbW1hbmQgaW1wbGVtZW50YXRpb24gdGhhdCBleGVjdXRlcyBvdGhlciBjb21tYW5kcywgc3VjaCBhc1xuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfVxuICogb3Ige0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH1cbiAqIHN1YmNsYXNzZXMuXG4gKiAgXG4gKiBBIE1hY3JvQ29tbWFuZCBtYWludGFpbnMgYW4gbGlzdCBvZlxuICogY29tbWFuZCBjb25zdHJ1Y3RvciByZWZlcmVuY2VzIGNhbGxlZCAqU3ViQ29tbWFuZHMqLlxuICogXG4gKiBXaGVuICNleGVjdXRlIGlzIGNhbGxlZCwgdGhlIE1hY3JvQ29tbWFuZFxuICogaW5zdGFudGlhdGVzIGFuZCBjYWxscyAjZXhlY3V0ZSBvbiBlYWNoIG9mIGl0cyAqU3ViQ29tbWFuZHMqIGluIHR1cm4uXG4gKiBFYWNoICpTdWJDb21tYW5kKiB3aWxsIGJlIHBhc3NlZCBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWxcbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259IFxuICogdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSBNYWNyb0NvbW1hbmRzICNleGVjdXRlIG1ldGhvZFxuICogXG4gKiBVbmxpa2Uge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfSwgXG4gKiB5b3VyIHN1YmNsYXNzIHNob3VsZCBub3Qgb3ZlcnJpZGUgI2V4ZWN1dGUgYnV0IGluc3RlYWQsIHNob3VsZCBcbiAqIG92ZXJyaWRlIHRoZSAjaW5pdGlhbGl6ZU1hY3JvQ29tbWFuZCBtZXRob2QsIGNhbGxpbmcgI2FkZFN1YkNvbW1hbmQgb25jZSBmb3IgXG4gKiBlYWNoICpTdWJDb21tYW5kKiB0byBiZSBleGVjdXRlZC5cbiAqIFxuICogSWYgeW91ciBzdWJjbGFzcyBkb2VzIGRlZmluZSBhIGNvbnN0cnVjdG9yLCBiZSBzdXJlIHRvIGNhbGwgXCJzdXBlclwiIGxpa2Ugc29cbiAqIFxuICogICAgIGZ1bmN0aW9uIE15TWFjcm9Db21tYW5kICgpXG4gKiAgICAge1xuICogICAgICAgICBNYWNyb0NvbW1hbmQuY2FsbCh0aGlzKTtcbiAqICAgICB9O1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1hY3JvQ29tbWFuZCgpXG57XG4gICAgdGhpcy5zdWJDb21tYW5kcz0gW107XG4gICAgdGhpcy5pbml0aWFsaXplTWFjcm9Db21tYW5kKCk7XG59O1xuXG4vKiBzdWJjbGFzcyBOb3RpZmllciAqL1xuTWFjcm9Db21tYW5kLnByb3RvdHlwZT0gbmV3IE5vdGlmaWVyO1xuTWFjcm9Db21tYW5kLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj0gTWFjcm9Db21tYW5kO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAdHlwZSB7QXJyYXkuPHB1cmVtdmMuU2ltcGxlQ29tbWFuZHxwdXJlbXZjLk1hY3JvQ29tbWFuZD59XG4gKi9cbk1hY3JvQ29tbWFuZC5wcm90b3R5cGUuc3ViQ29tbWFuZHM9IG51bGw7XG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogSW5pdGlhbGl6ZSB0aGUgTWFjcm9Db21tYW5kLlxuICogXG4gKiBJbiB5b3VyIHN1YmNsYXNzLCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBcbiAqIGluaXRpYWxpemUgdGhlIE1hY3JvQ29tbWFuZCdzICpTdWJDb21tYW5kKiAgXG4gKiBsaXN0IHdpdGggY29tbWFuZCBjbGFzcyByZWZlcmVuY2VzIGxpa2UgXG4gKiB0aGlzOlxuICogXG4gKiAgICAgLy8gSW5pdGlhbGl6ZSBNeU1hY3JvQ29tbWFuZFxuICogICAgIE15TWFjcm9Db21tYW5kLnByb3RvdHlwZS5pbml0aWFsaXplTWFjcm9Db21tYW5kPSBmdW5jdGlvbiAoKVxuICogICAgIHtcbiAqICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKCBjb20ubWUubXlhcHAuY29udHJvbGxlci5GaXJzdENvbW1hbmQgKTtcbiAqICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKCBjb20ubWUubXlhcHAuY29udHJvbGxlci5TZWNvbmRDb21tYW5kICk7XG4gKiAgICAgICAgIHRoaXMuYWRkU3ViQ29tbWFuZCggY29tLm1lLm15YXBwLmNvbnRyb2xsZXIuVGhpcmRDb21tYW5kICk7XG4gKiAgICAgfTtcbiAqIFxuICogTm90ZSB0aGF0ICpTdWJDb21tYW5kKnMgbWF5IGJlIGFueSBjb21tYW5kIGltcGxlbWVudG9yLFxuICogTWFjcm9Db21tYW5kcyBvciBTaW1wbGVDb21tYW5kcyBhcmUgYm90aCBhY2NlcHRhYmxlLlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTWFjcm9Db21tYW5kLnByb3RvdHlwZS5pbml0aWFsaXplTWFjcm9Db21tYW5kPSBmdW5jdGlvbigpIHt9XG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogQWRkIGEgKlN1YkNvbW1hbmQqXG4gKiBcbiAqIFRoZSAqU3ViQ29tbWFuZCpzIHdpbGwgYmUgY2FsbGVkIGluIEZpcnN0IEluIC8gRmlyc3QgT3V0IChGSUZPKSBvcmRlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tbWFuZENsYXNzUmVmXG4gKiAgQSByZWZlcmVuY2UgdG8gYSBzdWJjbGFzc2VkIFNpbXBsZUNvbW1hbmQgb3IgTWFjcm9Db21tYW5kIGNvbnN0cnVjdG9yXG4gKi9cbk1hY3JvQ29tbWFuZC5wcm90b3R5cGUuYWRkU3ViQ29tbWFuZD0gZnVuY3Rpb24oY29tbWFuZENsYXNzUmVmKVxue1xuICAgIHRoaXMuc3ViQ29tbWFuZHMucHVzaChjb21tYW5kQ2xhc3NSZWYpO1xufTtcblxuLyoqXG4gKiBFeGVjdXRlIHRoaXMgTWFjcm9Db21tYW5kcyAqU3ViQ29tbWFuZHMqXG4gKiBcbiAqIFRoZSAqU3ViQ29tbWFuZCpzIHdpbGwgYmUgY2FsbGVkIGluIEZpcnN0IEluIC8gRmlyc3QgT3V0IChGSUZPKSBvcmRlclxuICogQHBhcmFtIHtwdXJlbXZjLk5vdGlmaWNhdGlvbn0gbm90ZVxuICogIFRoZSBOb3RpZmljYXRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBlYWNoICpTdWJDb21tYW5kKlxuICovXG5NYWNyb0NvbW1hbmQucHJvdG90eXBlLmV4ZWN1dGU9IGZ1bmN0aW9uKG5vdGUpXG57XG4gICAgLy8gU0lDLSBUT0RPIG9wdGltaXplXG4gICAgd2hpbGUodGhpcy5zdWJDb21tYW5kcy5sZW5ndGggPiAwKVxuICAgIHtcbiAgICAgICAgdmFyIHJlZj0gdGhpcy5zdWJDb21tYW5kcy5zaGlmdCgpO1xuICAgICAgICB2YXIgY21kPSBuZXcgcmVmO1xuICAgICAgICBjbWQuaW5pdGlhbGl6ZU5vdGlmaWVyKHRoaXMubXVsdGl0b25LZXkpO1xuICAgICAgICBjbWQuZXhlY3V0ZShub3RlKTtcbiAgICB9XG59O1xuLyoqXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGNsYXNzIHB1cmVtdmMuTWVkaWF0b3JcbiAqIEBleHRlbmRzIHB1cmVtdmMuTm90aWZpZXJcbiAqIFxuICogQSBiYXNlIE1lZGlhdG9yIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEluIFB1cmVNVkMsIE1lZGlhdG9yIGNsYXNzZXMgYXJlIHVzZWQgdG8gbWVkaWF0ZSBjb21tdW5pY2F0aW9uIGJldHdlZW4gYSB2aWV3IFxuICogY29tcG9uZW50IGFuZCB0aGUgcmVzdCBvZiB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogQSBNZWRpYXRvciBzaG91bGQgbGlzdGVuIHRvIGl0cyB2aWV3IGNvbXBvbmVudHMgZm9yIGV2ZW50cywgYW5kIGhhbmRsZSB0aGVtIFxuICogYnkgc2VuZGluZyBub3RpZmljYXRpb25zICh0byBiZSBoYW5kbGVkIGJ5IG90aGVyIE1lZGlhdG9ycywgXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmRzfSBcbiAqIG9yXG4gKiB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kc30pIFxuICogb3IgcGFzc2luZyBkYXRhIGZyb20gdGhlIHZpZXcgY29tcG9uZW50IGRpcmVjdGx5IHRvIGEgXG4gKiB7QGxpbmsgcHVyZW12Yy5Qcm94eSBQcm94eX0sIHN1Y2ggYXMgc3VibWl0dGluZyBcbiAqIHRoZSBjb250ZW50cyBvZiBhIGZvcm0gdG8gYSBzZXJ2aWNlLlxuICogXG4gKiBNZWRpYXRvcnMgc2hvdWxkIG5vdCBwZXJmb3JtIGJ1c2luZXNzIGxvZ2ljLCBtYWludGFpbiBzdGF0ZSBvciBvdGhlciBcbiAqIGluZm9ybWF0aW9uIGZvciBpdHMgdmlldyBjb21wb25lbnQsIG9yIGJyZWFrIHRoZSBlbmNhcHN1bGF0aW9uIG9mIHRoZSB2aWV3IFxuICogY29tcG9uZW50IGJ5IG1hbmlwdWxhdGluZyB0aGUgdmlldyBjb21wb25lbnQncyBjaGlsZHJlbi4gSXQgc2hvdWxkIG9ubHkgY2FsbCBcbiAqIG1ldGhvZHMgb3Igc2V0IHByb3BlcnRpZXMgb24gdGhlIHZpZXcgY29tcG9uZW50LlxuICogIFxuICogVGhlIHZpZXcgY29tcG9uZW50IHNob3VsZCBlbmNhcHN1bGF0ZSBpdHMgb3duIGJlaGF2aW9yIGFuZCBpbXBsZW1lbnRhdGlvbiBieSBcbiAqIGV4cG9zaW5nIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgdGhhdCB0aGUgTWVkaWF0b3IgY2FuIGNhbGwgd2l0aG91dCBoYXZpbmcgdG8gXG4gKiBrbm93IGFib3V0IHRoZSB2aWV3IGNvbXBvbmVudCdzIGNoaWxkcmVuLlxuICogXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVkaWF0b3JOYW1lXVxuICogIFRoZSBNZWRpYXRvcnMgbmFtZS4gVGhlIE1lZGlhdG9ycyBzdGF0aWMgI05BTUUgdmFsdWUgaXMgdXNlZCBieSBkZWZhdWx0XG4gKiBAcGFyYW0ge09iamVjdH0gW3ZpZXdDb21wb25lbnRdXG4gKiAgVGhlIE1lZGlhdG9ycyB7QGxpbmsgI3NldFZpZXdDb21wb25lbnQgdmlld0NvbXBvbmVudH0uXG4gKi9cbmZ1bmN0aW9uIE1lZGlhdG9yIChtZWRpYXRvck5hbWUsIHZpZXdDb21wb25lbnQpXG57XG4gICAgdGhpcy5tZWRpYXRvck5hbWU9IG1lZGlhdG9yTmFtZSB8fCB0aGlzLmNvbnN0cnVjdG9yLk5BTUU7XG4gICAgdGhpcy52aWV3Q29tcG9uZW50PXZpZXdDb21wb25lbnQ7ICBcbn07XG5cbi8qKlxuICogQHN0YXRpY1xuICogVGhlIG5hbWUgb2YgdGhlIE1lZGlhdG9yLlxuICogXG4gKiBUeXBpY2FsbHksIGEgTWVkaWF0b3Igd2lsbCBiZSB3cml0dGVuIHRvIHNlcnZlIG9uZSBzcGVjaWZpYyBjb250cm9sIG9yIGdyb3VwXG4gKiBvZiBjb250cm9scyBhbmQgc28sIHdpbGwgbm90IGhhdmUgYSBuZWVkIHRvIGJlIGR5bmFtaWNhbGx5IG5hbWVkLlxuICogXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5NZWRpYXRvci5OQU1FPSBcIk1lZGlhdG9yXCI7XG5cbi8qIHN1YmNsYXNzICovXG5NZWRpYXRvci5wcm90b3R5cGU9IG5ldyBOb3RpZmllcjtcbk1lZGlhdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj0gTWVkaWF0b3I7XG5cbi8qKlxuICogR2V0IHRoZSBuYW1lIG9mIHRoZSBNZWRpYXRvclxuICogXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiAgVGhlIE1lZGlhdG9yIG5hbWVcbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLmdldE1lZGlhdG9yTmFtZT0gZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm4gdGhpcy5tZWRpYXRvck5hbWU7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgTWVkaWF0b3JzIHZpZXcgY29tcG9uZW50LiBUaGlzIGNvdWxkXG4gKiBiZSBhIEhUTUxFbGVtZW50LCBhIGJlc3Bva2UgVWlDb21wb25lbnQgd3JhcHBlclxuICogY2xhc3MsIGEgTW9vVG9vbHMgRWxlbWVudCwgYSBqUXVlcnkgcmVzdWx0IG9yIGFcbiAqIGNzcyBzZWxlY3RvciwgZGVwZW5kaW5nIG9uIHdoaWNoIERPTSBhYnN0cmFjdGlvbiBcbiAqIGxpYnJhcnkgeW91IGFyZSB1c2luZy5cbiAqIFxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gdGhlIHZpZXcgY29tcG9uZW50XG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5NZWRpYXRvci5wcm90b3R5cGUuc2V0Vmlld0NvbXBvbmVudD0gZnVuY3Rpb24gKHZpZXdDb21wb25lbnQpXG57XG4gICAgdGhpcy52aWV3Q29tcG9uZW50PSB2aWV3Q29tcG9uZW50O1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIE1lZGlhdG9ycyB2aWV3IGNvbXBvbmVudC5cbiAqIFxuICogQWRkaXRpb25hbGx5LCBhbiBvcHRpb25hbCBleHBsaWNpdCBnZXR0ZXIgY2FuIGJlXG4gKiBiZSBkZWZpbmVkIGluIHRoZSBzdWJjbGFzcyB0aGF0IGRlZmluZXMgdGhlIFxuICogdmlldyBjb21wb25lbnRzLCBwcm92aWRpbmcgYSBtb3JlIHNlbWFudGljIGludGVyZmFjZVxuICogdG8gdGhlIE1lZGlhdG9yLlxuICogXG4gKiBUaGlzIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBBUzMgaW1wbGVtZW50YXRpb24gaW5cbiAqIHRoZSBzZW5zZSB0aGF0IG5vIGNhc3RpbmcgaXMgcmVxdWlyZWQgZnJvbSB0aGVcbiAqIG9iamVjdCBzdXBwbGllZCBhcyB0aGUgdmlldyBjb21wb25lbnQuXG4gKiBcbiAqICAgICBNeU1lZGlhdG9yLnByb3RvdHlwZS5nZXRDb21ib0JveD0gZnVuY3Rpb24gKClcbiAqICAgICB7XG4gKiAgICAgICAgIHJldHVybiB0aGlzLnZpZXdDb21wb25lbnQ7ICBcbiAqICAgICB9XG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqICBUaGUgdmlldyBjb21wb25lbnRcbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLmdldFZpZXdDb21wb25lbnQ9IGZ1bmN0aW9uICgpXG57XG4gICAgcmV0dXJuIHRoaXMudmlld0NvbXBvbmVudDtcbn07XG5cbi8qKlxuICogTGlzdCB0aGUgTm90aWZpY2F0aW9uIG5hbWVzIHRoaXMgTWVkaWF0b3IgaXMgaW50ZXJlc3RlZFxuICogaW4gYmVpbmcgbm90aWZpZWQgb2YuXG4gKiBcbiAqIEByZXR1cm4ge0FycmF5fSBcbiAqICBUaGUgbGlzdCBvZiBOb3RpZmljYXRpb24gbmFtZXMuXG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5saXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzPSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybiBbXTtcbn07XG5cbi8qKlxuICogSGFuZGxlIE5vdGlmaWNhdGlvbnMuXG4gKiBcbiAqIFR5cGljYWxseSB0aGlzIHdpbGwgYmUgaGFuZGxlZCBpbiBhIHN3aXRjaCBzdGF0ZW1lbnRcbiAqIHdpdGggb25lICdjYXNlJyBlbnRyeSBwZXIgTm90aWZpY2F0aW9uIHRoZSBNZWRpYXRvclxuICogaXMgaW50ZXJlc3RlZCBpblxuICogXG4gKiBAcGFyYW0ge3B1cmVtdmMuTm90aWZpY2F0aW9ufSBub3RpZmljYXRpb25cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5oYW5kbGVOb3RpZmljYXRpb249IGZ1bmN0aW9uIChub3RpZmljYXRpb24pXG57XG4gICAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBDYWxsZWQgYnkgdGhlIFZpZXcgd2hlbiB0aGUgTWVkaWF0b3IgaXMgcmVnaXN0ZXJlZFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLm9uUmVnaXN0ZXI9IGZ1bmN0aW9uICgpXG57XG4gICAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBDYWxsZWQgYnkgdGhlIFZpZXcgd2hlbiB0aGUgTWVkaWF0b3IgaXMgcmVtb3ZlZFxuICovXG5NZWRpYXRvci5wcm90b3R5cGUub25SZW1vdmU9IGZ1bmN0aW9uICgpXG57XG4gICAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgTWVkaWF0b3JzIG5hbWUuIFNob3VsZCBvbmx5IGJlIGFjY2Vzc2VkIGJ5IE1lZGlhdG9yIHN1YmNsYXNzZXMuXG4gKiBcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHN0cmluZ1xuICovXG5NZWRpYXRvci5wcm90b3R5cGUubWVkaWF0b3JOYW1lPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBNZWRpYXRvcnMgdmlld0NvbXBvbmVudC4gU2hvdWxkIG9ubHkgYmUgYWNjZXNzZWQgYnkgTWVkaWF0b3Igc3ViY2xhc3Nlcy5cbiAqIFxuICogQHByb3RlY3RlZFxuICogQHR5cGUgT2JqZWN0XG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS52aWV3Q29tcG9uZW50PW51bGw7XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5Qcm94eVxuICogQGV4dGVuZHMgcHVyZW12Yy5Ob3RpZmllclxuICpcbiAqIEEgYmFzZSBQcm94eSBpbXBsZW1lbnRhdGlvbi4gXG4gKiBcbiAqIEluIFB1cmVNVkMsIFByb3h5IGNsYXNzZXMgYXJlIHVzZWQgdG8gbWFuYWdlIHBhcnRzIG9mIHRoZSBhcHBsaWNhdGlvbidzIGRhdGEgXG4gKiBtb2RlbC5cbiAqIFxuICogQSBQcm94eSBtaWdodCBzaW1wbHkgbWFuYWdlIGEgcmVmZXJlbmNlIHRvIGEgbG9jYWwgZGF0YSBvYmplY3QsIGluIHdoaWNoIGNhc2UgXG4gKiBpbnRlcmFjdGluZyB3aXRoIGl0IG1pZ2h0IGludm9sdmUgc2V0dGluZyBhbmQgZ2V0dGluZyBvZiBpdHMgZGF0YSBpbiBcbiAqIHN5bmNocm9ub3VzIGZhc2hpb24uXG4gKiBcbiAqIFByb3h5IGNsYXNzZXMgYXJlIGFsc28gdXNlZCB0byBlbmNhcHN1bGF0ZSB0aGUgYXBwbGljYXRpb24ncyBpbnRlcmFjdGlvbiB3aXRoIFxuICogcmVtb3RlIHNlcnZpY2VzIHRvIHNhdmUgb3IgcmV0cmlldmUgZGF0YSwgaW4gd2hpY2ggY2FzZSwgd2UgYWRvcHQgYW4gXG4gKiBhc3luY3Jvbm91cyBpZGlvbTsgc2V0dGluZyBkYXRhIChvciBjYWxsaW5nIGEgbWV0aG9kKSBvbiB0aGUgUHJveHkgYW5kIFxuICogbGlzdGVuaW5nIGZvciBhIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn0gXG4gKiB0byBiZSBzZW50ICB3aGVuIHRoZSBQcm94eSBoYXMgcmV0cmlldmVkIHRoZSBkYXRhIGZyb20gdGhlIHNlcnZpY2UuIFxuICogXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcHJveHlOYW1lXVxuICogIFRoZSBQcm94eSdzIG5hbWUuIElmIG5vbmUgaXMgcHJvdmlkZWQsIHRoZSBQcm94eSB3aWxsIHVzZSBpdHMgY29uc3RydWN0b3JzXG4gKiAgTkFNRSBwcm9wZXJ0eS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGF0YV1cbiAqICBUaGUgUHJveHkncyBkYXRhIG9iamVjdFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFByb3h5KHByb3h5TmFtZSwgZGF0YSlcbntcbiAgICB0aGlzLnByb3h5TmFtZT0gcHJveHlOYW1lIHx8IHRoaXMuY29uc3RydWN0b3IuTkFNRTtcbiAgICBpZihkYXRhICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XG4gICAgfVxufTtcblxuXG5Qcm94eS5OQU1FPSBcIlByb3h5XCI7XG5cblByb3h5LnByb3RvdHlwZT0gbmV3IE5vdGlmaWVyO1xuUHJveHkucHJvdG90eXBlLmNvbnN0cnVjdG9yPSBQcm94eTtcblxuLyoqXG4gKiBHZXQgdGhlIFByb3h5J3MgbmFtZS5cbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cblByb3h5LnByb3RvdHlwZS5nZXRQcm94eU5hbWU9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gdGhpcy5wcm94eU5hbWU7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgUHJveHkncyBkYXRhIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Qcm94eS5wcm90b3R5cGUuc2V0RGF0YT0gZnVuY3Rpb24oZGF0YSlcbntcbiAgICB0aGlzLmRhdGE9IGRhdGE7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgUHJveHkncyBkYXRhIG9iamVjdFxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuUHJveHkucHJvdG90eXBlLmdldERhdGE9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gdGhpcy5kYXRhO1xufTtcblxuLyoqXG4gKiBDYWxsZWQgYnkgdGhlIHtAbGluayBwdXJlbXZjLk1vZGVsIE1vZGVsfSB3aGVuXG4gKiB0aGUgUHJveHkgaXMgcmVnaXN0ZXJlZC5cbiAqXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Qcm94eS5wcm90b3R5cGUub25SZWdpc3Rlcj0gZnVuY3Rpb24oKVxue1xuICAgIHJldHVybjtcbn07XG5cbi8qKlxuICogQ2FsbGVkIGJ5IHRoZSB7QGxpbmsgcHVyZW12Yy5Nb2RlbCBNb2RlbH0gd2hlblxuICogdGhlIFByb3h5IGlzIHJlbW92ZWQuXG4gKiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblByb3h5LnByb3RvdHlwZS5vblJlbW92ZT0gZnVuY3Rpb24oKVxue1xuICAgIHJldHVybjtcbn07XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIFByb3h5cyBuYW1lLlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIFN0cmluZ1xuICovXG5Qcm94eS5wcm90b3R5cGUucHJveHlOYW1lPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBQcm94eSdzIGRhdGEgb2JqZWN0LlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIE9iamVjdFxuICovXG5Qcm94eS5wcm90b3R5cGUuZGF0YT0gbnVsbDtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLkZhY2FkZVxuICogRmFjYWRlIGV4cG9zZXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIENvbnRyb2xsZXIsIE1vZGVsIGFuZCBWaWV3XG4gKiBhY3RvcnMgdG8gY2xpZW50IGZhY2luZyBjb2RlLiBcbiAqIFxuICogVGhpcyBGYWNhZGUgaW1wbGVtZW50YXRpb24gaXMgYSBNdWx0aXRvbiwgc28geW91IHNob3VsZCBub3QgY2FsbCB0aGUgXG4gKiBjb25zdHJ1Y3RvciBkaXJlY3RseSwgYnV0IGluc3RlYWQgY2FsbCB0aGUgc3RhdGljIEZhY3RvcnkgbWV0aG9kLCBcbiAqIHBhc3NpbmcgdGhlIHVuaXF1ZSBrZXkgZm9yIHRoaXMgaW5zdGFuY2UgdG8gI2dldEluc3RhbmNlXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBcdFRoZSBtdWx0aXRvbiBrZXkgdG8gdXNlIHRvIHJldHJpZXZlIHRoZSBGYWNhZGUgaW5zdGFuY2UuXG4gKiBAdGhyb3dzIHtFcnJvcn0gXG4gKiAgSWYgYW4gYXR0ZW1wdCBpcyBtYWRlIHRvIGluc3RhbnRpYXRlIEZhY2FkZSBkaXJlY3RseVxuICovXG5mdW5jdGlvbiBGYWNhZGUoa2V5KVxue1xuICAgIGlmKEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRmFjYWRlLk1VTFRJVE9OX01TRyk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplTm90aWZpZXIoa2V5KTtcbiAgICBGYWNhZGUuaW5zdGFuY2VNYXBba2V5XSA9IHRoaXM7XG4gICAgdGhpcy5pbml0aWFsaXplRmFjYWRlKCk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIE11bHRpdG9uIEZhY2FkZSBpbnN0YW5jZS5cbiAqIFxuICogQ2FsbGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIGNvbnN0cnVjdG9yLiBPdmVycmlkZSBpbiB5b3VyIHN1YmNsYXNzIHRvIGFueVxuICogc3ViY2xhc3Mgc3BlY2lmaWMgaW5pdGlhbGl6YXRpb25zLiBCZSBzdXJlIHRvIGNhbGwgdGhlICdzdXBlcicgXG4gKiBpbml0aWFsaXplRmFjYWRlIG1ldGhvZCwgdGhvdWdoXG4gKiBcbiAqICAgICBNeUZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUZhY2FkZT0gZnVuY3Rpb24gKClcbiAqICAgICB7XG4gKiAgICAgICAgIEZhY2FkZS5jYWxsKHRoaXMpO1xuICogICAgIH07XG4gKiBAcHJvdGVjdGVkXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVGYWNhZGUgPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5pbml0aWFsaXplTW9kZWwoKTtcbiAgICB0aGlzLmluaXRpYWxpemVDb250cm9sbGVyKCk7XG4gICAgdGhpcy5pbml0aWFsaXplVmlldygpO1xufTtcblxuLyoqXG4gKiBGYWNhZGUgTXVsdGl0b24gRmFjdG9yeSBtZXRob2QuIFxuICogTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIG51bGwgaWYgc3VwcGxpZWQgYVxuICogbnVsbCBvciB1bmRlZmluZWQgbXVsdGl0b24ga2V5LlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBcdFRoZSBtdWx0aXRvbiBrZXkgdXNlIHRvIHJldHJpZXZlIGEgcGFydGljdWxhciBGYWNhZGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge3B1cmVtdmMuRmFjYWRlfVxuICovXG5GYWNhZGUuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbihrZXkpXG57XG5cdGlmIChudWxsID09IGtleSlcblx0XHRyZXR1cm4gbnVsbDtcblx0XHRcbiAgICBpZihGYWNhZGUuaW5zdGFuY2VNYXBba2V5XSA9PSBudWxsKVxuICAgIHtcbiAgICAgICAgRmFjYWRlLmluc3RhbmNlTWFwW2tleV0gPSBuZXcgRmFjYWRlKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSB7QGxpbmsgcHVyZW12Yy5Db250cm9sbGVyIENvbnRyb2xsZXJ9LlxuICogXG4gKiBDYWxsZWQgYnkgdGhlICNpbml0aWFsaXplRmFjYWRlIG1ldGhvZC5cbiAqIFxuICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4geW91ciBzdWJjbGFzcyBvZiBGYWNhZGVcbiAqIGlmIG9uZSBvciBib3RoIG9mIHRoZSBmb2xsb3dpbmcgYXJlIHRydWU6XG5cbiAqIC0gWW91IHdpc2ggdG8gaW5pdGlhbGl6ZSBhIGRpZmZlcmVudCBDb250cm9sbGVyXG4gKiAtIFlvdSBoYXZlIFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfXNcbiAqIG9yIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9c1xuICogdG8gcmVnaXN0ZXIgd2l0aCB0aGUgQ29udHJvbGxlcmF0IHN0YXJ0dXAuICAgXG4gKiBcbiAqIElmIHlvdSBkb24ndCB3YW50IHRvIGluaXRpYWxpemUgYSBkaWZmZXJlbnQgQ29udHJvbGxlciwgXG4gKiBjYWxsIHRoZSAnc3VwZXInIGluaXRpYWxpemVDb250cm9sbGUgbWV0aG9kIGF0IHRoZSBiZWdpbm5pbmcgb2YgeW91clxuICogbWV0aG9kLCB0aGVuIHJlZ2lzdGVyIGNvbW1hbmRzLlxuICogXG4gKiAgICAgTXlGYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVDb250cm9sbGVyPSBmdW5jdGlvbiAoKVxuICogICAgIHtcbiAqICAgICAgICAgRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICogICAgICAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZChBcHBDb25zdGFudHMuQV9OT1RFX05BTUUsIEFCZXNwb2tlQ29tbWFuZClcbiAqICAgICB9XG4gKiBcbiAqIEBwcm90ZWN0ZWRcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbigpXG57XG4gICAgaWYodGhpcy5jb250cm9sbGVyICE9IG51bGwpXG4gICAgICAgIHJldHVybjtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IENvbnRyb2xsZXIuZ2V0SW5zdGFuY2UodGhpcy5tdWx0aXRvbktleSk7XG59O1xuXG4vKipcbiAqIEBwcm90ZWN0ZWRcbiAqIEluaXRpYWxpemUgdGhlIHtAbGluayBwdXJlbXZjLk1vZGVsIE1vZGVsfTtcbiAqIFxuICogQ2FsbGVkIGJ5IHRoZSAjaW5pdGlhbGl6ZUZhY2FkZSBtZXRob2QuXG4gKiBPdmVycmlkZSB0aGlzIG1ldGhvZCBpbiB5b3VyIHN1YmNsYXNzIG9mIEZhY2FkZSBpZiBvbmUgb2YgdGhlIGZvbGxvd2luZyBhcmVcbiAqIHRydWU6XG4gKiBcbiAqIC0gWW91IHdpc2ggdG8gaW5pdGlhbGl6ZSBhIGRpZmZlcmVudCBNb2RlbC5cbiAqIFxuICogLSBZb3UgaGF2ZSB7QGxpbmsgcHVyZW12Yy5Qcm94eSBQcm94eX1zIHRvIFxuICogICByZWdpc3RlciB3aXRoIHRoZSBNb2RlbCB0aGF0IGRvIG5vdCByZXRyaWV2ZSBhIHJlZmVyZW5jZSB0byB0aGUgRmFjYWRlIGF0IFxuICogICBjb25zdHJ1Y3Rpb24gdGltZS5cbiAqIFxuICogSWYgeW91IGRvbid0IHdhbnQgdG8gaW5pdGlhbGl6ZSBhIGRpZmZlcmVudCBNb2RlbFxuICogY2FsbCAnc3VwZXInICNpbml0aWFsaXplTW9kZWwgYXQgdGhlIGJlZ2lubmluZyBvZiB5b3VyIG1ldGhvZCwgdGhlbiByZWdpc3RlciBcbiAqIFByb3h5cy5cbiAqIFxuICogTm90ZTogVGhpcyBtZXRob2QgaXMgKnJhcmVseSogb3ZlcnJpZGRlbjsgaW4gcHJhY3RpY2UgeW91IGFyZSBtb3JlXG4gKiBsaWtlbHkgdG8gdXNlIGEgY29tbWFuZCB0byBjcmVhdGUgYW5kIHJlZ2lzdGVyUHJveHlzIHdpdGggdGhlIE1vZGVsPiwgXG4gKiBzaW5jZSBQcm94eXMgd2l0aCBtdXRhYmxlIGRhdGEgd2lsbCBsaWtlbHlcbiAqIG5lZWQgdG8gc2VuZCBOb3RpZmljYXRpb25zIGFuZCB0aHVzIHdpbGwgbGlrZWx5IHdhbnQgdG8gZmV0Y2ggYSByZWZlcmVuY2UgdG8gXG4gKiB0aGUgRmFjYWRlIGR1cmluZyB0aGVpciBjb25zdHJ1Y3Rpb24uIFxuICogXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVNb2RlbCA9IGZ1bmN0aW9uKClcbntcbiAgICBpZih0aGlzLm1vZGVsICE9IG51bGwpXG4gICAgICAgIHJldHVybjtcblxuICAgIHRoaXMubW9kZWwgPSBNb2RlbC5nZXRJbnN0YW5jZSh0aGlzLm11bHRpdG9uS2V5KTtcbn07XG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogXG4gKiBJbml0aWFsaXplIHRoZSB7QGxpbmsgcHVyZW12Yy5WaWV3IFZpZXd9LlxuICogXG4gKiBDYWxsZWQgYnkgdGhlICNpbml0aWFsaXplRmFjYWRlIG1ldGhvZC5cbiAqIFxuICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4geW91ciBzdWJjbGFzcyBvZiBGYWNhZGUgaWYgb25lIG9yIGJvdGggb2YgdGhlIFxuICogZm9sbG93aW5nIGFyZSB0cnVlOlxuICpcbiAqIC0gWW91IHdpc2ggdG8gaW5pdGlhbGl6ZSBhIGRpZmZlcmVudCBWaWV3LlxuICogLSBZb3UgaGF2ZSBPYnNlcnZlcnMgdG8gcmVnaXN0ZXIgd2l0aCB0aGUgVmlld1xuICogXG4gKiBJZiB5b3UgZG9uJ3Qgd2FudCB0byBpbml0aWFsaXplIGEgZGlmZmVyZW50IFZpZXcgXG4gKiBjYWxsICdzdXBlcicgI2luaXRpYWxpemVWaWV3IGF0IHRoZSBiZWdpbm5pbmcgb2YgeW91clxuICogbWV0aG9kLCB0aGVuIHJlZ2lzdGVyIE1lZGlhdG9yIGluc3RhbmNlcy5cbiAqIFxuICogICAgIE15RmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplVmlldz0gZnVuY3Rpb24gKClcbiAqICAgICB7XG4gKiAgICAgICAgIEZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZVZpZXcuY2FsbCh0aGlzKTtcbiAqICAgICAgICAgdGhpcy5yZWdpc3Rlck1lZGlhdG9yKG5ldyBNeU1lZGlhdG9yKCkpO1xuICogICAgIH07XG4gKiBcbiAqIE5vdGU6IFRoaXMgbWV0aG9kIGlzICpyYXJlbHkqIG92ZXJyaWRkZW47IGluIHByYWN0aWNlIHlvdSBhcmUgbW9yZVxuICogbGlrZWx5IHRvIHVzZSBhIGNvbW1hbmQgdG8gY3JlYXRlIGFuZCByZWdpc3RlciBNZWRpYXRvcnNcbiAqIHdpdGggdGhlIFZpZXcsIHNpbmNlIE1lZGlhdG9yIGluc3RhbmNlcyB3aWxsIG5lZWQgdG8gc2VuZCBcbiAqIE5vdGlmaWNhdGlvbnMgYW5kIHRodXMgd2lsbCBsaWtlbHkgd2FudCB0byBmZXRjaCBhIHJlZmVyZW5jZSBcbiAqIHRvIHRoZSBGYWNhZGUgZHVyaW5nIHRoZWlyIGNvbnN0cnVjdGlvbi4gXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVWaWV3ID0gZnVuY3Rpb24oKVxue1xuICAgIGlmKHRoaXMudmlldyAhPSBudWxsKVxuICAgICAgICByZXR1cm47XG5cbiAgICB0aGlzLnZpZXcgPSBWaWV3LmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIGNvbW1hbmQgd2l0aCB0aGUgQ29udHJvbGxlciBieSBOb3RpZmljYXRpb24gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9uIHRvIGFzc29jaWF0ZSB0aGUgY29tbWFuZCB3aXRoXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21tYW5kQ2xhc3NSZWZcbiAqICBBIHJlZmVyZW5jZSBvdCB0aGUgY29tbWFuZHMgY29uc3RydWN0b3IuXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLnJlZ2lzdGVyQ29tbWFuZCA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk5hbWUsIGNvbW1hbmRDbGFzc1JlZilcbntcbiAgICB0aGlzLmNvbnRyb2xsZXIucmVnaXN0ZXJDb21tYW5kKG5vdGlmaWNhdGlvbk5hbWUsIGNvbW1hbmRDbGFzc1JlZik7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBjb21tYW5kIHRvIE5vdGlmaWNhdGlvbiBtYXBwaW5nIGZyb20gdGhlXG4gKiB7QGxpbmsgcHVyZW12Yy5Db250cm9sbGVyI3JlbW92ZUNvbW1hbmQgQ29udHJvbGxlcn1cbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIHRoZSBOb3RpZmljYXRpb24gdG8gcmVtb3ZlIGZyb20gdGhlIGNvbW1hbmQgbWFwcGluZyBmb3IuXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lKVxue1xuICAgIHRoaXMuY29udHJvbGxlci5yZW1vdmVDb21tYW5kKG5vdGlmaWNhdGlvbk5hbWUpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhIGNvbW1hbmQgaXMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBub3RpZmljYXRpb24uXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgQSBOb3RpZmljYXRpb24gbmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqICBXaGV0aGVyIGEgY29tbWFuIGlzIGN1cnJlbnRseSByZWdpc3RlcmVkIGZvciB0aGUgZ2l2ZW4gbm90aWZpY2F0aW9uTmFtZVxuICovXG5GYWNhZGUucHJvdG90eXBlLmhhc0NvbW1hbmQgPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lKVxue1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuaGFzQ29tbWFuZChub3RpZmljYXRpb25OYW1lKTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBQcm94eSB3aXRoIHRoZSB7QGxpbmsgcHVyZW12Yy5Nb2RlbCNyZWdpc3RlclByb3h5IE1vZGVsfVxuICogYnkgbmFtZS5cbiAqIFxuICogQHBhcmFtIHtwdXJlbXZjLlByb3h5fSBwcm94eVxuICogIFRoZSBQcm94eSBpbnN0YW5jZSB0byBiZSByZWdpc3RlcmVkIHdpdGggdGhlIE1vZGVsLlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZWdpc3RlclByb3h5ID0gZnVuY3Rpb24ocHJveHkpXG57XG4gICAgdGhpcy5tb2RlbC5yZWdpc3RlclByb3h5KHByb3h5KTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgYSBQcm94eSBmcm9tIHRoZSBNb2RlbFxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiBAcmV0dXJuIHtwdXJlbXZjLlByb3h5fVxuICovXG5GYWNhZGUucHJvdG90eXBlLnJldHJpZXZlUHJveHkgPSBmdW5jdGlvbihwcm94eU5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMubW9kZWwucmV0cmlldmVQcm94eShwcm94eU5hbWUpO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSBQcm94eSBmcm9tIHRoZSBNb2RlbCBieSBuYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIFByb3h5XG4gKiBAcmV0dXJuIHtwdXJlbXZjLlByb3h5fVxuICogIFRoZSBQcm94eSB0aGF0IHdhcyByZW1vdmVkIGZyb20gdGhlIE1vZGVsXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmVtb3ZlUHJveHkgPSBmdW5jdGlvbihwcm94eU5hbWUpXG57XG4gICAgdmFyIHByb3h5ID0gbnVsbDtcbiAgICBpZih0aGlzLm1vZGVsICE9IG51bGwpXG4gICAge1xuICAgICAgICBwcm94eSA9IHRoaXMubW9kZWwucmVtb3ZlUHJveHkocHJveHlOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJveHk7XG59O1xuXG4vKipcbiAqIENoZWNrIGl0IGEgUHJveHkgaXMgcmVnaXN0ZXJlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm94eU5hbWVcbiAqICBBIFByb3h5IG5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgV2hldGhlciBhIFByb3h5IGlzIGN1cnJlbnRseSByZWdpc3RlcmVkIHdpdGggdGhlIGdpdmVuIHByb3h5TmFtZVxuICovXG5GYWNhZGUucHJvdG90eXBlLmhhc1Byb3h5ID0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLm1vZGVsLmhhc1Byb3h5KHByb3h5TmFtZSk7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgTWVkaWF0b3Igd2l0aCB3aXRoIHRoZSBWaWV3LlxuICogXG4gKiBAcGFyYW0ge3B1cmVtdmMuTWVkaWF0b3J9IG1lZGlhdG9yXG4gKiAgQSByZWZlcmVuY2UgdG8gdGhlIE1lZGlhdG9yIHRvIHJlZ2lzdGVyXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLnJlZ2lzdGVyTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvcilcbntcbiAgICBpZih0aGlzLnZpZXcgIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMudmlldy5yZWdpc3Rlck1lZGlhdG9yKG1lZGlhdG9yKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIGEgTWVkaWF0b3IgZnJvbSB0aGUgVmlldyBieSBuYW1lXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZWRpYXRvck5hbWVcbiAqICBUaGUgTWVkaWF0b3JzIG5hbWVcbiAqIEByZXR1cm4ge3B1cmVtdmMuTWVkaWF0b3J9XG4gKiAgVGhlIHJldHJpZXZlZCBNZWRpYXRvclxuICovXG5GYWNhZGUucHJvdG90eXBlLnJldHJpZXZlTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvck5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMudmlldy5yZXRyaWV2ZU1lZGlhdG9yKG1lZGlhdG9yTmFtZSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhIE1lZGlhdG9yIGZyb20gdGhlIFZpZXcuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZWRpYXRvck5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgTWVkaWF0b3IgdG8gcmVtb3ZlLlxuICogQHJldHVybiB7cHVyZW12Yy5NZWRpYXRvcn1cbiAqICBUaGUgcmVtb3ZlZCBNZWRpYXRvclxuICovXG5GYWNhZGUucHJvdG90eXBlLnJlbW92ZU1lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3JOYW1lKVxue1xuICAgIHZhciBtZWRpYXRvciA9IG51bGw7XG4gICAgaWYodGhpcy52aWV3ICE9IG51bGwpXG4gICAge1xuICAgICAgICBtZWRpYXRvciA9IHRoaXMudmlldy5yZW1vdmVNZWRpYXRvcihtZWRpYXRvck5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBtZWRpYXRvcjtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBNZWRpYXRvciBpcyByZWdpc3RlcmVkIG9yIG5vdC5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG1lZGlhdG9yTmFtZVxuICogIEEgTWVkaWF0b3IgbmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqICBXaGV0aGVyIGEgTWVkaWF0b3IgaXMgcmVnaXN0ZXJlZCB3aXRoIHRoZSBnaXZlbiBtZWRpYXRvck5hbWVcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5oYXNNZWRpYXRvciA9IGZ1bmN0aW9uKG1lZGlhdG9yTmFtZSlcbntcbiAgICByZXR1cm4gdGhpcy52aWV3Lmhhc01lZGlhdG9yKG1lZGlhdG9yTmFtZSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhbmQgc2VuZCBhIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn1cbiAqIFxuICogS2VlcHMgdXMgZnJvbSBoYXZpbmcgdG8gY29uc3RydWN0IG5ldyBOb3RpZmljYXRpb24gaW5zdGFuY2VzIGluIG91clxuICogaW1wbGVtZW50YXRpb25cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9uIHRvIHNlbmRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYm9keV1cbiAqICBUaGUgYm9keSBvZiB0aGUgbm90aWZpY2F0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdXG4gKiAgVGhlIHR5cGUgb2YgdGhlIG5vdGlmaWNhdGlvblxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5zZW5kTm90aWZpY2F0aW9uID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgYm9keSwgdHlwZSlcbntcbiAgICB0aGlzLm5vdGlmeU9ic2VydmVycyhuZXcgTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbk5hbWUsIGJvZHksIHR5cGUpKTtcbn07XG5cbi8qKlxuICogTm90aWZ5IHtAbGluayBwdXJlbXZjLk9ic2VydmVyIE9ic2VydmVyfXNcbiAqIFxuICogVGhpcyBtZXRob2QgaXMgbGVmdCBwdWJsaWMgbW9zdGx5IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBhbmQgdG8gYWxsb3dcbiAqIHlvdSB0byBzZW5kIGN1c3RvbSBub3RpZmljYXRpb24gY2xhc3NlcyB1c2luZyB0aGUgZmFjYWRlLlxuICogXG4gKiBVc3VhbGx5IHlvdSBzaG91bGQganVzdCBjYWxsIHNlbmROb3RpZmljYXRpb24gYW5kIHBhc3MgdGhlIHBhcmFtZXRlcnMsIG5ldmVyIFxuICogaGF2aW5nIHRvIGNvbnN0cnVjdCB0aGUgbm90aWZpY2F0aW9uIHlvdXJzZWxmLlxuICogXG4gKiBAcGFyYW0ge3B1cmVtdmMuTm90aWZpY2F0aW9ufSBub3RpZmljYXRpb25cbiAqICBUaGUgTm90aWZpY2F0aW9uIHRvIHNlbmRcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUubm90aWZ5T2JzZXJ2ZXJzID0gZnVuY3Rpb24obm90aWZpY2F0aW9uKVxue1xuICAgIGlmKHRoaXMudmlldyAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy52aWV3Lm5vdGlmeU9ic2VydmVycyhub3RpZmljYXRpb24pO1xuICAgIH1cbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgRmFjYWRlcyBOb3RpZmllciBjYXBhYmlsaXRpZXMgYnkgc2V0dGluZyB0aGUgTXVsdGl0b24ga2V5IGZvciBcbiAqIHRoaXMgZmFjYWRlIGluc3RhbmNlLlxuICogXG4gKiBOb3QgY2FsbGVkIGRpcmVjdGx5LCBidXQgaW5zdGVhZCBmcm9tIHRoZSBjb25zdHJ1Y3RvciB3aGVuICNnZXRJbnN0YW5jZSBpcyBcbiAqIGludm9rZWQuIEl0IGlzIG5lY2Vzc2FyeSB0byBiZSBwdWJsaWMgaW4gb3JkZXIgdG8gaW1wbGVtZW50IE5vdGlmaWVyXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZU5vdGlmaWVyID0gZnVuY3Rpb24oa2V5KVxue1xuICAgIHRoaXMubXVsdGl0b25LZXkgPSBrZXk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgKkNvcmUqIGlzIHJlZ2lzdGVyZWQgb3Igbm90XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogIFRoZSBtdWx0aXRvbiBrZXkgZm9yIHRoZSAqQ29yZSogaW4gcXVlc3Rpb25cbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgV2hldGhlciBhICpDb3JlKiBpcyByZWdpc3RlcmVkIHdpdGggdGhlIGdpdmVuIGtleVxuICovXG5GYWNhZGUuaGFzQ29yZSA9IGZ1bmN0aW9uKGtleSlcbntcbiAgICByZXR1cm4gRmFjYWRlLmluc3RhbmNlTWFwW2tleV0gIT0gbnVsbDtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgKkNvcmUqIFxuICogXG4gKiBSZW1vdmUgdGhlIE1vZGVsLCBWaWV3LCBDb250cm9sbGVyIGFuZCBGYWNhZGUgZm9yIGEgZ2l2ZW4ga2V5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5yZW1vdmVDb3JlID0gZnVuY3Rpb24oa2V5KVxue1xuICAgIGlmKEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldID09IG51bGwpXG4gICAgICAgIHJldHVybjtcblxuICAgIE1vZGVsLnJlbW92ZU1vZGVsKGtleSk7XG4gICAgVmlldy5yZW1vdmVWaWV3KGtleSk7XG4gICAgQ29udHJvbGxlci5yZW1vdmVDb250cm9sbGVyKGtleSk7XG4gICAgZGVsZXRlIEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldO1xufTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgRmFjYWRlcyBjb3JyZXNwb25kaW5nIENvbnRyb2xsZXJcbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBwdXJlbXZjLkNvbnRyb2xsZXJcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5jb250cm9sbGVyID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgRmFjYWRlcyBjb3JyZXNwb25kaW5nIE1vZGVsIGluc3RhbmNlXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgcHVyZW12Yy5Nb2RlbFxuICovXG5GYWNhZGUucHJvdG90eXBlLm1vZGVsID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgRmFjYWRlcyBjb3JyZXNwbmRpbmcgVmlldyBpbnN0YW5jZS5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBwdXJlbXZjLlZpZXdcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS52aWV3ID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgRmFjYWRlcyBtdWx0aXRvbiBrZXkuXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgc3RyaW5nXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUubXVsdGl0b25LZXkgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBNdWx0aXRvbiBGYWNhZGUgaW5zdGFuY2UgbWFwLlxuICogQHN0YXRpY1xuICogQHByb3RlY3RlZFxuICogQHR5cGUgQXJyYXlcbiAqL1xuRmFjYWRlLmluc3RhbmNlTWFwID0gW107XG5cbi8qKlxuICogQGlnbm9yZVxuICogTWVzc2FnZXMgQ29uc3RhbnRzXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQGNvbnN0XG4gKiBAc3RhdGljXG4gKi9cbkZhY2FkZS5NVUxUSVRPTl9NU0cgPSBcIkZhY2FkZSBpbnN0YW5jZSBmb3IgdGhpcyBNdWx0aXRvbiBrZXkgYWxyZWFkeSBjb25zdHJ1Y3RlZCFcIjtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLlZpZXdcbiAqIFxuICogQSBNdWx0aXRvbiBWaWV3IGltcGxlbWVudGF0aW9uLlxuICogXG4gKiBJbiBQdXJlTVZDLCB0aGUgVmlldyBjbGFzcyBhc3N1bWVzIHRoZXNlIHJlc3BvbnNpYmlsaXRpZXNcbiAqIFxuICogLSBNYWludGFpbiBhIGNhY2hlIG9mIHtAbGluayBwdXJlbXZjLk1lZGlhdG9yIE1lZGlhdG9yfVxuICogICBpbnN0YW5jZXMuXG4gKiBcbiAqIC0gUHJvdmlkZSBtZXRob2RzIGZvciByZWdpc3RlcmluZywgcmV0cmlldmluZywgYW5kIHJlbW92aW5nIFxuICogICB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciBNZWRpYXRvcn0uXG4gKiBcbiAqIC0gTm90aWZpeWluZyB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciBNZWRpYXRvcn0gd2hlbiB0aGV5IGFyZSByZWdpc3RlcmVkIG9yIFxuICogICByZW1vdmVkLlxuICogXG4gKiAtIE1hbmFnaW5nIHRoZSBvYnNlcnZlciBsaXN0cyBmb3IgZWFjaCB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSAgXG4gKiAgIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqIFxuICogLSBQcm92aWRpbmcgYSBtZXRob2QgZm9yIGF0dGFjaGluZyB7QGxpbmsgcHVyZW12Yy5PYnNlcnZlciBPYnNlcnZlcn0gdG8gYW4gXG4gKiAgIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259J3Mgb2JzZXJ2ZXIgbGlzdC5cbiAqIFxuICogLSBQcm92aWRpbmcgYSBtZXRob2QgZm9yIGJyb2FkY2FzdGluZyBhIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259LlxuICogXG4gKiAtIE5vdGlmeWluZyB0aGUge0BsaW5rIHB1cmVtdmMuT2JzZXJ2ZXIgT2JzZXJ2ZXJ9cyBvZiBhIGdpdmVuIFxuICogICB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSB3aGVuIGl0IGJyb2FkY2FzdC5cbiAqIFxuICogVGhpcyBWaWV3IGltcGxlbWVudGF0aW9uIGlzIGEgTXVsdGl0b24sIHNvIHlvdSBzaG91bGQgbm90IGNhbGwgdGhlIFxuICogY29uc3RydWN0b3IgZGlyZWN0bHksIGJ1dCBpbnN0ZWFkIGNhbGwgdGhlIHN0YXRpYyBNdWx0aXRvbiBcbiAqIEZhY3RvcnkgI2dldEluc3RhbmNlIG1ldGhvZC5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQGNvbnN0cnVjdG9yXG4gKiBAdGhyb3dzIHtFcnJvcn0gXG4gKiAgaWYgaW5zdGFuY2UgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGhhcyBhbHJlYWR5IGJlZW4gY29uc3RydWN0ZWRcbiAqL1xuZnVuY3Rpb24gVmlldyhrZXkpXG57XG4gICAgaWYoVmlldy5pbnN0YW5jZU1hcFtrZXldICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoVmlldy5NVUxUSVRPTl9NU0cpO1xuICAgIH07XG5cbiAgICB0aGlzLm11bHRpdG9uS2V5ID0ga2V5O1xuICAgIFZpZXcuaW5zdGFuY2VNYXBbdGhpcy5tdWx0aXRvbktleV0gPSB0aGlzO1xuICAgIHRoaXMubWVkaWF0b3JNYXAgPSBbXTtcbiAgICB0aGlzLm9ic2VydmVyTWFwID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplVmlldygpO1xufTtcblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBJbml0aWFsaXplIHRoZSBTaW5nbGV0b24gVmlldyBpbnN0YW5jZVxuICogXG4gKiBDYWxsZWQgYXV0b21hdGljYWxseSBieSB0aGUgY29uc3RydWN0b3IsIHRoaXMgaXMgeW91ciBvcHBvcnR1bml0eSB0b1xuICogaW5pdGlhbGl6ZSB0aGUgU2luZ2xldG9uIGluc3RhbmNlIGluIHlvdXIgc3ViY2xhc3Mgd2l0aG91dCBvdmVycmlkaW5nIHRoZVxuICogY29uc3RydWN0b3JcbiAqIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZVZpZXcgPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBWaWV3IFNpbmdsZXRvbiBGYWN0b3J5IG1ldGhvZC5cbiAqIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBudWxsIGlmIHN1cHBsaWVkIGEgbnVsbCBcbiAqIG9yIHVuZGVmaW5lZCBtdWx0aXRvbiBrZXkuXG4gKiAgXG4gKiBAcmV0dXJuIHtwdXJlbXZjLlZpZXd9XG4gKiAgVGhlIFNpbmdsZXRvbiBpbnN0YW5jZSBvZiBWaWV3XG4gKi9cblZpZXcuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbihrZXkpXG57XG5cdGlmIChudWxsID09IGtleSlcblx0XHRyZXR1cm4gbnVsbDtcblx0XHRcbiAgICBpZihWaWV3Lmluc3RhbmNlTWFwW2tleV0gPT0gbnVsbClcbiAgICB7XG4gICAgICAgIFZpZXcuaW5zdGFuY2VNYXBba2V5XSA9IG5ldyBWaWV3KGtleSk7XG4gICAgfTtcblxuICAgIHJldHVybiBWaWV3Lmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGFuIE9ic2VydmVyIHRvIGJlIG5vdGlmaWVkIG9mIE5vdGlmaWNhdGlvbnMgd2l0aCBhIGdpdmVuIG5hbWVcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9ucyB0byBub3RpZnkgdGhpcyBPYnNlcnZlciBvZlxuICogQHBhcmFtIHtwdXJlbXZjLk9ic2VydmVyfSBvYnNlcnZlclxuICogIFRoZSBPYnNlcnZlciB0byByZWdpc3Rlci5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblZpZXcucHJvdG90eXBlLnJlZ2lzdGVyT2JzZXJ2ZXIgPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBvYnNlcnZlcilcbntcbiAgICBpZih0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdLnB1c2gob2JzZXJ2ZXIpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdID0gW29ic2VydmVyXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIE5vdGlmeSB0aGUgT2JzZXJ2ZXJzZm9yIGEgcGFydGljdWxhciBOb3RpZmljYXRpb24uXG4gKiBcbiAqIEFsbCBwcmV2aW91c2x5IGF0dGFjaGVkIE9ic2VydmVycyBmb3IgdGhpcyBOb3RpZmljYXRpb24nc1xuICogbGlzdCBhcmUgbm90aWZpZWQgYW5kIGFyZSBwYXNzZWQgYSByZWZlcmVuY2UgdG8gdGhlIElOb3RpZmljYXRpb24gaW4gXG4gKiB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSB3ZXJlIHJlZ2lzdGVyZWQuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogIFRoZSBOb3RpZmljYXRpb24gdG8gbm90aWZ5IE9ic2VydmVycyBvZlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuVmlldy5wcm90b3R5cGUubm90aWZ5T2JzZXJ2ZXJzID0gZnVuY3Rpb24obm90aWZpY2F0aW9uKVxue1xuICAgIC8vIFNJQ1xuICAgIGlmKHRoaXMub2JzZXJ2ZXJNYXBbbm90aWZpY2F0aW9uLmdldE5hbWUoKV0gIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHZhciBvYnNlcnZlcnNfcmVmID0gdGhpcy5vYnNlcnZlck1hcFtub3RpZmljYXRpb24uZ2V0TmFtZSgpXSwgb2JzZXJ2ZXJzID0gW10sIG9ic2VydmVyXG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG9ic2VydmVyc19yZWYubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ic2VydmVyID0gb2JzZXJ2ZXJzX3JlZltpXTtcbiAgICAgICAgICAgIG9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvYnNlcnZlcnMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ic2VydmVyID0gb2JzZXJ2ZXJzW2ldO1xuICAgICAgICAgICAgb2JzZXJ2ZXIubm90aWZ5T2JzZXJ2ZXIobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBPYnNlcnZlciBmb3IgYSBnaXZlbiBub3RpZnlDb250ZXh0IGZyb20gYW4gb2JzZXJ2ZXIgbGlzdCBmb3JcbiAqIGEgZ2l2ZW4gTm90aWZpY2F0aW9uIG5hbWVcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBXaGljaCBvYnNlcnZlciBsaXN0IHRvIHJlbW92ZSBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gbm90aWZ5Q29udGV4dFxuICogIFJlbW92ZSB0aGUgT2JzZXJ2ZXIgd2l0aCB0aGlzIG9iamVjdCBhcyBpdHMgbm90aWZ5Q29udGV4dFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuVmlldy5wcm90b3R5cGUucmVtb3ZlT2JzZXJ2ZXIgPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBub3RpZnlDb250ZXh0KVxue1xuICAgIC8vIFNJQ1xuICAgIHZhciBvYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvYnNlcnZlcnMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBpZihvYnNlcnZlcnNbaV0uY29tcGFyZU5vdGlmeUNvbnRleHQobm90aWZ5Q29udGV4dCkgPT0gdHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgb2JzZXJ2ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYob2JzZXJ2ZXJzLmxlbmd0aCA9PSAwKVxuICAgIHtcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJNYXBbbm90aWZpY2F0aW9uTmFtZV07XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIE1lZGlhdG9yIGluc3RhbmNlIHdpdGggdGhlIFZpZXcuXG4gKiBcbiAqIFJlZ2lzdGVycyB0aGUgTWVkaWF0b3Igc28gdGhhdCBpdCBjYW4gYmUgcmV0cmlldmVkIGJ5IG5hbWUsXG4gKiBhbmQgZnVydGhlciBpbnRlcnJvZ2F0ZXMgdGhlIE1lZGlhdG9yIGZvciBpdHMgXG4gKiB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciNsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzIGludGVyZXN0c30uXG4gKlxuICogSWYgdGhlIE1lZGlhdG9yIHJldHVybnMgYW55IE5vdGlmaWNhdGlvblxuICogbmFtZXMgdG8gYmUgbm90aWZpZWQgYWJvdXQsIGFuIE9ic2VydmVyIGlzIGNyZWF0ZWQgZW5jYXBzdWxhdGluZyBcbiAqIHRoZSBNZWRpYXRvciBpbnN0YW5jZSdzIFxuICoge0BsaW5rIHB1cmVtdmMuTWVkaWF0b3IjaGFuZGxlTm90aWZpY2F0aW9uIGhhbmRsZU5vdGlmaWNhdGlvbn1cbiAqIG1ldGhvZCBhbmQgcmVnaXN0ZXJpbmcgaXQgYXMgYW4gT2JzZXJ2ZXIgZm9yIGFsbCBOb3RpZmljYXRpb25zIHRoZSBcbiAqIE1lZGlhdG9yIGlzIGludGVyZXN0ZWQgaW4uXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5NZWRpYXRvcn0gXG4gKiAgYSByZWZlcmVuY2UgdG8gdGhlIE1lZGlhdG9yIGluc3RhbmNlXG4gKi9cblZpZXcucHJvdG90eXBlLnJlZ2lzdGVyTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvcilcbntcbiAgICBpZih0aGlzLm1lZGlhdG9yTWFwW21lZGlhdG9yLmdldE1lZGlhdG9yTmFtZSgpXSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1lZGlhdG9yLmluaXRpYWxpemVOb3RpZmllcih0aGlzLm11bHRpdG9uS2V5KTtcbiAgICAvLyByZWdpc3RlciB0aGUgbWVkaWF0b3IgZm9yIHJldHJpZXZhbCBieSBuYW1lXG4gICAgdGhpcy5tZWRpYXRvck1hcFttZWRpYXRvci5nZXRNZWRpYXRvck5hbWUoKV0gPSBtZWRpYXRvcjtcblxuICAgIC8vIGdldCBub3RpZmljYXRpb24gaW50ZXJlc3RzIGlmIGFueVxuICAgIHZhciBpbnRlcmVzdHMgPSBtZWRpYXRvci5saXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzKCk7XG5cbiAgICAvLyByZWdpc3RlciBtZWRpYXRvciBhcyBhbiBvYnNlcnZlciBmb3IgZWFjaCBub3RpZmljYXRpb25cbiAgICBpZihpbnRlcmVzdHMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICAgIC8vIGNyZWF0ZSBvYnNlcnZlciByZWZlcmVuY2luZyB0aGlzIG1lZGlhdG9ycyBoYW5kbGVOb3RpZmljYXRpb24gbWV0aG9kXG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBPYnNlcnZlcihtZWRpYXRvci5oYW5kbGVOb3RpZmljYXRpb24sIG1lZGlhdG9yKTtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGludGVyZXN0cy5sZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlck9ic2VydmVyKGludGVyZXN0c1tpXSwgb2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWVkaWF0b3Iub25SZWdpc3RlcigpO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGEgTWVkaWF0b3IgZnJvbSB0aGUgVmlld1xuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVkaWF0b3JOYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIE1lZGlhdG9yIGluc3RhbmNlIHRvIHJldHJpZXZlXG4gKiBAcmV0dXJuIHtwdXJlbXZjLk1lZGlhdG9yfVxuICogIFRoZSBNZWRpYXRvciBpbnN0YW5jZSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gbWVkaWF0b3JOYW1lXG4gKi9cblZpZXcucHJvdG90eXBlLnJldHJpZXZlTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvck5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMubWVkaWF0b3JNYXBbbWVkaWF0b3JOYW1lXTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgTWVkaWF0b3IgZnJvbSB0aGUgVmlldy5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG1lZGlhdG9yTmFtZVxuICogIE5hbWUgb2YgdGhlIE1lZGlhdG9yIGluc3RhbmNlIHRvIGJlIHJlbW92ZWRcbiAqIEByZXR1cm4ge3B1cmVtdmMuTWVkaWF0b3J9XG4gKiAgVGhlIE1lZGlhdG9yIHRoYXQgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVmlld1xuICovXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVNZWRpYXRvciA9IGZ1bmN0aW9uKG1lZGlhdG9yTmFtZSlcbntcbiAgICB2YXIgbWVkaWF0b3IgPSB0aGlzLm1lZGlhdG9yTWFwW21lZGlhdG9yTmFtZV07XG4gICAgaWYobWVkaWF0b3IpXG4gICAge1xuICAgICAgICAvLyBmb3IgZXZlcnkgbm90aWZpY2F0aW9uIHRoZSBtZWRpYXRvciBpcyBpbnRlcmVzdGVkIGluLi4uXG4gICAgICAgIHZhciBpbnRlcmVzdHMgPSBtZWRpYXRvci5saXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzKCk7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpbnRlcmVzdHMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgb2JzZXJ2ZXIgbGlua2luZyB0aGUgbWVkaWF0b3IgdG8gdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgLy8gaW50ZXJlc3RcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlT2JzZXJ2ZXIoaW50ZXJlc3RzW2ldLCBtZWRpYXRvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgdGhlIG1lZGlhdG9yIGZyb20gdGhlIG1hcFxuICAgICAgICBkZWxldGUgdGhpcy5tZWRpYXRvck1hcFttZWRpYXRvck5hbWVdO1xuXG4gICAgICAgIC8vIGFsZXJ0IHRoZSBtZWRpYXRvciB0aGF0IGl0IGhhcyBiZWVuIHJlbW92ZWRcbiAgICAgICAgbWVkaWF0b3Iub25SZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVkaWF0b3I7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgTWVkaWF0b3IgaXMgcmVnaXN0ZXJlZCBvciBub3QuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZWRpYXRvck5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgV2hldGhlciBhIE1lZGlhdG9yIGlzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gbWVkaWF0b3JuYW1lXG4gKi9cblZpZXcucHJvdG90eXBlLmhhc01lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3JOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLm1lZGlhdG9yTWFwW21lZGlhdG9yTmFtZV0gIT0gbnVsbDtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgVmlldyBpbnN0YW5jZVxuICogXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5WaWV3LnJlbW92ZVZpZXcgPSBmdW5jdGlvbihrZXkpXG57XG4gICAgZGVsZXRlIFZpZXcuaW5zdGFuY2VNYXBba2V5XTtcbn07XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIFZpZXdzIGludGVybmFsIG1hcHBpbmcgb2YgbWVkaWF0b3IgbmFtZXMgdG8gbWVkaWF0b3IgaW5zdGFuY2VzXG4gKlxuICogQHR5cGUgQXJyYXlcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuVmlldy5wcm90b3R5cGUubWVkaWF0b3JNYXAgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBWaWV3cyBpbnRlcm5hbCBtYXBwaW5nIG9mIE5vdGlmaWNhdGlvbiBuYW1lcyB0byBPYnNlcnZlciBsaXN0c1xuICpcbiAqIEB0eXBlIEFycmF5XG4gKiBAcHJvdGVjdGVkXG4gKi9cblZpZXcucHJvdG90eXBlLm9ic2VydmVyTWFwID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgaW50ZXJuYWwgbWFwIHVzZWQgdG8gc3RvcmUgbXVsdGl0b24gVmlldyBpbnN0YW5jZXNcbiAqXG4gKiBAdHlwZSBBcnJheVxuICogQHByb3RlY3RlZFxuICovXG5WaWV3Lmluc3RhbmNlTWFwID0gW107XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIFZpZXdzIGludGVybmFsIG11bHRpdG9uIGtleS5cbiAqXG4gKiBAdHlwZSBzdHJpbmdcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuVmlldy5wcm90b3R5cGUubXVsdGl0b25LZXkgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBlcnJvciBtZXNzYWdlIHVzZWQgaWYgYW4gYXR0ZW1wdCBpcyBtYWRlIHRvIGluc3RhbnRpYXRlIFZpZXcgZGlyZWN0bHlcbiAqXG4gKiBAdHlwZSBzdHJpbmdcbiAqIEBwcm90ZWN0ZWRcbiAqIEBjb25zdFxuICogQHN0YXRpY1xuICovXG5WaWV3Lk1VTFRJVE9OX01TRyA9IFwiVmlldyBpbnN0YW5jZSBmb3IgdGhpcyBNdWx0aXRvbiBrZXkgYWxyZWFkeSBjb25zdHJ1Y3RlZCFcIjtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk1vZGVsXG4gKlxuICogQSBNdWx0aXRvbiBNb2RlbCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBJbiBQdXJlTVZDLCB0aGUgTW9kZWwgY2xhc3MgcHJvdmlkZXNcbiAqIGFjY2VzcyB0byBtb2RlbCBvYmplY3RzIChQcm94aWVzKSBieSBuYW1lZCBsb29rdXAuXG4gKlxuICogVGhlIE1vZGVsIGFzc3VtZXMgdGhlc2UgcmVzcG9uc2liaWxpdGllczpcbiAqXG4gKiAtIE1haW50YWluIGEgY2FjaGUgb2Yge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9XG4gKiAgIGluc3RhbmNlcy5cbiAqIC0gUHJvdmlkZSBtZXRob2RzIGZvciByZWdpc3RlcmluZywgcmV0cmlldmluZywgYW5kIHJlbW92aW5nXG4gKiAgIHtAbGluayBwdXJlbXZjLlByb3h5IFByb3h5fSBpbnN0YW5jZXMuXG4gKlxuICogWW91ciBhcHBsaWNhdGlvbiBtdXN0IHJlZ2lzdGVyIFxuICoge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9IGluc3RhbmNlcyB3aXRoIHRoZSBNb2RlbC4gXG4gKiBUeXBpY2FsbHksIHlvdSB1c2UgYSBcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH0gXG4gKiBvclxuICoge0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH0gXG4gKiB0byBjcmVhdGUgYW5kIHJlZ2lzdGVyIFByb3h5IGluc3RhbmNlcyBvbmNlIHRoZSBGYWNhZGUgaGFzIGluaXRpYWxpemVkIHRoZSBcbiAqICpDb3JlKiBhY3RvcnMuXG4gKlxuICogVGhpcyBNb2RlbCBpbXBsZW1lbnRhdGlvbiBpcyBhIE11bHRpdG9uLCBzbyB5b3Ugc2hvdWxkIG5vdCBjYWxsIHRoZSBcbiAqIGNvbnN0cnVjdG9yIGRpcmVjdGx5LCBidXQgaW5zdGVhZCBjYWxsIHRoZSBcbiAqIHtAbGluayAjZ2V0SW5zdGFuY2Ugc3RhdGljIE11bHRpdG9uIEZhY3RvcnkgbWV0aG9kfSBcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogIFRoZSBNb2RlbHMgbXVsdGl0b24ga2V5XG4gKiBAdGhyb3dzIHtFcnJvcn1cbiAqICBBbiBlcnJvciBpcyB0aHJvd24gaWYgdGhpcyBtdWx0aXRvbnMga2V5IGlzIGFscmVhZHkgaW4gdXNlIGJ5IGFub3RoZXIgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gTW9kZWwoa2V5KVxue1xuICAgIGlmKE1vZGVsLmluc3RhbmNlTWFwW2tleV0pXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoTW9kZWwuTVVMVElUT05fTVNHKTtcbiAgICB9XG5cbiAgICB0aGlzLm11bHRpdG9uS2V5PSBrZXk7XG4gICAgTW9kZWwuaW5zdGFuY2VNYXBba2V5XT0gdGhpcztcbiAgICB0aGlzLnByb3h5TWFwPSBbXTtcbiAgICB0aGlzLmluaXRpYWxpemVNb2RlbCgpO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBNb2RlbCBpbnN0YW5jZS5cbiAqIFxuICogQ2FsbGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIGNvbnN0cnVjdG9yLCB0aGlzXG4gKiBpcyB5b3VyIG9wcG9ydHVuaXR5IHRvIGluaXRpYWxpemUgdGhlIFNpbmdsZXRvblxuICogaW5zdGFuY2UgaW4geW91ciBzdWJjbGFzcyB3aXRob3V0IG92ZXJyaWRpbmcgdGhlXG4gKiBjb25zdHJ1Y3Rvci5cbiAqIFxuICogQHJldHVybiB2b2lkXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplTW9kZWw9IGZ1bmN0aW9uKCl7fTtcblxuXG4vKipcbiAqIE1vZGVsIE11bHRpdG9uIEZhY3RvcnkgbWV0aG9kLlxuICogTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIG51bGwgaWYgc3VwcGxpZWQgYSBudWxsIFxuICogb3IgdW5kZWZpbmVkIG11bHRpdG9uIGtleS5cbiAqICBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqICBUaGUgbXVsdGl0b24ga2V5IGZvciB0aGUgTW9kZWwgdG8gcmV0cmlldmVcbiAqIEByZXR1cm4ge3B1cmVtdmMuTW9kZWx9XG4gKiAgdGhlIGluc3RhbmNlIGZvciB0aGlzIE11bHRpdG9uIGtleSBcbiAqL1xuTW9kZWwuZ2V0SW5zdGFuY2U9IGZ1bmN0aW9uKGtleSlcbntcblx0aWYgKG51bGwgPT0ga2V5KVxuXHRcdHJldHVybiBudWxsO1xuXHRcdFxuICAgIGlmKE1vZGVsLmluc3RhbmNlTWFwW2tleV0gPT0gbnVsbClcbiAgICB7XG4gICAgICAgIE1vZGVsLmluc3RhbmNlTWFwW2tleV09IG5ldyBNb2RlbChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBNb2RlbC5pbnN0YW5jZU1hcFtrZXldO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIFByb3h5IHdpdGggdGhlIE1vZGVsXG4gKiBAcGFyYW0ge3B1cmVtdmMuUHJveHl9XG4gKi9cbk1vZGVsLnByb3RvdHlwZS5yZWdpc3RlclByb3h5PSBmdW5jdGlvbihwcm94eSlcbntcbiAgICBwcm94eS5pbml0aWFsaXplTm90aWZpZXIodGhpcy5tdWx0aXRvbktleSk7XG4gICAgdGhpcy5wcm94eU1hcFtwcm94eS5nZXRQcm94eU5hbWUoKV09IHByb3h5O1xuICAgIHByb3h5Lm9uUmVnaXN0ZXIoKTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgYSBQcm94eSBmcm9tIHRoZSBNb2RlbFxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiBAcmV0dXJuIHtwdXJlbXZjLlByb3h5fVxuICogIFRoZSBQcm94eSBpbnN0YW5jZSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgcHJvdmlkZWQgcHJveHlOYW1lXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5yZXRyaWV2ZVByb3h5PSBmdW5jdGlvbihwcm94eU5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMucHJveHlNYXBbcHJveHlOYW1lXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBQcm94eSBpcyByZWdpc3RlcmVkXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICogIHdoZXRoZXIgYSBQcm94eSBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBnaXZlbiBwcm94eU5hbWUuXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5oYXNQcm94eT0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLnByb3h5TWFwW3Byb3h5TmFtZV0gIT0gbnVsbDtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgUHJveHkgZnJvbSB0aGUgTW9kZWwuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm94eU5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgUHJveHkgaW5zdGFuY2UgdG8gcmVtb3ZlXG4gKiBAcmV0dXJuIHtwdXJlbXZjLlByb3h5fVxuICogIFRoZSBQcm94eSB0aGF0IHdhcyByZW1vdmVkIGZyb20gdGhlIE1vZGVsXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5yZW1vdmVQcm94eT0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHZhciBwcm94eT0gdGhpcy5wcm94eU1hcFtwcm94eU5hbWVdO1xuICAgIGlmKHByb3h5KVxuICAgIHtcbiAgICAgICAgdGhpcy5wcm94eU1hcFtwcm94eU5hbWVdPSBudWxsO1xuICAgICAgICBwcm94eS5vblJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm94eTtcbn07XG5cbi8qKlxuICogQHN0YXRpY1xuICogUmVtb3ZlIGEgTW9kZWwgaW5zdGFuY2UuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk1vZGVsLnJlbW92ZU1vZGVsPSBmdW5jdGlvbihrZXkpXG57XG4gICAgZGVsZXRlIE1vZGVsLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBtYXAgdXNlZCBieSB0aGUgTW9kZWwgdG8gc3RvcmUgUHJveHkgaW5zdGFuY2VzLlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIEFycmF5XG4gKi9cbk1vZGVsLnByb3RvdHlwZS5wcm94eU1hcD0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgbWFwIHVzZWQgYnkgdGhlIE1vZGVsIHRvIHN0b3JlIG11bHRpdG9uIGluc3RhbmNlc1xuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIEFycmF5XG4gKi9cbk1vZGVsLmluc3RhbmNlTWFwPSBbXTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgTW9kZWxzIG11bHRpdG9uIGtleS5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBzdHJpbmdcbiAqL1xuTW9kZWwucHJvdG90eXBlLm11bHRpdG9uS2V5O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIE1lc3NhZ2VzIENvbnN0YW50c1xuICogXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5Nb2RlbC5NVUxUSVRPTl9NU0c9IFwiTW9kZWwgaW5zdGFuY2UgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGFscmVhZHkgY29uc3RydWN0ZWQhXCI7XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5Db250cm9sbGVyXG4gKiBcbiAqIEluIFB1cmVNVkMsIHRoZSBDb250cm9sbGVyIGNsYXNzIGZvbGxvd3MgdGhlICdDb21tYW5kIGFuZCBDb250cm9sbGVyJyBcbiAqIHN0cmF0ZWd5LCBhbmQgYXNzdW1lcyB0aGVzZSByZXNwb25zaWJpbGl0aWVzOlxuICogXG4gKiAtIFJlbWVtYmVyaW5nIHdoaWNoXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9c1xuICogb3IgXG4gKiB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfXNcbiAqIGFyZSBpbnRlbmRlZCB0byBoYW5kbGUgd2hpY2ggXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufXNcbiAqIC0gUmVnaXN0ZXJpbmcgaXRzZWxmIGFzIGFuIFxuICoge0BsaW5rIHB1cmVtdmMuT2JzZXJ2ZXIgT2JzZXJ2ZXJ9IHdpdGhcbiAqIHRoZSB7QGxpbmsgcHVyZW12Yy5WaWV3IFZpZXd9IGZvciBlYWNoIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn1cbiAqIHRoYXQgaXQgaGFzIGFuIFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfSBcbiAqIG9yIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9IFxuICogbWFwcGluZyBmb3IuXG4gKiAtIENyZWF0aW5nIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBwcm9wZXIgXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9c1xuICogb3IgXG4gKiB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfXNcbiAqIHRvIGhhbmRsZSBhIGdpdmVuIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn0gXG4gKiB3aGVuIG5vdGlmaWVkIGJ5IHRoZVxuICoge0BsaW5rIHB1cmVtdmMuVmlldyBWaWV3fS5cbiAqIC0gQ2FsbGluZyB0aGUgY29tbWFuZCdzIGV4ZWN1dGUgbWV0aG9kLCBwYXNzaW5nIGluIHRoZSBcbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259LlxuICpcbiAqIFlvdXIgYXBwbGljYXRpb24gbXVzdCByZWdpc3RlciBcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH1zXG4gKiBvciB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfXMgXG4gKiB3aXRoIHRoZSBDb250cm9sbGVyLlxuICpcbiAqIFRoZSBzaW1wbGVzdCB3YXkgaXMgdG8gc3ViY2xhc3MgXG4gKiB7QGxpbmsgcHVyZW12Yy5GYWNhZGUgRmFjYWRlfSxcbiAqIGFuZCB1c2UgaXRzIFxuICoge0BsaW5rIHB1cmVtdmMuRmFjYWRlI2luaXRpYWxpemVDb250cm9sbGVyIGluaXRpYWxpemVDb250cm9sbGVyfSBcbiAqIG1ldGhvZCB0byBhZGQgeW91ciByZWdpc3RyYXRpb25zLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogVGhpcyBDb250cm9sbGVyIGltcGxlbWVudGF0aW9uIGlzIGEgTXVsdGl0b24sIHNvIHlvdSBzaG91bGQgbm90IGNhbGwgdGhlIFxuICogY29uc3RydWN0b3IgZGlyZWN0bHksIGJ1dCBpbnN0ZWFkIGNhbGwgdGhlIHN0YXRpYyAjZ2V0SW5zdGFuY2UgZmFjdG9yeSBtZXRob2QsIFxuICogcGFzc2luZyB0aGUgdW5pcXVlIGtleSBmb3IgdGhpcyBpbnN0YW5jZSB0byBpdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEB0aHJvd3Mge0Vycm9yfVxuICogIElmIGluc3RhbmNlIGZvciB0aGlzIE11bHRpdG9uIGtleSBoYXMgYWxyZWFkeSBiZWVuIGNvbnN0cnVjdGVkXG4gKi9cbmZ1bmN0aW9uIENvbnRyb2xsZXIoa2V5KVxue1xuICAgIGlmKENvbnRyb2xsZXIuaW5zdGFuY2VNYXBba2V5XSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKENvbnRyb2xsZXIuTVVMVElUT05fTVNHKTtcbiAgICB9XG5cbiAgICB0aGlzLm11bHRpdG9uS2V5PSBrZXk7XG4gICAgQ29udHJvbGxlci5pbnN0YW5jZU1hcFt0aGlzLm11bHRpdG9uS2V5XT0gdGhpcztcbiAgICB0aGlzLmNvbW1hbmRNYXA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xsZXIoKTtcbn1cblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBcbiAqIEluaXRpYWxpemUgdGhlIG11bHRpdG9uIENvbnRyb2xsZXIgaW5zdGFuY2UuXG4gKlxuICogQ2FsbGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIGNvbnN0cnVjdG9yLlxuICpcbiAqIE5vdGUgdGhhdCBpZiB5b3UgYXJlIHVzaW5nIGEgc3ViY2xhc3Mgb2YgVmlld1xuICogaW4geW91ciBhcHBsaWNhdGlvbiwgeW91IHNob3VsZCAqYWxzbyogc3ViY2xhc3MgQ29udHJvbGxlclxuICogYW5kIG92ZXJyaWRlIHRoZSBpbml0aWFsaXplQ29udHJvbGxlciBtZXRob2QgaW4gdGhlXG4gKiBmb2xsb3dpbmcgd2F5LlxuICogXG4gKiAgICAgTXlDb250cm9sbGVyLnByb3RvdHlwZS5pbml0aWFsaXplQ29udHJvbGxlcj0gZnVuY3Rpb24gKClcbiAqICAgICB7XG4gKiAgICAgICAgIHRoaXMudmlldz0gTXlWaWV3LmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xuICogICAgIH07XG4gKiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXRpYWxpemVDb250cm9sbGVyPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy52aWV3PSBWaWV3LmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xufTtcblxuLyoqXG4gKiBUaGUgQ29udHJvbGxlcnMgbXVsdGl0b24gZmFjdG9yeSBtZXRob2QuIFxuICogTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIG51bGwgaWYgc3VwcGxpZWQgYSBudWxsIFxuICogb3IgdW5kZWZpbmVkIG11bHRpdG9uIGtleS4gXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogIEEgQ29udHJvbGxlcidzIG11bHRpdG9uIGtleVxuICogQHJldHVybiB7cHVyZW12Yy5Db250cm9sbGVyfVxuICogIHRoZSBNdWx0aXRvbiBpbnN0YW5jZSBvZiBDb250cm9sbGVyXG4gKi9cbkNvbnRyb2xsZXIuZ2V0SW5zdGFuY2U9IGZ1bmN0aW9uKGtleSlcbntcblx0aWYgKG51bGwgPT0ga2V5KVxuXHRcdHJldHVybiBudWxsO1xuXHRcdFxuICAgIGlmKG51bGwgPT0gdGhpcy5pbnN0YW5jZU1hcFtrZXldKVxuICAgIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZU1hcFtrZXldPSBuZXcgdGhpcyhrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIElmIGEgU2ltcGxlQ29tbWFuZCBvciBNYWNyb0NvbW1hbmQgaGFzIHByZXZpb3VzbHkgYmVlbiByZWdpc3RlcmVkIHRvIGhhbmRsZVxuICogdGhlIGdpdmVuIE5vdGlmaWNhdGlvbiB0aGVuIGl0IGlzIGV4ZWN1dGVkLlxuICpcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGVcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmV4ZWN1dGVDb21tYW5kPSBmdW5jdGlvbihub3RlKVxue1xuICAgIHZhciBjb21tYW5kQ2xhc3NSZWY9IHRoaXMuY29tbWFuZE1hcFtub3RlLmdldE5hbWUoKV07XG4gICAgaWYoY29tbWFuZENsYXNzUmVmID09IG51bGwpXG4gICAgICAgIHJldHVybjtcblxuICAgIHZhciBjb21tYW5kSW5zdGFuY2U9IG5ldyBjb21tYW5kQ2xhc3NSZWYoKTtcbiAgICBjb21tYW5kSW5zdGFuY2UuaW5pdGlhbGl6ZU5vdGlmaWVyKHRoaXMubXVsdGl0b25LZXkpO1xuICAgIGNvbW1hbmRJbnN0YW5jZS5leGVjdXRlKG5vdGUpO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIHBhcnRpY3VsYXIgU2ltcGxlQ29tbWFuZCBvciBNYWNyb0NvbW1hbmQgY2xhc3MgYXMgdGhlIGhhbmRsZXIgZm9yIFxuICogYSBwYXJ0aWN1bGFyIE5vdGlmaWNhdGlvbi5cbiAqXG4gKiBJZiBhbiBjb21tYW5kIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIHRvIGhhbmRsZSBOb3RpZmljYXRpb25zIHdpdGggdGhpcyBuYW1lLCBcbiAqIGl0IGlzIG5vIGxvbmdlciB1c2VkLCB0aGUgbmV3IGNvbW1hbmQgaXMgdXNlZCBpbnN0ZWFkLlxuICpcbiAqIFRoZSBPYnNlcnZlciBmb3IgdGhlIG5ldyBjb21tYW5kIGlzIG9ubHkgY3JlYXRlZCBpZiB0aGlzIHRoZSBpcnN0IHRpbWUgYVxuICogY29tbWFuZCBoYXMgYmVlbiByZWdpc2VyZWQgZm9yIHRoaXMgTm90aWZpY2F0aW9uIG5hbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICB0aGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21tYW5kQ2xhc3NSZWZcbiAqICBhIGNvbW1hbmQgY29uc3RydWN0b3JcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyQ29tbWFuZD0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgY29tbWFuZENsYXNzUmVmKVxue1xuICAgIGlmKHRoaXMuY29tbWFuZE1hcFtub3RpZmljYXRpb25OYW1lXSA9PSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy52aWV3LnJlZ2lzdGVyT2JzZXJ2ZXIobm90aWZpY2F0aW9uTmFtZSwgbmV3IE9ic2VydmVyKHRoaXMuZXhlY3V0ZUNvbW1hbmQsIHRoaXMpKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbW1hbmRNYXBbbm90aWZpY2F0aW9uTmFtZV09IGNvbW1hbmRDbGFzc1JlZjtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBjb21tYW5kIGlzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gTm90aWZpY2F0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgd2hldGhlciBhIENvbW1hbmQgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgZm9yIHRoZSBnaXZlbiBub3RpZmljYXRpb25OYW1lLlxuICovXG5Db250cm9sbGVyLnByb3RvdHlwZS5oYXNDb21tYW5kPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lKVxue1xuICAgIHJldHVybiB0aGlzLmNvbW1hbmRNYXBbbm90aWZpY2F0aW9uTmFtZV0gIT0gbnVsbDtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIGNvbW1hbmQgdG9cbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259XG4gKiBtYXBwaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgdGhlIG5hbWUgb2YgdGhlIE5vdGlmaWNhdGlvbiB0byByZW1vdmUgdGhlIGNvbW1hbmQgbWFwcGluZyBmb3JcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbW92ZUNvbW1hbmQ9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk5hbWUpXG57XG4gICAgaWYodGhpcy5oYXNDb21tYW5kKG5vdGlmaWNhdGlvbk5hbWUpKVxuICAgIHtcbiAgICAgICAgdGhpcy52aWV3LnJlbW92ZU9ic2VydmVyKG5vdGlmaWNhdGlvbk5hbWUsIHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1hbmRNYXBbbm90aWZpY2F0aW9uTmFtZV09IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAc3RhdGljXG4gKiBSZW1vdmUgYSBDb250cm9sbGVyIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXG4gKiAgbXVsdGl0b25LZXkgb2YgQ29udHJvbGxlciBpbnN0YW5jZSB0byByZW1vdmVcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucmVtb3ZlQ29udHJvbGxlcj0gZnVuY3Rpb24oa2V5KVxue1xuICAgIGRlbGV0ZSB0aGlzLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIExvY2FsIHJlZmVyZW5jZSB0byB0aGUgQ29udHJvbGxlcidzIFZpZXdcbiAqIFxuICogQHByb3RlY3RlZFxuICogQHR5cGUge3B1cmVtdmMuVmlld31cbiAqL1xuQ29udHJvbGxlci5wcm90b3R5cGUudmlldz0gbnVsbDtcblxuLyoqXG4gKiBOb3RlIG5hbWUgdG8gY29tbWFuZCBjb25zdHJ1Y3RvciBtYXBwaW5nc1xuICogXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5Db250cm9sbGVyLnByb3RvdHlwZS5jb21tYW5kTWFwPSBudWxsO1xuXG4vKipcbiAqIFRoZSBDb250cm9sbGVyJ3MgbXVsdGl0b24ga2V5XG4gKiBcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLm11bHRpdG9uS2V5PSBudWxsO1xuXG4vKipcbiAqIE11bHRpdG9uIGtleSB0byBDb250cm9sbGVyIGluc3RhbmNlIG1hcHBpbmdzXG4gKiBcbiAqIEBzdGF0aWNcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbkNvbnRyb2xsZXIuaW5zdGFuY2VNYXA9IFtdO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFxuICogTWVzc2FnZXMgY29uc3RhbnRzXG4gKiBAc3RhdGljXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5Db250cm9sbGVyLk1VTFRJVE9OX01TRz0gXCJjb250cm9sbGVyIGtleSBmb3IgdGhpcyBNdWx0aXRvbiBrZXkgYWxyZWFkeSBjb25zdHJ1Y3RlZFwiXG4vKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBoaWRlXG4gKiBBIGFuIGludGVybmFsIGhlbHBlciBjbGFzcyB1c2VkIHRvIGFzc2lzdCBjbGFzc2xldCBpbXBsZW1lbnRhdGlvbi4gVGhpc1xuICogY2xhc3MgaXMgbm90IGFjY2Vzc2libGUgYnkgY2xpZW50IGNvZGUuXG4gKi9cbnZhciBPb3BIZWxwPVxue1xuICAgIC8qXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIHNjb3BlLiBXZSB1c2UgdGhpcyByYXRoZXIgdGhhbiB3aW5kb3dcbiAgICAgKiBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggYnJvd3NlciBiYXNlZCBhbmQgbm9uIGJyb3dzZXIgYmFlZCBcbiAgICAgKiBKYXZhU2NyaXB0IGludGVycHJldGVycy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuXHRnbG9iYWw6IChmdW5jdGlvbigpe3JldHVybiB0aGlzfSkoKVxuICAgIFxuICAgIC8qXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBFeHRlbmQgb25lIEZ1bmN0aW9uJ3MgcHJvdG90eXBlIGJ5IGFub3RoZXIsIGVtdWxhdGluZyBjbGFzc2ljXG4gICAgICogaW5oZXJpdGFuY2UuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2hpbGRcbiAgICAgKiAgVGhlIEZ1bmN0aW9uIHRvIGV4dGVuZCAoc3ViY2xhc3MpXG4gICAgICogXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyZW50XG4gICAgICogIFRoZSBGdW5jdGlvbiB0byBleHRlbmQgZnJvbSAoc3VwZXJjbGFzcylcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgKiBcbiAgICAgKiAgQSByZWZlcmVuY2UgdG8gdGhlIGV4dGVuZGVkIEZ1bmN0aW9uIChzdWJjbGFzcylcbiAgICAgKi9cbiwgICBleHRlbmQ6IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50KVxuICAgIHtcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjaGlsZClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJyNleHRlbmQtIGNoaWxkIHNob3VsZCBiZSBGdW5jdGlvbicpOyAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBwYXJlbnQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcjZXh0ZW5kLSBwYXJlbnQgc2hvdWxkIGJlIEZ1bmN0aW9uJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKHBhcmVudCA9PT0gY2hpbGQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgdmFyIFRyYW5zaXRpdmU9IG5ldyBGdW5jdGlvbjtcbiAgICAgICAgVHJhbnNpdGl2ZS5wcm90b3R5cGU9IHBhcmVudC5wcm90b3R5cGU7XG4gICAgICAgIGNoaWxkLnByb3RvdHlwZT0gbmV3IFRyYW5zaXRpdmU7XG4gICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGUuY29uc3RydWN0b3I9IGNoaWxkO1xuICAgIH1cbiAgICBcbiAgICAvKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogRGVjb2FyYXRlIG9uZSBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBhbm90aGVyLiBcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAgICogIFRoZSBvYmplY3QgdG8gZGVjb3JhdGUuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRyYWl0c1xuICAgICAqICBUaGUgb2JqZWN0IHByb3ZpZGluZyB0aGUgcHJvcGVyaXRlcyB0aGF0IHRoZSBmaXJzdCBvYmplY3RcbiAgICAgKiAgd2lsbCBiZSBkZWNvcmF0ZWQgd2l0aC4gTm90ZSB0aGF0IG9ubHkgcHJvcGVydGllcyBkZWZpbmVkIG9uIFxuICAgICAqICB0aGlzIG9iamVjdCB3aWxsIGJlIGNvcGllZC0gaS5lLiBpbmhlcml0ZWQgcHJvcGVydGllcyB3aWxsXG4gICAgICogIGJlIGlnbm9yZWQuXG4gICAgICogXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqICBUSGUgZGVjb3JhdGVkIG9iamVjdCAoZmlyc3QgYXJndW1lbnQpXG4gICAgICovXG4sICAgZGVjb3JhdGU6IGZ1bmN0aW9uIChvYmplY3QsIHRyYWl0cylcbiAgICB7ICAgXG4gICAgICAgIGZvciAodmFyIGFjY2Vzc29yIGluIHRyYWl0cylcbiAgICAgICAge1xuICAgICAgICAgICAgb2JqZWN0W2FjY2Vzc29yXT0gdHJhaXRzW2FjY2Vzc29yXTtcbiAgICAgICAgfSAgICBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIEBtZW1iZXIgcHVyZW12Y1xuICogXG4gKiBEZWNsYXJlIGEgbmFtZXNwYWNlIGFuZCBvcHRpb25hbGx5IG1ha2UgYW4gT2JqZWN0IHRoZSByZWZlcmVudFxuICogb2YgdGhhdCBuYW1lc3BhY2UuXG4gKiBcbiAqICAgICBjb25zb2xlLmFzc2VydChudWxsID09IHdpbmRvdy50bGQsICdObyB0bGQgbmFtZXNwYWNlJyk7XG4gKiAgICAgLy8gZGVjbGFyZSB0aGUgdGxkIG5hbWVzcGFjZVxuICogICAgIHB1cmVtdmMuZGVjbGFyZSgndGxkJyk7XG4gKiAgICAgY29uc29sZS5hc3NlcnQoJ29iamVjdCcgPT09IHR5cGVvZiB0bGQsICdUaGUgdGxkIG5hbWVzcGFjZSB3YXMgZGVjbGFyZWQnKTtcbiAqIFxuICogICAgIC8vIHRoZSBtZXRob2QgcmV0dXJucyBhIHJlZmVyZW5jZSB0byBsYXN0IG5hbWVzcGFjZSBub2RlIGluIGEgY3JlYXRlZCBoaWVyYXJjaHlcbiAqICAgICB2YXIgcmVmZXJlbmNlPSBwdXJlbXZjLmRlY2xhcmUoJ3RsZC5kb21haW4uYXBwJyk7XG4gKiAgICAgY29uc29sZS5hc3NlcnQocmVmZXJlbmNlID09PSB0bGQuZG9tYWluLmFwcClcbiAqICAgIFxuICogICAgIC8vIG9mIGNvdXJzZSB5b3UgY2FuIGFsc28gZGVjbGFyZSB5b3VyIG93biBvYmplY3RzIGFzIHdlbGxcbiAqICAgICB2YXIgQXBwQ29uc3RhbnRzPVxuICogICAgICAgICB7XG4gKiBcdCAgICAgICAgICAgQVBQX05BTUU6ICd0bGQuZG9tYWluLmFwcC5BcHAnXG4gKiAgICAgICAgIH07XG4gKiBcbiAqICAgICBwdXJlbXZjLmRlY2xhcmUoJ3RsZC5kb21haW4uYXBwLkFwcENvbnN0YW50cycsIEFwcENvbnN0YW50cyk7XG4gKiAgICAgY29uc29sZS5hc3NlcnQoQXBwQ29uc3RhbnRzID09PSB0bGQuZG9tYWluLmFwcC5BcHBDb25zdGFudHNcbiAqIFx0ICAgLCAnQXBwQ29uc3RhbnRzIHdhcyBleHBvcnRlZCB0byB0aGUgbmFtZXNwYWNlJyk7XG4gKiBcbiAqIE5vdGUgdGhhdCB5b3UgY2FuIGFsc28gI2RlY2xhcmUgd2l0aGluIGEgY2xvc3VyZS4gVGhhdCB3YXkgeW91XG4gKiBjYW4gc2VsZWN0aXZlbHkgZXhwb3J0IE9iamVjdHMgdG8geW91ciBvd24gbmFtZXNwYWNlcyB3aXRob3V0XG4gKiBsZWFraW5nIHZhcmlhYmxlcyBpbnRvIHRoZSBnbG9iYWwgc2NvcGUuXG4gKiAgICBcbiAqICAgICAoZnVuY3Rpb24oKXtcbiAqICAgICAgICAgLy8gdGhpcyB2YXIgaXMgbm90IGFjY2Vzc2libGUgb3V0c2lkZSBvZiB0aGlzXG4gKiAgICAgICAgIC8vIGNsb3N1cmVzIGNhbGwgc2NvcGVcbiAqICAgICAgICAgdmFyIGhpZGRlblZhbHVlPSAnZGVmYXVsdFZhbHVlJztcbiAqIFxuICogICAgICAgICAvLyBleHBvcnQgYW4gb2JqZWN0IHRoYXQgcmVmZXJlbmNlcyB0aGUgaGlkZGVuXG4gKiAgICAgICAgIC8vIHZhcmlhYmxlIGFuZCB3aGljaCBjYW4gbXV0YXRlIGl0XG4gKiAgICAgICAgIHB1cmVtdmMuZGVjbGFyZVxuICogICAgICAgICAoXG4gKiAgICAgICAgICAgICAgJ3RsZC5kb21haW4uYXBwLmJhY2tkb29yJ1xuICogXG4gKiAgICAgICAgICwgICAge1xuICogICAgICAgICAgICAgICAgICBzZXRWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKVxuICogICAgICAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ25zIHRvIHRoZSBoaWRkZW4gdmFyXG4gKiAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5WYWx1ZT0gdmFsdWU7XG4gKiAgICAgICAgICAgICAgICAgIH1cbiAqIFxuICogICAgICAgICAsICAgICAgICBnZXRWYWx1ZTogZnVuY3Rpb24gKClcbiAqICAgICAgICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgICAgICAgLy8gcmVhZHMgZnJvbSB0aGUgaGlkZGVuIHZhclxuICogICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpZGRlblZhbHVlO1xuICogICAgICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgICAgfVxuICogICAgICAgICApO1xuICogICAgIH0pKCk7XG4gKiAgICAgLy8gaW5kaXJlY3RseSByZXRyaWV2ZSB0aGUgaGlkZGVuIHZhcmlhYmxlcyB2YWx1ZVxuICogICAgIGNvbnNvbGUuYXNzZXJ0KCdkZWZhdWx0VmFsdWUnID09PSB0bGQuZG9tYWluLmFwcC5iYWNrZG9vci5nZXRWYWx1ZSgpKTtcbiAqICAgICAvLyBpbmRpcmVjdGx5IHNldCB0aGUgaGlkZGVuIHZhcmlhYmxlcyB2YWx1ZVxuICogICAgIHRsZC5kb21haW4uYXBwLmJhY2tkb29yLnNldFZhbHVlKCduZXdWYWx1ZScpO1xuICogICAgIC8vIHRoZSBoaWRkZW4gdmFyIHdhcyBtdXRhdGVkXG4gKiAgICAgY29uc29sZS5hc3NlcnQoJ25ld1ZhbHVlJyA9PT0gdGxkLmRvbWFpbi5hcHAuYmFja2Rvb3IuZ2V0VmFsdWUoKSk7XG4gKiBcbiAqIE9uIG9jY2FzaW9uLCBwcmltYXJpbHkgZHVyaW5nIHRlc3RpbmcsIHlvdSBtYXkgd2FudCB0byB1c2UgZGVjbGFyZSwgXG4gKiBidXQgbm90IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgYmUgdGhlIG5hbWVzcGFjZSByb290LiBJbiB0aGVzZSBjYXNlcyB5b3VcbiAqIGNhbiBzdXBwbHkgdGhlIG9wdGlvbmFsIHRoaXJkIHNjb3BlIGFyZ3VtZW50LlxuICogXG4gKiAgICAgdmFyIGxvY2FsU2NvcGU9IHt9XG4gKiAgICAgLCAgIG9iamVjdD0ge31cbiAqIFxuICogICAgIHB1cmVtdmMuZGVjbGFyZSgnbW9jay5vYmplY3QnLCBvYmplY3QsIGxvY2FsU2NvcGUpO1xuICogXG4gKiAgICAgY29uc29sZS5hc3NlcnQobnVsbCA9PSB3aW5kb3cubW9jaywgJ21vY2sgbmFtZXNwYWNlIGlzIG5vdCBpbiBnbG9iYWwgc2NvcGUnKTtcbiAqICAgICBjb25zb2xlLmFzc2VydChvYmplY3QgPT09IGxvY2FsU2NvcGUubW9jay5vYmplY3QsICdtb2NrLm9iamVjdCBpcyBhdmFpbGFibGUgaW4gbG9jYWxTY29wZScpOyAgICBcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICogIEEgcXVhbGlmaWVkIG9iamVjdCBuYW1lLCBlLmcuICdjb20uZXhhbXBsZS5DbGFzcydcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdXG4gKiAgQW4gb2JqZWN0IHRvIG1ha2UgdGhlIHJlZmVyZW50IG9mIHRoZSBuYW1lc3BhY2UuIFxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW3Njb3BlXVxuICogIFRoZSBuYW1lc3BhY2UncyByb290IG5vZGUuIElmIG5vdCBzdXBwbGllZCwgdGhlIGdsb2JhbFxuICogIHNjb3BlIHdpbGwgYmUgbmFtZXNwYWNlcyByb290IG5vZGUuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIFxuICogIEEgcmVmZXJlbmNlIHRvIHRoZSBsYXN0IG5vZGUgb2YgdGhlIE9iamVjdCBoaWVyYXJjaHkgY3JlYXRlZC5cbiAqL1xuZnVuY3Rpb24gZGVjbGFyZSAocXVhbGlmaWVkTmFtZSwgb2JqZWN0LCBzY29wZSlcbntcbiAgICB2YXIgbm9kZXM9IHF1YWxpZmllZE5hbWUuc3BsaXQoJy4nKVxuICAgICwgICBub2RlPSBzY29wZSB8fCBPb3BIZWxwLmdsb2JhbFxuICAgICwgICBsYXN0Tm9kZVxuICAgICwgICBuZXdOb2RlXG4gICAgLCAgIG5vZGVOYW1lO1xuICAgICAgICAgICAgICAgIFxuICAgIGZvciAodmFyIGk9IDAsIG49IG5vZGVzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICB7XG4gICAgICAgIGxhc3ROb2RlPSBub2RlO1xuICAgICAgICBub2RlTmFtZT0gbm9kZXNbaV07XG4gICAgICAgIFxuICAgICAgICBub2RlPSAobnVsbCA9PSBub2RlW25vZGVOYW1lXSA/IG5vZGVbbm9kZU5hbWVdID0ge30gOiBub2RlW25vZGVOYW1lXSk7XG4gICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICBpZiAobnVsbCA9PSBvYmplY3QpXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgcmV0dXJuIGxhc3ROb2RlW25vZGVOYW1lXT0gb2JqZWN0O1xufTtcblxuXG5cblxuLyoqXG4gKiBAbWVtYmVyIHB1cmVtdmNcbiAqIFxuICogRGVmaW5lIGEgbmV3IGNsYXNzbGV0LiBDdXJyZW50IGVkaXRpb25zIG9mIEphdmFTY3JpcHQgZG8gbm90IGhhdmUgY2xhc3NlcyxcbiAqIGJ1dCB0aGV5IGNhbiBiZSBlbXVsYXRlZCwgYW5kIHRoaXMgbWV0aG9kIGRvZXMgdGhpcyBmb3IgeW91LCBzYXZpbmcgeW91XG4gKiBmcm9tIGhhdmluZyB0byB3b3JrIHdpdGggRnVuY3Rpb24gcHJvdG90eXBlIGRpcmVjdGx5LiBUaGUgbWV0aG9kIGRvZXNcbiAqIG5vdCBleHRlbmQgYW55IE5hdGl2ZSBvYmplY3RzIGFuZCBpcyBlbnRpcmVseSBvcHQgaW4uIEl0cyBwYXJ0aWN1bGFybHlcbiAqIHVzZWZ1bGwgaWYgeW91IHdhbnQgdG8gbWFrZSB5b3VyIFB1cmVNdmMgYXBwbGljYXRpb25zIG1vcmUgcG9ydGFibGUsIGJ5XG4gKiBkZWNvdXBsaW5nIHRoZW0gZnJvbSBhIHNwZWNpZmljIE9PUCBhYnN0cmFjdGlvbiBsaWJyYXJ5LlxuICogXG4gKiBcbiAqICAgICBwdXJlbXZjLmRlZmluZVxuICogICAgIChcbiAqICAgICAgICAgLy8gdGhlIGZpcnN0IG9iamVjdCBzdXBwbGllZCBpcyBhIGNsYXNzIGRlc2NyaXB0b3IuIE5vbmUgb2YgdGhlc2VcbiAqICAgICAgICAgLy8gcHJvcGVydGllcyBhcmUgYWRkZWQgdG8geW91ciBjbGFzcywgdGhlIGV4Y2VwdGlvbiBiZWluZyB0aGVcbiAqICAgICAgICAgLy8gY29uc3RydWN0b3IgcHJvcGVydHksIHdoaWNoIGlmIHN1cHBsaWVkLCB3aWxsIGJlIHlvdXIgY2xhc3Nlc1xuICogICAgICAgICAvLyBjb25zdHJ1Y3Rvci5cbiAqICAgICAgICAge1xuICogICAgICAgICAgICAgLy8geW91ciBjbGFzc2VzIG5hbWVzcGFjZS0gaWYgc3VwcGxpZWQsIGl0IHdpbGwgYmUgXG4gKiAgICAgICAgICAgICAvLyBjcmVhdGVkIGZvciB5b3VcbiAqICAgICAgICAgICAgIG5hbWU6ICdjb20uZXhhbXBsZS5Vc2VyTWVkaWF0b3InXG4gKiBcbiAqICAgICAgICAgICAgIC8vIHlvdXIgY2xhc3NlcyBwYXJlbnQgY2xhc3MuIElmIHN1cHBsaWVkLCBpbmhlcml0YW5jZSBcbiAqICAgICAgICAgICAgIC8vIHdpbGwgYmUgdGFrZW4gY2FyZSBvZiBmb3IgeW91XG4gKiAgICAgICAgICwgICBwYXJlbnQ6IHB1cmVtdmMuTWVkaWF0b3JcbiAqIFxuICogICAgICAgICAgICAgLy8geW91ciBjbGFzc2VzIGNvbnN0cnVjdG9yLiBJZiBub3Qgc3VwcGxpZWQsIG9uZSB3aWxsIGJlIFxuICogICAgICAgICAgICAgLy8gY3JlYXRlZCBmb3IgeW91XG4gKiAgICAgICAgICwgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gVXNlck1lZGlhdG9yIChjb21wb25lbnQpXG4gKiAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUsIGNvbXBvbmVudCk7ICBcbiAqICAgICAgICAgICAgIH1cbiAqICAgICAgICAgfVxuICogICAgICAgICBcbiAqICAgICAgICAgLy8gdGhlIHNlY29uZCBvYmplY3Qgc3VwcGxpZWQgZGVmaW5lcyB5b3VyIGNsYXNzIHRyYWl0cywgdGhhdCBpc1xuICogICAgICAgICAvLyB0aGUgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgZGVmaW5lZCBvbiB5b3VyIGNsYXNzZXMgcHJvdG90eXBlXG4gKiAgICAgICAgIC8vIGFuZCB0aGVyZWJ5IG9uIGFsbCBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzc1xuICogICAgICwgICB7XG4gKiAgICAgICAgICAgICBidXNpbmVzc01ldGhvZDogZnVuY3Rpb24gKClcbiAqICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAvLyBpbXBsIFxuICogICAgICAgICAgICAgfVxuICogICAgICAgICB9XG4gKiBcbiAqICAgICAgICAgLy8gdGhlIHRoaXJkIG9iamVjdCBzdXBwbGllZCBkZWZpbmVzIHlvdXIgY2xhc3NlcyAnc3RhdGljJyB0cmFpdHNcbiAqICAgICAgICAgLy8gdGhhdCBpcywgdGhlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgd2hpY2ggd2lsbCBiZSBkZWZpbmVkIG9uXG4gKiAgICAgICAgIC8vIHlvdXIgY2xhc3NlcyBjb25zdHJ1Y3RvclxuICogICAgICwgICB7XG4gKiAgICAgICAgICAgICBOQU1FOiAndXNlck1lZGlhdG9yJ1xuICogICAgICAgICB9XG4gKiAgICAgKTtcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtjbGFzc2luZm9dXG4gKiAgQW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGNsYXNzLiBUaGlzIG9iamVjdCBjYW4gaGF2ZSBhbnkgb3IgYWxsIG9mXG4gKiAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogXG4gKiAgLSBuYW1lOiBTdHJpbmcgIFxuICogICAgICBUaGUgY2xhc3NsZXRzIG5hbWUuIFRoaXMgY2FuIGJlIGFueSBhcmJpdHJhcnkgcXVhbGlmaWVkIG9iamVjdFxuICogICAgICBuYW1lLiAnY29tLmV4YW1wbGUuQ2xhc3NsZXQnIG9yIHNpbXBseSAnTXlDbGFzc2xldCcgZm9yIGV4YW1wbGUgXG4gKiAgICAgIFRoZSBtZXRob2Qgd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhbiBvYmplY3QgaGllcmFyY2h5IHJlZmVyaW5nXG4gKiAgICAgIHRvIHlvdXIgY2xhc3MgZm9yIHlvdS4gTm90ZSB0aGF0IHlvdSB3aWxsIG5lZWQgdG8gY2FwdHVyZSB0aGUgXG4gKiAgICAgIG1ldGhvZHMgcmV0dXJuIHZhbHVlIHRvIHJldHJpZXZlIGEgcmVmZXJlbmNlIHRvIHlvdXIgY2xhc3MgaWYgdGhlXG4gKiAgICAgIGNsYXNzIG5hbWUgcHJvcGVydHkgaXMgbm90IGRlZmluZWQuXG5cbiAqICAtIHBhcmVudDogRnVuY3Rpb25cbiAqICAgICAgVGhlIGNsYXNzbGV0cyAnc3VwZXJjbGFzcycuIFlvdXIgY2xhc3Mgd2lsbCBiZSBleHRlbmRlZCBmcm9tIHRoaXNcbiAqICAgICAgaWYgc3VwcGxpZWQuXG4gKiBcbiAqICAtIGNvbnN0cnVjdG9yOiBGdW5jdGlvblxuICogICAgICBUaGUgY2xhc3NsZXRzIGNvbnN0cnVjdG9yLiBOb3RlIHRoaXMgaXMgKm5vdCogYSBwb3N0IGNvbnN0cnVjdCBcbiAqICAgICAgaW5pdGlhbGl6ZSBtZXRob2QsIGJ1dCB5b3VyIGNsYXNzZXMgY29uc3RydWN0b3IgRnVuY3Rpb24uXG4gKiAgICAgIElmIHRoaXMgYXR0cmlidXRlIGlzIG5vdCBkZWZpbmVkLCBhIGNvbnN0cnVjdG9yIHdpbGwgYmUgY3JlYXRlZCBmb3IgXG4gKiAgICAgIHlvdSBhdXRvbWF0aWNhbGx5LiBJZiB5b3UgaGF2ZSBzdXBwbGllZCBhIHBhcmVudCBjbGFzc1xuICogICAgICB2YWx1ZSBhbmQgbm90IGRlZmluZWQgdGhlIGNsYXNzZXMgY29uc3RydWN0b3IsIHRoZSBhdXRvbWF0aWNhbGx5XG4gKiAgICAgIGNyZWF0ZWQgY29uc3RydWN0b3Igd2lsbCBpbnZva2UgdGhlIHN1cGVyIGNsYXNzIGNvbnN0cnVjdG9yXG4gKiAgICAgIGF1dG9tYXRpY2FsbHkuIElmIHlvdSBoYXZlIHN1cHBsaWVkIHlvdXIgb3duIGNvbnN0cnVjdG9yIGFuZCB5b3VcbiAqICAgICAgd2lzaCB0byBpbnZva2UgaXQncyBzdXBlciBjb25zdHJ1Y3RvciwgeW91IG11c3QgZG8gdGhpcyBtYW51YWxseSwgYXNcbiAqICAgICAgdGhlcmUgaXMgbm8gcmVmZXJlbmNlIHRvIHRoZSBjbGFzc2VzIHBhcmVudCBhZGRlZCB0byB0aGUgY29uc3RydWN0b3JcbiAqICAgICAgcHJvdG90eXBlLlxuICogICAgICBcbiAqICAtIHNjb3BlOiBPYmplY3QuXG4gKiAgICAgIEZvciB1c2UgaW4gYWR2YW5jZWQgc2NlbmFyaW9zLiBJZiB0aGUgbmFtZSBhdHRyaWJ1dGUgaGFzIGJlZW4gc3VwcGxpZWQsXG4gKiAgICAgIHRoaXMgdmFsdWUgd2lsbCBiZSB0aGUgcm9vdCBvZiB0aGUgb2JqZWN0IGhpZXJhcmNoeSBjcmVhdGVkIGZvciB5b3UuXG4gKiAgICAgIFVzZSBpdCBkbyBkZWZpbmUgeW91ciBvd24gY2xhc3MgaGllcmFyY2hpZXMgaW4gcHJpdmF0ZSBzY29wZXMsXG4gKiAgICAgIGFjY3Jvc3MgaUZyYW1lcywgaW4geW91ciB1bml0IHRlc3RzLCBvciBhdm9pZCBjb2xsaXNpb24gd2l0aCB0aGlyZFxuICogICAgICBwYXJ0eSBsaWJyYXJ5IG5hbWVzcGFjZXMuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdHJhaXRzXVxuICogIEFuIE9iamVjdCwgdGhlIHByb3BlcnRpZXMgb2Ygd2hpY2ggd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAqICBjbGFzcyBjb25zdHJ1Y3RvcnMgcHJvdG90eXBlLlxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWl0Y1RyYWl0c11cbiAqICBBbiBPYmplY3QsIHRoZSBwcm9wZXJ0aWVzIG9mIHdoaWNoIHdpbGwgYmUgYWRkZWQgZGlyZWN0bHlcbiAqICB0byB0aGlzIGNsYXNzIGNvbnN0cnVjdG9yXG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogIEEgcmVmZXJlbmNlIHRvIHRoZSBjbGFzc2xldHMgY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gZGVmaW5lIChjbGFzc0luZm8sIHRyYWl0cywgc3RhdGljVHJhaXRzKVxue1xuICAgIGlmICghY2xhc3NJbmZvKVxuICAgIHtcbiAgICAgICAgY2xhc3NJbmZvPSB7fVxuICAgIH1cblxuICAgIHZhciBjbGFzc05hbWU9IGNsYXNzSW5mby5uYW1lXG4gICAgLCAgIGNsYXNzUGFyZW50PSBjbGFzc0luZm8ucGFyZW50XG4gICAgLCAgIGRvRXh0ZW5kPSAnZnVuY3Rpb24nID09PSB0eXBlb2YgY2xhc3NQYXJlbnRcbiAgICAsICAgY2xhc3NDb25zdHJ1Y3RvclxuICAgICwgICBjbGFzc1Njb3BlPSBjbGFzc0luZm8uc2NvcGUgfHwgbnVsbFxuICAgICwgICBwcm90b3R5cGVcblxuICAgIGlmICgncGFyZW50JyBpbiBjbGFzc0luZm8gJiYgIWRvRXh0ZW5kKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2xhc3MgcGFyZW50IG11c3QgYmUgRnVuY3Rpb24nKTtcbiAgICB9XG4gICAgICAgIFxuICAgIGlmIChjbGFzc0luZm8uaGFzT3duUHJvcGVydHkoJ2NvbnN0cnVjdG9yJykpXG4gICAge1xuICAgICAgICBjbGFzc0NvbnN0cnVjdG9yPSBjbGFzc0luZm8uY29uc3RydWN0b3JcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjbGFzc0NvbnN0cnVjdG9yKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDbGFzcyBjb25zdHJ1Y3RvciBtdXN0IGJlIEZ1bmN0aW9uJylcbiAgICAgICAgfSAgIFxuICAgIH1cbiAgICBlbHNlIC8vIHRoZXJlIGlzIG5vIGNvbnN0cnVjdG9yLCBjcmVhdGUgb25lXG4gICAge1xuICAgICAgICBpZiAoZG9FeHRlbmQpIC8vIGVuc3VyZSB0byBjYWxsIHRoZSBzdXBlciBjb25zdHJ1Y3RvclxuICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc0NvbnN0cnVjdG9yPSBmdW5jdGlvbiAoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzUGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSAvLyBqdXN0IGNyZWF0ZSBhIEZ1bmN0aW9uXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzQ29uc3RydWN0b3I9IG5ldyBGdW5jdGlvbjtcbiAgICAgICAgfSBcbiAgICB9XG5cbiAgICBpZiAoZG9FeHRlbmQpXG4gICAge1xuICAgICAgICBPb3BIZWxwLmV4dGVuZChjbGFzc0NvbnN0cnVjdG9yLCBjbGFzc1BhcmVudCk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0cmFpdHMpXG4gICAge1xuICAgICAgICBwcm90b3R5cGU9IGNsYXNzQ29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICAgIE9vcEhlbHAuZGVjb3JhdGUocHJvdG90eXBlLCB0cmFpdHMpO1xuICAgICAgICAvLyByZWFzc2lnbiBjb25zdHJ1Y3RvciBcbiAgICAgICAgcHJvdG90eXBlLmNvbnN0cnVjdG9yPSBjbGFzc0NvbnN0cnVjdG9yO1xuICAgIH1cbiAgICBcbiAgICBpZiAoc3RhdGljVHJhaXRzKVxuICAgIHtcbiAgICAgICAgT29wSGVscC5kZWNvcmF0ZShjbGFzc0NvbnN0cnVjdG9yLCBzdGF0aWNUcmFpdHMpXG4gICAgfVxuICAgIFxuICAgIGlmIChjbGFzc05hbWUpXG4gICAge1xuICAgICAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBjbGFzc05hbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NsYXNzIG5hbWUgbXVzdCBiZSBwcmltaXRpdmUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICBkZWNsYXJlIChjbGFzc05hbWUsIGNsYXNzQ29uc3RydWN0b3IsIGNsYXNzU2NvcGUpO1xuICAgIH0gICAgXG4gICAgXG4gICAgcmV0dXJuIGNsYXNzQ29uc3RydWN0b3I7ICAgICAgICAgICAgXG59O1xuXG5cblx0XG4gXHQvKiBpbXBsZW1lbnRhdGlvbiBlbmQgKi9cbiBcdCBcbiBcdC8vIGRlZmluZSB0aGUgcHVyZW12YyBnbG9iYWwgbmFtZXNwYWNlIGFuZCBleHBvcnQgdGhlIGFjdG9yc1xudmFyIHB1cmVtdmMgPVxuIFx0e1xuIFx0XHRWaWV3OiBWaWV3XG4gXHQsXHRNb2RlbDogTW9kZWxcbiBcdCxcdENvbnRyb2xsZXI6IENvbnRyb2xsZXJcbiBcdCxcdFNpbXBsZUNvbW1hbmQ6IFNpbXBsZUNvbW1hbmRcbiBcdCxcdE1hY3JvQ29tbWFuZDogTWFjcm9Db21tYW5kXG4gXHQsXHRGYWNhZGU6IEZhY2FkZVxuIFx0LFx0TWVkaWF0b3I6IE1lZGlhdG9yXG4gXHQsXHRPYnNlcnZlcjogT2JzZXJ2ZXJcbiBcdCxcdE5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uXG4gXHQsXHROb3RpZmllcjogTm90aWZpZXJcbiBcdCxcdFByb3h5OiBQcm94eVxuIFx0LFx0ZGVmaW5lOiBkZWZpbmVcbiBcdCxcdGRlY2xhcmU6IGRlY2xhcmVcbiBcdH07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmM7IiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBQdXJlTVZDIFN0YXRlIE1hY2hpbmUgVXRpbGl0eSBKUyBOYXRpdmUgUG9ydCBieSBTYWFkIFNoYW1zXG4gKiBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFJldXNlIGdvdmVybmVkIGJ5IENyZWF0aXZlIENvbW1vbnMgQXR0cmlidXRpb24gMy4wIFxuICogaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wL3VzL1xuICogQGF1dGhvciBzYWFkLnNoYW1zQHB1cmVtdmMub3JnIFxuICovXG5cbnZhciBwdXJlbXZjID0gcmVxdWlyZSggJy4vcHVyZW12Yy0xLjAuMS1tb2QuanMnICk7XG4gICAgXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKlxuICogRGVmaW5lcyBhIFN0YXRlLlxuICogQG1ldGhvZCBTdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgaWQgdGhlIGlkIG9mIHRoZSBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGVudGVyaW5nIGFuIG9wdGlvbmFsIG5vdGlmaWNhdGlvbiBuYW1lIHRvIGJlIHNlbnQgd2hlbiBlbnRlcmluZyB0aGlzIHN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gZXhpdGluZyBhbiBvcHRpb25hbCBub3RpZmljYXRpb24gbmFtZSB0byBiZSBzZW50IHdoZW4gZXhpdGluZyB0aGlzIHN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhbmdlZCBhbiBvcHRpb25hbCBub3RpZmljYXRpb24gbmFtZSB0byBiZSBzZW50IHdoZW4gZnVsbHkgdHJhbnNpdGlvbmVkIHRvIHRoaXMgc3RhdGVcbiAqIEByZXR1cm4gXG4gKi9cblxuZnVuY3Rpb24gU3RhdGUobmFtZSwgZW50ZXJpbmcsIGV4aXRpbmcsIGNoYW5nZWQpIHsgIFxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgaWYoZW50ZXJpbmcpIHRoaXMuZW50ZXJpbmcgPSBlbnRlcmluZztcbiAgICBpZihleGl0aW5nKSB0aGlzLmV4aXRpbmcgPSBleGl0aW5nO1xuICAgIGlmKGNoYW5nZWQpIHRoaXMuY2hhbmdlZCA9IGNoYW5nZWQ7XG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IHt9O1xufVxuXG4vKipcbiAqIERlZmluZSBhIHRyYW5zaXRpb24uXG4gKiBAbWV0aG9kIGRlZmluZVRyYW5zXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uIHRoZSBuYW1lIG9mIHRoZSBTdGF0ZU1hY2hpbmUuQUNUSU9OIE5vdGlmaWNhdGlvbiB0eXBlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCB0aGUgbmFtZSBvZiB0aGUgdGFyZ2V0IHN0YXRlIHRvIHRyYW5zaXRpb24gdG8uXG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZS5wcm90b3R5cGUuZGVmaW5lVHJhbnMgPSBmdW5jdGlvbihhY3Rpb24sIHRhcmdldCkge1xuICAgIGlmKHRoaXMuZ2V0VGFyZ2V0KGFjdGlvbikgIT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMudHJhbnNpdGlvbnNbYWN0aW9uXSA9IHRhcmdldDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBwcmV2aW91c2x5IGRlZmluZWQgdHJhbnNpdGlvbi5cbiAqIEBtZXRob2QgcmVtb3ZlVHJhbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25cbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlLnByb3RvdHlwZS5yZW1vdmVUcmFucyA9IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGRlbGV0ZSB0aGlzLnRyYW5zaXRpb25zW2FjdGlvbl07XG59XG5cbi8qKlxuICogR2V0IHRoZSB0YXJnZXQgc3RhdGUgbmFtZSBmb3IgYSBnaXZlbiBhY3Rpb24uXG4gKiBAbWV0aG9kIGdldFRhcmdldFxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblxuICogQHJldHVybiBTdGF0ZVxuICovXG4vKipcbiAqIFxuICovXG5TdGF0ZS5wcm90b3R5cGUuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbnNbYWN0aW9uXSA/IHRoaXMudHJhbnNpdGlvbnNbYWN0aW9uXSA6IG51bGw7XG59XG5cbi8vIFRoZSBzdGF0ZSBuYW1lXG5TdGF0ZS5wcm90b3R5cGUubmFtZSA9IG51bGw7XG5cbi8vIFRoZSBub3RpZmljYXRpb24gdG8gZGlzcGF0Y2ggd2hlbiBlbnRlcmluZyB0aGUgc3RhdGVcblN0YXRlLnByb3RvdHlwZS5lbnRlcmluZyA9IG51bGw7XG5cbi8vIFRoZSBub3RpZmljYXRpb24gdG8gZGlzcGF0Y2ggd2hlbiBleGl0aW5nIHRoZSBzdGF0ZVxuU3RhdGUucHJvdG90eXBlLmV4aXRpbmcgPSBudWxsO1xuXG4vLyBUaGUgbm90aWZpY2F0aW9uIHRvIGRpc3BhdGNoIHdoZW4gdGhlIHN0YXRlIGhhcyBhY3R1YWxseSBjaGFuZ2VkXG5TdGF0ZS5wcm90b3R5cGUuY2hhbmdlZCA9IG51bGw7XG5cbi8qKlxuICogIFRyYW5zaXRpb24gbWFwIG9mIGFjdGlvbnMgdG8gdGFyZ2V0IHN0YXRlc1xuICovIFxuU3RhdGUucHJvdG90eXBlLnRyYW5zaXRpb25zID0gbnVsbDtcbiAgICBcblxuICAgIFxuIC8qKlxuICogQSBGaW5pdGUgU3RhdGUgTWFjaGluZSBpbXBsaW1lbnRhdGlvbi5cbiAqIDxQPlxuICogSGFuZGxlcyByZWdpc2lzdHJhdGlvbiBhbmQgcmVtb3ZhbCBvZiBzdGF0ZSBkZWZpbml0aW9ucywgXG4gKiB3aGljaCBpbmNsdWRlIG9wdGlvbmFsIGVudHJ5IGFuZCBleGl0IGNvbW1hbmRzIGZvciBlYWNoIFxuICogc3RhdGUuPC9QPlxuICovXG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqXG4gKiBAbWV0aG9kIFN0YXRlTWFjaGluZVxuICogQHJldHVybiBcbiAqL1xuZnVuY3Rpb24gU3RhdGVNYWNoaW5lKCkge1xuICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCBTdGF0ZU1hY2hpbmUuTkFNRSwgbnVsbCk7XG4gICAgdGhpcy5zdGF0ZXMgPSB7fTtcbn1cbiAgICBcblN0YXRlTWFjaGluZS5wcm90b3R5cGUgPSBuZXcgcHVyZW12Yy5NZWRpYXRvcjtcblN0YXRlTWFjaGluZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdGF0ZU1hY2hpbmU7XG5cbi8qKlxuICogVHJhbnNpdGlvbnMgdG8gaW5pdGlhbCBzdGF0ZSBvbmNlIHJlZ2lzdGVyZWQgd2l0aCBGYWNhZGVcbiAqIEBtZXRob2Qgb25SZWdpc3RlclxuICogQHJldHVybiBcbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5vblJlZ2lzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5pbml0aWFsKSB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLmluaXRpYWwsIG51bGwpO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVycyB0aGUgZW50cnkgYW5kIGV4aXQgY29tbWFuZHMgZm9yIGEgZ2l2ZW4gc3RhdGUuXG4gKiBAbWV0aG9kIHJlZ2lzdGVyU3RhdGVcbiAqIEBwYXJhbSB7U3RhdGV9IHN0YXRlIHRoZSBzdGF0ZSB0byB3aGljaCB0byByZWdpc3RlciB0aGUgYWJvdmUgY29tbWFuZHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbCBib29sZWFuIHRlbGxpbmcgaWYgdGhpcyBpcyB0aGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgc3lzdGVtXG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLnJlZ2lzdGVyU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSwgaW5pdGlhbCkge1xuICAgIGlmKHN0YXRlID09IG51bGwgfHwgdGhpcy5zdGF0ZXNbc3RhdGUubmFtZV0gIT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMuc3RhdGVzW3N0YXRlLm5hbWVdID0gc3RhdGU7XG4gICAgaWYoaW5pdGlhbCkgdGhpcy5pbml0aWFsID0gc3RhdGU7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgc3RhdGUgbWFwcGluZy4gUmVtb3ZlcyB0aGUgZW50cnkgYW5kIGV4aXQgY29tbWFuZHMgZm9yIGEgZ2l2ZW4gc3RhdGUgYXMgd2VsbCBhcyB0aGUgc3RhdGUgbWFwcGluZyBpdHNlbGYuXG4gKiBAbWV0aG9kIHJlbW92ZVN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVOYW1lXG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLnJlbW92ZVN0YXRlID0gZnVuY3Rpb24oc3RhdGVOYW1lKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZXNbc3RhdGVOYW1lXTtcbiAgICBpZihzdGF0ZSA9PSBudWxsKSByZXR1cm47XG4gICAgdGhpcy5zdGF0ZXNbc3RhdGVOYW1lXSA9IG51bGw7XG59XG5cbi8qKlxuICogVHJhbnNpdGlvbnMgdG8gdGhlIGdpdmVuIHN0YXRlIGZyb20gdGhlIGN1cnJlbnQgc3RhdGUuXG4gKiA8UD5cbiAqIFNlbmRzIHRoZSA8Y29kZT5leGl0aW5nPC9jb2RlPiBub3RpZmljYXRpb24gZm9yIHRoZSBjdXJyZW50IHN0YXRlIFxuICogZm9sbG93ZWQgYnkgdGhlIDxjb2RlPmVudGVyaW5nPC9jb2RlPiBub3RpZmljYXRpb24gZm9yIHRoZSBuZXcgc3RhdGUuXG4gKiBPbmNlIGZpbmFsbHkgdHJhbnNpdGlvbmVkIHRvIHRoZSBuZXcgc3RhdGUsIHRoZSA8Y29kZT5jaGFuZ2VkPC9jb2RlPiBcbiAqIG5vdGlmaWNhdGlvbiBmb3IgdGhlIG5ldyBzdGF0ZSBpcyBzZW50LjwvUD5cbiAqIDxQPlxuICogSWYgYSBkYXRhIHBhcmFtZXRlciBpcyBwcm92aWRlZCwgaXQgaXMgaW5jbHVkZWQgYXMgdGhlIGJvZHkgb2YgYWxsXG4gKiB0aHJlZSBzdGF0ZS1zcGVjaWZpYyB0cmFuc2l0aW9uIG5vdGVzLjwvUD5cbiAqIDxQPlxuICogRmluYWxseSwgd2hlbiBhbGwgdGhlIHN0YXRlLXNwZWNpZmljIHRyYW5zaXRpb24gbm90ZXMgaGF2ZSBiZWVuXG4gKiBzZW50LCBhIDxjb2RlPlN0YXRlTWFjaGluZS5DSEFOR0VEPC9jb2RlPiBub3RlIGlzIHNlbnQsIHdpdGggdGhlXG4gKiBuZXcgPGNvZGU+U3RhdGU8L2NvZGU+IG9iamVjdCBhcyB0aGUgPGNvZGU+Ym9keTwvY29kZT4gYW5kIHRoZSBuYW1lIG9mIHRoZSBcbiAqIG5ldyBzdGF0ZSBpbiB0aGUgPGNvZGU+dHlwZTwvY29kZT4uXG4gKlxuICogQG1ldGhvZCB0cmFuc2l0aW9uVG9cbiAqIEBwYXJhbSB7U3RhdGV9IG5leHRTdGF0ZSB0aGUgbmV4dCBTdGF0ZSB0byB0cmFuc2l0aW9uIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgaXMgdGhlIG9wdGlvbmFsIE9iamVjdCB0aGF0IHdhcyBzZW50IGluIHRoZSA8Y29kZT5TdGF0ZU1hY2hpbmUuQUNUSU9OPC9jb2RlPiBub3RpZmljYXRpb24gYm9keVxuICogQHJldHVybiBcbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS50cmFuc2l0aW9uVG8gPSBmdW5jdGlvbihuZXh0U3RhdGUsIGRhdGEpIHtcbiAgICAvLyBHb2luZyBub3doZXJlP1xuICAgIGlmKG5leHRTdGF0ZSA9PSBudWxsKSByZXR1cm47XG4gICAgXG4gICAgLy8gQ2xlYXIgdGhlIGNhbmNlbCBmbGFnXG4gICAgdGhpcy5jYW5jZWxlZCA9IGZhbHNlO1xuICAgIFxuICAgIC8vIEV4aXQgdGhlIGN1cnJlbnQgU3RhdGUgXG4gICAgaWYodGhpcy5nZXRDdXJyZW50U3RhdGUoKSAmJiB0aGlzLmdldEN1cnJlbnRTdGF0ZSgpLmV4aXRpbmcpIFxuICAgICAgICB0aGlzLnNlbmROb3RpZmljYXRpb24odGhpcy5nZXRDdXJyZW50U3RhdGUoKS5leGl0aW5nLCBkYXRhLCBuZXh0U3RhdGUubmFtZSk7XG4gICAgXG4gICAgLy8gQ2hlY2sgdG8gc2VlIHdoZXRoZXIgdGhlIGV4aXRpbmcgZ3VhcmQgaGFzIGNhbmNlbGVkIHRoZSB0cmFuc2l0aW9uXG4gICAgaWYodGhpcy5jYW5jZWxlZCkge1xuICAgICAgICB0aGlzLmNhbmNlbGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gRW50ZXIgdGhlIG5leHQgU3RhdGUgXG4gICAgaWYobmV4dFN0YXRlLmVudGVyaW5nKVxuICAgICAgICB0aGlzLnNlbmROb3RpZmljYXRpb24obmV4dFN0YXRlLmVudGVyaW5nLCBkYXRhKTtcbiAgICBcbiAgICAvLyBDaGVjayB0byBzZWUgd2hldGhlciB0aGUgZW50ZXJpbmcgZ3VhcmQgaGFzIGNhbmNlbGVkIHRoZSB0cmFuc2l0aW9uXG4gICAgaWYodGhpcy5jYW5jZWxlZCkge1xuICAgICAgICB0aGlzLmNhbmNlbGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gY2hhbmdlIHRoZSBjdXJyZW50IHN0YXRlIG9ubHkgd2hlbiBib3RoIGd1YXJkcyBoYXZlIGJlZW4gcGFzc2VkXG4gICAgdGhpcy5zZXRDdXJyZW50U3RhdGUobmV4dFN0YXRlKTtcbiAgICBcbiAgICAvLyBTZW5kIHRoZSBub3RpZmljYXRpb24gY29uZmlndXJlZCB0byBiZSBzZW50IHdoZW4gdGhpcyBzcGVjaWZpYyBzdGF0ZSBiZWNvbWVzIGN1cnJlbnQgXG4gICAgaWYobmV4dFN0YXRlLmNoYW5nZWQpIHtcbiAgICAgICAgdGhpcy5zZW5kTm90aWZpY2F0aW9uKHRoaXMuZ2V0Q3VycmVudFN0YXRlKCkuY2hhbmdlZCwgZGF0YSk7XG4gICAgfVxuICAgIFxuICAgIC8vIE5vdGlmeSB0aGUgYXBwIGdlbmVyYWxseSB0aGF0IHRoZSBzdGF0ZSBjaGFuZ2VkIGFuZCB3aGF0IHRoZSBuZXcgc3RhdGUgaXMgXG4gICAgdGhpcy5zZW5kTm90aWZpY2F0aW9uKFN0YXRlTWFjaGluZS5DSEFOR0VELCB0aGlzLmdldEN1cnJlbnRTdGF0ZSgpLCB0aGlzLmdldEN1cnJlbnRTdGF0ZSgpLm5hbWUpO1xufVxuXG4vKipcbiAqIE5vdGlmaWNhdGlvbiBpbnRlcmVzdHMgZm9yIHRoZSBTdGF0ZU1hY2hpbmUuXG4gKiBAbWV0aG9kIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHNcbiAqIEByZXR1cm4ge0FycmF5fSBBcnJheSBvZiBOb3RpZmljYXRpb25zXG4gKi9cblxuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5saXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgU3RhdGVNYWNoaW5lLkFDVElPTixcbiAgICAgICAgU3RhdGVNYWNoaW5lLkNBTkNFTFxuICAgIF07XG59XG5cbi8qKlxuICogSGFuZGxlIG5vdGlmaWNhdGlvbnMgdGhlIDxjb2RlPlN0YXRlTWFjaGluZTwvY29kZT4gaXMgaW50ZXJlc3RlZCBpbi5cbiAqIDxQPlxuICogPGNvZGU+U3RhdGVNYWNoaW5lLkFDVElPTjwvY29kZT46IFRyaWdnZXJzIHRoZSB0cmFuc2l0aW9uIHRvIGEgbmV3IHN0YXRlLjxCUj5cbiAqIDxjb2RlPlN0YXRlTWFjaGluZS5DQU5DRUw8L2NvZGU+OiBDYW5jZWxzIHRoZSB0cmFuc2l0aW9uIGlmIHNlbnQgaW4gcmVzcG9uc2UgdG8gdGhlIGV4aXRpbmcgbm90ZSBmb3IgdGhlIGN1cnJlbnQgc3RhdGUuPEJSPlxuICpcbiAqIEBtZXRob2QgaGFuZGxlTm90aWZpY2F0aW9uXG4gKiBAcGFyYW0ge05vdGlmaWNhdGlvbn0gbm90aWZpY2F0aW9uXG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLmhhbmRsZU5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgIHN3aXRjaChub3RpZmljYXRpb24uZ2V0TmFtZSgpKSB7XG4gICAgICAgIGNhc2UgU3RhdGVNYWNoaW5lLkFDVElPTjpcbiAgICAgICAgICAgIHZhciBhY3Rpb24gPSBub3RpZmljYXRpb24uZ2V0VHlwZSgpO1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuZ2V0Q3VycmVudFN0YXRlKCkuZ2V0VGFyZ2V0KGFjdGlvbik7XG4gICAgICAgICAgICB2YXIgbmV3U3RhdGUgPSB0aGlzLnN0YXRlc1t0YXJnZXRdO1xuICAgICAgICAgICAgaWYobmV3U3RhdGUpIHRoaXMudHJhbnNpdGlvblRvKG5ld1N0YXRlLCBub3RpZmljYXRpb24uZ2V0Qm9keSgpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhc2UgU3RhdGVNYWNoaW5lLkNBTkNFTDpcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgY3VycmVudCBzdGF0ZS5cbiAqIEBtZXRob2QgZ2V0Q3VycmVudFN0YXRlXG4gKiBAcmV0dXJuIGEgU3RhdGUgZGVmaW5pbmcgdGhlIG1hY2hpbmUncyBjdXJyZW50IHN0YXRlXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUuZ2V0Q3VycmVudFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudmlld0NvbXBvbmVudDtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBAbWV0aG9kIHNldEN1cnJlbnRTdGF0ZVxuICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUuc2V0Q3VycmVudFN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICB0aGlzLnZpZXdDb21wb25lbnQgPSBzdGF0ZTtcbn1cblxuLyoqXG4gKiBNYXAgb2YgU3RhdGVzIG9iamVjdHMgYnkgbmFtZS5cbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5zdGF0ZXMgPSBudWxsO1xuXG4vKipcbiAqIFRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBGU00uXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUuaW5pdGlhbCA9IG51bGw7XG5cbi8qKlxuICogVGhlIHRyYW5zaXRpb24gaGFzIGJlZW4gY2FuY2VsZWQuXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUuY2FuY2VsZWQgPSBudWxsO1xuICAgIFxuU3RhdGVNYWNoaW5lLk5BTUUgPSBcIlN0YXRlTWFjaGluZVwiO1xuXG4vKipcbiAqIEFjdGlvbiBOb3RpZmljYXRpb24gbmFtZS4gXG4gKi8gXG5TdGF0ZU1hY2hpbmUuQUNUSU9OID0gU3RhdGVNYWNoaW5lLk5BTUUgKyBcIi9ub3Rlcy9hY3Rpb25cIjtcblxuLyoqXG4gKiAgQ2hhbmdlZCBOb3RpZmljYXRpb24gbmFtZSAgXG4gKi8gXG5TdGF0ZU1hY2hpbmUuQ0hBTkdFRCA9IFN0YXRlTWFjaGluZS5OQU1FICsgXCIvbm90ZXMvY2hhbmdlZFwiO1xuXG4vKipcbiAqICBDYW5jZWwgTm90aWZpY2F0aW9uIG5hbWUgIFxuICovIFxuU3RhdGVNYWNoaW5lLkNBTkNFTCA9IFN0YXRlTWFjaGluZS5OQU1FICsgXCIvbm90ZXMvY2FuY2VsXCI7XG4gICAgXG4gICAgXG4vKipcbiAqIENyZWF0ZXMgYW5kIHJlZ2lzdGVycyBhIFN0YXRlTWFjaGluZSBkZXNjcmliZWQgaW4gSlNPTi5cbiAqIFxuICogPFA+XG4gKiBUaGlzIGFsbG93cyByZWNvbmZpZ3VyYXRpb24gb2YgdGhlIFN0YXRlTWFjaGluZSBcbiAqIHdpdGhvdXQgY2hhbmdpbmcgYW55IGNvZGUsIGFzIHdlbGwgYXMgbWFraW5nIGl0IFxuICogZWFzaWVyIHRoYW4gY3JlYXRpbmcgYWxsIHRoZSA8Y29kZT5TdGF0ZTwvY29kZT4gXG4gKiBpbnN0YW5jZXMgYW5kIHJlZ2lzdGVyaW5nIHRoZW0gd2l0aCB0aGUgXG4gKiA8Y29kZT5TdGF0ZU1hY2hpbmU8L2NvZGU+IGF0IHN0YXJ0dXAgdGltZS5cbiAqIFxuICogQCBzZWUgU3RhdGVcbiAqIEAgc2VlIFN0YXRlTWFjaGluZVxuICovXG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqIEBtZXRob2QgRlNNSW5qZWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBmc20gSlNPTiBPYmplY3RcbiAqIEByZXR1cm4gXG4gKi9cbmZ1bmN0aW9uIEZTTUluamVjdG9yKGZzbSkge1xuICAgIHB1cmVtdmMuTm90aWZpZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmZzbSA9IGZzbTtcbn1cbiAgXG5GU01JbmplY3Rvci5wcm90b3R5cGUgPSBuZXcgcHVyZW12Yy5Ob3RpZmllcjtcbkZTTUluamVjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZTTUluamVjdG9yO1xuXG4vKipcbiAqIEluamVjdCB0aGUgPGNvZGU+U3RhdGVNYWNoaW5lPC9jb2RlPiBpbnRvIHRoZSBQdXJlTVZDIGFwcGFyYXR1cy5cbiAqIDxQPlxuICogQ3JlYXRlcyB0aGUgPGNvZGU+U3RhdGVNYWNoaW5lPC9jb2RlPiBpbnN0YW5jZSwgcmVnaXN0ZXJzIGFsbCB0aGUgc3RhdGVzXG4gKiBhbmQgcmVnaXN0ZXJzIHRoZSA8Y29kZT5TdGF0ZU1hY2hpbmU8L2NvZGU+IHdpdGggdGhlIDxjb2RlPklGYWNhZGU8L2NvZGU+LlxuICogQG1ldGhvZCBpbmplY3RcbiAqIEByZXR1cm4gXG4gKi9cbkZTTUluamVjdG9yLnByb3RvdHlwZS5pbmplY3QgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBDcmVhdGUgdGhlIFN0YXRlTWFjaGluZVxuICAgIHZhciBzdGF0ZU1hY2hpbmUgPSBuZXcgcHVyZW12Yy5zdGF0ZW1hY2hpbmUuU3RhdGVNYWNoaW5lKCk7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgYWxsIHRoZSBzdGF0ZXMgd2l0aCB0aGUgU3RhdGVNYWNoaW5lXG4gICAgdmFyIHN0YXRlcyA9IHRoaXMuZ2V0U3RhdGVzKCk7XG4gICAgZm9yKHZhciBpPTA7IGk8c3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YXRlTWFjaGluZS5yZWdpc3RlclN0YXRlKHN0YXRlc1tpXSwgdGhpcy5pc0luaXRpYWwoc3RhdGVzW2ldLm5hbWUpKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdGhlIFN0YXRlTWFjaGluZSB3aXRoIHRoZSBmYWNhZGVcbiAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKHN0YXRlTWFjaGluZSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBzdGF0ZSBkZWZpbml0aW9ucy5cbiAqIDxQPlxuICogQ3JlYXRlcyBhbmQgcmV0dXJucyB0aGUgYXJyYXkgb2YgU3RhdGUgb2JqZWN0cyBcbiAqIGZyb20gdGhlIEZTTSBvbiBmaXJzdCBjYWxsLCBzdWJzZXF1ZW50bHkgcmV0dXJuc1xuICogdGhlIGV4aXN0aW5nIGFycmF5LjwvUD5cbiAqXG4gKiBAbWV0aG9kIGdldFN0YXRlc1xuICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIFN0YXRlc1xuICovXG5GU01JbmplY3Rvci5wcm90b3R5cGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5zdGF0ZUxpc3QgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnN0YXRlTGlzdCA9IFtdO1xuXG4gICAgICAgIHZhciBzdGF0ZURlZnMgPSB0aGlzLmZzbS5zdGF0ZSA/IHRoaXMuZnNtLnN0YXRlIDogW107XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPHN0YXRlRGVmcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHN0YXRlRGVmID0gc3RhdGVEZWZzW2ldO1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5jcmVhdGVTdGF0ZShzdGF0ZURlZik7XG4gICAgICAgICAgICB0aGlzLnN0YXRlTGlzdC5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0ZUxpc3Q7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIDxjb2RlPlN0YXRlPC9jb2RlPiBpbnN0YW5jZSBmcm9tIGl0cyBKU09OIGRlZmluaXRpb24uXG4gKiBAbWV0aG9kIGNyZWF0ZVN0YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGVEZWYgSlNPTiBPYmplY3RcbiAqIEByZXR1cm4ge1N0YXRlfSBcbiAqL1xuLyoqXG5cbiAqL1xuRlNNSW5qZWN0b3IucHJvdG90eXBlLmNyZWF0ZVN0YXRlID0gZnVuY3Rpb24oc3RhdGVEZWYpIHtcbiAgICAvLyBDcmVhdGUgU3RhdGUgb2JqZWN0XG4gICAgdmFyIG5hbWUgPSBzdGF0ZURlZlsnQG5hbWUnXTtcbiAgICB2YXIgZXhpdGluZyA9IHN0YXRlRGVmWydAZXhpdGluZyddO1xuICAgIHZhciBlbnRlcmluZyA9IHN0YXRlRGVmWydAZW50ZXJpbmcnXTtcbiAgICB2YXIgY2hhbmdlZCA9IHN0YXRlRGVmWydAY2hhbmdlZCddO1xuICAgIHZhciBzdGF0ZSA9IG5ldyBwdXJlbXZjLnN0YXRlbWFjaGluZS5TdGF0ZShuYW1lLCBlbnRlcmluZywgZXhpdGluZywgY2hhbmdlZCk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIHRyYW5zaXRpb25zXG4gICAgdmFyIHRyYW5zaXRpb25zID0gc3RhdGVEZWYudHJhbnNpdGlvbiA/IHN0YXRlRGVmLnRyYW5zaXRpb24gOiBbXTtcbiAgICBmb3IodmFyIGk9MDsgaTx0cmFuc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdHJhbnNEZWYgPSB0cmFuc2l0aW9uc1tpXTtcbiAgICAgICAgc3RhdGUuZGVmaW5lVHJhbnModHJhbnNEZWZbJ0BhY3Rpb24nXSwgdHJhbnNEZWZbJ0B0YXJnZXQnXSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gc3RhdGUgdGhlIGluaXRpYWwgc3RhdGU/XG4gKiBAbWV0aG9kIGlzSW5pdGlhbFxuICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlTmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuRlNNSW5qZWN0b3IucHJvdG90eXBlLmlzSW5pdGlhbCA9IGZ1bmN0aW9uKHN0YXRlTmFtZSkge1xuICAgIHZhciBpbml0aWFsID0gdGhpcy5mc21bJ0Bpbml0aWFsJ107XG4gICAgcmV0dXJuIHN0YXRlTmFtZSA9PSBpbml0aWFsO1xufVxuXG4vLyBUaGUgSlNPTiBGU00gZGVmaW5pdGlvblxuRlNNSW5qZWN0b3IucHJvdG90eXBlLmZzbSA9IG51bGw7XG5cbi8vIFRoZSBMaXN0IG9mIFN0YXRlIG9iamVjdHNcbkZTTUluamVjdG9yLnByb3RvdHlwZS5zdGF0ZUxpc3QgPSBudWxsO1xuXG5cbnB1cmVtdmMuc3RhdGVtYWNoaW5lID1cbntcbiAgICBTdGF0ZTogU3RhdGVcbiAgICAsXHRTdGF0ZU1hY2hpbmU6IFN0YXRlTWFjaGluZVxuICAgICxcdEZTTUluamVjdG9yOiBGU01JbmplY3RvclxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLnN0YXRlbWFjaGluZTsiLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjguM1xuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kLFxuICAgIG5hdGl2ZUNyZWF0ZSAgICAgICA9IE9iamVjdC5jcmVhdGU7XG5cbiAgLy8gTmFrZWQgZnVuY3Rpb24gcmVmZXJlbmNlIGZvciBzdXJyb2dhdGUtcHJvdG90eXBlLXN3YXBwaW5nLlxuICB2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuOC4zJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIG9wdGltaXplQ2IgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIG90aGVyKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBIG1vc3RseS1pbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZFxuICAvLyB0byBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXJcbiAgLy8gaWRlbnRpdHksIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuICB2YXIgY2IgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiBvcHRpbWl6ZUNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSByZXR1cm4gXy5tYXRjaGVyKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG4gIF8uaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBjYih2YWx1ZSwgY29udGV4dCwgSW5maW5pdHkpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVBc3NpZ25lciA9IGZ1bmN0aW9uKGtleXNGdW5jLCB1bmRlZmluZWRPbmx5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoIDwgMiB8fCBvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF0sXG4gICAgICAgICAgICBrZXlzID0ga2V5c0Z1bmMoc291cmNlKSxcbiAgICAgICAgICAgIGwgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoIXVuZGVmaW5lZE9ubHkgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIHZhciBiYXNlQ3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KHByb3RvdHlwZSkpIHJldHVybiB7fTtcbiAgICBpZiAobmF0aXZlQ3JlYXRlKSByZXR1cm4gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yO1xuICAgIEN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBwcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3RcbiAgLy8gUmVsYXRlZDogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGhcbiAgLy8gQXZvaWRzIGEgdmVyeSBuYXN0eSBpT1MgOCBKSVQgYnVnIG9uIEFSTS02NC4gIzIwOTRcbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBnZXRMZW5ndGggPSBwcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gIHZhciBpc0FycmF5TGlrZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG4gIH07XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyByYXcgb2JqZWN0cyBpbiBhZGRpdGlvbiB0byBhcnJheS1saWtlcy4gVHJlYXRzIGFsbFxuICAvLyBzcGFyc2UgYXJyYXktbGlrZXMgYXMgaWYgdGhleSB3ZXJlIGRlbnNlLlxuICBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2ldLCBpLCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIHJlZHVjaW5nIGZ1bmN0aW9uIGl0ZXJhdGluZyBsZWZ0IG9yIHJpZ2h0LlxuICBmdW5jdGlvbiBjcmVhdGVSZWR1Y2UoZGlyKSB7XG4gICAgLy8gT3B0aW1pemVkIGl0ZXJhdG9yIGZ1bmN0aW9uIGFzIHVzaW5nIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAvLyBpbiB0aGUgbWFpbiBmdW5jdGlvbiB3aWxsIGRlb3B0aW1pemUgdGhlLCBzZWUgIzE5OTEuXG4gICAgZnVuY3Rpb24gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCkge1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGNvbnRleHQpIHtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgNCk7XG4gICAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICAgIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBpbml0aWFsIHZhbHVlIGlmIG5vbmUgaXMgcHJvdmlkZWQuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgbWVtbyA9IG9ialtrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGRpcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGNyZWF0ZVJlZHVjZSgxKTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXk7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGtleSA9IF8uZmluZEluZGV4KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5ID0gXy5maW5kS2V5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwICYmIGtleSAhPT0gLTEpIHJldHVybiBvYmpba2V5XTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubmVnYXRlKGNiKHByZWRpY2F0ZSkpLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZXNgIGFuZCBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGVzID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ICE9ICdudW1iZXInIHx8IGd1YXJkKSBmcm9tSW5kZXggPSAwO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCBpdGVtLCBmcm9tSW5kZXgpID49IDA7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBmdW5jID0gaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXTtcbiAgICAgIHJldHVybiBmdW5jID09IG51bGwgPyBmdW5jIDogZnVuYy5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYSBjb2xsZWN0aW9uLCB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHNldCA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBzZXQubGVuZ3RoO1xuICAgIHZhciBzaHVmZmxlZCA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCByYW5kOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKDAsIGluZGV4KTtcbiAgICAgIGlmIChyYW5kICE9PSBpbmRleCkgc2h1ZmZsZWRbaW5kZXhdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHNldFtpbmRleF07XG4gICAgfVxuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRlZS5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSsrOyBlbHNlIHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gU3BsaXQgYSBjb2xsZWN0aW9uIGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBwYXNzID0gW10sIGZhaWwgPSBbXTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICAgIChwcmVkaWNhdGUodmFsdWUsIGtleSwgb2JqKSA/IHBhc3MgOiBmYWlsKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbMF07XG4gICAgcmV0dXJuIF8uaW5pdGlhbChhcnJheSwgYXJyYXkubGVuZ3RoIC0gbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSAobiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIF8ucmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgbiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgc3RyaWN0LCBzdGFydEluZGV4KSB7XG4gICAgdmFyIG91dHB1dCA9IFtdLCBpZHggPSAwO1xuICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4IHx8IDAsIGxlbmd0aCA9IGdldExlbmd0aChpbnB1dCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAvL2ZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0XG4gICAgICAgIGlmICghc2hhbGxvdykgdmFsdWUgPSBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QpO1xuICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgb3V0cHV0Lmxlbmd0aCArPSBsZW47XG4gICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldLFxuICAgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpIDogdmFsdWU7XG4gICAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgICAgaWYgKCFpIHx8IHNlZW4gIT09IGNvbXB1dGVkKSByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIHNlZW4gPSBjb21wdXRlZDtcbiAgICAgIH0gZWxzZSBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfLmNvbnRhaW5zKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKF8uY29udGFpbnMocmVzdWx0LCBpdGVtKSkgY29udGludWU7XG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuemlwKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ29tcGxlbWVudCBvZiBfLnppcC4gVW56aXAgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGdyb3Vwc1xuICAvLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXNcbiAgXy51bnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIF8ubWF4KGFycmF5LCBnZXRMZW5ndGgpLmxlbmd0aCB8fCAwO1xuICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IF8ucGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgobGlzdCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGZpbmRJbmRleCBhbmQgZmluZExhc3RJbmRleCBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoZGlyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIHZhciBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoMSk7XG4gIF8uZmluZExhc3RJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKC0xKTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBpbmRleE9mIGFuZCBsYXN0SW5kZXhPZiBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlSW5kZXhGaW5kZXIoZGlyLCBwcmVkaWNhdGVGaW5kLCBzb3J0ZWRJbmRleCkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgaXRlbSwgaWR4KSB7XG4gICAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICBpZiAodHlwZW9mIGlkeCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgICAgaSA9IGlkeCA+PSAwID8gaWR4IDogTWF0aC5tYXgoaWR4ICsgbGVuZ3RoLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlkeCA+PSAwID8gTWF0aC5taW4oaWR4ICsgMSwgbGVuZ3RoKSA6IGlkeCArIGxlbmd0aCArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc29ydGVkSW5kZXggJiYgaWR4ICYmIGxlbmd0aCkge1xuICAgICAgICBpZHggPSBzb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgICBpZHggPSBwcmVkaWNhdGVGaW5kKHNsaWNlLmNhbGwoYXJyYXksIGksIGxlbmd0aCksIF8uaXNOYU4pO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigxLCBfLmZpbmRJbmRleCwgXy5zb3J0ZWRJbmRleCk7XG4gIF8ubGFzdEluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigtMSwgXy5maW5kTGFzdEluZGV4KTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChzdG9wID09IG51bGwpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvclxuICAvLyBvciBhIG5vcm1hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgdmFyIGV4ZWN1dGVCb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgY29udGV4dCwgdGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBfID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghXy5oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBfLnBhcnRpYWwoXy5kZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICBmdW5jdGlvbiBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gKF8uaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlKSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoXy5oYXMob2JqLCBwcm9wKSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIGFsbCB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBfLmFsbEtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdFxuICAvLyBJbiBjb250cmFzdCB0byBfLm1hcCBpdCByZXR1cm5zIGFuIG9iamVjdFxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHRzID0ge30sXG4gICAgICAgICAgY3VycmVudEtleTtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY3VycmVudEtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW4gb2JqZWN0KHMpXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kS2V5ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqZWN0LCBvaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIG9iaiA9IG9iamVjdCwgaXRlcmF0ZWUsIGtleXM7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob2l0ZXJhdGVlKSkge1xuICAgICAga2V5cyA9IF8uYWxsS2V5cyhvYmopO1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKG9pdGVyYXRlZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IHJldHVybiBrZXkgaW4gb2JqOyB9O1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5uZWdhdGUoaXRlcmF0ZWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ubWFwKGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSBvYmplY3QuXG4gIC8vIElmIGFkZGl0aW9uYWwgcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdGhlbiB0aGV5IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gIC8vIGNyZWF0ZWQgb2JqZWN0LlxuICBfLmNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSwgcHJvcHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIGlmIChwcm9wcykgXy5leHRlbmRPd24ocmVzdWx0LCBwcm9wcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uaXNNYXRjaCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhhdHRycyksIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuXG4gICAgLy8gSW5pdGlhbGl6aW5nIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIC8vIEl0J3MgZG9uZSBoZXJlIHNpbmNlIHdlIG9ubHkgbmVlZCB0aGVtIGZvciBvYmplY3RzIGFuZCBhcnJheXMgY29tcGFyaXNvbi5cbiAgICBhU3RhY2sgPSBhU3RhY2sgfHwgW107XG4gICAgYlN0YWNrID0gYlN0YWNrIHx8IFtdO1xuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYjtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG5cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoYXJlQXJyYXlzKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFlcShhW2xlbmd0aF0sIGJbbGVuZ3RoXSwgYVN0YWNrLCBiU3RhY2spKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgdmFyIGtleXMgPSBfLmtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMgYmVmb3JlIGNvbXBhcmluZyBkZWVwIGVxdWFsaXR5LlxuICAgICAgaWYgKF8ua2V5cyhiKS5sZW5ndGggIT09IGxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICBrZXkgPSBrZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSAmJiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopIHx8IF8uaXNBcmd1bWVudHMob2JqKSkpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBfLmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAsIGlzRXJyb3IuXG4gIF8uZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJywgJ0Vycm9yJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSA8IDkpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmhhcyhvYmosICdjYWxsZWUnKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIHR5cGVvZiBidWdzIGluIG9sZCB2OCxcbiAgLy8gSUUgMTEgKCMxNjIxKSwgYW5kIGluIFNhZmFyaSA4ICgjMTkyOSkuXG4gIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT09ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9ucy4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5ub29wID0gZnVuY3Rpb24oKXt9O1xuXG4gIF8ucHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIF8ucHJvcGVydHlPZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT0gbnVsbCA/IGZ1bmN0aW9uKCl7fSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mXG4gIC8vIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXIgPSBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIGF0dHJzID0gXy5leHRlbmRPd24oe30sIGF0dHJzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5pc01hdGNoKG9iaiwgYXR0cnMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIF8ubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZXNjYXBlTWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjeDI3OycsXG4gICAgJ2AnOiAnJiN4NjA7J1xuICB9O1xuICB2YXIgdW5lc2NhcGVNYXAgPSBfLmludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIGNyZWF0ZUVzY2FwZXIgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgZXNjYXBlciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgICB9O1xuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZFxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIF8ua2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgPT0gbnVsbCA/ICcnIDogJycgKyBzdHJpbmc7XG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgICB9O1xuICB9O1xuICBfLmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTtcbiAgXy51bmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIGZhbGxiYWNrKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB2b2lkIDAgOiBvYmplY3RbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICB2YWx1ZSA9IGZhbGxiYWNrO1xuICAgIH1cbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgdmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfTtcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAvLyBOQjogYG9sZFNldHRpbmdzYCBvbmx5IGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVyLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZlc3QuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyAncmV0dXJuIF9fcDtcXG4nO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaic7XG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBvYmopIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gIF8ucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3h5IGZvciBzb21lIG1ldGhvZHMgdXNlZCBpbiBlbmdpbmUgb3BlcmF0aW9uc1xuICAvLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuICBfLnByb3RvdHlwZS52YWx1ZU9mID0gXy5wcm90b3R5cGUudG9KU09OID0gXy5wcm90b3R5cGUudmFsdWU7XG5cbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiJdfQ==
