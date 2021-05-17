/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./animation/animation.ts":
/*!********************************!*\
  !*** ./animation/animation.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Timeline": () => (/* binding */ Timeline),
/* harmony export */   "createAnimationOptions": () => (/* binding */ createAnimationOptions),
/* harmony export */   "Animation": () => (/* binding */ Animation)
/* harmony export */ });
/*
 * @Description:
 * @Author: zhuo.pan
 * @Date: 2021-04-11 19:27:08
 * @LastEditTime: 2021-04-19 02:49:31
 * @LastEditors: zhuo.pan
 */
var TICK = Symbol("tick");
var TICK_HANDLER = Symbol("tivk-handler");
var ANIMATIONS = Symbol("animations");
var START_TIME = Symbol("start-time");
var PAUSE_START = Symbol("pause-start");
var PAUSE_TIME = Symbol("pause-time");
var TIME_PROGRESS = Symbol('time-progress');
var TimelineState;
(function (TimelineState) {
    TimelineState[TimelineState["Inited"] = 0] = "Inited";
    TimelineState[TimelineState["Started"] = 1] = "Started";
    TimelineState[TimelineState["Paused"] = 2] = "Paused";
})(TimelineState || (TimelineState = {}));
var Timeline = /** @class */ (function () {
    function Timeline() {
        this.state = TimelineState.Inited;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TIME_PROGRESS] = 0;
    }
    Timeline.prototype.getProgress = function () {
        return this[TIME_PROGRESS];
    };
    Timeline.prototype.start = function () {
        var _this = this;
        if (this.state !== TimelineState.Inited)
            return;
        this.state = TimelineState.Started;
        var startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = function () {
            var _a;
            _this[TIME_PROGRESS] = Date.now() - startTime - _this[PAUSE_TIME]; // 时间进度
            (_a = _this[ANIMATIONS]) === null || _a === void 0 ? void 0 : _a.forEach(function (animation) {
                var t = _this[TIME_PROGRESS] - _this[START_TIME].get(animation) - animation.delay;
                if (animation.duration < t) {
                    if ((animation.repeat === 0) ||
                        (t / animation.duration > animation.repeat + 1)) { // 循环结束
                        _this[ANIMATIONS].delete(animation);
                        t = animation.duration;
                    }
                    else {
                        // 永久循环
                        t = t % animation.duration;
                    }
                }
                // 考虑delay因素，大于0才出发
                if (t > 0) {
                    animation.receive(t);
                }
            });
            _this[TICK_HANDLER] = requestAnimationFrame(_this[TICK]);
        };
        this[TICK](0);
    };
    Timeline.prototype.pause = function () {
        if (this.state !== TimelineState.Started)
            return;
        this.state = TimelineState.Paused;
        cancelAnimationFrame(this[TICK_HANDLER]);
        this[PAUSE_START] = Date.now(); //记录暂停开始的时间
        // this[PAUSE_TIME] = this[TIME_PROGRESS]
    };
    Timeline.prototype.resume = function () {
        if (this.state !== TimelineState.Paused)
            return;
        this.state = TimelineState.Started;
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK](0);
    };
    Timeline.prototype.reset = function () {
        this.pause();
        this.state = TimelineState.Inited;
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[PAUSE_START] = 0;
        this[TICK_HANDLER] = null;
        this[TIME_PROGRESS] = 0;
    };
    Timeline.prototype.add = function (animation, startTime) {
        if (arguments.length < 2) {
            //时间少于2的时候添加默认值
            startTime = this[TIME_PROGRESS];
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    };
    return Timeline;
}());

var createAnimationOptions = function (object, property, startValue, endValue, duration, delay, repeat, timingFunction, template) { return ({
    object: object,
    property: property,
    repeat: repeat,
    startValue: startValue, endValue: endValue, duration: duration, delay: delay, timingFunction: timingFunction, template: template
}); };
var Animation = /** @class */ (function () {
    function Animation(_a) {
        var object = _a.object, property = _a.property, _b = _a.repeat, repeat = _b === void 0 ? 0 : _b, startValue = _a.startValue, endValue = _a.endValue, _c = _a.duration, duration = _c === void 0 ? 250 : _c, _d = _a.delay, delay = _d === void 0 ? 0 : _d, timingFunction = _a.timingFunction, template = _a.template;
        timingFunction = timingFunction || (function (v) { return v; });
        template = template || (function (v) { return v; });
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        if (repeat === true) {
            this.repeat = -1;
        }
        else if (typeof repeat === 'number') {
            this.repeat = repeat;
        }
        else {
            this.repeat = 0;
        }
        this.timingFunction = timingFunction;
        this.template = template;
    }
    Animation.prototype.receive = function (time) {
        time = +time;
        var rage = this.endValue - this.startValue;
        var progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + rage * progress);
    };
    return Animation;
}());



/***/ }),

/***/ "./animation/timingFunctions.ts":
/*!**************************************!*\
  !*** ./animation/timingFunctions.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "linear": () => (/* binding */ linear),
/* harmony export */   "cubicBezier": () => (/* binding */ cubicBezier),
/* harmony export */   "ease": () => (/* binding */ ease),
/* harmony export */   "easeIn": () => (/* binding */ easeIn),
/* harmony export */   "easeOut": () => (/* binding */ easeOut),
/* harmony export */   "easeInOut": () => (/* binding */ easeInOut)
/* harmony export */ });
var linear = function (v) { return +v; };
function cubicBezier(p1x, p1y, p2x, p2y) {
    p1x = +p1x;
    p1y = +p1y;
    p2x = +p2x;
    p2y = +p2y;
    var ZERO_LIMIT = 1e-6;
    // Calculate the polynomial coefficients,
    // implicit first and last control points are (0, 0) and (1, 1).
    var ax = 3 * p1x - 3 * p2x + 1;
    var bx = 3 * p2x - 6 * p1x;
    var cx = 3 * p1x;
    var ay = 3 * p1y - 3 * p2y + 1;
    var by = 3 * p2y - 6 * p1y;
    var cy = 3 * p1y;
    function sampleCurveDerivativeX(t) {
        t = +t;
        return +((3 * ax * t + 2 * bx) * t + cx);
    }
    function sampleCurveX(t) {
        t = +t;
        return +(((ax * t + bx) * t + cx) * t);
    }
    function sampleCurveY(t) {
        t = +t;
        return +(((ay * t + by) * t + cy) * t);
    }
    function solveCurveX(x) {
        var t2 = +x;
        var x2;
        // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
        // First try a few iterations of Newton's method -- normally very fast.
        // http://en.wikipedia.org/wiki/Newton's_method
        for (var i = 0; i < 8; i++) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return +t2;
            }
            var derivative = sampleCurveDerivativeX(t2);
            if (Math.abs(derivative) < ZERO_LIMIT) {
                break;
            }
            t2 -= x2 / derivative;
        }
        var t1 = 1;
        var t0 = 0;
        t2 = x;
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return +t2;
            }
            if (x2 > 0) {
                t1 = t2;
            }
            else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }
        return +t2;
    }
    function solve(x) {
        x = +x;
        return +sampleCurveY(solveCurveX(x));
    }
    return solve;
}
// https://cubic-bezier.com/#.25,.1,.25,1
var ease = cubicBezier(.25, .1, .25, 1);
var easeIn = cubicBezier(.42, 0, 1, 1);
var easeOut = cubicBezier(0, 0, .58, 1);
var easeInOut = cubicBezier(.42, 0, .58, 1);
/*
#include "ui/gfx/geometry/cubic_bezier.h"

#include <algorithm>
#include <cmath>

#include "base/check_op.h"
#include "base/numerics/ranges.h"

namespace gfx {

namespace {

const int kMaxNewtonIterations = 4;

}  // namespace

static const double kBezierEpsilon = 1e-7;

CubicBezier::CubicBezier(double p1x, double p1y, double p2x, double p2y) {
  InitCoefficients(p1x, p1y, p2x, p2y);
  InitGradients(p1x, p1y, p2x, p2y);
  InitRange(p1y, p2y);
  InitSpline();
}

CubicBezier::CubicBezier(const CubicBezier& other) = default;

void CubicBezier::InitCoefficients(double p1x,
                                   double p1y,
                                   double p2x,
                                   double p2y) {
  // Calculate the polynomial coefficients, implicit first and last control
  // points are (0,0) and (1,1).
  cx_ = 3.0 * p1x;
  bx_ = 3.0 * (p2x - p1x) - cx_;
  ax_ = 1.0 - cx_ - bx_;

  cy_ = 3.0 * p1y;
  by_ = 3.0 * (p2y - p1y) - cy_;
  ay_ = 1.0 - cy_ - by_;

#ifndef NDEBUG
  // Bezier curves with x-coordinates outside the range [0,1] for internal
  // control points may have multiple values for t for a given value of x.
  // In this case, calls to SolveCurveX may produce ambiguous results.
  monotonically_increasing_ = p1x >= 0 && p1x <= 1 && p2x >= 0 && p2x <= 1;
#endif
}

void CubicBezier::InitGradients(double p1x,
                                double p1y,
                                double p2x,
                                double p2y) {
  // End-point gradients are used to calculate timing function results
  // outside the range [0, 1].
  //
  // There are four possibilities for the gradient at each end:
  // (1) the closest control point is not horizontally coincident with regard to
  //     (0, 0) or (1, 1). In this case the line between the end point and
  //     the control point is tangent to the bezier at the end point.
  // (2) the closest control point is coincident with the end point. In
  //     this case the line between the end point and the far control
  //     point is tangent to the bezier at the end point.
  // (3) both internal control points are coincident with an endpoint. There
  //     are two special case that fall into this category:
  //     CubicBezier(0, 0, 0, 0) and CubicBezier(1, 1, 1, 1). Both are
  //     equivalent to linear.
  // (4) the closest control point is horizontally coincident with the end
  //     point, but vertically distinct. In this case the gradient at the
  //     end point is Infinite. However, this causes issues when
  //     interpolating. As a result, we break down to a simple case of
  //     0 gradient under these conditions.

  if (p1x > 0)
    start_gradient_ = p1y / p1x;
  else if (!p1y && p2x > 0)
    start_gradient_ = p2y / p2x;
  else if (!p1y && !p2y)
    start_gradient_ = 1;
  else
    start_gradient_ = 0;

  if (p2x < 1)
    end_gradient_ = (p2y - 1) / (p2x - 1);
  else if (p2y == 1 && p1x < 1)
    end_gradient_ = (p1y - 1) / (p1x - 1);
  else if (p2y == 1 && p1y == 1)
    end_gradient_ = 1;
  else
    end_gradient_ = 0;
}

// This works by taking taking the derivative of the cubic bezier, on the y
// axis. We can then solve for where the derivative is zero to find the min
// and max distance along the line. We the have to solve those in terms of time
// rather than distance on the x-axis
void CubicBezier::InitRange(double p1y, double p2y) {
  range_min_ = 0;
  range_max_ = 1;
  if (0 <= p1y && p1y < 1 && 0 <= p2y && p2y <= 1)
    return;

  const double epsilon = kBezierEpsilon;

  // Represent the function's derivative in the form at^2 + bt + c
  // as in sampleCurveDerivativeY.
  // (Technically this is (dy/dt)*(1/3), which is suitable for finding zeros
  // but does not actually give the slope of the curve.)
  const double a = 3.0 * ay_;
  const double b = 2.0 * by_;
  const double c = cy_;

  // Check if the derivative is constant.
  if (std::abs(a) < epsilon && std::abs(b) < epsilon)
    return;

  // Zeros of the function's derivative.
  double t1 = 0;
  double t2 = 0;

  if (std::abs(a) < epsilon) {
    // The function's derivative is linear.
    t1 = -c / b;
  } else {
    // The function's derivative is a quadratic. We find the zeros of this
    // quadratic using the quadratic formula.
    double discriminant = b * b - 4 * a * c;
    if (discriminant < 0)
      return;
    double discriminant_sqrt = sqrt(discriminant);
    t1 = (-b + discriminant_sqrt) / (2 * a);
    t2 = (-b - discriminant_sqrt) / (2 * a);
  }

  double sol1 = 0;
  double sol2 = 0;

  // If the solution is in the range [0,1] then we include it, otherwise we
  // ignore it.

  // An interesting fact about these beziers is that they are only
  // actually evaluated in [0,1]. After that we take the tangent at that point
  // and linearly project it out.
  if (0 < t1 && t1 < 1)
    sol1 = SampleCurveY(t1);

  if (0 < t2 && t2 < 1)
    sol2 = SampleCurveY(t2);

  range_min_ = std::min({range_min_, sol1, sol2});
  range_max_ = std::max({range_max_, sol1, sol2});
}

void CubicBezier::InitSpline() {
  double delta_t = 1.0 / (CUBIC_BEZIER_SPLINE_SAMPLES - 1);
  for (int i = 0; i < CUBIC_BEZIER_SPLINE_SAMPLES; i++) {
    spline_samples_[i] = SampleCurveX(i * delta_t);
  }
}

double CubicBezier::GetDefaultEpsilon() {
  return kBezierEpsilon;
}

double CubicBezier::SolveCurveX(double x, double epsilon) const {
  DCHECK_GE(x, 0.0);
  DCHECK_LE(x, 1.0);

  double t0;
  double t1;
  double t2 = x;
  double x2;
  double d2;
  int i;

#ifndef NDEBUG
  DCHECK(monotonically_increasing_);
#endif

  // Linear interpolation of spline curve for initial guess.
  double delta_t = 1.0 / (CUBIC_BEZIER_SPLINE_SAMPLES - 1);
  for (i = 1; i < CUBIC_BEZIER_SPLINE_SAMPLES; i++) {
    if (x <= spline_samples_[i]) {
      t1 = delta_t * i;
      t0 = t1 - delta_t;
      t2 = t0 + (t1 - t0) * (x - spline_samples_[i - 1]) /
                    (spline_samples_[i] - spline_samples_[i - 1]);
      break;
    }
  }

  // Perform a few iterations of Newton's method -- normally very fast.
  // See https://en.wikipedia.org/wiki/Newton%27s_method.
  double newton_epsilon = std::min(kBezierEpsilon, epsilon);
  for (i = 0; i < kMaxNewtonIterations; i++) {
    x2 = SampleCurveX(t2) - x;
    if (fabs(x2) < newton_epsilon)
      return t2;
    d2 = SampleCurveDerivativeX(t2);
    if (fabs(d2) < kBezierEpsilon)
      break;
    t2 = t2 - x2 / d2;
  }
  if (fabs(x2) < epsilon)
    return t2;

  // Fall back to the bisection method for reliability.
  while (t0 < t1) {
    x2 = SampleCurveX(t2);
    if (fabs(x2 - x) < epsilon)
      return t2;
    if (x > x2)
      t0 = t2;
    else
      t1 = t2;
    t2 = (t1 + t0) * .5;
  }

  // Failure.
  return t2;
}

double CubicBezier::Solve(double x) const {
  return SolveWithEpsilon(x, kBezierEpsilon);
}

double CubicBezier::SlopeWithEpsilon(double x, double epsilon) const {
  x = base::ClampToRange(x, 0.0, 1.0);
  double t = SolveCurveX(x, epsilon);
  double dx = SampleCurveDerivativeX(t);
  double dy = SampleCurveDerivativeY(t);
  return dy / dx;
}

double CubicBezier::Slope(double x) const {
  return SlopeWithEpsilon(x, kBezierEpsilon);
}

double CubicBezier::GetX1() const {
  return cx_ / 3.0;
}

double CubicBezier::GetY1() const {
  return cy_ / 3.0;
}

double CubicBezier::GetX2() const {
  return (bx_ + cx_) / 3.0 + GetX1();
}

double CubicBezier::GetY2() const {
  return (by_ + cy_) / 3.0 + GetY1();
}

}  // namespace gfx

*/ 


/***/ }),

/***/ "./component/carousel.tsx":
/*!********************************!*\
  !*** ./component/carousel.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _framework_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../framework/framework */ "./framework/framework.ts");
/* harmony import */ var _framework_gesture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../framework/gesture */ "./framework/gesture.ts");
/* harmony import */ var _animation_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animation/animation */ "./animation/animation.ts");
/* harmony import */ var _animation_timingFunctions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../animation/timingFunctions */ "./animation/timingFunctions.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a, _b, _c;
/// <reference path = "../framework/gesture.ts" />




var kDuration = Symbol('duration');
var kOnChanged = Symbol('on-changed');
var kImgList = Symbol('img-list');
var kIntervalHandle = Symbol('interval-handle');
var Carousel = /** @class */ (function (_super) {
    __extends(Carousel, _super);
    function Carousel() {
        var _this = _super.call(this) || this;
        _this.width = 500;
        _this[_a] = 2000;
        _this[_b] = function (position) { };
        _this[_c] = [];
        _this[kImgList] = [];
        _this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position = 0;
        return _this;
    }
    // STATES
    // position: number = 0
    // ATTRIBUTES
    ;
    Carousel.prototype.didMounted = function () {
        var _this = this;
        var eWarp = this.root;
        var element = eWarp.root;
        (0,_framework_gesture__WEBPACK_IMPORTED_MODULE_1__.gestureEnable)(element);
        var children = Array.from(element.children);
        var imageCount = children.length;
        var width = this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTES].width || 500;
        var animationStartProgress = 0;
        var nextImage = function () {
            animationStartProgress = timeline.getProgress();
            var nextIndex = (_this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position + 1) % imageCount;
            timeline.add(new _animation_animation__WEBPACK_IMPORTED_MODULE_2__.Animation({
                object: children[_this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position].style,
                property: "transform",
                startValue: -_this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position * width,
                endValue: -_this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position * width - width,
                duration: 500,
                timingFunction: _animation_timingFunctions__WEBPACK_IMPORTED_MODULE_3__.ease,
                template: function (progress) { return "translateX(" + progress + "px)"; }
            }));
            timeline.add(new _animation_animation__WEBPACK_IMPORTED_MODULE_2__.Animation({
                object: children[nextIndex].style,
                property: "transform",
                startValue: -nextIndex * width + width,
                endValue: -nextIndex * width,
                duration: 500,
                timingFunction: _animation_timingFunctions__WEBPACK_IMPORTED_MODULE_3__.ease,
                template: function (progress) { return "translateX(" + progress + "px)"; }
            }));
            _this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position = nextIndex;
            _this.triggerEvent('change', nextIndex);
        };
        var timeline = new _animation_animation__WEBPACK_IMPORTED_MODULE_2__.Timeline();
        timeline.start();
        var animationOffsetX = 0;
        element.addEventListener('start', function (event) {
            timeline.pause();
            clearInterval(_this[kIntervalHandle]);
            // 计算动画偏差
            var duration = _this[kDuration];
            var curProgressTime = timeline.getProgress();
            var progress = (curProgressTime - animationStartProgress) < duration ? 0 : curProgressTime - animationStartProgress;
            console.log('progress', progress, animationStartProgress, curProgressTime);
            animationOffsetX = (0,_animation_timingFunctions__WEBPACK_IMPORTED_MODULE_3__.ease)(progress % duration / duration) * width;
        });
        var i = 0;
        element.addEventListener('pan', function (event) {
            var panX = event.clientX - event.startX;
            (i++ % 20 === 0) && console.log(panX, animationOffsetX);
            var x = panX - animationOffsetX;
            var moveIndex = Math.round(-x / width);
            var curIndex = (_this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position + moveIndex % imageCount + imageCount) % imageCount;
            var preIndex = (curIndex - 1 + imageCount) % imageCount;
            var nextIndex = (curIndex + 1 + imageCount) % imageCount;
            children[preIndex].style.transform = "translateX(" + (-((preIndex - moveIndex) * width) + x - width) + "px)";
            children[curIndex].style.transform = "translateX(" + (-((curIndex - moveIndex) * width) + x) + "px)";
            children[nextIndex].style.transform = "translateX(" + (-((nextIndex - moveIndex) * width) + x + width) + "px)";
        });
        element.addEventListener('end', function (event) {
            timeline.reset();
            timeline.start();
            var panX = event.clientX - event.startX;
            var x = panX - animationOffsetX;
            var curIndex = (_this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position + Math.round(-x / width) % imageCount + imageCount) % imageCount;
            if (event.isFlick) {
                var moveIndex = event.velocity < 0 ? Math.ceil(panX / width) : Math.floor(panX / width);
                for (var _i = 0, _d = [-1, 0, 1]; _i < _d.length; _i++) {
                    var offset = _d[_i];
                    var index = (curIndex + offset + imageCount) % imageCount;
                    timeline.add(new _animation_animation__WEBPACK_IMPORTED_MODULE_2__.Animation({
                        object: children[index].style,
                        property: "transform",
                        startValue: -((index - moveIndex) * width) + x + width * offset,
                        endValue: -((index - moveIndex) * width) + width * offset,
                        duration: 500,
                        timingFunction: _animation_timingFunctions__WEBPACK_IMPORTED_MODULE_3__.ease,
                        template: function (progress) { return "translateX(" + progress + "px)"; }
                    }));
                }
            }
            else {
                var moveIndex = Math.round(-x / width);
                // console.log(x, panX, animationOffsetX)
                // console.log(preIndex, curIndex, nextIndex, moveIndex)
                for (var _e = 0, _f = [-1, 0, 1]; _e < _f.length; _e++) {
                    var offset = _f[_e];
                    var index = (curIndex + offset + imageCount) % imageCount;
                    timeline.add(new _animation_animation__WEBPACK_IMPORTED_MODULE_2__.Animation({
                        object: children[index].style,
                        property: "transform",
                        startValue: -((index - moveIndex) * width) + x + width * offset,
                        endValue: -((index - moveIndex) * width) + width * offset,
                        duration: 500,
                        timingFunction: _animation_timingFunctions__WEBPACK_IMPORTED_MODULE_3__.ease,
                        template: function (progress) { return "translateX(" + progress + "px)"; }
                    }));
                }
            }
            _this[_framework_framework__WEBPACK_IMPORTED_MODULE_0__.STATES].position = curIndex;
            _this.triggerEvent('change', curIndex);
            _this[kIntervalHandle] = setInterval(nextImage, _this[kDuration]);
        });
        this[kIntervalHandle] = setInterval(nextImage, this[kDuration]);
    };
    Carousel.prototype.setDuration = function (duration) {
        this[kDuration] = duration;
    };
    Carousel.prototype.setImgList = function (imgList) {
        this[kImgList] = imgList;
    };
    Carousel.prototype.render = function () {
        return _framework_framework__WEBPACK_IMPORTED_MODULE_0__.React.createElement("div", { class: "carousel" }, this[kImgList].map(function (img) {
            var styles = "background-image:url(" + img.src + ")";
            return _framework_framework__WEBPACK_IMPORTED_MODULE_0__.React.createElement("div", { class: "carousel--item", style: styles });
        }));
    };
    return Carousel;
}(_framework_framework__WEBPACK_IMPORTED_MODULE_0__.BaseComponent));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Carousel);
_a = kDuration, _b = kOnChanged, _c = kImgList;


/***/ }),

/***/ "./framework/framework.ts":
/*!********************************!*\
  !*** ./framework/framework.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ATTRIBUTES": () => (/* binding */ ATTRIBUTES),
/* harmony export */   "STATES": () => (/* binding */ STATES),
/* harmony export */   "createElement": () => (/* binding */ createElement),
/* harmony export */   "React": () => (/* binding */ React),
/* harmony export */   "ElementWrapper": () => (/* binding */ ElementWrapper),
/* harmony export */   "BaseComponent": () => (/* binding */ BaseComponent)
/* harmony export */ });
/**
 * 组件封装方法
 */
var ATTRIBUTES = Symbol('attributes');
var STATES = Symbol('states');
function createElement(type, attribute) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (!type) {
        return null;
    }
    var element;
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    }
    else {
        element = createComponent(type);
    }
    for (var attr in attribute) {
        element.setAttribute(attr, attribute[attr]);
    }
    var appendChild = function (children) {
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            if (typeof child === 'string') {
                child = new TextWrapper(child);
            }
            element.appendChild(child);
        }
    };
    if (Array.isArray(children === null || children === void 0 ? void 0 : children[0])) {
        appendChild(children.flat());
    }
    else {
        appendChild(children);
    }
    return element;
}
var React = {
    createElement: createElement
};
var ElementWrapper = /** @class */ (function () {
    function ElementWrapper(type) {
        this.type = type || 'div';
        this.root = this.render();
    }
    ElementWrapper.prototype.setAttribute = function (attr, value) {
        this.root.setAttribute(attr, value);
    };
    ElementWrapper.prototype.mountTo = function (parent) {
        parent.appendChild(this.root);
    };
    ElementWrapper.prototype.appendChild = function (child) {
        child.mountTo(this.root);
    };
    ElementWrapper.prototype.render = function () {
        return document.createElement(this.type);
    };
    return ElementWrapper;
}());

var TextWrapper = /** @class */ (function () {
    function TextWrapper(content) {
        this.content = content || '';
        this.root = this.render();
    }
    TextWrapper.prototype.setAttribute = function (attr, value) {
    };
    TextWrapper.prototype.mountTo = function (parent) {
        parent.appendChild(this.root);
    };
    TextWrapper.prototype.appendChild = function (child) {
        // this.mountTo(this.root)
    };
    TextWrapper.prototype.render = function () {
        return document.createTextNode(this.content);
    };
    return TextWrapper;
}());
function createComponent(cmpConstructor, type) {
    return new cmpConstructor(type);
}
var BaseComponent = /** @class */ (function () {
    function BaseComponent() {
        this[ATTRIBUTES] = Object.create(null);
        this[STATES] = Object.create(null);
    }
    BaseComponent.prototype.mountTo = function (parent) {
        var _this = this;
        if (!this.root) {
            this.root = this.render();
        }
        if (isComponent(this.root)) {
            this.root.mountTo(parent);
            setTimeout(function () {
                var _a;
                (_a = _this.didMounted) === null || _a === void 0 ? void 0 : _a.call(_this);
            });
        }
        else {
            parent.appendChild(this.root);
        }
    };
    BaseComponent.prototype.didMounted = function () {
        throw new Error("Method not implemented.");
    };
    BaseComponent.prototype.setAttribute = function (attr, value) {
        if (!attr.length) {
            return;
        }
        var setterName = 'set' + attr[0].toUpperCase() + attr.slice(1);
        if (typeof this[setterName] === 'function') {
            this[setterName](value);
        }
        console.log(attr, value);
        this[ATTRIBUTES][attr] = value;
    };
    BaseComponent.prototype.getAttribute = function (attr) {
        if (!attr.length) {
            return;
        }
        var getterName = 'get' + attr[0].toUpperCase() + attr.slice(1);
        if (this[getterName] === 'function') {
            this[getterName];
        }
        return this[ATTRIBUTES][attr];
    };
    BaseComponent.prototype.triggerEvent = function (type, args) {
        if (!type) {
            return;
        }
        this[ATTRIBUTES]['on' + type[0].toUpperCase() + type.slice(1)](new CustomEvent(type, { detail: args }));
    };
    BaseComponent.prototype.setState = function (state, value) {
        this[STATES][state] = value;
    };
    BaseComponent.prototype.appendChild = function (child) {
    };
    BaseComponent.prototype.render = function () {
        return document.createElement('div');
    };
    return BaseComponent;
}());

function isComponent(cmp) {
    return cmp.mountTo !== undefined;
}


/***/ }),

/***/ "./framework/gesture.ts":
/*!******************************!*\
  !*** ./framework/gesture.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Listener": () => (/* binding */ Listener),
/* harmony export */   "Recognizer": () => (/* binding */ Recognizer),
/* harmony export */   "Dispatcher": () => (/* binding */ Dispatcher),
/* harmony export */   "gestureEnable": () => (/* binding */ gestureEnable)
/* harmony export */ });
var kMousePre = 'mouse_';
var kTouchPre = 'touch_';
var Listener = /** @class */ (function () {
    function Listener(element, recognizer) {
        if (!(element instanceof HTMLElement)) {
            throw new Error('element must be HTMLElement');
        }
        if (!recognizer) {
            throw new Error('recognizer must be instance of Recognizer');
        }
        this.element = element;
        this.recognizer = recognizer;
        this.init();
    }
    Listener.prototype.init = function () {
        var _this = this;
        var recognizer = this.recognizer;
        var element = this.element;
        element.addEventListener('contextmenu', function (event) {
            event.stopPropagation();
        }, {
            capture: true,
            passive: true
        });
        var isListeningMouse = false;
        var contexts = new Map();
        element.addEventListener('mousedown', function (event) {
            var _a, _b;
            var context = Object.create(null);
            contexts.set(kMousePre + (1 << event.button), context);
            (_b = (_a = _this.recognizer) === null || _a === void 0 ? void 0 : _a.start) === null || _b === void 0 ? void 0 : _b.call(_a, event, context);
            var move = function (event) {
                var _a, _b;
                var button = 1;
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        // order of buttons & button propery is not same
                        var key = void 0;
                        if (button === 2) {
                            key = 4;
                        }
                        else if (button === 4) {
                            key = 2;
                        }
                        else {
                            key = button;
                        }
                        var context_1 = contexts.get(kMousePre + key);
                        (_b = (_a = _this.recognizer) === null || _a === void 0 ? void 0 : _a.move) === null || _b === void 0 ? void 0 : _b.call(_a, event, context_1);
                    }
                    button = button << 1;
                }
            };
            var up = function (event) {
                var _a;
                var context = contexts.get(kMousePre + (1 << event.button));
                (_a = recognizer.end) === null || _a === void 0 ? void 0 : _a.call(recognizer, event, context);
                contexts.delete(kMousePre + (1 << event.button));
                if (event.buttons === 0) {
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', up);
                    isListeningMouse = false;
                }
            };
            if (isListeningMouse == false) {
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
                isListeningMouse = true;
            }
        });
        this.element.addEventListener('touchstart', function (event) {
            var _a;
            for (var _i = 0, _b = Array.from(event.changedTouches); _i < _b.length; _i++) {
                var point = _b[_i];
                var context = Object.create(null);
                contexts.set(kTouchPre + point.identifier, context);
                (_a = recognizer.start) === null || _a === void 0 ? void 0 : _a.call(recognizer, point, context);
            }
        });
        this.element.addEventListener('touchmove', function (event) {
            var _a;
            for (var _i = 0, _b = Array.from(event.changedTouches); _i < _b.length; _i++) {
                var point = _b[_i];
                var context = contexts.get(kTouchPre + point.identifier);
                (_a = recognizer === null || recognizer === void 0 ? void 0 : recognizer.move) === null || _a === void 0 ? void 0 : _a.call(recognizer, point, context);
            }
        });
        this.element.addEventListener('touchend', function (event) {
            var _a;
            for (var _i = 0, _b = Array.from(event.changedTouches); _i < _b.length; _i++) {
                var point = _b[_i];
                var key = kTouchPre + point.identifier;
                var context = contexts.get(key);
                (_a = recognizer === null || recognizer === void 0 ? void 0 : recognizer.end) === null || _a === void 0 ? void 0 : _a.call(recognizer, point, context);
                contexts.delete(key);
            }
        });
        this.element.addEventListener('touchcancel', function (event) {
            var _a, _b;
            for (var _i = 0, _c = Array.from(event.changedTouches); _i < _c.length; _i++) {
                var point = _c[_i];
                var key = kTouchPre + point.identifier;
                var context = contexts.get(key);
                (_b = (_a = _this.recognizer) === null || _a === void 0 ? void 0 : _a.end) === null || _b === void 0 ? void 0 : _b.call(_a, point, context);
                contexts.delete(key);
            }
        });
    };
    return Listener;
}());

var Recognizer = /** @class */ (function () {
    function Recognizer(dispatcher) {
        this.dispatcher = dispatcher;
    }
    Recognizer.prototype.start = function (point, context) {
        var _this = this;
        var _a, _b;
        context.startX = point.clientX, context.startY = point.clientY;
        context.points = [
            {
                t: Date.now(),
                x: point.clientX,
                y: point.clientY,
            }
        ];
        (_b = (_a = this.dispatcher) === null || _a === void 0 ? void 0 : _a.dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, 'start', {
            clientX: point.clientX,
            clientY: point.clientY,
        });
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.handler = window.setTimeout(function () {
            var _a, _b;
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            (_b = (_a = _this.dispatcher) === null || _a === void 0 ? void 0 : _a.dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, 'press', {});
        }, 500);
    };
    Recognizer.prototype.move = function (point, context) {
        var dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        if (!context.isPan && Math.pow(dx, 2) + Math.pow(dy, 2) > 100) {
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy),
                this.dispatcher.dispatch('panstart', {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    isVertical: context.isVertical,
                });
            clearTimeout(context.handler);
        }
        if (context.isPan) {
            this.dispatcher.dispatch('pan', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            });
        }
        context.points = context.points.filter(function (point) { return Date.now() - point.t < 500; });
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY,
        });
    };
    Recognizer.prototype.end = function (point, context) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (context.isTap) {
            clearTimeout(context.handler);
            (_b = (_a = this.dispatcher) === null || _a === void 0 ? void 0 : _a.dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, 'tap', {});
        }
        if (context.isPress) {
            (_d = (_c = this.dispatcher) === null || _c === void 0 ? void 0 : _c.dispatch) === null || _d === void 0 ? void 0 : _d.call(_c, 'pressend', {});
        }
        context.points = context.points.filter(function (point) { return Date.now() - point.t < 500; });
        var v;
        if (!context.points.length) {
            v = 0;
        }
        else {
            var d = Math.sqrt(Math.pow((point.clientX - context.points[0].x), 2) +
                Math.pow((point.clientY - context.points[0].y), 2));
            v = d / (Date.now() - context.points[0].t);
        }
        if (v > 1.5) {
            (_f = (_e = this.dispatcher) === null || _e === void 0 ? void 0 : _e.dispatch) === null || _f === void 0 ? void 0 : _f.call(_e, 'flick', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v,
            });
            context.isFlick = true;
        }
        else {
            context.isFlick = false;
        }
        if (context.isPan) {
            (_h = (_g = this.dispatcher) === null || _g === void 0 ? void 0 : _g.dispatch) === null || _h === void 0 ? void 0 : _h.call(_g, 'panend', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
            });
        }
        (_k = (_j = this.dispatcher) === null || _j === void 0 ? void 0 : _j.dispatch) === null || _k === void 0 ? void 0 : _k.call(_j, 'end', {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            isVertical: context.isVertical,
            velocity: v,
            isFlick: context.isFlick,
        });
    };
    Recognizer.prototype.cancel = function (point, context) {
        this.dispatcher.dispatch('cancel', {});
        clearTimeout(context.handler);
    };
    return Recognizer;
}());

var Dispatcher = /** @class */ (function () {
    function Dispatcher(element) {
        this.element = element;
    }
    Dispatcher.prototype.dispatch = function (type, properties) {
        var _a;
        var event = new CustomEvent(type);
        for (var prop in properties) {
            event[prop] = properties[prop];
        }
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.dispatchEvent(event);
    };
    return Dispatcher;
}());

function gestureEnable(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)));
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _framework_framework_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./framework/framework.ts */ "./framework/framework.ts");
/* harmony import */ var _component_carousel_tsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component/carousel.tsx */ "./component/carousel.tsx");


{
  var imgList = [{
    src: './img/0.jpg'
  }, {
    src: './img/1.jpg'
  }, {
    src: './img/2.jpg'
  }, {
    src: './img/3.jpg'
  }];
  var carouselCmp = (0,_framework_framework_ts__WEBPACK_IMPORTED_MODULE_0__.createElement)(_component_carousel_tsx__WEBPACK_IMPORTED_MODULE_1__.default, {
    onChange: function onChange(event) {
      console.log('changed', event);
    },
    duration: 2021,
    imgList: imgList
  });
  carouselCmp.mountTo(document.body);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc3gvLi9hbmltYXRpb24vYW5pbWF0aW9uLnRzIiwid2VicGFjazovL2pzeC8uL2FuaW1hdGlvbi90aW1pbmdGdW5jdGlvbnMudHMiLCJ3ZWJwYWNrOi8vanN4Ly4vY29tcG9uZW50L2Nhcm91c2VsLnRzeCIsIndlYnBhY2s6Ly9qc3gvLi9mcmFtZXdvcmsvZnJhbWV3b3JrLnRzIiwid2VicGFjazovL2pzeC8uL2ZyYW1ld29yay9nZXN0dXJlLnRzIiwid2VicGFjazovL2pzeC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc3gvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2pzeC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2pzeC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2pzeC8uL21haW4uanMiXSwibmFtZXMiOlsiaW1nTGlzdCIsInNyYyIsImNhcm91c2VsQ21wIiwiZXZlbnQiLCJjb25zb2xlIiwibG9nIiwibW91bnRUbyIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUVILElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDM0IsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUMzQyxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3ZDLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUN6QyxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3ZDLElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFFN0MsSUFBSyxhQUlKO0FBSkQsV0FBSyxhQUFhO0lBQ2hCLHFEQUFVO0lBQ1YsdURBQVc7SUFDWCxxREFBVTtBQUNaLENBQUMsRUFKSSxhQUFhLEtBQWIsYUFBYSxRQUlqQjtBQUNEO0lBVUU7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNO1FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRTtRQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQXFCO1FBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBQ3pCLENBQUM7SUFFRCw4QkFBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFFRCx3QkFBSyxHQUFMO1FBQUEsaUJBNkJDO1FBNUJDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxhQUFhLENBQUMsTUFBTTtZQUNyQyxPQUFNO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBTztRQUNsQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRzs7WUFDWCxLQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsT0FBTztZQUN4RSxXQUFJLENBQUMsVUFBVSxDQUFDLDBDQUFFLE9BQU8sQ0FBQyxtQkFBUztnQkFDakMsSUFBSSxDQUFDLEdBQVcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUs7Z0JBQ3ZGLElBQUksU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQzt3QkFDNUIsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTzt3QkFDeEQsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7d0JBQ2xDLENBQUMsR0FBRyxTQUFTLENBQUMsUUFBUTtxQkFDdkI7eUJBQU07d0JBQ0wsT0FBTzt3QkFDUCxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxRQUFRO3FCQUMzQjtpQkFDRjtnQkFDRCxtQkFBbUI7Z0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDVCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDckI7WUFDSCxDQUFDLENBQUM7WUFFRixLQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcscUJBQXFCLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVELHdCQUFLLEdBQUw7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssYUFBYSxDQUFDLE9BQU87WUFDdEMsT0FBTTtRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLE1BQU07UUFDakMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUMsV0FBVztRQUMxQyx5Q0FBeUM7SUFDM0MsQ0FBQztJQUNELHlCQUFNLEdBQU47UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssYUFBYSxDQUFDLE1BQU07WUFDckMsT0FBTTtRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLE9BQU87UUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDO0lBQ0Qsd0JBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDWixJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNO1FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRTtRQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUU7UUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUk7UUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7SUFDekIsQ0FBQztJQUNELHNCQUFHLEdBQUgsVUFBSSxTQUFvQixFQUFFLFNBQWtCO1FBQzFDLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDeEIsZUFBZTtZQUNmLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQzVDLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQzs7QUFlTSxJQUFNLHNCQUFzQixHQUFHLFVBQUMsTUFBVyxFQUNoRCxRQUFrQyxFQUNsQyxVQUFrQixFQUFFLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsTUFBd0IsRUFBRSxjQUFjLEVBQUUsUUFBUSxJQUFLLFFBQUM7SUFDL0gsTUFBTTtJQUNOLFFBQVE7SUFDUixNQUFNO0lBQ04sVUFBVSxjQUFFLFFBQVEsWUFBRSxRQUFRLFlBQUUsS0FBSyxTQUFFLGNBQWMsa0JBQUUsUUFBUTtDQUNoRSxDQUFDLEVBTDhILENBSzlIO0FBRUY7SUFVRSxtQkFBWSxFQVNPO1lBUmpCLE1BQU0sY0FDTixRQUFRLGdCQUNSLGNBQVUsRUFBVixNQUFNLG1CQUFHLENBQUMsT0FDVixVQUFVLGtCQUFFLFFBQVEsZ0JBQ3BCLGdCQUFjLEVBQWQsUUFBUSxtQkFBRyxHQUFHLE9BQ2QsYUFBUyxFQUFULEtBQUssbUJBQUcsQ0FBQyxPQUNULGNBQWMsc0JBQ2QsUUFBUTtRQUVSLGNBQWMsR0FBRyxjQUFjLElBQUksQ0FBQyxXQUFDLElBQUksUUFBQyxFQUFELENBQUMsQ0FBQztRQUMzQyxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsV0FBQyxJQUFJLFFBQUMsRUFBRCxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUTtRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVU7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUTtRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUs7UUFDbEIsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ2pCO2FBQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7U0FDaEI7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRO0lBQzFCLENBQUM7SUFDRCwyQkFBTyxHQUFQLFVBQVEsSUFBSTtRQUNWLElBQUksR0FBRyxDQUFDLElBQUk7UUFDWixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVO1FBQzVDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7SUFDL0UsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUtNLElBQU0sTUFBTSxHQUFHLFVBQUMsQ0FBUyxJQUFLLFFBQUMsQ0FBQyxFQUFGLENBQUUsQ0FBQztBQUVqQyxTQUFTLFdBQVcsQ0FBQyxHQUFXLEVBQUUsR0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFXO0lBQzVFLEdBQUcsR0FBRyxDQUFDLEdBQUc7SUFDVixHQUFHLEdBQUcsQ0FBQyxHQUFHO0lBQ1YsR0FBRyxHQUFHLENBQUMsR0FBRztJQUNWLEdBQUcsR0FBRyxDQUFDLEdBQUc7SUFDVixJQUFNLFVBQVUsR0FBRyxJQUFJO0lBQ3ZCLHlDQUF5QztJQUN6QyxnRUFBZ0U7SUFDaEUsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDaEMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRztJQUM1QixJQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRztJQUVsQixJQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNoQyxJQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHO0lBQzVCLElBQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHO0lBRWxCLFNBQVMsc0JBQXNCLENBQUMsQ0FBQztRQUMvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ04sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsU0FBUyxZQUFZLENBQUMsQ0FBQztRQUNyQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ04sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsU0FBUyxZQUFZLENBQUMsQ0FBUztRQUM3QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ04sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsU0FBUyxXQUFXLENBQUMsQ0FBUztRQUM1QixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLEVBQVU7UUFFZCwwRUFBMEU7UUFDMUUsdUVBQXVFO1FBQ3ZFLCtDQUErQztRQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFCLEVBQUUsR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUN6QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFO2dCQUM3QixPQUFPLENBQUMsRUFBRTthQUNYO1lBQ0QsSUFBTSxVQUFVLEdBQUcsc0JBQXNCLENBQUMsRUFBRSxDQUFDO1lBQzdDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLEVBQUU7Z0JBQ3JDLE1BQUs7YUFDTjtZQUNELEVBQUUsSUFBSSxFQUFFLEdBQUcsVUFBVTtTQUN0QjtRQUNELElBQUksRUFBRSxHQUFHLENBQUM7UUFDVixJQUFJLEVBQUUsR0FBRyxDQUFDO1FBQ1YsRUFBRSxHQUFHLENBQUM7UUFDTixPQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDYixFQUFFLEdBQUcsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDekIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRTtnQkFDN0IsT0FBTyxDQUFDLEVBQUU7YUFDWDtZQUNELElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDVixFQUFFLEdBQUcsRUFBRTthQUNSO2lCQUFNO2dCQUNMLEVBQUUsR0FBRyxFQUFFO2FBQ1I7WUFDRCxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNuQjtRQUNELE9BQU8sQ0FBQyxFQUFFO0lBQ1osQ0FBQztJQUVELFNBQVMsS0FBSyxDQUFDLENBQVM7UUFDdEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNOLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxPQUFPLEtBQUs7QUFDZCxDQUFDO0FBRUQseUNBQXlDO0FBQ2xDLElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDekMsSUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFFcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaVFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BWRixrREFBa0Q7QUFDK0M7QUFDM0I7QUFDVjtBQUNUO0FBR25ELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDcEMsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN2QyxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ25DLElBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztBQVNqRDtJQUFzQyw0QkFBYTtJQVdqRDtRQUFBLFlBQ0UsaUJBQU8sU0FHUjtRQVRBLFdBQUssR0FBRyxHQUFHLENBQ1g7UUFBQSxTQUFXLEdBQUcsSUFBSSxDQUNsQjtRQUFBLFNBQVksR0FBRyxVQUFDLFFBQWdCLElBQU0sQ0FBQyxDQUN2QztRQUFBLFNBQVUsR0FBK0IsRUFBRTtRQUkxQyxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNuQixLQUFJLENBQUMsd0RBQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDOztJQUMzQixDQUFDO0lBYkQsU0FBUztJQUNULHVCQUF1QjtJQUV2QixhQUFhO0lBQ2IsQ0FBQztJQVdELDZCQUFVLEdBQVY7UUFBQSxpQkFzSEM7UUFwSEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQXNCO1FBQ3pDLElBQU0sT0FBTyxHQUFnQixLQUFLLENBQUMsSUFBSTtRQUN2QyxpRUFBYSxDQUFDLE9BQU8sQ0FBQztRQUV0QixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQXVCO1FBQ25FLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNO1FBQ2xDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyw0REFBVSxDQUFDLENBQUMsS0FBSyxJQUFJLEdBQUc7UUFDM0MsSUFBSSxzQkFBc0IsR0FBRyxDQUFDO1FBRTlCLElBQU0sU0FBUyxHQUFHO1lBQ2hCLHNCQUFzQixHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDL0MsSUFBSSxTQUFTLEdBQUcsQ0FBQyxLQUFJLENBQUMsd0RBQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVO1lBQ3hELFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSwyREFBUyxDQUFDO2dCQUN6QixNQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUksQ0FBQyx3REFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSztnQkFDN0MsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFVBQVUsRUFBRSxDQUFDLEtBQUksQ0FBQyx3REFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUs7Z0JBQzFDLFFBQVEsRUFBRSxDQUFDLEtBQUksQ0FBQyx3REFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssR0FBRyxLQUFLO2dCQUNoRCxRQUFRLEVBQUUsR0FBRztnQkFDYixjQUFjLEVBQUUsNERBQUk7Z0JBQ3BCLFFBQVEsRUFBRSxVQUFDLFFBQVEsSUFBSyx1QkFBYyxRQUFRLFFBQUssRUFBM0IsQ0FBMkI7YUFDcEQsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJEQUFTLENBQUM7Z0JBQ3pCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSztnQkFDakMsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFVBQVUsRUFBRSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsS0FBSztnQkFDdEMsUUFBUSxFQUFFLENBQUMsU0FBUyxHQUFHLEtBQUs7Z0JBQzVCLFFBQVEsRUFBRSxHQUFHO2dCQUNiLGNBQWMsRUFBRSw0REFBSTtnQkFDcEIsUUFBUSxFQUFFLFVBQUMsUUFBUSxJQUFLLHVCQUFjLFFBQVEsUUFBSyxFQUEzQixDQUEyQjthQUNwRCxDQUFDLENBQUM7WUFFSCxLQUFJLENBQUMsd0RBQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxTQUFTO1lBQ2pDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSwwREFBUSxFQUFFO1FBQzdCLFFBQVEsQ0FBQyxLQUFLLEVBQUU7UUFFaEIsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUF1QjtZQUN4RCxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ2hCLGFBQWEsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFcEMsU0FBUztZQUNULElBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUM7WUFDaEMsSUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUM5QyxJQUFNLFFBQVEsR0FBRyxDQUFDLGVBQWUsR0FBRyxzQkFBc0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsc0JBQXNCO1lBQ3JILE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxlQUFlLENBQUM7WUFDMUUsZ0JBQWdCLEdBQUcsZ0VBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEtBQUs7UUFDakUsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNULE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBQyxLQUF1QjtZQUN0RCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDMUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFFLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUM7WUFDeEQsSUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLGdCQUFnQjtZQUNqQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN4QyxJQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUksQ0FBQyx3REFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLFNBQVMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVTtZQUMzRixJQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVTtZQUN6RCxJQUFNLFNBQVMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVTtZQUMxRCxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxpQkFBYyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssU0FBTTtZQUN0RyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxpQkFBYyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFNO1lBQzlGLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGlCQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxTQUFNO1FBQzFHLENBQUMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBQyxLQUF1QjtZQUN0RCxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ2hCLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFFaEIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTTtZQUV6QyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsZ0JBQWdCO1lBQy9CLElBQU0sUUFBUSxHQUFHLENBQUMsS0FBSSxDQUFDLHdEQUFNLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVTtZQUl4RyxJQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUM7Z0JBQ2YsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUN4RixLQUFtQixVQUFVLEVBQVYsTUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQVYsY0FBVSxFQUFWLElBQVUsRUFBRTtvQkFBMUIsSUFBSSxNQUFNO29CQUNiLElBQU0sS0FBSyxHQUFHLENBQUMsUUFBUSxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVO29CQUMzRCxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksMkRBQVMsQ0FBQzt3QkFDekIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLO3dCQUM3QixRQUFRLEVBQUUsV0FBVzt3QkFDckIsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU07d0JBQy9ELFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU07d0JBQ3pELFFBQVEsRUFBRSxHQUFHO3dCQUNiLGNBQWMsRUFBRSw0REFBSTt3QkFDcEIsUUFBUSxFQUFFLFVBQUMsUUFBUSxJQUFLLHVCQUFjLFFBQVEsUUFBSyxFQUEzQixDQUEyQjtxQkFDcEQsQ0FBQyxDQUFDO2lCQUNKO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3hDLHlDQUF5QztnQkFDekMsd0RBQXdEO2dCQUV4RCxLQUFtQixVQUFVLEVBQVYsTUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQVYsY0FBVSxFQUFWLElBQVUsRUFBRTtvQkFBMUIsSUFBSSxNQUFNO29CQUNiLElBQU0sS0FBSyxHQUFHLENBQUMsUUFBUSxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVO29CQUMzRCxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksMkRBQVMsQ0FBQzt3QkFDekIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLO3dCQUM3QixRQUFRLEVBQUUsV0FBVzt3QkFDckIsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU07d0JBQy9ELFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU07d0JBQ3pELFFBQVEsRUFBRSxHQUFHO3dCQUNiLGNBQWMsRUFBRSw0REFBSTt3QkFDcEIsUUFBUSxFQUFFLFVBQUMsUUFBUSxJQUFLLHVCQUFjLFFBQVEsUUFBSyxFQUEzQixDQUEyQjtxQkFDcEQsQ0FBQyxDQUFDO2lCQUNKO2FBQ0Y7WUFJRCxLQUFJLENBQUMsd0RBQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRO1lBQ2hDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztZQUNyQyxLQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWpFLENBQUM7SUFFRCw4QkFBVyxHQUFYLFVBQVksUUFBZ0I7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVE7SUFDNUIsQ0FBQztJQUVELDZCQUFVLEdBQVYsVUFBVyxPQUFtQztRQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTztJQUMxQixDQUFDO0lBRUQseUJBQU0sR0FBTjtRQUVFLE9BQU8sK0VBQUssS0FBSyxFQUFDLFVBQVUsSUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFHO1lBQ3JCLElBQU0sTUFBTSxHQUFHLDBCQUF3QixHQUFHLENBQUMsR0FBRyxNQUFHO1lBQ2pELE9BQU8sK0VBQUssS0FBSyxFQUFDLGdCQUFnQixFQUFDLEtBQUssRUFBRSxNQUFNLEdBQVE7UUFDMUQsQ0FBQyxDQUFDLENBQ0U7SUFDUixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQ0ExSnFDLCtEQUFhLEdBMEpsRDs7S0FuSkcsU0FBUyxPQUNULFVBQVUsT0FDVixRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCWjs7R0FFRztBQUVJLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUUvQixTQUFTLGFBQWEsQ0FBQyxJQUEwQyxFQUFFLFNBQWtDO0lBQUUsa0JBQXVGO1NBQXZGLFVBQXVGLEVBQXZGLHFCQUF1RixFQUF2RixJQUF1RjtRQUF2RixpQ0FBdUY7O0lBQ25NLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxPQUFPLElBQUk7S0FDWjtJQUNELElBQUksT0FBa0M7SUFDdEMsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDNUIsT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQztLQUNuQztTQUFNO1FBQ0wsT0FBTyxHQUFHLGVBQWUsQ0FBOEIsSUFBSSxDQUFDO0tBQzdEO0lBRUQsS0FBSyxJQUFJLElBQUksSUFBSSxTQUFTLEVBQUU7UUFDMUIsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVDO0lBRUQsSUFBTSxXQUFXLEdBQUcsVUFBQyxRQUEwQztRQUM3RCxLQUFrQixVQUFRLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVEsRUFBRTtZQUF2QixJQUFJLEtBQUs7WUFDWixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtnQkFDN0IsS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQzthQUMvQjtZQUNELE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNoQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzdCO1NBQU07UUFDTCxXQUFXLENBQW1DLFFBQVEsQ0FBQztLQUN4RDtJQUVELE9BQU8sT0FBTztBQUNoQixDQUFDO0FBRU0sSUFBTSxLQUFLLEdBQUc7SUFDbkIsYUFBYTtDQUNkO0FBRUQ7SUFJRSx3QkFBWSxJQUFhO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEtBQUs7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQzNCLENBQUM7SUFFRCxxQ0FBWSxHQUFaLFVBQWEsSUFBWSxFQUFFLEtBQWE7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztJQUNyQyxDQUFDO0lBRUQsZ0NBQU8sR0FBUCxVQUFRLE1BQW1CO1FBQ3pCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMvQixDQUFDO0lBQ0Qsb0NBQVcsR0FBWCxVQUFZLEtBQWdDO1FBQzFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMxQixDQUFDO0lBQ0QsK0JBQU0sR0FBTjtRQUNFLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzFDLENBQUM7SUFFSCxxQkFBQztBQUFELENBQUM7O0FBRUQ7SUFJRSxxQkFBWSxPQUFnQjtRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUMzQixDQUFDO0lBRUQsa0NBQVksR0FBWixVQUFhLElBQVksRUFBRSxLQUFhO0lBQ3hDLENBQUM7SUFFRCw2QkFBTyxHQUFQLFVBQVEsTUFBbUI7UUFDekIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQy9CLENBQUM7SUFDRCxpQ0FBVyxHQUFYLFVBQVksS0FBZ0M7UUFDMUMsMEJBQTBCO0lBQzVCLENBQUM7SUFDRCw0QkFBTSxHQUFOO1FBQ0UsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDOUMsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLGNBQTJDLEVBQUUsSUFBYTtJQUNqRixPQUFPLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRDtJQU1FO1FBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRUQsK0JBQU8sR0FBUCxVQUFRLE1BQW1CO1FBQTNCLGlCQVlDO1FBWEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FDMUI7UUFDRCxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3pCLFVBQVUsQ0FBQzs7Z0JBQ1QsV0FBSSxDQUFDLFVBQVUsK0NBQWYsS0FBSSxDQUFlO1lBQ3JCLENBQUMsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLENBQUMsV0FBVyxDQUFjLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBRUQsa0NBQVUsR0FBVjtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUM7SUFDNUMsQ0FBQztJQUVELG9DQUFZLEdBQVosVUFBYSxJQUFZLEVBQUUsS0FBVTtRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixPQUFNO1NBQ1A7UUFDRCxJQUFNLFVBQVUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDeEI7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUs7SUFDaEMsQ0FBQztJQUVELG9DQUFZLEdBQVosVUFBYSxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLE9BQU07U0FDUDtRQUNELElBQU0sVUFBVSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQ25DLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDakI7UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDL0IsQ0FBQztJQUVELG9DQUFZLEdBQVosVUFBYSxJQUFJLEVBQUUsSUFBSTtRQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTTtTQUNQO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZHLENBQUM7SUFFRCxnQ0FBUSxHQUFSLFVBQVMsS0FBYSxFQUFFLEtBQVU7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUs7SUFDN0IsQ0FBQztJQUVELG1DQUFXLEdBQVgsVUFBWSxLQUFnQztJQUU1QyxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDdEMsQ0FBQztJQUVILG9CQUFDO0FBQUQsQ0FBQzs7QUFHRCxTQUFTLFdBQVcsQ0FBQyxHQUE0QztJQUMvRCxPQUFtQyxHQUFJLENBQUMsT0FBTyxLQUFLLFNBQVM7QUFDL0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdElELElBQU0sU0FBUyxHQUFHLFFBQVE7QUFDMUIsSUFBTSxTQUFTLEdBQUcsUUFBUTtBQUkxQjtJQU9FLGtCQUFZLE9BQW9CLEVBQUUsVUFBc0I7UUFDdEQsSUFBSSxDQUFDLENBQUMsT0FBTyxZQUFZLFdBQVcsQ0FBQyxFQUFFO1lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUM7U0FDL0M7UUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQztTQUM3RDtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVU7UUFDNUIsSUFBSSxDQUFDLElBQUksRUFBRTtJQUNiLENBQUM7SUFFRCx1QkFBSSxHQUFKO1FBQUEsaUJBeUZDO1FBdkZDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVO1FBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPO1FBRTVCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsVUFBQyxLQUFLO1lBQzVDLEtBQUssQ0FBQyxlQUFlLEVBQUU7UUFDekIsQ0FBQyxFQUFFO1lBQ0QsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7UUFFRixJQUFJLGdCQUFnQixHQUFHLEtBQUs7UUFDNUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQTJCO1FBRWpELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBQyxLQUFLOztZQUUxQyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNuQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxDQUFDO1lBRXRELGlCQUFJLENBQUMsVUFBVSwwQ0FBRSxLQUFLLG1EQUFHLEtBQUssRUFBRSxPQUFPLENBQUM7WUFDeEMsSUFBTSxJQUFJLEdBQUcsVUFBQyxLQUFpQjs7Z0JBQzdCLElBQUksTUFBTSxHQUFHLENBQUM7Z0JBQ1osT0FBTSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtvQkFDN0IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRTt3QkFDMUIsZ0RBQWdEO3dCQUNoRCxJQUFJLEdBQUc7d0JBQ1AsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFOzRCQUNoQixHQUFHLEdBQUcsQ0FBQzt5QkFDUjs2QkFBTSxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ3ZCLEdBQUcsR0FBRyxDQUFDO3lCQUNSOzZCQUFNOzRCQUNMLEdBQUcsR0FBRyxNQUFNO3lCQUNiO3dCQUNELElBQUksU0FBTyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQzt3QkFDM0MsaUJBQUksQ0FBQyxVQUFVLDBDQUFFLElBQUksbURBQUcsS0FBSyxFQUFFLFNBQU8sQ0FBQztxQkFDeEM7b0JBQ0QsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDO2lCQUNyQjtZQUNMLENBQUM7WUFDRCxJQUFNLEVBQUUsR0FBRyxVQUFDLEtBQWlCOztnQkFDM0IsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMzRCxnQkFBVSxDQUFDLEdBQUcsK0NBQWQsVUFBVSxFQUFPLEtBQUssRUFBRSxPQUFPLENBQUM7Z0JBQ2hDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRTtvQkFDdkIsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUM7b0JBQy9DLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO29CQUMzQyxnQkFBZ0IsR0FBRyxLQUFLO2lCQUN6QjtZQUNILENBQUM7WUFDRCxJQUFJLGdCQUFnQixJQUFJLEtBQUssRUFBRTtnQkFDN0IsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUM7Z0JBQzVDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO2dCQUN4QyxnQkFBZ0IsR0FBRyxJQUFJO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsVUFBQyxLQUFLOztZQUNoRCxLQUFvQixVQUFnQyxFQUFoQyxVQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBaEMsY0FBZ0MsRUFBaEMsSUFBZ0MsRUFBRTtnQkFBakQsSUFBTSxLQUFLO2dCQUNkLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNqQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztnQkFDbkQsZ0JBQVUsQ0FBQyxLQUFLLCtDQUFoQixVQUFVLEVBQVMsS0FBSyxFQUFFLE9BQU8sQ0FBQzthQUNuQztRQUNILENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBSzs7WUFDL0MsS0FBb0IsVUFBZ0MsRUFBaEMsVUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQWhDLGNBQWdDLEVBQWhDLElBQWdDLEVBQUU7Z0JBQWpELElBQU0sS0FBSztnQkFDZCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO2dCQUMxRCxnQkFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLElBQUksK0NBQWhCLFVBQVUsRUFBUyxLQUFLLEVBQUUsT0FBTyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsVUFBQyxLQUFLOztZQUM5QyxLQUFvQixVQUFnQyxFQUFoQyxVQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBaEMsY0FBZ0MsRUFBaEMsSUFBZ0MsRUFBRTtnQkFBakQsSUFBTSxLQUFLO2dCQUNkLElBQU0sR0FBRyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVTtnQkFDeEMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ2pDLGdCQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsR0FBRywrQ0FBZixVQUFVLEVBQVEsS0FBSyxFQUFFLE9BQU8sQ0FBQztnQkFDakMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDckI7UUFDSCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxVQUFDLEtBQUs7O1lBQ2pELEtBQW9CLFVBQWdDLEVBQWhDLFVBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFoQyxjQUFnQyxFQUFoQyxJQUFnQyxFQUFFO2dCQUFqRCxJQUFNLEtBQUs7Z0JBQ2QsSUFBTSxHQUFHLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQyxVQUFVO2dCQUN4QyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDakMsaUJBQUksQ0FBQyxVQUFVLDBDQUFFLEdBQUcsbURBQUcsS0FBSyxFQUFFLE9BQU8sQ0FBQztnQkFDdEMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDckI7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUgsZUFBQztBQUFELENBQUM7O0FBUUQ7SUFPRSxvQkFBWSxVQUFzQjtRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVU7SUFDOUIsQ0FBQztJQUVELDBCQUFLLEdBQUwsVUFBTSxLQUFpQixFQUFFLE9BQXdCO1FBQWpELGlCQTJCQzs7UUExQkMsT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU87UUFFOUQsT0FBTyxDQUFDLE1BQU0sR0FBRztZQUNmO2dCQUNFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNiLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDaEIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPO2FBQ2pCO1NBQ0Y7UUFFRCxnQkFBSSxDQUFDLFVBQVUsMENBQUUsUUFBUSxtREFBRyxPQUFPLEVBQUU7WUFDbkMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDO1FBRUYsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJO1FBQ3BCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSztRQUNyQixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUs7UUFFdkIsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDOztZQUNsQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUs7WUFDckIsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLO1lBQ3JCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSTtZQUN0QixPQUFPLENBQUMsT0FBTyxHQUFHLElBQUk7WUFDdEIsaUJBQUksQ0FBQyxVQUFVLDBDQUFFLFFBQVEsbURBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQztRQUMxQyxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ1QsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxLQUFpQixFQUFFLE9BQXdCO1FBQzlDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTTtRQUM1RSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxXQUFFLEVBQUksQ0FBQyxJQUFHLFdBQUUsRUFBSSxDQUFDLElBQUcsR0FBRyxFQUFFO1lBQzdDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSztZQUNyQixPQUFPLENBQUMsS0FBSyxHQUFHLElBQUk7WUFDcEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLO1lBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFO29CQUNuQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07b0JBQ3RCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtvQkFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO29CQUN0QixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87b0JBQ3RCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtpQkFDL0IsQ0FBQztZQUNGLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtnQkFDOUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUN0QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN0QixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7YUFDL0IsQ0FBQztTQUNIO1FBRUQsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFLLElBQUksV0FBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUExQixDQUEwQixDQUFDO1FBRTNFLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNqQjtZQUNFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ2QsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ2pCLENBQ0Y7SUFDTCxDQUFDO0lBRUQsd0JBQUcsR0FBSCxVQUFJLEtBQWlCLEVBQUUsT0FBd0I7O1FBQzdDLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNqQixZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUM3QixnQkFBSSxDQUFDLFVBQVUsMENBQUUsUUFBUSxtREFBRyxLQUFLLEVBQUUsRUFBRSxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ25CLGdCQUFJLENBQUMsVUFBVSwwQ0FBRSxRQUFRLG1EQUFHLFVBQVUsRUFBRSxFQUFFLENBQUM7U0FDNUM7UUFDRCxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQUssSUFBSSxXQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQTFCLENBQTBCLENBQUM7UUFDM0UsSUFBSSxDQUFTO1FBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzFCLENBQUMsR0FBRyxDQUFDO1NBQ047YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUksQ0FBQztnQkFDdEQsVUFBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUksQ0FBQyxFQUFDO1lBQ2pELENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDWCxnQkFBSSxDQUFDLFVBQVUsMENBQUUsUUFBUSxtREFBRyxPQUFPLEVBQUU7Z0JBQ25DLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtnQkFDdEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUN0QixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO2dCQUM5QixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87Z0JBQ3hCLFFBQVEsRUFBRSxDQUFDO2FBQ1osQ0FBQztZQUNGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSTtTQUN2QjthQUFNO1lBQ0wsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2pCLGdCQUFJLENBQUMsVUFBVSwwQ0FBRSxRQUFRLG1EQUFHLFFBQVEsRUFBRTtnQkFDcEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUN0QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN0QixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7Z0JBQzlCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTzthQUN6QixDQUFDO1NBQ0g7UUFFRCxnQkFBSSxDQUFDLFVBQVUsMENBQUUsUUFBUSxtREFBRyxLQUFLLEVBQUU7WUFDakMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1lBQ3RCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtZQUN0QixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtZQUM5QixRQUFRLEVBQUUsQ0FBQztZQUNYLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztTQUN6QixDQUFDO0lBQ0osQ0FBQztJQUVELDJCQUFNLEdBQU4sVUFBTyxLQUFpQixFQUFFLE9BQXdCO1FBQ2hELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDdEMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDL0IsQ0FBQztJQUVILGlCQUFDO0FBQUQsQ0FBQzs7QUFFRDtJQUlFLG9CQUFZLE9BQW9CO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTztJQUN4QixDQUFDO0lBRUQsNkJBQVEsR0FBUixVQUFTLElBQVksRUFBRSxVQUFnQjs7UUFDckMsSUFBTSxLQUFLLEdBQXFCLElBQUksV0FBVyxDQUFrQixJQUFJLENBQUM7UUFDdEUsS0FBSyxJQUFNLElBQUksSUFBSSxVQUFVLEVBQUU7WUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FDL0I7UUFDRCxVQUFJLENBQUMsT0FBTywwQ0FBRSxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ3BDLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUM7O0FBRU0sU0FBUyxhQUFhLENBQUMsT0FBb0I7SUFDaEQsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBQzs7Ozs7OztVQy9URDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBSUE7QUFFRSxNQUFNQSxPQUFPLEdBQUcsQ0FDZDtBQUNFQyxPQUFHLEVBQUU7QUFEUCxHQURjLEVBSWQ7QUFDRUEsT0FBRyxFQUFFO0FBRFAsR0FKYyxFQU9kO0FBQ0VBLE9BQUcsRUFBRTtBQURQLEdBUGMsRUFVZDtBQUNFQSxPQUFHLEVBQUU7QUFEUCxHQVZjLENBQWhCO0FBZUEsTUFBTUMsV0FBVyxHQUFHLHVFQUFDLDREQUFEO0FBQVUsWUFBUSxFQUFFLGtCQUFDQyxLQUFELEVBQVc7QUFDakRDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosRUFBdUJGLEtBQXZCO0FBQ0QsS0FGbUI7QUFFakIsWUFBUSxFQUFFLElBRk87QUFFRCxXQUFPLEVBQUVIO0FBRlIsSUFBcEI7QUFHQUUsYUFBVyxDQUFDSSxPQUFaLENBQW9CQyxRQUFRLENBQUNDLElBQTdCO0FBQ0QsQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEBEZXNjcmlwdGlvbjogXG4gKiBAQXV0aG9yOiB6aHVvLnBhblxuICogQERhdGU6IDIwMjEtMDQtMTEgMTk6Mjc6MDhcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjEtMDQtMTkgMDI6NDk6MzFcbiAqIEBMYXN0RWRpdG9yczogemh1by5wYW5cbiAqL1xuXG5jb25zdCBUSUNLID0gU3ltYm9sKFwidGlja1wiKVxuY29uc3QgVElDS19IQU5ETEVSID0gU3ltYm9sKFwidGl2ay1oYW5kbGVyXCIpXG5jb25zdCBBTklNQVRJT05TID0gU3ltYm9sKFwiYW5pbWF0aW9uc1wiKVxuY29uc3QgU1RBUlRfVElNRSA9IFN5bWJvbChcInN0YXJ0LXRpbWVcIilcbmNvbnN0IFBBVVNFX1NUQVJUID0gU3ltYm9sKFwicGF1c2Utc3RhcnRcIilcbmNvbnN0IFBBVVNFX1RJTUUgPSBTeW1ib2woXCJwYXVzZS10aW1lXCIpXG5jb25zdCBUSU1FX1BST0dSRVNTID0gU3ltYm9sKCd0aW1lLXByb2dyZXNzJylcblxuZW51bSBUaW1lbGluZVN0YXRlIHtcbiAgSW5pdGVkID0gMCxcbiAgU3RhcnRlZCA9IDEsXG4gIFBhdXNlZCA9IDJcbn1cbmV4cG9ydCBjbGFzcyBUaW1lbGluZSB7XG4gIHN0YXRlOiBUaW1lbGluZVN0YXRlXG4gIFtQQVVTRV9USU1FXTogbnVtYmVyICAgLy8g5Yqo55S75pqC5YGc5pe26Ze077yM5oGi5aSN55qE5pe25YCZ6ZyA6KaB5YeP5Y676L+Z5Liq5pe26Ze0XG4gIFtBTklNQVRJT05TXTogU2V0PEFuaW1hdGlvbj4gLy8g5o6n5Yi255qE5Yqo55S7XG4gIFtTVEFSVF9USU1FXTogTWFwPEFuaW1hdGlvbiwgbnVtYmVyPiAgLy8g5ZCE5Liq5Yqo55S755qE5byA5aeL5pe26Ze0XG4gIFtUSUNLX0hBTkRMRVJdOiBudW1iZXIgICAgLy8g5L+d5a2YVGlja+eahOWPpeafhFxuICBbVElDS106IEZyYW1lUmVxdWVzdENhbGxiYWNrXG4gIFtUSU1FX1BST0dSRVNTXTogbnVtYmVyICAgIC8vIOWKqOeUu+eahOaXtumXtOi/m+W6plxuXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IFRpbWVsaW5lU3RhdGUuSW5pdGVkXG4gICAgdGhpc1tBTklNQVRJT05TXSA9IG5ldyBTZXQoKVxuICAgIHRoaXNbU1RBUlRfVElNRV0gPSBuZXcgTWFwPEFuaW1hdGlvbiwgbnVtYmVyPigpXG4gICAgdGhpc1tUSU1FX1BST0dSRVNTXSA9IDBcbiAgfVxuXG4gIGdldFByb2dyZXNzKCkge1xuICAgIHJldHVybiB0aGlzW1RJTUVfUFJPR1JFU1NdXG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZSAhPT0gVGltZWxpbmVTdGF0ZS5Jbml0ZWQpXG4gICAgICByZXR1cm5cbiAgICB0aGlzLnN0YXRlID0gVGltZWxpbmVTdGF0ZS5TdGFydGVkXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXNbUEFVU0VfVElNRV0gPSAwXG4gICAgdGhpc1tUSUNLXSA9ICgpID0+IHtcbiAgICAgIHRoaXNbVElNRV9QUk9HUkVTU10gPSBEYXRlLm5vdygpIC0gc3RhcnRUaW1lIC0gdGhpc1tQQVVTRV9USU1FXSAgLy8g5pe26Ze06L+b5bqmXG4gICAgICB0aGlzW0FOSU1BVElPTlNdPy5mb3JFYWNoKGFuaW1hdGlvbiA9PiB7XG4gICAgICAgIGxldCB0OiBudW1iZXIgPSB0aGlzW1RJTUVfUFJPR1JFU1NdIC0gdGhpc1tTVEFSVF9USU1FXS5nZXQoYW5pbWF0aW9uKSAtIGFuaW1hdGlvbi5kZWxheSAgXG4gICAgICAgIGlmIChhbmltYXRpb24uZHVyYXRpb24gPCB0KSB7XG4gICAgICAgICAgaWYgKChhbmltYXRpb24ucmVwZWF0ID09PSAwKSB8fFxuICAgICAgICAgICh0IC8gYW5pbWF0aW9uLmR1cmF0aW9uID4gYW5pbWF0aW9uLnJlcGVhdCArIDEpKSB7IC8vIOW+queOr+e7k+adn1xuICAgICAgICAgICAgdGhpc1tBTklNQVRJT05TXS5kZWxldGUoYW5pbWF0aW9uKVxuICAgICAgICAgICAgdCA9IGFuaW1hdGlvbi5kdXJhdGlvblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDmsLjkuYXlvqrnjq9cbiAgICAgICAgICAgIHQgPSB0ICUgYW5pbWF0aW9uLmR1cmF0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIOiAg+iZkWRlbGF55Zug57Sg77yM5aSn5LqOMOaJjeWHuuWPkVxuICAgICAgICBpZiAodCA+IDApIHtcbiAgICAgICAgICBhbmltYXRpb24ucmVjZWl2ZSh0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgXG4gICAgICB0aGlzW1RJQ0tfSEFORExFUl0gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpc1tUSUNLXSlcbiAgICB9XG4gICAgdGhpc1tUSUNLXSgwKVxuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgIT09IFRpbWVsaW5lU3RhdGUuU3RhcnRlZClcbiAgICAgIHJldHVyblxuICAgIHRoaXMuc3RhdGUgPSBUaW1lbGluZVN0YXRlLlBhdXNlZFxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXNbVElDS19IQU5ETEVSXSlcbiAgICB0aGlzW1BBVVNFX1NUQVJUXSA9IERhdGUubm93KCkgLy/orrDlvZXmmoLlgZzlvIDlp4vnmoTml7bpl7RcbiAgICAvLyB0aGlzW1BBVVNFX1RJTUVdID0gdGhpc1tUSU1FX1BST0dSRVNTXVxuICB9XG4gIHJlc3VtZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZSAhPT0gVGltZWxpbmVTdGF0ZS5QYXVzZWQpXG4gICAgICByZXR1cm5cbiAgICB0aGlzLnN0YXRlID0gVGltZWxpbmVTdGF0ZS5TdGFydGVkXG4gICAgdGhpc1tQQVVTRV9USU1FXSArPSBEYXRlLm5vdygpIC0gdGhpc1tQQVVTRV9TVEFSVF1cbiAgICB0aGlzW1RJQ0tdKDApXG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wYXVzZSgpXG4gICAgdGhpcy5zdGF0ZSA9IFRpbWVsaW5lU3RhdGUuSW5pdGVkXG4gICAgdGhpc1tQQVVTRV9USU1FXSA9IDBcbiAgICB0aGlzW0FOSU1BVElPTlNdID0gbmV3IFNldCgpXG4gICAgdGhpc1tTVEFSVF9USU1FXSA9IG5ldyBNYXAoKVxuICAgIHRoaXNbUEFVU0VfU1RBUlRdID0gMFxuICAgIHRoaXNbVElDS19IQU5ETEVSXSA9IG51bGxcbiAgICB0aGlzW1RJTUVfUFJPR1JFU1NdID0gMFxuICB9XG4gIGFkZChhbmltYXRpb246IEFuaW1hdGlvbiwgc3RhcnRUaW1lPzogbnVtYmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAvL+aXtumXtOWwkeS6jjLnmoTml7blgJnmt7vliqDpu5jorqTlgLxcbiAgICAgIHN0YXJ0VGltZSA9IHRoaXNbVElNRV9QUk9HUkVTU11cbiAgICB9XG4gICAgdGhpc1tBTklNQVRJT05TXS5hZGQoYW5pbWF0aW9uKVxuICAgIHRoaXNbU1RBUlRfVElNRV0uc2V0KGFuaW1hdGlvbiwgc3RhcnRUaW1lKVxuICB9XG59XG5cblxudHlwZSBBbmltYXRpb25PcHRpb25zID0ge1xuICBvYmplY3QsXG4gIHByb3BlcnR5OiBzdHJpbmcgfCBzeW1ib2wgfCBudW1iZXIsXG4gIHN0YXJ0VmFsdWU6IG51bWJlcixcbiAgZW5kVmFsdWU6IG51bWJlciwgXG4gIGR1cmF0aW9uOiBudW1iZXIsIFxuICBkZWxheT86IG51bWJlcixcbiAgcmVwZWF0PzogbnVtYmVyIHwgYm9vbGVhblxuICB0aW1pbmdGdW5jdGlvbjogKHRpbWVQcm9ncmVzczogbnVtYmVyKSA9PiBudW1iZXIsIFxuICB0ZW1wbGF0ZTogKHByb2dyZXNzOiBudW1iZXIpID0+IGFueVxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlQW5pbWF0aW9uT3B0aW9ucyA9IChvYmplY3Q6IGFueSxcbiAgcHJvcGVydHk6IHN0cmluZyB8IG51bWJlciB8IHN5bWJvbCxcbiAgc3RhcnRWYWx1ZTogbnVtYmVyLCBlbmRWYWx1ZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyLCBkZWxheTogbnVtYmVyLCByZXBlYXQ6IG51bWJlciB8IGJvb2xlYW4sIHRpbWluZ0Z1bmN0aW9uLCB0ZW1wbGF0ZSkgPT4gKHtcbiAgb2JqZWN0LFxuICBwcm9wZXJ0eSxcbiAgcmVwZWF0LFxuICBzdGFydFZhbHVlLCBlbmRWYWx1ZSwgZHVyYXRpb24sIGRlbGF5LCB0aW1pbmdGdW5jdGlvbiwgdGVtcGxhdGVcbn0pXG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb24ge1xuICBvYmplY3Q6IGFueVxuICBwcm9wZXJ0eTogc3RyaW5nIHwgc3ltYm9sIHwgbnVtYmVyXG4gIHN0YXJ0VmFsdWU6IG51bWJlclxuICBlbmRWYWx1ZTogbnVtYmVyXG4gIGR1cmF0aW9uOiBudW1iZXJcbiAgZGVsYXk6IG51bWJlclxuICByZXBlYXQ6IG51bWJlclxuICB0aW1pbmdGdW5jdGlvbjogKHRpbWVQcm9ncmVzczogbnVtYmVyKSA9PiBudW1iZXJcbiAgdGVtcGxhdGU6IChwcm9ncmVzczogbnVtYmVyKSA9PiBhbnlcbiAgY29uc3RydWN0b3Ioe1xuICAgIG9iamVjdCxcbiAgICBwcm9wZXJ0eSxcbiAgICByZXBlYXQgPSAwLFxuICAgIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBcbiAgICBkdXJhdGlvbiA9IDI1MCxcbiAgICBkZWxheSA9IDAsIFxuICAgIHRpbWluZ0Z1bmN0aW9uLCBcbiAgICB0ZW1wbGF0ZVxuICB9OiBBbmltYXRpb25PcHRpb25zKSB7XG4gICAgdGltaW5nRnVuY3Rpb24gPSB0aW1pbmdGdW5jdGlvbiB8fCAodiA9PiB2KVxuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgfHwgKHYgPT4gdilcbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdFxuICAgIHRoaXMucHJvcGVydHkgPSBwcm9wZXJ0eVxuICAgIHRoaXMuc3RhcnRWYWx1ZSA9IHN0YXJ0VmFsdWVcbiAgICB0aGlzLmVuZFZhbHVlID0gZW5kVmFsdWVcbiAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb25cbiAgICB0aGlzLmRlbGF5ID0gZGVsYXlcbiAgICBpZiAocmVwZWF0ID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnJlcGVhdCA9IC0xXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVwZWF0ID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXBlYXQgPSAwXG4gICAgfVxuICAgIHRoaXMudGltaW5nRnVuY3Rpb24gPSB0aW1pbmdGdW5jdGlvblxuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICB9XG4gIHJlY2VpdmUodGltZSkge1xuICAgIHRpbWUgPSArdGltZVxuICAgIGNvbnN0IHJhZ2UgPSB0aGlzLmVuZFZhbHVlIC0gdGhpcy5zdGFydFZhbHVlXG4gICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLnRpbWluZ0Z1bmN0aW9uKHRpbWUgLyB0aGlzLmR1cmF0aW9uKVxuICAgIHRoaXMub2JqZWN0W3RoaXMucHJvcGVydHldID0gdGhpcy50ZW1wbGF0ZSh0aGlzLnN0YXJ0VmFsdWUgKyByYWdlICogcHJvZ3Jlc3MpXG4gIH1cbn0iLCJleHBvcnQgY29uc3QgbGluZWFyID0gKHY6IG51bWJlcikgPT4gK3Y7XG5cbmV4cG9ydCBmdW5jdGlvbiBjdWJpY0JlemllcihwMXg6IG51bWJlciwgcDF5OiBudW1iZXIsIHAyeDogbnVtYmVyLCBwMnk6IG51bWJlcikge1xuICBwMXggPSArcDF4XG4gIHAxeSA9ICtwMXlcbiAgcDJ4ID0gK3AyeFxuICBwMnkgPSArcDJ5XG4gIGNvbnN0IFpFUk9fTElNSVQgPSAxZS02XG4gIC8vIENhbGN1bGF0ZSB0aGUgcG9seW5vbWlhbCBjb2VmZmljaWVudHMsXG4gIC8vIGltcGxpY2l0IGZpcnN0IGFuZCBsYXN0IGNvbnRyb2wgcG9pbnRzIGFyZSAoMCwgMCkgYW5kICgxLCAxKS5cbiAgY29uc3QgYXggPSAzICogcDF4IC0gMyAqIHAyeCArIDFcbiAgY29uc3QgYnggPSAzICogcDJ4IC0gNiAqIHAxeFxuICBjb25zdCBjeCA9IDMgKiBwMXhcblxuICBjb25zdCBheSA9IDMgKiBwMXkgLSAzICogcDJ5ICsgMVxuICBjb25zdCBieSA9IDMgKiBwMnkgLSA2ICogcDF5XG4gIGNvbnN0IGN5ID0gMyAqIHAxeVxuXG4gIGZ1bmN0aW9uIHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodCkge1xuICAgIHQgPSArdFxuICAgIHJldHVybiArKCgzICogYXggKiB0ICsgMiAqIGJ4KSAqIHQgKyBjeClcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhbXBsZUN1cnZlWCh0KSB7XG4gICAgdCA9ICt0XG4gICAgcmV0dXJuICsoKChheCAqIHQgKyBieCkgKiB0ICsgY3gpICogdClcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhbXBsZUN1cnZlWSh0OiBudW1iZXIpIHtcbiAgICB0ID0gK3RcbiAgICByZXR1cm4gKygoKGF5ICogdCArIGJ5KSAqIHQgKyBjeSkgKiB0KVxuICB9XG5cbiAgZnVuY3Rpb24gc29sdmVDdXJ2ZVgoeDogbnVtYmVyKSB7XG4gICAgbGV0IHQyID0gK3hcbiAgICBsZXQgeDI6IG51bWJlclxuXG4gICAgLy8gaHR0cHM6Ly90cmFjLndlYmtpdC5vcmcvYnJvd3Nlci90cnVuay9Tb3VyY2UvV2ViQ29yZS9wbGF0Zm9ybS9hbmltYXRpb25cbiAgICAvLyBGaXJzdCB0cnkgYSBmZXcgaXRlcmF0aW9ucyBvZiBOZXd0b24ncyBtZXRob2QgLS0gbm9ybWFsbHkgdmVyeSBmYXN0LlxuICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTmV3dG9uJ3NfbWV0aG9kXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgIHgyID0gc2FtcGxlQ3VydmVYKHQyKSAtIHhcbiAgICAgIGlmIChNYXRoLmFicyh4MikgPCBaRVJPX0xJTUlUKSB7XG4gICAgICAgIHJldHVybiArdDJcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRlcml2YXRpdmUgPSBzYW1wbGVDdXJ2ZURlcml2YXRpdmVYKHQyKVxuICAgICAgaWYgKE1hdGguYWJzKGRlcml2YXRpdmUpIDwgWkVST19MSU1JVCkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdDIgLT0geDIgLyBkZXJpdmF0aXZlXG4gICAgfVxuICAgIGxldCB0MSA9IDFcbiAgICBsZXQgdDAgPSAwXG4gICAgdDIgPSB4XG4gICAgd2hpbGUodDEgPiB0MCkge1xuICAgICAgeDIgPSBzYW1wbGVDdXJ2ZVgodDIpIC0geFxuICAgICAgaWYgKE1hdGguYWJzKHgyKSA8IFpFUk9fTElNSVQpIHtcbiAgICAgICAgcmV0dXJuICt0MlxuICAgICAgfVxuICAgICAgaWYgKHgyID4gMCkge1xuICAgICAgICB0MSA9IHQyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0MCA9IHQyXG4gICAgICB9XG4gICAgICB0MiA9ICh0MSArIHQwKSAvIDJcbiAgICB9XG4gICAgcmV0dXJuICt0MlxuICB9XG5cbiAgZnVuY3Rpb24gc29sdmUoeDogbnVtYmVyKSB7XG4gICAgeCA9ICt4XG4gICAgcmV0dXJuICtzYW1wbGVDdXJ2ZVkoc29sdmVDdXJ2ZVgoeCkpXG4gIH1cblxuICByZXR1cm4gc29sdmVcbn1cblxuLy8gaHR0cHM6Ly9jdWJpYy1iZXppZXIuY29tLyMuMjUsLjEsLjI1LDFcbmV4cG9ydCBjb25zdCBlYXNlID0gY3ViaWNCZXppZXIoLjI1LCAuMSwgLjI1LCAxKVxuZXhwb3J0IGNvbnN0IGVhc2VJbiA9IGN1YmljQmV6aWVyKC40MiwgMCwgMSwgMSlcbmV4cG9ydCBjb25zdCBlYXNlT3V0ID0gY3ViaWNCZXppZXIoMCwgMCwgLjU4LCAxKVxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dCA9IGN1YmljQmV6aWVyKC40MiwgMCwgLjU4LCAxKVxuXG4vKlxuI2luY2x1ZGUgXCJ1aS9nZngvZ2VvbWV0cnkvY3ViaWNfYmV6aWVyLmhcIlxuXG4jaW5jbHVkZSA8YWxnb3JpdGhtPlxuI2luY2x1ZGUgPGNtYXRoPlxuXG4jaW5jbHVkZSBcImJhc2UvY2hlY2tfb3AuaFwiXG4jaW5jbHVkZSBcImJhc2UvbnVtZXJpY3MvcmFuZ2VzLmhcIlxuXG5uYW1lc3BhY2UgZ2Z4IHtcblxubmFtZXNwYWNlIHtcblxuY29uc3QgaW50IGtNYXhOZXd0b25JdGVyYXRpb25zID0gNDtcblxufSAgLy8gbmFtZXNwYWNlXG5cbnN0YXRpYyBjb25zdCBkb3VibGUga0JlemllckVwc2lsb24gPSAxZS03O1xuXG5DdWJpY0Jlemllcjo6Q3ViaWNCZXppZXIoZG91YmxlIHAxeCwgZG91YmxlIHAxeSwgZG91YmxlIHAyeCwgZG91YmxlIHAyeSkge1xuICBJbml0Q29lZmZpY2llbnRzKHAxeCwgcDF5LCBwMngsIHAyeSk7XG4gIEluaXRHcmFkaWVudHMocDF4LCBwMXksIHAyeCwgcDJ5KTtcbiAgSW5pdFJhbmdlKHAxeSwgcDJ5KTtcbiAgSW5pdFNwbGluZSgpO1xufVxuXG5DdWJpY0Jlemllcjo6Q3ViaWNCZXppZXIoY29uc3QgQ3ViaWNCZXppZXImIG90aGVyKSA9IGRlZmF1bHQ7XG5cbnZvaWQgQ3ViaWNCZXppZXI6OkluaXRDb2VmZmljaWVudHMoZG91YmxlIHAxeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG91YmxlIHAxeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG91YmxlIHAyeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG91YmxlIHAyeSkge1xuICAvLyBDYWxjdWxhdGUgdGhlIHBvbHlub21pYWwgY29lZmZpY2llbnRzLCBpbXBsaWNpdCBmaXJzdCBhbmQgbGFzdCBjb250cm9sXG4gIC8vIHBvaW50cyBhcmUgKDAsMCkgYW5kICgxLDEpLlxuICBjeF8gPSAzLjAgKiBwMXg7XG4gIGJ4XyA9IDMuMCAqIChwMnggLSBwMXgpIC0gY3hfO1xuICBheF8gPSAxLjAgLSBjeF8gLSBieF87XG5cbiAgY3lfID0gMy4wICogcDF5O1xuICBieV8gPSAzLjAgKiAocDJ5IC0gcDF5KSAtIGN5XztcbiAgYXlfID0gMS4wIC0gY3lfIC0gYnlfO1xuXG4jaWZuZGVmIE5ERUJVR1xuICAvLyBCZXppZXIgY3VydmVzIHdpdGggeC1jb29yZGluYXRlcyBvdXRzaWRlIHRoZSByYW5nZSBbMCwxXSBmb3IgaW50ZXJuYWxcbiAgLy8gY29udHJvbCBwb2ludHMgbWF5IGhhdmUgbXVsdGlwbGUgdmFsdWVzIGZvciB0IGZvciBhIGdpdmVuIHZhbHVlIG9mIHguXG4gIC8vIEluIHRoaXMgY2FzZSwgY2FsbHMgdG8gU29sdmVDdXJ2ZVggbWF5IHByb2R1Y2UgYW1iaWd1b3VzIHJlc3VsdHMuXG4gIG1vbm90b25pY2FsbHlfaW5jcmVhc2luZ18gPSBwMXggPj0gMCAmJiBwMXggPD0gMSAmJiBwMnggPj0gMCAmJiBwMnggPD0gMTtcbiNlbmRpZlxufVxuXG52b2lkIEN1YmljQmV6aWVyOjpJbml0R3JhZGllbnRzKGRvdWJsZSBwMXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdWJsZSBwMXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdWJsZSBwMngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdWJsZSBwMnkpIHtcbiAgLy8gRW5kLXBvaW50IGdyYWRpZW50cyBhcmUgdXNlZCB0byBjYWxjdWxhdGUgdGltaW5nIGZ1bmN0aW9uIHJlc3VsdHNcbiAgLy8gb3V0c2lkZSB0aGUgcmFuZ2UgWzAsIDFdLlxuICAvL1xuICAvLyBUaGVyZSBhcmUgZm91ciBwb3NzaWJpbGl0aWVzIGZvciB0aGUgZ3JhZGllbnQgYXQgZWFjaCBlbmQ6XG4gIC8vICgxKSB0aGUgY2xvc2VzdCBjb250cm9sIHBvaW50IGlzIG5vdCBob3Jpem9udGFsbHkgY29pbmNpZGVudCB3aXRoIHJlZ2FyZCB0b1xuICAvLyAgICAgKDAsIDApIG9yICgxLCAxKS4gSW4gdGhpcyBjYXNlIHRoZSBsaW5lIGJldHdlZW4gdGhlIGVuZCBwb2ludCBhbmRcbiAgLy8gICAgIHRoZSBjb250cm9sIHBvaW50IGlzIHRhbmdlbnQgdG8gdGhlIGJlemllciBhdCB0aGUgZW5kIHBvaW50LlxuICAvLyAoMikgdGhlIGNsb3Nlc3QgY29udHJvbCBwb2ludCBpcyBjb2luY2lkZW50IHdpdGggdGhlIGVuZCBwb2ludC4gSW5cbiAgLy8gICAgIHRoaXMgY2FzZSB0aGUgbGluZSBiZXR3ZWVuIHRoZSBlbmQgcG9pbnQgYW5kIHRoZSBmYXIgY29udHJvbFxuICAvLyAgICAgcG9pbnQgaXMgdGFuZ2VudCB0byB0aGUgYmV6aWVyIGF0IHRoZSBlbmQgcG9pbnQuXG4gIC8vICgzKSBib3RoIGludGVybmFsIGNvbnRyb2wgcG9pbnRzIGFyZSBjb2luY2lkZW50IHdpdGggYW4gZW5kcG9pbnQuIFRoZXJlXG4gIC8vICAgICBhcmUgdHdvIHNwZWNpYWwgY2FzZSB0aGF0IGZhbGwgaW50byB0aGlzIGNhdGVnb3J5OlxuICAvLyAgICAgQ3ViaWNCZXppZXIoMCwgMCwgMCwgMCkgYW5kIEN1YmljQmV6aWVyKDEsIDEsIDEsIDEpLiBCb3RoIGFyZVxuICAvLyAgICAgZXF1aXZhbGVudCB0byBsaW5lYXIuXG4gIC8vICg0KSB0aGUgY2xvc2VzdCBjb250cm9sIHBvaW50IGlzIGhvcml6b250YWxseSBjb2luY2lkZW50IHdpdGggdGhlIGVuZFxuICAvLyAgICAgcG9pbnQsIGJ1dCB2ZXJ0aWNhbGx5IGRpc3RpbmN0LiBJbiB0aGlzIGNhc2UgdGhlIGdyYWRpZW50IGF0IHRoZVxuICAvLyAgICAgZW5kIHBvaW50IGlzIEluZmluaXRlLiBIb3dldmVyLCB0aGlzIGNhdXNlcyBpc3N1ZXMgd2hlblxuICAvLyAgICAgaW50ZXJwb2xhdGluZy4gQXMgYSByZXN1bHQsIHdlIGJyZWFrIGRvd24gdG8gYSBzaW1wbGUgY2FzZSBvZlxuICAvLyAgICAgMCBncmFkaWVudCB1bmRlciB0aGVzZSBjb25kaXRpb25zLlxuXG4gIGlmIChwMXggPiAwKVxuICAgIHN0YXJ0X2dyYWRpZW50XyA9IHAxeSAvIHAxeDtcbiAgZWxzZSBpZiAoIXAxeSAmJiBwMnggPiAwKVxuICAgIHN0YXJ0X2dyYWRpZW50XyA9IHAyeSAvIHAyeDtcbiAgZWxzZSBpZiAoIXAxeSAmJiAhcDJ5KVxuICAgIHN0YXJ0X2dyYWRpZW50XyA9IDE7XG4gIGVsc2VcbiAgICBzdGFydF9ncmFkaWVudF8gPSAwO1xuXG4gIGlmIChwMnggPCAxKVxuICAgIGVuZF9ncmFkaWVudF8gPSAocDJ5IC0gMSkgLyAocDJ4IC0gMSk7XG4gIGVsc2UgaWYgKHAyeSA9PSAxICYmIHAxeCA8IDEpXG4gICAgZW5kX2dyYWRpZW50XyA9IChwMXkgLSAxKSAvIChwMXggLSAxKTtcbiAgZWxzZSBpZiAocDJ5ID09IDEgJiYgcDF5ID09IDEpXG4gICAgZW5kX2dyYWRpZW50XyA9IDE7XG4gIGVsc2VcbiAgICBlbmRfZ3JhZGllbnRfID0gMDtcbn1cblxuLy8gVGhpcyB3b3JrcyBieSB0YWtpbmcgdGFraW5nIHRoZSBkZXJpdmF0aXZlIG9mIHRoZSBjdWJpYyBiZXppZXIsIG9uIHRoZSB5XG4vLyBheGlzLiBXZSBjYW4gdGhlbiBzb2x2ZSBmb3Igd2hlcmUgdGhlIGRlcml2YXRpdmUgaXMgemVybyB0byBmaW5kIHRoZSBtaW5cbi8vIGFuZCBtYXggZGlzdGFuY2UgYWxvbmcgdGhlIGxpbmUuIFdlIHRoZSBoYXZlIHRvIHNvbHZlIHRob3NlIGluIHRlcm1zIG9mIHRpbWVcbi8vIHJhdGhlciB0aGFuIGRpc3RhbmNlIG9uIHRoZSB4LWF4aXNcbnZvaWQgQ3ViaWNCZXppZXI6OkluaXRSYW5nZShkb3VibGUgcDF5LCBkb3VibGUgcDJ5KSB7XG4gIHJhbmdlX21pbl8gPSAwO1xuICByYW5nZV9tYXhfID0gMTtcbiAgaWYgKDAgPD0gcDF5ICYmIHAxeSA8IDEgJiYgMCA8PSBwMnkgJiYgcDJ5IDw9IDEpXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IGRvdWJsZSBlcHNpbG9uID0ga0JlemllckVwc2lsb247XG5cbiAgLy8gUmVwcmVzZW50IHRoZSBmdW5jdGlvbidzIGRlcml2YXRpdmUgaW4gdGhlIGZvcm0gYXReMiArIGJ0ICsgY1xuICAvLyBhcyBpbiBzYW1wbGVDdXJ2ZURlcml2YXRpdmVZLlxuICAvLyAoVGVjaG5pY2FsbHkgdGhpcyBpcyAoZHkvZHQpKigxLzMpLCB3aGljaCBpcyBzdWl0YWJsZSBmb3IgZmluZGluZyB6ZXJvc1xuICAvLyBidXQgZG9lcyBub3QgYWN0dWFsbHkgZ2l2ZSB0aGUgc2xvcGUgb2YgdGhlIGN1cnZlLilcbiAgY29uc3QgZG91YmxlIGEgPSAzLjAgKiBheV87XG4gIGNvbnN0IGRvdWJsZSBiID0gMi4wICogYnlfO1xuICBjb25zdCBkb3VibGUgYyA9IGN5XztcblxuICAvLyBDaGVjayBpZiB0aGUgZGVyaXZhdGl2ZSBpcyBjb25zdGFudC5cbiAgaWYgKHN0ZDo6YWJzKGEpIDwgZXBzaWxvbiAmJiBzdGQ6OmFicyhiKSA8IGVwc2lsb24pXG4gICAgcmV0dXJuO1xuXG4gIC8vIFplcm9zIG9mIHRoZSBmdW5jdGlvbidzIGRlcml2YXRpdmUuXG4gIGRvdWJsZSB0MSA9IDA7XG4gIGRvdWJsZSB0MiA9IDA7XG5cbiAgaWYgKHN0ZDo6YWJzKGEpIDwgZXBzaWxvbikge1xuICAgIC8vIFRoZSBmdW5jdGlvbidzIGRlcml2YXRpdmUgaXMgbGluZWFyLlxuICAgIHQxID0gLWMgLyBiO1xuICB9IGVsc2Uge1xuICAgIC8vIFRoZSBmdW5jdGlvbidzIGRlcml2YXRpdmUgaXMgYSBxdWFkcmF0aWMuIFdlIGZpbmQgdGhlIHplcm9zIG9mIHRoaXNcbiAgICAvLyBxdWFkcmF0aWMgdXNpbmcgdGhlIHF1YWRyYXRpYyBmb3JtdWxhLlxuICAgIGRvdWJsZSBkaXNjcmltaW5hbnQgPSBiICogYiAtIDQgKiBhICogYztcbiAgICBpZiAoZGlzY3JpbWluYW50IDwgMClcbiAgICAgIHJldHVybjtcbiAgICBkb3VibGUgZGlzY3JpbWluYW50X3NxcnQgPSBzcXJ0KGRpc2NyaW1pbmFudCk7XG4gICAgdDEgPSAoLWIgKyBkaXNjcmltaW5hbnRfc3FydCkgLyAoMiAqIGEpO1xuICAgIHQyID0gKC1iIC0gZGlzY3JpbWluYW50X3NxcnQpIC8gKDIgKiBhKTtcbiAgfVxuXG4gIGRvdWJsZSBzb2wxID0gMDtcbiAgZG91YmxlIHNvbDIgPSAwO1xuXG4gIC8vIElmIHRoZSBzb2x1dGlvbiBpcyBpbiB0aGUgcmFuZ2UgWzAsMV0gdGhlbiB3ZSBpbmNsdWRlIGl0LCBvdGhlcndpc2Ugd2VcbiAgLy8gaWdub3JlIGl0LlxuXG4gIC8vIEFuIGludGVyZXN0aW5nIGZhY3QgYWJvdXQgdGhlc2UgYmV6aWVycyBpcyB0aGF0IHRoZXkgYXJlIG9ubHlcbiAgLy8gYWN0dWFsbHkgZXZhbHVhdGVkIGluIFswLDFdLiBBZnRlciB0aGF0IHdlIHRha2UgdGhlIHRhbmdlbnQgYXQgdGhhdCBwb2ludFxuICAvLyBhbmQgbGluZWFybHkgcHJvamVjdCBpdCBvdXQuXG4gIGlmICgwIDwgdDEgJiYgdDEgPCAxKVxuICAgIHNvbDEgPSBTYW1wbGVDdXJ2ZVkodDEpO1xuXG4gIGlmICgwIDwgdDIgJiYgdDIgPCAxKVxuICAgIHNvbDIgPSBTYW1wbGVDdXJ2ZVkodDIpO1xuXG4gIHJhbmdlX21pbl8gPSBzdGQ6Om1pbih7cmFuZ2VfbWluXywgc29sMSwgc29sMn0pO1xuICByYW5nZV9tYXhfID0gc3RkOjptYXgoe3JhbmdlX21heF8sIHNvbDEsIHNvbDJ9KTtcbn1cblxudm9pZCBDdWJpY0Jlemllcjo6SW5pdFNwbGluZSgpIHtcbiAgZG91YmxlIGRlbHRhX3QgPSAxLjAgLyAoQ1VCSUNfQkVaSUVSX1NQTElORV9TQU1QTEVTIC0gMSk7XG4gIGZvciAoaW50IGkgPSAwOyBpIDwgQ1VCSUNfQkVaSUVSX1NQTElORV9TQU1QTEVTOyBpKyspIHtcbiAgICBzcGxpbmVfc2FtcGxlc19baV0gPSBTYW1wbGVDdXJ2ZVgoaSAqIGRlbHRhX3QpO1xuICB9XG59XG5cbmRvdWJsZSBDdWJpY0Jlemllcjo6R2V0RGVmYXVsdEVwc2lsb24oKSB7XG4gIHJldHVybiBrQmV6aWVyRXBzaWxvbjtcbn1cblxuZG91YmxlIEN1YmljQmV6aWVyOjpTb2x2ZUN1cnZlWChkb3VibGUgeCwgZG91YmxlIGVwc2lsb24pIGNvbnN0IHtcbiAgRENIRUNLX0dFKHgsIDAuMCk7XG4gIERDSEVDS19MRSh4LCAxLjApO1xuXG4gIGRvdWJsZSB0MDtcbiAgZG91YmxlIHQxO1xuICBkb3VibGUgdDIgPSB4O1xuICBkb3VibGUgeDI7XG4gIGRvdWJsZSBkMjtcbiAgaW50IGk7XG5cbiNpZm5kZWYgTkRFQlVHXG4gIERDSEVDSyhtb25vdG9uaWNhbGx5X2luY3JlYXNpbmdfKTtcbiNlbmRpZlxuXG4gIC8vIExpbmVhciBpbnRlcnBvbGF0aW9uIG9mIHNwbGluZSBjdXJ2ZSBmb3IgaW5pdGlhbCBndWVzcy5cbiAgZG91YmxlIGRlbHRhX3QgPSAxLjAgLyAoQ1VCSUNfQkVaSUVSX1NQTElORV9TQU1QTEVTIC0gMSk7XG4gIGZvciAoaSA9IDE7IGkgPCBDVUJJQ19CRVpJRVJfU1BMSU5FX1NBTVBMRVM7IGkrKykge1xuICAgIGlmICh4IDw9IHNwbGluZV9zYW1wbGVzX1tpXSkge1xuICAgICAgdDEgPSBkZWx0YV90ICogaTtcbiAgICAgIHQwID0gdDEgLSBkZWx0YV90O1xuICAgICAgdDIgPSB0MCArICh0MSAtIHQwKSAqICh4IC0gc3BsaW5lX3NhbXBsZXNfW2kgLSAxXSkgL1xuICAgICAgICAgICAgICAgICAgICAoc3BsaW5lX3NhbXBsZXNfW2ldIC0gc3BsaW5lX3NhbXBsZXNfW2kgLSAxXSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBQZXJmb3JtIGEgZmV3IGl0ZXJhdGlvbnMgb2YgTmV3dG9uJ3MgbWV0aG9kIC0tIG5vcm1hbGx5IHZlcnkgZmFzdC5cbiAgLy8gU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL05ld3RvbiUyN3NfbWV0aG9kLlxuICBkb3VibGUgbmV3dG9uX2Vwc2lsb24gPSBzdGQ6Om1pbihrQmV6aWVyRXBzaWxvbiwgZXBzaWxvbik7XG4gIGZvciAoaSA9IDA7IGkgPCBrTWF4TmV3dG9uSXRlcmF0aW9uczsgaSsrKSB7XG4gICAgeDIgPSBTYW1wbGVDdXJ2ZVgodDIpIC0geDtcbiAgICBpZiAoZmFicyh4MikgPCBuZXd0b25fZXBzaWxvbilcbiAgICAgIHJldHVybiB0MjtcbiAgICBkMiA9IFNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodDIpO1xuICAgIGlmIChmYWJzKGQyKSA8IGtCZXppZXJFcHNpbG9uKVxuICAgICAgYnJlYWs7XG4gICAgdDIgPSB0MiAtIHgyIC8gZDI7XG4gIH1cbiAgaWYgKGZhYnMoeDIpIDwgZXBzaWxvbilcbiAgICByZXR1cm4gdDI7XG5cbiAgLy8gRmFsbCBiYWNrIHRvIHRoZSBiaXNlY3Rpb24gbWV0aG9kIGZvciByZWxpYWJpbGl0eS5cbiAgd2hpbGUgKHQwIDwgdDEpIHtcbiAgICB4MiA9IFNhbXBsZUN1cnZlWCh0Mik7XG4gICAgaWYgKGZhYnMoeDIgLSB4KSA8IGVwc2lsb24pXG4gICAgICByZXR1cm4gdDI7XG4gICAgaWYgKHggPiB4MilcbiAgICAgIHQwID0gdDI7XG4gICAgZWxzZVxuICAgICAgdDEgPSB0MjtcbiAgICB0MiA9ICh0MSArIHQwKSAqIC41O1xuICB9XG5cbiAgLy8gRmFpbHVyZS5cbiAgcmV0dXJuIHQyO1xufVxuXG5kb3VibGUgQ3ViaWNCZXppZXI6OlNvbHZlKGRvdWJsZSB4KSBjb25zdCB7XG4gIHJldHVybiBTb2x2ZVdpdGhFcHNpbG9uKHgsIGtCZXppZXJFcHNpbG9uKTtcbn1cblxuZG91YmxlIEN1YmljQmV6aWVyOjpTbG9wZVdpdGhFcHNpbG9uKGRvdWJsZSB4LCBkb3VibGUgZXBzaWxvbikgY29uc3Qge1xuICB4ID0gYmFzZTo6Q2xhbXBUb1JhbmdlKHgsIDAuMCwgMS4wKTtcbiAgZG91YmxlIHQgPSBTb2x2ZUN1cnZlWCh4LCBlcHNpbG9uKTtcbiAgZG91YmxlIGR4ID0gU2FtcGxlQ3VydmVEZXJpdmF0aXZlWCh0KTtcbiAgZG91YmxlIGR5ID0gU2FtcGxlQ3VydmVEZXJpdmF0aXZlWSh0KTtcbiAgcmV0dXJuIGR5IC8gZHg7XG59XG5cbmRvdWJsZSBDdWJpY0Jlemllcjo6U2xvcGUoZG91YmxlIHgpIGNvbnN0IHtcbiAgcmV0dXJuIFNsb3BlV2l0aEVwc2lsb24oeCwga0JlemllckVwc2lsb24pO1xufVxuXG5kb3VibGUgQ3ViaWNCZXppZXI6OkdldFgxKCkgY29uc3Qge1xuICByZXR1cm4gY3hfIC8gMy4wO1xufVxuXG5kb3VibGUgQ3ViaWNCZXppZXI6OkdldFkxKCkgY29uc3Qge1xuICByZXR1cm4gY3lfIC8gMy4wO1xufVxuXG5kb3VibGUgQ3ViaWNCZXppZXI6OkdldFgyKCkgY29uc3Qge1xuICByZXR1cm4gKGJ4XyArIGN4XykgLyAzLjAgKyBHZXRYMSgpO1xufVxuXG5kb3VibGUgQ3ViaWNCZXppZXI6OkdldFkyKCkgY29uc3Qge1xuICByZXR1cm4gKGJ5XyArIGN5XykgLyAzLjAgKyBHZXRZMSgpO1xufVxuXG59ICAvLyBuYW1lc3BhY2UgZ2Z4XG5cbiovIiwiLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi4vZnJhbWV3b3JrL2dlc3R1cmUudHNcIiAvPlxuaW1wb3J0IHsgQmFzZUNvbXBvbmVudCwgUmVhY3QsIEVsZW1lbnRXcmFwcGVyLCBBVFRSSUJVVEVTLCBTVEFURVMgfSBmcm9tICcuLi9mcmFtZXdvcmsvZnJhbWV3b3JrJ1xuaW1wb3J0IHsgZ2VzdHVyZUVuYWJsZSwgR2VzdHVyZUV2ZW50VHlwZSB9IGZyb20gJy4uL2ZyYW1ld29yay9nZXN0dXJlJ1xuaW1wb3J0IHsgVGltZWxpbmUsIEFuaW1hdGlvbiB9IGZyb20gJy4uL2FuaW1hdGlvbi9hbmltYXRpb24nXG5pbXBvcnQgeyBlYXNlIH0gZnJvbSAnLi4vYW5pbWF0aW9uL3RpbWluZ0Z1bmN0aW9ucydcblxuXG5jb25zdCBrRHVyYXRpb24gPSBTeW1ib2woJ2R1cmF0aW9uJylcbmNvbnN0IGtPbkNoYW5nZWQgPSBTeW1ib2woJ29uLWNoYW5nZWQnKVxuY29uc3Qga0ltZ0xpc3QgPSBTeW1ib2woJ2ltZy1saXN0JylcbmNvbnN0IGtJbnRlcnZhbEhhbmRsZSA9IFN5bWJvbCgnaW50ZXJ2YWwtaGFuZGxlJylcblxubmFtZXNwYWNlIEdlZWtDYXJvdXNlbCB7XG4gIGV4cG9ydCB0eXBlIEltZ0l0ZW1UeXBlID0ge1xuICAgIHNyYzogc3RyaW5nLFxuICAgIHRpdGxlPzogc3RyaW5nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2Fyb3VzZWwgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblxuICAvLyBTVEFURVNcbiAgLy8gcG9zaXRpb246IG51bWJlciA9IDBcblxuICAvLyBBVFRSSUJVVEVTXG4gIDt3aWR0aCA9IDUwMFxuICA7W2tEdXJhdGlvbl0gPSAyMDAwXG4gIDtba09uQ2hhbmdlZF0gPSAocG9zaXRpb246IG51bWJlcikgPT4ge31cbiAgO1trSW1nTGlzdF06IEdlZWtDYXJvdXNlbC5JbWdJdGVtVHlwZVtdID0gW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpc1trSW1nTGlzdF0gPSBbXVxuICAgIHRoaXNbU1RBVEVTXS5wb3NpdGlvbiA9IDBcbiAgfVxuXG4gIGRpZE1vdW50ZWQoKSB7XG4gICAgXG4gICAgY29uc3QgZVdhcnAgPSB0aGlzLnJvb3QgYXMgRWxlbWVudFdyYXBwZXJcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGVXYXJwLnJvb3RcbiAgICBnZXN0dXJlRW5hYmxlKGVsZW1lbnQpXG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWxlbWVudC5jaGlsZHJlbikgYXMgQXJyYXk8SFRNTEVsZW1lbnQ+XG4gICAgY29uc3QgaW1hZ2VDb3VudCA9IGNoaWxkcmVuLmxlbmd0aFxuICAgIGNvbnN0IHdpZHRoID0gdGhpc1tBVFRSSUJVVEVTXS53aWR0aCB8fCA1MDBcbiAgICBsZXQgYW5pbWF0aW9uU3RhcnRQcm9ncmVzcyA9IDBcblxuICAgIGNvbnN0IG5leHRJbWFnZSA9ICgpID0+IHtcbiAgICAgIGFuaW1hdGlvblN0YXJ0UHJvZ3Jlc3MgPSB0aW1lbGluZS5nZXRQcm9ncmVzcygpXG4gICAgICBsZXQgbmV4dEluZGV4ID0gKHRoaXNbU1RBVEVTXS5wb3NpdGlvbiArIDEpICUgaW1hZ2VDb3VudFxuICAgICAgdGltZWxpbmUuYWRkKG5ldyBBbmltYXRpb24oe1xuICAgICAgICBvYmplY3Q6IGNoaWxkcmVuW3RoaXNbU1RBVEVTXS5wb3NpdGlvbl0uc3R5bGUsXG4gICAgICAgIHByb3BlcnR5OiBcInRyYW5zZm9ybVwiLFxuICAgICAgICBzdGFydFZhbHVlOiAtdGhpc1tTVEFURVNdLnBvc2l0aW9uICogd2lkdGgsXG4gICAgICAgIGVuZFZhbHVlOiAtdGhpc1tTVEFURVNdLnBvc2l0aW9uICogd2lkdGggLSB3aWR0aCxcbiAgICAgICAgZHVyYXRpb246IDUwMCwgXG4gICAgICAgIHRpbWluZ0Z1bmN0aW9uOiBlYXNlLFxuICAgICAgICB0ZW1wbGF0ZTogKHByb2dyZXNzKSA9PiBgdHJhbnNsYXRlWCgke3Byb2dyZXNzfXB4KWBcbiAgICAgIH0pKVxuICAgICAgdGltZWxpbmUuYWRkKG5ldyBBbmltYXRpb24oe1xuICAgICAgICBvYmplY3Q6IGNoaWxkcmVuW25leHRJbmRleF0uc3R5bGUsXG4gICAgICAgIHByb3BlcnR5OiBcInRyYW5zZm9ybVwiLFxuICAgICAgICBzdGFydFZhbHVlOiAtbmV4dEluZGV4ICogd2lkdGggKyB3aWR0aCxcbiAgICAgICAgZW5kVmFsdWU6IC1uZXh0SW5kZXggKiB3aWR0aCxcbiAgICAgICAgZHVyYXRpb246IDUwMCwgXG4gICAgICAgIHRpbWluZ0Z1bmN0aW9uOiBlYXNlLFxuICAgICAgICB0ZW1wbGF0ZTogKHByb2dyZXNzKSA9PiBgdHJhbnNsYXRlWCgke3Byb2dyZXNzfXB4KWBcbiAgICAgIH0pKVxuXG4gICAgICB0aGlzW1NUQVRFU10ucG9zaXRpb24gPSBuZXh0SW5kZXhcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KCdjaGFuZ2UnLCBuZXh0SW5kZXgpXG4gICAgfVxuICAgIGxldCB0aW1lbGluZSA9IG5ldyBUaW1lbGluZSgpXG4gICAgdGltZWxpbmUuc3RhcnQoKVxuICAgIFxuICAgIGxldCBhbmltYXRpb25PZmZzZXRYID0gMFxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc3RhcnQnLCAoZXZlbnQ6IEdlc3R1cmVFdmVudFR5cGUpID0+IHtcbiAgICAgIHRpbWVsaW5lLnBhdXNlKClcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpc1trSW50ZXJ2YWxIYW5kbGVdKVxuXG4gICAgICAvLyDorqHnrpfliqjnlLvlgY/lt65cbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpc1trRHVyYXRpb25dXG4gICAgICBjb25zdCBjdXJQcm9ncmVzc1RpbWUgPSB0aW1lbGluZS5nZXRQcm9ncmVzcygpXG4gICAgICBjb25zdCBwcm9ncmVzcyA9IChjdXJQcm9ncmVzc1RpbWUgLSBhbmltYXRpb25TdGFydFByb2dyZXNzKSA8IGR1cmF0aW9uID8gMCA6IGN1clByb2dyZXNzVGltZSAtIGFuaW1hdGlvblN0YXJ0UHJvZ3Jlc3NcbiAgICAgIGNvbnNvbGUubG9nKCdwcm9ncmVzcycsIHByb2dyZXNzLCBhbmltYXRpb25TdGFydFByb2dyZXNzLCBjdXJQcm9ncmVzc1RpbWUpXG4gICAgICBhbmltYXRpb25PZmZzZXRYID0gZWFzZShwcm9ncmVzcyAlIGR1cmF0aW9uIC8gZHVyYXRpb24pICogd2lkdGhcbiAgICB9KVxuICAgIGxldCBpID0gMFxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFuJywgKGV2ZW50OiBHZXN0dXJlRXZlbnRUeXBlKSA9PiB7XG4gICAgICBjb25zdCBwYW5YID0gZXZlbnQuY2xpZW50WCAtIGV2ZW50LnN0YXJ0WDtcbiAgICAgIChpKysgJSAyMCA9PT0gMCApICYmIGNvbnNvbGUubG9nKHBhblgsIGFuaW1hdGlvbk9mZnNldFgpXG4gICAgICBjb25zdCB4ID0gcGFuWCAtIGFuaW1hdGlvbk9mZnNldFhcbiAgICAgIGNvbnN0IG1vdmVJbmRleCA9IE1hdGgucm91bmQoLXggLyB3aWR0aClcbiAgICAgIGNvbnN0IGN1ckluZGV4ID0gKHRoaXNbU1RBVEVTXS5wb3NpdGlvbiArIG1vdmVJbmRleCAlIGltYWdlQ291bnQgKyBpbWFnZUNvdW50KSAlIGltYWdlQ291bnRcbiAgICAgIGNvbnN0IHByZUluZGV4ID0gKGN1ckluZGV4IC0gMSArIGltYWdlQ291bnQpICUgaW1hZ2VDb3VudFxuICAgICAgY29uc3QgbmV4dEluZGV4ID0gKGN1ckluZGV4ICsgMSArIGltYWdlQ291bnQpICUgaW1hZ2VDb3VudFxuICAgICAgY2hpbGRyZW5bcHJlSW5kZXhdLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LSgocHJlSW5kZXggLSBtb3ZlSW5kZXgpICogd2lkdGgpICsgeCAtIHdpZHRoIH1weClgXG4gICAgICBjaGlsZHJlbltjdXJJbmRleF0uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstKChjdXJJbmRleCAtIG1vdmVJbmRleCkgKiB3aWR0aCkgKyB4IH1weClgXG4gICAgICBjaGlsZHJlbltuZXh0SW5kZXhdLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LSgobmV4dEluZGV4IC0gbW92ZUluZGV4KSAqIHdpZHRoKSArIHggKyB3aWR0aCB9cHgpYFxuICAgIH0pXG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2VuZCcsIChldmVudDogR2VzdHVyZUV2ZW50VHlwZSkgPT4ge1xuICAgICAgdGltZWxpbmUucmVzZXQoKVxuICAgICAgdGltZWxpbmUuc3RhcnQoKVxuXG4gICAgICBjb25zdCBwYW5YID0gZXZlbnQuY2xpZW50WCAtIGV2ZW50LnN0YXJ0WFxuICAgICAgXG4gICAgICBsZXQgeCA9IHBhblggLSBhbmltYXRpb25PZmZzZXRYXG4gICAgICBjb25zdCBjdXJJbmRleCA9ICh0aGlzW1NUQVRFU10ucG9zaXRpb24gKyBNYXRoLnJvdW5kKC14IC8gd2lkdGgpICUgaW1hZ2VDb3VudCArIGltYWdlQ291bnQpICUgaW1hZ2VDb3VudFxuICAgICAgXG4gICAgICBcblxuICAgICAgaWYoZXZlbnQuaXNGbGljayl7XG4gICAgICAgIGNvbnN0IG1vdmVJbmRleCA9IGV2ZW50LnZlbG9jaXR5IDwgMD8gTWF0aC5jZWlsKHBhblggLyB3aWR0aCkgOiBNYXRoLmZsb29yKHBhblggLyB3aWR0aClcbiAgICAgICAgZm9yIChsZXQgb2Zmc2V0IG9mIFstMSwgMCwgMV0pIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IChjdXJJbmRleCArIG9mZnNldCArIGltYWdlQ291bnQpICUgaW1hZ2VDb3VudFxuICAgICAgICAgIHRpbWVsaW5lLmFkZChuZXcgQW5pbWF0aW9uKHtcbiAgICAgICAgICAgIG9iamVjdDogY2hpbGRyZW5baW5kZXhdLnN0eWxlLFxuICAgICAgICAgICAgcHJvcGVydHk6IFwidHJhbnNmb3JtXCIsXG4gICAgICAgICAgICBzdGFydFZhbHVlOiAtKChpbmRleCAtIG1vdmVJbmRleCkgKiB3aWR0aCkgKyB4ICsgd2lkdGggKiBvZmZzZXQsXG4gICAgICAgICAgICBlbmRWYWx1ZTogLSgoaW5kZXggLSBtb3ZlSW5kZXgpICogd2lkdGgpICsgd2lkdGggKiBvZmZzZXQsXG4gICAgICAgICAgICBkdXJhdGlvbjogNTAwLCBcbiAgICAgICAgICAgIHRpbWluZ0Z1bmN0aW9uOiBlYXNlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IChwcm9ncmVzcykgPT4gYHRyYW5zbGF0ZVgoJHtwcm9ncmVzc31weClgXG4gICAgICAgICAgfSkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1vdmVJbmRleCA9IE1hdGgucm91bmQoLXggLyB3aWR0aClcbiAgICAgICAgLy8gY29uc29sZS5sb2coeCwgcGFuWCwgYW5pbWF0aW9uT2Zmc2V0WClcbiAgICAgICAgLy8gY29uc29sZS5sb2cocHJlSW5kZXgsIGN1ckluZGV4LCBuZXh0SW5kZXgsIG1vdmVJbmRleClcblxuICAgICAgICBmb3IgKGxldCBvZmZzZXQgb2YgWy0xLCAwLCAxXSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gKGN1ckluZGV4ICsgb2Zmc2V0ICsgaW1hZ2VDb3VudCkgJSBpbWFnZUNvdW50XG4gICAgICAgICAgdGltZWxpbmUuYWRkKG5ldyBBbmltYXRpb24oe1xuICAgICAgICAgICAgb2JqZWN0OiBjaGlsZHJlbltpbmRleF0uc3R5bGUsXG4gICAgICAgICAgICBwcm9wZXJ0eTogXCJ0cmFuc2Zvcm1cIixcbiAgICAgICAgICAgIHN0YXJ0VmFsdWU6IC0oKGluZGV4IC0gbW92ZUluZGV4KSAqIHdpZHRoKSArIHggKyB3aWR0aCAqIG9mZnNldCxcbiAgICAgICAgICAgIGVuZFZhbHVlOiAtKChpbmRleCAtIG1vdmVJbmRleCkgKiB3aWR0aCkgKyB3aWR0aCAqIG9mZnNldCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsIFxuICAgICAgICAgICAgdGltaW5nRnVuY3Rpb246IGVhc2UsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogKHByb2dyZXNzKSA9PiBgdHJhbnNsYXRlWCgke3Byb2dyZXNzfXB4KWBcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBcblxuICAgICAgdGhpc1tTVEFURVNdLnBvc2l0aW9uID0gY3VySW5kZXhcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KCdjaGFuZ2UnLCBjdXJJbmRleClcbiAgICAgIHRoaXNba0ludGVydmFsSGFuZGxlXSA9IHNldEludGVydmFsKG5leHRJbWFnZSwgdGhpc1trRHVyYXRpb25dKVxuICAgIH0pXG4gICAgXG4gICAgdGhpc1trSW50ZXJ2YWxIYW5kbGVdID0gc2V0SW50ZXJ2YWwobmV4dEltYWdlLCB0aGlzW2tEdXJhdGlvbl0pXG4gICAgXG4gIH1cblxuICBzZXREdXJhdGlvbihkdXJhdGlvbjogbnVtYmVyKSB7XG4gICAgdGhpc1trRHVyYXRpb25dID0gZHVyYXRpb25cbiAgfVxuXG4gIHNldEltZ0xpc3QoaW1nTGlzdDogR2Vla0Nhcm91c2VsLkltZ0l0ZW1UeXBlW10pIHtcbiAgICB0aGlzW2tJbWdMaXN0XSA9IGltZ0xpc3RcbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuICAgIHJldHVybiA8ZGl2IGNsYXNzPVwiY2Fyb3VzZWxcIj5cbiAgICAgIHt0aGlzW2tJbWdMaXN0XS5tYXAoaW1nID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1nLnNyY30pYFxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzcz1cImNhcm91c2VsLS1pdGVtXCIgc3R5bGU9e3N0eWxlc30+PC9kaXY+XG4gICAgICB9KX1cbiAgICA8L2Rpdj5cbiAgfVxufVxuXG4iLCIvKipcbiAqIOe7hOS7tuWwgeijheaWueazlVxuICovXG5cbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVTID0gU3ltYm9sKCdhdHRyaWJ1dGVzJylcbmV4cG9ydCBjb25zdCBTVEFURVMgPSBTeW1ib2woJ3N0YXRlcycpXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGU6IHN0cmluZyB8IFdlZWsxNC5Db21wb25lbnRDb25zdHJ1Y3RvciwgYXR0cmlidXRlPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgLi4uY2hpbGRyZW46IEFycmF5PFdlZWsxNC5Db21wb25lbnRJbnRlcmZhY2U+IHwgQXJyYXk8QXJyYXk8V2VlazE0LkNvbXBvbmVudEludGVyZmFjZT4+KSB7XG4gIGlmICghdHlwZSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgbGV0IGVsZW1lbnQ6IFdlZWsxNC5Db21wb25lbnRJbnRlcmZhY2VcbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGVsZW1lbnQgPSBuZXcgRWxlbWVudFdyYXBwZXIodHlwZSlcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50ID0gY3JlYXRlQ29tcG9uZW50KDxXZWVrMTQuQ29tcG9uZW50Q29uc3RydWN0b3I+dHlwZSlcbiAgfVxuICBcbiAgZm9yIChsZXQgYXR0ciBpbiBhdHRyaWJ1dGUpIHtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyaWJ1dGVbYXR0cl0pXG4gIH1cblxuICBjb25zdCBhcHBlbmRDaGlsZCA9IChjaGlsZHJlbjogQXJyYXk8V2VlazE0LkNvbXBvbmVudEludGVyZmFjZT4pID0+IHtcbiAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY2hpbGQgPSBuZXcgVGV4dFdyYXBwZXIoY2hpbGQpXG4gICAgICB9XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbj8uWzBdKSkge1xuICAgIGFwcGVuZENoaWxkKGNoaWxkcmVuLmZsYXQoKSlcbiAgfSBlbHNlIHtcbiAgICBhcHBlbmRDaGlsZCg8QXJyYXk8V2VlazE0LkNvbXBvbmVudEludGVyZmFjZT4+Y2hpbGRyZW4pXG4gIH1cblxuICByZXR1cm4gZWxlbWVudFxufVxuXG5leHBvcnQgY29uc3QgUmVhY3QgPSB7XG4gIGNyZWF0ZUVsZW1lbnRcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnRXcmFwcGVyIGltcGxlbWVudHMgV2VlazE0LkNvbXBvbmVudEludGVyZmFjZSB7XG4gIHJvb3Q6IEhUTUxFbGVtZW50XG4gIHR5cGU6IHN0cmluZ1xuXG4gIGNvbnN0cnVjdG9yKHR5cGU/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlIHx8ICdkaXYnXG4gICAgdGhpcy5yb290ID0gdGhpcy5yZW5kZXIoKVxuICB9XG5cbiAgc2V0QXR0cmlidXRlKGF0dHI6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMucm9vdC5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsdWUpICAgXG4gIH1cblxuICBtb3VudFRvKHBhcmVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5yb290KVxuICB9XG4gIGFwcGVuZENoaWxkKGNoaWxkOiBXZWVrMTQuQ29tcG9uZW50SW50ZXJmYWNlKSB7XG4gICAgY2hpbGQubW91bnRUbyh0aGlzLnJvb3QpXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMudHlwZSlcbiAgfVxuXG59XG5cbmNsYXNzIFRleHRXcmFwcGVyIGltcGxlbWVudHMgV2VlazE0LkNvbXBvbmVudEludGVyZmFjZSB7XG4gIHJvb3Q6IFRleHRcbiAgY29udGVudDogc3RyaW5nXG5cbiAgY29uc3RydWN0b3IoY29udGVudD86IHN0cmluZykge1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQgfHwgJydcbiAgICB0aGlzLnJvb3QgPSB0aGlzLnJlbmRlcigpXG4gIH1cblxuICBzZXRBdHRyaWJ1dGUoYXR0cjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gIH1cblxuICBtb3VudFRvKHBhcmVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5yb290KVxuICB9XG4gIGFwcGVuZENoaWxkKGNoaWxkOiBXZWVrMTQuQ29tcG9uZW50SW50ZXJmYWNlKSB7XG4gICAgLy8gdGhpcy5tb3VudFRvKHRoaXMucm9vdClcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuY29udGVudClcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoY21wQ29uc3RydWN0b3I6IFdlZWsxNC5Db21wb25lbnRDb25zdHJ1Y3RvciwgdHlwZT86IHN0cmluZyk6IFdlZWsxNC5Db21wb25lbnRJbnRlcmZhY2Uge1xuICByZXR1cm4gbmV3IGNtcENvbnN0cnVjdG9yKHR5cGUpO1xufVxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbXBvbmVudCBpbXBsZW1lbnRzIFdlZWsxNC5Db21wb25lbnRJbnRlcmZhY2Uge1xuICByb290OiBIVE1MRWxlbWVudCB8IEJhc2VDb21wb25lbnQgfCBFbGVtZW50V3JhcHBlclxuXG4gIFtBVFRSSUJVVEVTXSA6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgW1NUQVRFU10gOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpc1tBVFRSSUJVVEVTXSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB0aGlzW1NUQVRFU10gPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIH1cblxuICBtb3VudFRvKHBhcmVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMucm9vdCkge1xuICAgICAgdGhpcy5yb290ID0gdGhpcy5yZW5kZXIoKVxuICAgIH1cbiAgICBpZiAoaXNDb21wb25lbnQodGhpcy5yb290KSkge1xuICAgICAgdGhpcy5yb290Lm1vdW50VG8ocGFyZW50KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZGlkTW91bnRlZD8uKCkgIFxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKDxIVE1MRWxlbWVudD50aGlzLnJvb3QpXG4gICAgfVxuICB9XG5cbiAgZGlkTW91bnRlZCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKVxuICB9XG5cbiAgc2V0QXR0cmlidXRlKGF0dHI6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGlmICghYXR0ci5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzZXR0ZXJOYW1lID0gJ3NldCcgKyBhdHRyWzBdLnRvVXBwZXJDYXNlKCkgKyBhdHRyLnNsaWNlKDEpXG4gICAgaWYgKHR5cGVvZiB0aGlzW3NldHRlck5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzW3NldHRlck5hbWVdKHZhbHVlKVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhhdHRyLCB2YWx1ZSlcbiAgICB0aGlzW0FUVFJJQlVURVNdW2F0dHJdID0gdmFsdWVcbiAgfVxuXG4gIGdldEF0dHJpYnV0ZShhdHRyOiBzdHJpbmcpIHtcbiAgICBpZiAoIWF0dHIubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgZ2V0dGVyTmFtZSA9ICdnZXQnICsgYXR0clswXS50b1VwcGVyQ2FzZSgpICsgYXR0ci5zbGljZSgxKVxuICAgIGlmICh0aGlzW2dldHRlck5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzW2dldHRlck5hbWVdXG4gICAgfVxuICAgIHJldHVybiB0aGlzW0FUVFJJQlVURVNdW2F0dHJdXG4gIH1cblxuICB0cmlnZ2VyRXZlbnQodHlwZSwgYXJncyl7XG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpc1tBVFRSSUJVVEVTXVsnb24nICsgdHlwZVswXS50b1VwcGVyQ2FzZSgpICsgdHlwZS5zbGljZSgxKV0obmV3IEN1c3RvbUV2ZW50KHR5cGUsIHtkZXRhaWw6IGFyZ3N9KSlcbiAgfVxuXG4gIHNldFN0YXRlKHN0YXRlOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzW1NUQVRFU11bc3RhdGVdID0gdmFsdWVcbiAgfVxuXG4gIGFwcGVuZENoaWxkKGNoaWxkOiBXZWVrMTQuQ29tcG9uZW50SW50ZXJmYWNlKSB7XG4gICAgXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIH1cblxufVxuXG5cbmZ1bmN0aW9uIGlzQ29tcG9uZW50KGNtcDogSFRNTEVsZW1lbnQgfCBXZWVrMTQuQ29tcG9uZW50SW50ZXJmYWNlKTogY21wIGlzIFdlZWsxNC5Db21wb25lbnRJbnRlcmZhY2Uge1xuICByZXR1cm4gKDxXZWVrMTQuQ29tcG9uZW50SW50ZXJmYWNlPmNtcCkubW91bnRUbyAhPT0gdW5kZWZpbmVkXG59XG5cbm5hbWVzcGFjZSBXZWVrMTQge1xuICBleHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudENvbnN0cnVjdG9yIHtcbiAgICBuZXcgKHR5cGU/OiBzdHJpbmcpOiBDb21wb25lbnRJbnRlcmZhY2VcbiAgfVxuICBcbiAgZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRJbnRlcmZhY2Uge1xuICAgIG1vdW50VG8ocGFyZW50OiBIVE1MRWxlbWVudCkgOiB2b2lkXG4gICAgc2V0QXR0cmlidXRlKGF0dHI6IHN0cmluZywgdmFsdWU6IHN0cmluZykgOiB2b2lkXG4gICAgYXBwZW5kQ2hpbGQoY2hpbGQ6IENvbXBvbmVudEludGVyZmFjZSkgOiB2b2lkXG4gICAgcmVuZGVyKCkgOiBIVE1MRWxlbWVudCB8IFRleHRcblxuICAgIC8vIGRpZE1vdW50ZWQ/KCkgOiB2b2lkXG4gIH1cbn0iLCIvKlxuICogQERlc2NyaXB0aW9uOiDmiYvlir/lsIHoo4XvvIxHZXN0dXJlUmVjb2duaXplclxuICogQEF1dGhvcjogemh1by5wYW5cbiAqIEBEYXRlOiAyMDIxLTA0LTExIDE5OjI2OjU0XG4gKiBATGFzdEVkaXRUaW1lOiAyMDIxLTA0LTE5IDAzOjIwOjE2XG4gKiBATGFzdEVkaXRvcnM6IHpodW8ucGFuXG4gKi9cbi8vIG5hbWVzcGFjZSBHZWVrR2VzdHVyZSB7XG4gIGV4cG9ydCB0eXBlIEdlc3R1cmVFdmVudFR5cGUgPSBMaXN0ZW5lckNvbnRleHQgJiBFdmVudFxuLy8gfVxuXG50eXBlIExpc3RlbmVyQ29udGV4dCA9IFBhcnRpYWw8e1xuICBzdGFydFg/OiBudW1iZXJcbiAgc3RhcnRZPzogbnVtYmVyXG5cbiAgY2xpZW50WD86IG51bWJlclxuICBjbGllbnRZPzogbnVtYmVyXG5cbiAgaXNUYXA6IGJvb2xlYW5cbiAgaXNQYW46IGJvb2xlYW5cbiAgaXNQcmVzczogYm9vbGVhblxuICBpc0ZsaWNrOiBib29sZWFuXG5cbiAgaXNWZXJ0aWNhbDogYm9vbGVhblxuICB2ZWxvY2l0eTogbnVtYmVyXG5cbiAgcG9pbnRzOiBBcnJheTxQb2ludD5cblxuICBoYW5kbGVyOiBudW1iZXIgIC8vIOWumuaXtuWZqFxufT5cblxudHlwZSBQb2ludCA9IHtcbiAgdDogbnVtYmVyLFxuICB4OiBudW1iZXIsXG4gIHk6IG51bWJlclxufVxuXG5jb25zdCBrTW91c2VQcmUgPSAnbW91c2VfJ1xuY29uc3Qga1RvdWNoUHJlID0gJ3RvdWNoXydcblxuXG5cbmV4cG9ydCBjbGFzcyBMaXN0ZW5lciB7XG4gIHByb3RlY3RlZCByZWNvZ25pemVyOiBSZWNvZ25pemVyXG4gIHByb3RlY3RlZCBlbGVtZW50OiBIVE1MRWxlbWVudFxuXG4gIHN0YXJ0WDogbnVtYmVyXG4gIHN0YXJ0WTogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQsIHJlY29nbml6ZXI6IFJlY29nbml6ZXIpIHtcbiAgICBpZiAoIShlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VsZW1lbnQgbXVzdCBiZSBIVE1MRWxlbWVudCcpXG4gICAgfVxuICAgIGlmICghcmVjb2duaXplcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWNvZ25pemVyIG11c3QgYmUgaW5zdGFuY2Ugb2YgUmVjb2duaXplcicpXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB0aGlzLnJlY29nbml6ZXIgPSByZWNvZ25pemVyXG4gICAgdGhpcy5pbml0KClcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICBjb25zdCByZWNvZ25pemVyID0gdGhpcy5yZWNvZ25pemVyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFxuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9LCB7XG4gICAgICBjYXB0dXJlOiB0cnVlLFxuICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgIH0pXG5cbiAgICBsZXQgaXNMaXN0ZW5pbmdNb3VzZSA9IGZhbHNlXG4gICAgbGV0IGNvbnRleHRzID0gbmV3IE1hcDxzdHJpbmcsIExpc3RlbmVyQ29udGV4dD4oKVxuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQpID0+IHtcblxuICAgICAgY29uc3QgY29udGV4dCA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgIGNvbnRleHRzLnNldChrTW91c2VQcmUgKyAoMSA8PCBldmVudC5idXR0b24pLCBjb250ZXh0KVxuXG4gICAgICB0aGlzLnJlY29nbml6ZXI/LnN0YXJ0Py4oZXZlbnQsIGNvbnRleHQpXG4gICAgICBjb25zdCBtb3ZlID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGxldCBidXR0b24gPSAxXG4gICAgICAgICAgd2hpbGUoYnV0dG9uIDw9IGV2ZW50LmJ1dHRvbnMpIHtcbiAgICAgICAgICAgIGlmIChidXR0b24gJiBldmVudC5idXR0b25zKSB7XG4gICAgICAgICAgICAgIC8vIG9yZGVyIG9mIGJ1dHRvbnMgJiBidXR0b24gcHJvcGVyeSBpcyBub3Qgc2FtZVxuICAgICAgICAgICAgICBsZXQga2V5XG4gICAgICAgICAgICAgIGlmIChidXR0b24gPT09IDIpIHtcbiAgICAgICAgICAgICAgICBrZXkgPSA0XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYnV0dG9uID09PSA0KSB7XG4gICAgICAgICAgICAgICAga2V5ID0gMlxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtleSA9IGJ1dHRvblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY29udGV4dHMuZ2V0KGtNb3VzZVByZSArIGtleSlcbiAgICAgICAgICAgICAgdGhpcy5yZWNvZ25pemVyPy5tb3ZlPy4oZXZlbnQsIGNvbnRleHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidXR0b24gPSBidXR0b24gPDwgMVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHVwID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGxldCBjb250ZXh0ID0gY29udGV4dHMuZ2V0KGtNb3VzZVByZSArICgxIDw8IGV2ZW50LmJ1dHRvbikpXG4gICAgICAgIHJlY29nbml6ZXIuZW5kPy4oZXZlbnQsIGNvbnRleHQpXG4gICAgICAgIGNvbnRleHRzLmRlbGV0ZShrTW91c2VQcmUgKyAoMSA8PCBldmVudC5idXR0b24pKVxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9ucyA9PT0gMCkge1xuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmUpXG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHVwKVxuICAgICAgICAgIGlzTGlzdGVuaW5nTW91c2UgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNMaXN0ZW5pbmdNb3VzZSA9PSBmYWxzZSkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdXApXG4gICAgICAgIGlzTGlzdGVuaW5nTW91c2UgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2ZW50KSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIEFycmF5LmZyb20oZXZlbnQuY2hhbmdlZFRvdWNoZXMpKSB7XG4gICAgICAgIGxldCBjb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICAgICBjb250ZXh0cy5zZXQoa1RvdWNoUHJlICsgcG9pbnQuaWRlbnRpZmllciwgY29udGV4dClcbiAgICAgICAgcmVjb2duaXplci5zdGFydD8uKHBvaW50LCBjb250ZXh0KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIEFycmF5LmZyb20oZXZlbnQuY2hhbmdlZFRvdWNoZXMpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0cy5nZXQoa1RvdWNoUHJlICsgcG9pbnQuaWRlbnRpZmllcilcbiAgICAgICAgcmVjb2duaXplcj8ubW92ZT8uKHBvaW50LCBjb250ZXh0KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZXZlbnQpID0+IHtcbiAgICAgIGZvciAoY29uc3QgcG9pbnQgb2YgQXJyYXkuZnJvbShldmVudC5jaGFuZ2VkVG91Y2hlcykpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga1RvdWNoUHJlICsgcG9pbnQuaWRlbnRpZmllclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHMuZ2V0KGtleSlcbiAgICAgICAgcmVjb2duaXplcj8uZW5kPy4ocG9pbnQsIGNvbnRleHQpXG4gICAgICAgIGNvbnRleHRzLmRlbGV0ZShrZXkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIChldmVudCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBwb2ludCBvZiBBcnJheS5mcm9tKGV2ZW50LmNoYW5nZWRUb3VjaGVzKSkge1xuICAgICAgICBjb25zdCBrZXkgPSBrVG91Y2hQcmUgKyBwb2ludC5pZGVudGlmaWVyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0cy5nZXQoa2V5KVxuICAgICAgICB0aGlzLnJlY29nbml6ZXI/LmVuZD8uKHBvaW50LCBjb250ZXh0KVxuICAgICAgICBjb250ZXh0cy5kZWxldGUoa2V5KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxufVxuXG5pbnRlcmZhY2UgRXZlbnRQb2ludCB7XG4gIGNsaWVudFg6IG51bWJlclxuICBjbGllbnRZOiBudW1iZXJcbn1cblxuXG5leHBvcnQgY2xhc3MgUmVjb2duaXplciB7XG4gIGRpc3BhdGNoZXI6IERpc3BhdGNoZXJcblxuICBzdGFydFg6IG51bWJlclxuICBzdGFydFk6IG51bWJlclxuXG5cbiAgY29uc3RydWN0b3IoZGlzcGF0Y2hlcjogRGlzcGF0Y2hlcikge1xuICAgIHRoaXMuZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXJcbiAgfVxuXG4gIHN0YXJ0KHBvaW50OiBFdmVudFBvaW50LCBjb250ZXh0OiBMaXN0ZW5lckNvbnRleHQpIHtcbiAgICBjb250ZXh0LnN0YXJ0WCA9IHBvaW50LmNsaWVudFgsIGNvbnRleHQuc3RhcnRZID0gcG9pbnQuY2xpZW50WVxuXG4gICAgY29udGV4dC5wb2ludHMgPSBbXG4gICAgICB7XG4gICAgICAgIHQ6IERhdGUubm93KCksXG4gICAgICAgIHg6IHBvaW50LmNsaWVudFgsXG4gICAgICAgIHk6IHBvaW50LmNsaWVudFksXG4gICAgICB9XG4gICAgXVxuXG4gICAgdGhpcy5kaXNwYXRjaGVyPy5kaXNwYXRjaD8uKCdzdGFydCcsIHtcbiAgICAgIGNsaWVudFg6IHBvaW50LmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBwb2ludC5jbGllbnRZLFxuICAgIH0pXG5cbiAgICBjb250ZXh0LmlzVGFwID0gdHJ1ZVxuICAgIGNvbnRleHQuaXNQYW4gPSBmYWxzZVxuICAgIGNvbnRleHQuaXNQcmVzcyA9IGZhbHNlXG5cbiAgICBjb250ZXh0LmhhbmRsZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb250ZXh0LmlzVGFwID0gZmFsc2VcbiAgICAgIGNvbnRleHQuaXNQYW4gPSBmYWxzZVxuICAgICAgY29udGV4dC5pc1ByZXNzID0gdHJ1ZVxuICAgICAgY29udGV4dC5oYW5kbGVyID0gbnVsbFxuICAgICAgdGhpcy5kaXNwYXRjaGVyPy5kaXNwYXRjaD8uKCdwcmVzcycsIHt9KVxuICAgIH0sIDUwMClcbiAgfVxuXG4gIG1vdmUocG9pbnQ6IEV2ZW50UG9pbnQsIGNvbnRleHQ6IExpc3RlbmVyQ29udGV4dCkge1xuICAgIGxldCBkeCA9IHBvaW50LmNsaWVudFggLSBjb250ZXh0LnN0YXJ0WCwgZHkgPSBwb2ludC5jbGllbnRZIC0gY29udGV4dC5zdGFydFlcbiAgICBpZiAoIWNvbnRleHQuaXNQYW4gJiYgZHggKiogMiArIGR5ICoqIDIgPiAxMDApIHtcbiAgICAgIGNvbnRleHQuaXNUYXAgPSBmYWxzZVxuICAgICAgY29udGV4dC5pc1BhbiA9IHRydWVcbiAgICAgIGNvbnRleHQuaXNQcmVzcyA9IGZhbHNlXG4gICAgICBjb250ZXh0LmlzVmVydGljYWwgPSBNYXRoLmFicyhkeCkgPCBNYXRoLmFicyhkeSksXG4gICAgICB0aGlzLmRpc3BhdGNoZXIuZGlzcGF0Y2goJ3BhbnN0YXJ0Jywge1xuICAgICAgICBzdGFydFg6IGNvbnRleHQuc3RhcnRYLFxuICAgICAgICBzdGFydFk6IGNvbnRleHQuc3RhcnRZLFxuICAgICAgICBjbGllbnRYOiBwb2ludC5jbGllbnRYLFxuICAgICAgICBjbGllbnRZOiBwb2ludC5jbGllbnRZLFxuICAgICAgICBpc1ZlcnRpY2FsOiBjb250ZXh0LmlzVmVydGljYWwsXG4gICAgICB9KVxuICAgICAgY2xlYXJUaW1lb3V0KGNvbnRleHQuaGFuZGxlcilcbiAgICB9XG4gIFxuICAgIGlmIChjb250ZXh0LmlzUGFuKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoZXIuZGlzcGF0Y2goJ3BhbicsIHtcbiAgICAgICAgc3RhcnRYOiBjb250ZXh0LnN0YXJ0WCxcbiAgICAgICAgc3RhcnRZOiBjb250ZXh0LnN0YXJ0WSxcbiAgICAgICAgY2xpZW50WDogcG9pbnQuY2xpZW50WCxcbiAgICAgICAgY2xpZW50WTogcG9pbnQuY2xpZW50WSxcbiAgICAgICAgaXNWZXJ0aWNhbDogY29udGV4dC5pc1ZlcnRpY2FsLFxuICAgICAgfSlcbiAgICB9XG4gIFxuICAgIGNvbnRleHQucG9pbnRzID0gY29udGV4dC5wb2ludHMuZmlsdGVyKHBvaW50ID0+IERhdGUubm93KCkgLSBwb2ludC50IDwgNTAwKVxuICBcbiAgICBjb250ZXh0LnBvaW50cy5wdXNoKFxuICAgICAge1xuICAgICAgICB0OiBEYXRlLm5vdygpLFxuICAgICAgICB4OiBwb2ludC5jbGllbnRYLFxuICAgICAgICAgIHk6IHBvaW50LmNsaWVudFksXG4gICAgICAgIH1cbiAgICAgIClcbiAgfVxuXG4gIGVuZChwb2ludDogRXZlbnRQb2ludCwgY29udGV4dDogTGlzdGVuZXJDb250ZXh0KSB7XG4gICAgaWYgKGNvbnRleHQuaXNUYXApIHtcbiAgICAgIGNsZWFyVGltZW91dChjb250ZXh0LmhhbmRsZXIpXG4gICAgICB0aGlzLmRpc3BhdGNoZXI/LmRpc3BhdGNoPy4oJ3RhcCcsIHt9KVxuICAgIH1cbiAgICBpZiAoY29udGV4dC5pc1ByZXNzKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoZXI/LmRpc3BhdGNoPy4oJ3ByZXNzZW5kJywge30pXG4gICAgfVxuICAgIGNvbnRleHQucG9pbnRzID0gY29udGV4dC5wb2ludHMuZmlsdGVyKHBvaW50ID0+IERhdGUubm93KCkgLSBwb2ludC50IDwgNTAwKVxuICAgIGxldCB2OiBudW1iZXJcbiAgICBpZiAoIWNvbnRleHQucG9pbnRzLmxlbmd0aCkge1xuICAgICAgdiA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGQgPSBNYXRoLnNxcnQoKHBvaW50LmNsaWVudFggLSBjb250ZXh0LnBvaW50c1swXS54KSAqKiAyICtcbiAgICAgICAgICAgIChwb2ludC5jbGllbnRZIC0gY29udGV4dC5wb2ludHNbMF0ueSkgKiogMilcbiAgICAgIHYgPSBkIC8gKERhdGUubm93KCkgLSBjb250ZXh0LnBvaW50c1swXS50KVxuICAgIH1cbiAgXG4gICAgaWYgKHYgPiAxLjUpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hlcj8uZGlzcGF0Y2g/LignZmxpY2snLCB7XG4gICAgICAgIHN0YXJ0WDogY29udGV4dC5zdGFydFgsXG4gICAgICAgIHN0YXJ0WTogY29udGV4dC5zdGFydFksXG4gICAgICAgIGNsaWVudFg6IHBvaW50LmNsaWVudFgsXG4gICAgICAgIGNsaWVudFk6IHBvaW50LmNsaWVudFksXG4gICAgICAgIGlzVmVydGljYWw6IGNvbnRleHQuaXNWZXJ0aWNhbCxcbiAgICAgICAgaXNGbGljazogY29udGV4dC5pc0ZsaWNrLFxuICAgICAgICB2ZWxvY2l0eTogdixcbiAgICAgIH0pXG4gICAgICBjb250ZXh0LmlzRmxpY2sgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRleHQuaXNGbGljayA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQuaXNQYW4pIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hlcj8uZGlzcGF0Y2g/LigncGFuZW5kJywge1xuICAgICAgICBzdGFydFg6IGNvbnRleHQuc3RhcnRYLFxuICAgICAgICBzdGFydFk6IGNvbnRleHQuc3RhcnRZLFxuICAgICAgICBjbGllbnRYOiBwb2ludC5jbGllbnRYLFxuICAgICAgICBjbGllbnRZOiBwb2ludC5jbGllbnRZLFxuICAgICAgICBpc1ZlcnRpY2FsOiBjb250ZXh0LmlzVmVydGljYWwsXG4gICAgICAgIGlzRmxpY2s6IGNvbnRleHQuaXNGbGljayxcbiAgICAgIH0pXG4gICAgfVxuICAgIFxuICAgIHRoaXMuZGlzcGF0Y2hlcj8uZGlzcGF0Y2g/LignZW5kJywge1xuICAgICAgc3RhcnRYOiBjb250ZXh0LnN0YXJ0WCxcbiAgICAgIHN0YXJ0WTogY29udGV4dC5zdGFydFksXG4gICAgICBjbGllbnRYOiBwb2ludC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogcG9pbnQuY2xpZW50WSxcbiAgICAgIGlzVmVydGljYWw6IGNvbnRleHQuaXNWZXJ0aWNhbCxcbiAgICAgIHZlbG9jaXR5OiB2LFxuICAgICAgaXNGbGljazogY29udGV4dC5pc0ZsaWNrLFxuICAgIH0pXG4gIH1cblxuICBjYW5jZWwocG9pbnQ6IEV2ZW50UG9pbnQsIGNvbnRleHQ6IExpc3RlbmVyQ29udGV4dCkge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5kaXNwYXRjaCgnY2FuY2VsJywge30pXG4gICAgY2xlYXJUaW1lb3V0KGNvbnRleHQuaGFuZGxlcilcbiAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBEaXNwYXRjaGVyIHtcbiAgXG4gIGVsZW1lbnQ/OiBIVE1MRWxlbWVudFxuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICB9XG5cbiAgZGlzcGF0Y2godHlwZTogc3RyaW5nLCBwcm9wZXJ0aWVzPzogYW55KSB7XG4gICAgY29uc3QgZXZlbnQ6IEdlc3R1cmVFdmVudFR5cGUgPSBuZXcgQ3VzdG9tRXZlbnQ8TGlzdGVuZXJDb250ZXh0Pih0eXBlKVxuICAgIGZvciAoY29uc3QgcHJvcCBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBldmVudFtwcm9wXSA9IHByb3BlcnRpZXNbcHJvcF1cbiAgICB9XG4gICAgdGhpcy5lbGVtZW50Py5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXN0dXJlRW5hYmxlKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIG5ldyBMaXN0ZW5lcihlbGVtZW50LCBuZXcgUmVjb2duaXplcihuZXcgRGlzcGF0Y2hlcihlbGVtZW50KSkpXG59XG5cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnLi9mcmFtZXdvcmsvZnJhbWV3b3JrLnRzJ1xuaW1wb3J0IENhcm91c2VsIGZyb20gJy4vY29tcG9uZW50L2Nhcm91c2VsLnRzeCdcblxuXG5cbntcbiAgXG4gIGNvbnN0IGltZ0xpc3QgPSBbXG4gICAge1xuICAgICAgc3JjOiAnLi9pbWcvMC5qcGcnXG4gICAgfSxcbiAgICB7XG4gICAgICBzcmM6ICcuL2ltZy8xLmpwZydcbiAgICB9LFxuICAgIHsgXG4gICAgICBzcmM6ICcuL2ltZy8yLmpwZydcbiAgICB9LFxuICAgIHtcbiAgICAgIHNyYzogJy4vaW1nLzMuanBnJ1xuICAgIH1cbiAgXVxuXG4gIGNvbnN0IGNhcm91c2VsQ21wID0gPENhcm91c2VsIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnY2hhbmdlZCcsIGV2ZW50KVxuICB9fSBkdXJhdGlvbj17MjAyMX0gaW1nTGlzdD17aW1nTGlzdH0+PC9DYXJvdXNlbD5cbiAgY2Fyb3VzZWxDbXAubW91bnRUbyhkb2N1bWVudC5ib2R5KVxufSJdLCJzb3VyY2VSb290IjoiIn0=