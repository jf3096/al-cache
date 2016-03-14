Dom Loaded.js
===========================
Introduction
-------------------------------------
The purpose of this JavaScript plugin is used to detect document loaded. It allows you to invoke your function (callback) once document is ready.
Currently it does not support either AMD or CMD. But it will in the future. The mini version is only **370B**.

Browser compatibility
-------------------------------------
IE8+, Chrome, Firefox, Safari, Opera 5.0+

How to use
-------------------------------------
Simply, this plugin only exposes one function shown as followings:

```bash
dom.domReady(function(){alert('callback')})
```
It supports variable chaining.

```bash
var callbackFn = function(){
    alert('callback')
};
dom.domReady(callbackFn)(callbackFn)(callbackFn);
```