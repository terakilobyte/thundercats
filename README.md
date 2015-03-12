[![Circle CI](https://circleci.com/gh/r3dm/thundercats.svg?style=svg)](https://circleci.com/gh/r3dm/thundercats) [![Stories in Ready](https://badge.waffle.io/r3dm/thundercats.png?label=ready&title=Ready)](https://waffle.io/r3dm/thundercats) [![Join the chat at https://gitter.im/r3dm/thundercats](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/r3dm/thundercats?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
ThunderCats.js
=======




> Thundercats, Ho!


A [Flux](https://github.com/facebook/flux/) architecture implementation based on [RxJS](https://github.com/Reactive-Extensions/RxJS)

An exodus from [rx-flux](https://github.com/fdecampredon/rx-flux).

The [Flux](https://github.com/facebook/flux/) architecture allows you to think your application as an unidirectional flow of data, this module aims to facilitate the use of [RxJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) as basis for defining the relations between the different entities composing your application.


Difference with the Original Flux
---------------------------------

RxFlux shares more similarities with [RefluxJS](https://github.com/spoike/refluxjs) than with the original architecture.

* A store is an [RxJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) that *holds* a value
* An action is a function and an [RxJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)
* A store subscribes to an action and update accordingly its value.
* There is no central dispatcher.

Store
-----

###Usage

A `Store` is an [RxJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) :


###Api

The `Store` *class* inherits from [`Rx.Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md), it also exposes the following methods:


Action
------

###Usage

An action is a function and an [RxJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md), each time you call the action function it will propagate a new value: 

```javascript
var Action = require('rx-flux').Action;

var myAction = Action.create();

myAction.subscribe(function (value) {
  console.log(value);
});

myAction('foo'); // log 'foo'
myAction('bar'); // log 'bar'
```

When creating an action you can also pass as argument a `map` function to `Action.create`, the value passed to the action will be transformed by that map function, the transformed result will be notified and returned by the action call : 

```javascript
var Action = require('rx-flux').Action;

var myAction = Action.create(function (string) {
  return string + ' bar';
});

myAction.subscribe(function (value) {
  console.log(value);
});

var result = myAction('foo'); // log 'foo bar'
console.log(result) // log 'foo bar'
```

Note that the `map` function will always be executed, even if there is no active subscription : 

```javascript
var Action = require('rx-flux').Action;

var myAction = Action.create(function (string) {
  console.log(string);
  return string + ' bar';
});

myAction('foo'); // log 'foo'
```

An action cannot propagate an `error` or `complete` notification, **if an error is thrown in the map function that error won't be catched** : 

```javascript
var Action = require('rx-flux').Action;

var myAction = Action.create(function () {
  throw new Error('error in map function');
});

myAction.subscribe(function (value) {
  console.log(value); // will never be called
}, function (error) {
  console.log(error); // will never be called
});

try {
  myAction('foo'); // no log
} catch(e) {
  e // Error('error in map function')
}
```

Finally `Action` provide a special operator `waitFor` that operator takes as arguments a list of observables and insure that those observable published a new value during the action notification process before passing the notification : 

```javascript
var Action = require('rx-flux').Action;
var Rx = require('rx');

var myAction = Action.create();
var subject1 = new Rx.Subject();
var subject2 = new Rx.Subject();

myAction.subscribe(function () {
  console.log('handler 1'); 
  subject1.onNext();
});

myAction.waitFor(subject1, subject2).subscribe(function () {
  console.log('handler 2'); 
});

myAction.subscribe(function () {
  console.log('handler 3'); 
  subject2.onNext();
});

myAction();// logs: 'handler 1', 'handler 3', 'handler 2'
```

###Api

Creating an action:
* `Action.create(map?: (val: A) => B): Rx.Observable<B> & (a: A) => B` : create a new action

Action instance api: 
* `waitFor(...observables: Rx.Observable[])`: Rx.Observable: create a new observable that waits that the observables passed as parameters publish a new value before notifying.
* `hasObservers(): boolean`: returns true if the action has subscribed observers.
