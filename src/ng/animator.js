'use strict';

// NOTE: this is a pseudo directive.

/**
 * @ngdoc directive
 * @name ng.directive:ngAnimate
 *
 * @description
 * Директива `ngAnimate` работает как атрибут, который прилагается к уже существующим директивам.
 * Он воспроизводит эффект выполнения DOM-манипуляций. Это позволяет воспроизводить сложную анимацию 
 * не обременя директиву, которая её использует, деталями анимации. Директивы
 * `ngRepeat`, `ngInclude`, `ngSwitch`, `ngShow`, `ngHide` и `ngView` уже поддерживают директиву `ngAnimate`.
 * Пользовательские директивы могут воспроизводить анимацию с помощью сервиса {@link ng.$animator $animator}.
 *
 * Ниже показано для каких событий поддерживается анимация в ng-директивах:
 *
 * * {@link ng.directive:ngRepeat#animations ngRepeat} — enter, leave и move
 * * {@link ng.directive:ngView#animations ngView} — enter и leave
 * * {@link ng.directive:ngInclude#animations ngInclude} — enter и leave
 * * {@link ng.directive:ngSwitch#animations ngSwitch} — enter и leave
 * * {@link ng.directive:ngShow#animations ngShow & ngHide} - show и hide соответственно
 *
 * Подробную информацию об использовании анимации можно найти на странице каждой директивы.
 *
 * Ниже приведен пример директивы, использующей атрибут ngAnimate:
 *
 * <pre>
 * <!-- Также можно использовать data-ng-animate, ng:animate или x-ng-animate -->
 * <ANY ng-directive ng-animate="{event1: 'animation-name', event2: 'animation-name-2'}"></ANY>
 *
 * <!-- Также можно использовать короткую запись -->
 * <ANY ng-directive ng-animate=" 'animation' "></ANY>
 * <!-- которая раскрывается в -->
 * <ANY ng-directive ng-animate="{ enter: 'animation-enter', leave: 'animation-leave', ...}"></ANY>
 *
 * <!-- имейте в виду, что в ng-animate могут использоваться выражения -->
 * <ANY ng-directive ng-animate=" computeCurrentAnimation() "></ANY>
 * </pre>
 *
 * Атрибуты `event1` and `event2` относятся к конкретным событиям анимации в директиве, на которой они назначены.
 *
 * Имейте ввиду, что при показе анимации, ни один потомок такой анимации не может быть анимаирован.
 *
 * <h2>CSS-анимация</h2>
 * По умолчанию ngAnimate задействует для события анимации два CSS3-класса DOM-элемента. Но вы, разработчики, 
 * должны гарантировать, что что анимация будет происходить с использованием кросс-браузерных CSS3-переходов.
 * Все, что требуется, это следующий код CSS:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  Префикс animate-enter является именем события, 
 *  подставленным в атрибут ngAnimate.
 * &#42;/
 * .animate-enter-setup {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  -moz-transition: 1s linear all; /&#42; Firefox &#42;/
 *  -ms-transition: 1s linear all; /&#42; IE10 &#42;/
 *  -o-transition: 1s linear all; /&#42; Opera &#42;/
 *  transition: 1s linear all; /&#42; Future Browsers &#42;/
 *
 *  /&#42; Подготовка кода анимации &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Имейте в виду, что можно совместить оба CSS-класса
 *  вместе, чтобы избежать любых конфликтов CSS
 * &#42;/
 * .animate-enter-setup.animate-enter-start {
 *  /&#42; Код анимации &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div ng-directive ng-animate="{enter: 'animate-enter'}"></div>
 * </pre>
 * 
 * При возникновении мутации DOM, сперва устанавливается класс, затем браузеру разрешается форматировать содержимое, 
 * а затем добавляется класс для запуска анимации. Директива NgAnimate автоматически определит продолжительность 
 * анимации, чтобы узнать, когда она заканчивается. После окончания анимация, оба CSS-класса удалятся из DOM. 
 * Если браузер не поддерживает CSS-переходы, то анимация начнется и сразу закончится, установив DOM-элемент 
 * в конечное состояние. В конечном состоянии DOM-элемент не содержит классов анимации.
 *
 * <h2>JavaScript-анимация</h2>
 * Если не хотите использовать CSS3-анимацию или хотите использовать ее в браузерах, которые ее не поддерживают, 
 * можно использовать JavaScript-анимацию, определенную внутри ngModule.
 * <pre>
 * var ngModule = angular.module('YourApp', []);
 * ngModule.animation('animate-enter', function() {
 *   return {
 *     setup : function(element) {
 *       //подготовка элемента для анимации
 *       element.css({ 'opacity': 0 });
 *       var memo = "..."; //значение для предачи в функцию start
 *       return memo;
 *     },
 *     start : function(element, done, memo) {
 *       //запуск анимации
 *       element.animate({
 *         'opacity' : 1
 *       }, function() {
 *         //вызывается при завершении анимации
 *         done()
 *       });
 *     }
 *   }
 * });
 * </pre>
 *
 * Можно заметить, что код JavaScript придерживается аналогичного шаблона CSS3-анимации. После определения, анимация 
 * может быть использована так же с атрибутом ngAnimate. Имейте в виду, что при использовании JavaScript-анимации, 
 * ngAnimate добавит в элемент такие же CSS-классы, какие добавляются при поддержке CSS3 анимации (даже если 
 * используется JavaScript-анимация), но она не будет пытаться найти любые CSS3-значения продолжительности перехода. 
 * Это заблокирует анимацию пока хотя бы раз не будет выполнена функция. Так что важно убедиться, чтобы анимация 
 * не забыла хотя бы раз запустить функцию для завершения.
 *
 * @param {expression} ngAnimate Используется для настройки анимации DOM-манипуляций.
 *
 */

var $AnimatorProvider = function() {
  var NG_ANIMATE_CONTROLLER = '$ngAnimateController';
  var rootAnimateController = {running:true};

  this.$get = ['$animation', '$window', '$sniffer', '$rootElement', '$rootScope',
      function($animation, $window, $sniffer, $rootElement, $rootScope) {
    $rootElement.data(NG_ANIMATE_CONTROLLER, rootAnimateController);
    var unregister = $rootScope.$watch(function() {
      unregister();
      if (rootAnimateController.running) {
        $window.setTimeout(function() {
          rootAnimateController.running = false;
        }, 0);
      }
    });

    /**
     * @ngdoc function
     * @name ng.$animator
     * @function
     *
     * @description
     * The $animator.create service provides the DOM manipulation API which is decorated with animations.
     *
     * @param {Scope} scope the scope for the ng-animate.
     * @param {Attributes} attr the attributes object which contains the ngAnimate key / value pair. (The attributes are
     *        passed into the linking function of the directive using the `$animator`.)
     * @return {object} the animator object which contains the enter, leave, move, show, hide and animate methods.
     */
     var AnimatorService = function(scope, attrs) {
        var ngAnimateAttr = attrs.ngAnimate;
        var ngAnimateValue = ngAnimateAttr && scope.$eval(ngAnimateAttr);
        var animator = {};
  
        /**
         * @ngdoc function
         * @name ng.animator#enter
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Injects the element object into the DOM (inside of the parent element) and then runs the enter animation.
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the enter animation
        */
        animator.enter = animateActionFactory('enter', insert, noop);
  
        /**
         * @ngdoc function
         * @name ng.animator#leave
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM.
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the leave animation
        */
        animator.leave = animateActionFactory('leave', noop, remove);
  
        /**
         * @ngdoc function
         * @name ng.animator#move
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animator will either append it into the parent container or
         * add the element directly after the after element if present. Then the move animation will be run.
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the move animation
        */
        animator.move = animateActionFactory('move', move, noop);
  
        /**
         * @ngdoc function
         * @name ng.animator#show
         * @methodOf ng.$animator
         * @function
         *
         * @description
         * Reveals the element by setting the CSS property `display` to `block` and then starts the show animation directly after.
         *
         * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden
        */
        animator.show = animateActionFactory('show', show, noop);
  
        /**
         * @ngdoc function
         * @name ng.animator#hide
         * @methodOf ng.$animator
         *
         * @description
         * Starts the hide animation first and sets the CSS `display` property to `none` upon completion.
         *
         * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden
        */
        animator.hide = animateActionFactory('hide', noop, hide);
        return animator;
  
        function animateActionFactory(type, beforeFn, afterFn) {
          var className = ngAnimateAttr
              ? isObject(ngAnimateValue) ? ngAnimateValue[type] : ngAnimateValue + '-' + type
              : '';
          var animationPolyfill = $animation(className);
  
          var polyfillSetup = animationPolyfill && animationPolyfill.setup;
          var polyfillStart = animationPolyfill && animationPolyfill.start;
  
          if (!className) {
            return function(element, parent, after) {
              beforeFn(element, parent, after);
              afterFn(element, parent, after);
            }
          } else {
            var setupClass = className + '-setup';
            var startClass = className + '-start';
  
            return function(element, parent, after) {
              if (!parent) {
                parent = after ? after.parent() : element.parent();
              }
              if ((!$sniffer.supportsTransitions && !polyfillSetup && !polyfillStart) ||
                  (parent.inheritedData(NG_ANIMATE_CONTROLLER) || noop).running) {
                beforeFn(element, parent, after);
                afterFn(element, parent, after);
                return;
              }

              element.data(NG_ANIMATE_CONTROLLER, {running:true});
              element.addClass(setupClass);
              beforeFn(element, parent, after);
              if (element.length == 0) return done();
  
              var memento = (polyfillSetup || noop)(element);
  
              // $window.setTimeout(beginAnimation, 0); this was causing the element not to animate
              // keep at 1 for animation dom rerender
              $window.setTimeout(beginAnimation, 1);
  
              function beginAnimation() {
                element.addClass(startClass);
                if (polyfillStart) {
                  polyfillStart(element, done, memento);
                } else if (isFunction($window.getComputedStyle)) {
                  var vendorTransitionProp = $sniffer.vendorPrefix + 'Transition';
                  var w3cTransitionProp = 'transition'; //one day all browsers will have this
  
                  var durationKey = 'Duration';
                  var duration = 0;
                  //we want all the styles defined before and after
                  forEach(element, function(element) {
                    var globalStyles = $window.getComputedStyle(element) || {};
                    duration = Math.max(
                        parseFloat(globalStyles[w3cTransitionProp    + durationKey]) ||
                        parseFloat(globalStyles[vendorTransitionProp + durationKey]) ||
                        0,
                        duration);
                  });
                  $window.setTimeout(done, duration * 1000);
                } else {
                  done();
                }
              }
  
              function done() {
                afterFn(element, parent, after);
                element.removeClass(setupClass);
                element.removeClass(startClass);
                element.removeData(NG_ANIMATE_CONTROLLER);
              }
            }
          }
        }
  
        function show(element) {
          element.css('display', '');
        }
  
        function hide(element) {
          element.css('display', 'none');
        }
  
        function insert(element, parent, after) {
          if (after) {
            after.after(element);
          } else {
            parent.append(element);
          }
        }
  
        function remove(element) {
          element.remove();
        }
  
        function move(element, parent, after) {
          // Do not remove element before insert. Removing will cause data associated with the
          // element to be dropped. Insert will implicitly do the remove.
          insert(element, parent, after);
        }
      };

    /**
     * @ngdoc function
     * @name ng.animator#enabled
     * @methodOf ng.$animator
     * @function
     *
     * @param {Boolean=} If provided then set the animation on or off.
     * @return {Boolean} Current animation state.
     *
     * @description
     * Globally enables/disables animations.
     *
    */
    AnimatorService.enabled = function(value) {
      if (arguments.length) {
        rootAnimateController.running = !value;
      }
      return !rootAnimateController.running;
    };

    return AnimatorService;
  }];
};
