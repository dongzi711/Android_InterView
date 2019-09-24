# Weex是如何在Android客户端上跑起来的

> [参考：Weex 是如何在 iOS 客户端上跑起来的](https://www.jianshu.com/p/41cde2c62b81)

## 目录

- Weex概述
- Weex工作原理
- Weex在IOS上如何跑起来
- 关于Weex，ReactNative



### 1. Weex概述

```
Weex非常轻量，体积小巧，语法简单，方便接入和上手。ReactNative官方只允许将ReactNative基础js库和业务JS一起打成一个JS bundle，没有提供分包的功能，所以如果想节约流量就必须制作分包打包工具。而Weex默认打的JS bundle只包含业务JS代码，体积小很多，基础JS库包含在Weex SDK中，这一点Weex与Facebook的React Native和微软的Cordova相比，Weex更加轻量，体积小巧。把Weex生成的JS bundle轻松部署到服务器端，然后Push到客户端，或者客户端请求新的资源即可完成发布。如此快速的迭代就解决了前言里面说的第一个痛点，发布无法控制时间，

Weex中Native组件和API都可以横向扩展，业务方可去中心化横向灵活化定制组件和功能模块。并且还可以直接复用Web前端的工程化管理和监控性能等工具。
知乎上有一个关于Weex 和 ReactNative很好的对比文章weex&ReactNative对比，推荐大家阅读。
Weex在2017年2月17日正式发布v0.10.0，这个里程碑的版本开始完美的兼容Vue.js开发Weex界面。
Weex又于2017年2月24 迁移至 Apache 基金会，阿里巴巴会基于 Apache 的基础设施继续迭代。并启用了全新的 GitHub 仓库：https://github.com/apache/incubator-weex
故以下源码分析都基于v0.17.0这个版本。
```

[知乎上的对比](https://zhuanlan.zhihu.com/p/21677103)

### 2. Weex工作原理

Weex可以通过自己设计的DSL，书写.we文件或者.vue文件来开发界面，整个页面书写分成了3段，template、style、script，借鉴了成熟的MVVM的思想。

####Weex的页面结构

##### DOM模型

Weex页面通过类似的HTML DOM的方式管理界面。首先，页面会被分解成一个DOM树。每个DOM节点都代表了一个相对独立的native视图单元。然后不同的视图单元通过树状结构组织在一起，构成完成的页面。

> Weex 在 JS 引擎中，为每个页面都提供了一套 Native DOM APIs，这套接口和 HTML DOM APIs 非常接近，利用这套接口我们可以通过 JavaScript 控制 native 的渲染逻辑。而且 Weex 上层的 Vue 2.0 也是基于这套接口进行适配的。

> *绝大多数情况下 JS 框架会把 Native DOM APIs 都封装好，开发者不需要直接对 Native DOM 进行操作。*
>
> - `Document` 类，整个页面文档。
> - `Node` 类，结点的基础类。
> - `Element` 类，元素结点，继承自 `Node`，单个视图单元。
> - `Comment` 类，注释结点，继承自 `Node`，无实际意义，通常用作占位符。
>
> **每个 Weex 页面都有一个 weex.document 对象，该对象就是一个 Document 类的实例，也是下面所有接口调用的起点。**

[Navitve DOM API](https://weex.apache.org/cn/references/native-dom-api.html)

##### 组件

Weex 的界面就是由这些组件以 DOM 树的方式构建出来的。这些组件，原生view(Weex中的Component)与weex标签的映射。自带的组件都是通过这样的方式创建出来的。

> <div></div> 对应 WXDiv

##### 布局系统

Weex 页面中的组件会按照一定的布局规范来进行排布，我们这里提供了 **CSS 中的盒模型**、**flexbox** 和 **绝对/相对/固定/吸附布局**这三大块布局模型。

- 盒模型：通过宽、高、边框、内外边距、边框等 CSS 属性描述一个组件本身的尺寸。
- flexbox：通过 CSS 3 Flexbox 布局规范定义和描述组件之间的空间分布情况。
- position：支持 CSS position 属性中的 `absolute`, `relative`, `fixed`, `sticky` 位置类型，其中 `relative` 是默认值。

##### 功能

Weex 提供了非常丰富的系统功能 API，包括弹出存储、网络、导航、弹对话框和 toast 等，开发者可以在 Weex 页面通过获取一个 **native module **的方式引入并调用这些客户端功能 API。

上文可以知道所有的功能，都是通过module来实现的。在Js中调用。

> ```
> WXStorageModule->Storage Api
> ```

##### 生命周期

每个 Weex 页面都有其自身的生命周期，页面从开始被创建到最后被销毁，会经历到整个过程。这是通过对 Weex 页面的创建和销毁，在路由中通过 SDK 自行定义并实现的。



### 3.Weex在Android中是如何跑起来的

从.we或.vue文件到JS bundle这部分前端的代码。本文暂不涉及。

虽然笔者对这部分的知识相当匮乏，但是可以先通过看看`.we`编译后的js文件，先看看结构。更加具体的后面陆续学习后补充。

##### 简单的.we`编译后的js

```json
//第一行，表明了编译前的文件。vue的话，则为vue
// { "framework": "Weex" }
//开始 webpackBootstrap，应该是初始化脚手架的部分。
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
//从0这里开始，就是我们写的代码了。在0这里，获取通用的style和template
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __weex_template__ = __webpack_require__(1)
	var __weex_style__ = __webpack_require__(2)

	__weex_define__('@weex-component/22de37c9919eb3fd01a7758b3c5f2baf', [], function(__weex_require__, __weex_exports__, __weex_module__) {

	    __weex_module__.exports.template = __weex_template__

	    __weex_module__.exports.style = __weex_style__

	})

	__weex_bootstrap__('@weex-component/22de37c9919eb3fd01a7758b3c5f2baf',undefined,undefined)

/***/ }),
  /*从1开始，就是我们自己定义的对象了。看起来像是dom 模型的json文件
  type为div的话，它对应的classlist 为container。children:标记它的子节点。
  我们看到，一个节点，对应的属性可能有 type,classlist,attr,event
  */
/* 1 */
/***/ (function(module, exports) {

	module.exports = {
	  "type": "div",
	  "classList": [
	    "container"
	  ],
	  "children": [
	    {
	      "type": "div",
	      "classList": [
	        "cell"
	      ],
	      "children": [
	        {
	          "type": "image",
	          "classList": [
	            "thumb"
	          ],
	          "attr": {
	            "src": ""
	          }
	        },
	        {
	          "type": "text",
	          "classList": [
	            "title"
	          ],
	          "attr": {
	            "value": "Hello Weex"
	          }
	        }
	      ]
	    }
	  ]
	}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = {
	  "cell": {
	    "marginTop": 10,
	    "marginLeft": 10
	  },
	  "thumb": {
	    "width": 200,
	    "height": 200
	  },
	  "title": {
	    "textAlign": "center",
	    "flex": 1,
	    "color": "#808080"
	  }
	}

/***/ })
/******/ ]);
```

- 从1开始，就是我们自己定义的对象了。*看起来像是dom 模型的json文件*。

  对于`div`这样的容器型组件，它可能有`children`属性。

  我们看到，一个节点，对应的属性可能有 `type`,`classlist`,`attr`,`event`。


**主要还是围绕Weex SDK的源码来进行了解。**

#### Weex SDK初始化

先来看看playground App Android中是如何初始化的吧

> 文件位置：incubator-weex-master 2/android/playground/app/src/main/java/com/alibaba/weex/WxApplication.java

```java
public class WXApplication extends Application {

  @Override
  public void onCreate() {
    super.onCreate();

    /**
     * Set up for fresco usage.
     * Set<RequestListener> requestListeners = new HashSet<>();
     * requestListeners.add(new RequestLoggingListener());
     * ImagePipelineConfig config = ImagePipelineConfig.newBuilder(this)
     *     .setRequestListeners(requestListeners)
     *     .build();
     * Fresco.initialize(this,config);
     **/
//    initDebugEnvironment(true, false, "DEBUG_SERVER_HOST");
    WXSDKEngine.addCustomOptions("appName", "WXSample");
    WXSDKEngine.addCustomOptions("appGroup", "WXApp");
    WXSDKEngine.initialize(this,
                           new InitConfig.Builder()
                               //.setImgAdapter(new FrescoImageAdapter())// use fresco adapter
                               .setImgAdapter(new ImageAdapter())
                               .setWebSocketAdapterFactory(new DefaultWebSocketAdapterFactory())
                               .setJSExceptionAdapter(new JSExceptionAdapter())
                               .setHttpAdapter(new InterceptWXHttpAdapter())
                               .build()
                          );

    WXSDKManager.getInstance().setAccessibilityRoleAdapter(new DefaultAccessibilityRoleAdapter());

    try {
      Fresco.initialize(this);
      WXSDKEngine.registerComponent("synccomponent", WXComponentSyncTest.class);
      WXSDKEngine.registerComponent(WXParallax.PARALLAX, WXParallax.class);

      WXSDKEngine.registerComponent("richtext", RichText.class);
      WXSDKEngine.registerModule("render", RenderModule.class);
      WXSDKEngine.registerModule("event", WXEventModule.class);
      WXSDKEngine.registerModule("syncTest", SyncTestModule.class);

      WXSDKEngine.registerComponent("mask",WXMask.class);
      WXSDKEngine.registerDomObject("mask", WXMaskDomObject.class);

      WXSDKEngine.registerModule("myModule", MyModule.class);
      WXSDKEngine.registerModule("geolocation", GeolocationModule.class);
      /**
       * override default image tag
       * WXSDKEngine.registerComponent("image", FrescoImageComponent.class);
       */


    } catch (WXException e) {
      e.printStackTrace();
    }

    registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
      @Override
      public void onActivityCreated(Activity activity, Bundle bundle) {

      }

      @Override
      public void onActivityStarted(Activity activity) {

      }

      @Override
      public void onActivityResumed(Activity activity) {

      }

      @Override
      public void onActivityPaused(Activity activity) {

      }

      @Override
      public void onActivityStopped(Activity activity) {

      }

      @Override
      public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {

      }

      @Override
      public void onActivityDestroyed(Activity activity) {
        // The demo code of calling 'notifyTrimMemory()'
        if (false) {
          // We assume that the application is on an idle time.
          WXSDKManager.getInstance().notifyTrimMemory();
        }
        // The demo code of calling 'notifySerializeCodeCache()'
        if (false) {
          WXSDKManager.getInstance().notifySerializeCodeCache();
        }
      }
    });

  }
  ...
}
```

##### 初始化配置

初始化的代码很长，主要可以分成下面几个部分来看：

1. `WXSDKEngine.addCustomOptions("appName", "WXSample")`方法。这个方法可以注册一些APP中的常量到js内方便调用。JS可以通过`weex.config.env.appName`这样的方式来调用。

2. 通过建造者模式来创造InitConfig来初始化WxSDKEngine。

   其中可以设置的Adapter包括：

   ```java
   //网络请求的Apdater ,不实现的话，就使用内置了一个DefaultWXHttpAdapter
   IWXHttpAdapter httpAdapter;	
   //需要自己实现的图片加载的Adapter
   IWXImgLoaderAdapter imgAdapter;
   //...以及以下各种Adapter
   IDrawableLoader drawableLoader;
   IWXUserTrackAdapter utAdapter;
   IWXStorageAdapter storageAdapter;
   IWXSoLoaderAdapter soLoader;
   URIAdapter mURIAdapter;
   IWXJSExceptionAdapter mJSExceptionAdapter;
   String framework;
   IWebSocketAdapterFactory webSocketAdapterFactory;
   ```

   这些Adapter其实是内置的Component中利用适配器模式抽象出来的接口。高度灵活，由我们自己实现。

3. 通过`WXSDKEngine.registerComponent("richtext", RichText.class);`和 `WXSDKEngine.registerModule("render", RenderModule.class);`方法来注册自定义的Component和Module。Component可以看出是Android中native控件和Wx的绑定。而Module则可以看出是非UI功能的组件和Wx的绑定。具体的这两者，放到后面再细谈。



##### 初始化过程

1. **`WXSDKEngine.initialize(this, config)`方法。**

   ```java
    public static void initialize(Application application,InitConfig config){
      //这里是先同步这个方法，方法未执行完，不会走其他被mLock锁住的方法。
      //可以看到mLock其实只是锁了一个查询初始化状态的方法
      synchronized (mLock) {
         if (mIsInit) {
           return;
         }
         long start = System.currentTimeMillis();
         WXEnvironment.sSDKInitStart = start;
        //是否可调试。可以的话。在控制台输出log
         if(WXEnvironment.isApkDebugable()){
           WXEnvironment.sLogLevel = LogLevel.DEBUG;
         }else{
   		if(WXEnvironment.sApplication != null){
   		  WXEnvironment.sLogLevel = LogLevel.WARN;
   		}else {
   		  WXLogUtils.e(TAG,"WXEnvironment.sApplication is " + WXEnvironment.sApplication);
   		}
         }
        //进行初始化
         doInitInternal(application,config);
        //log 初始化耗时
         WXEnvironment.sSDKInitInvokeTime = System.currentTimeMillis()-start;
         WXLogUtils.renderPerformanceLog("SDKInitInvokeTime", WXEnvironment.sSDKInitInvokeTime);
         mIsInit = true;
       }
     }
   ```

   进一步看，`doInitInternal`做了什么

   ```java
   private static void doInitInternal(final Application application,final InitConfig config){
     //校验Application
       WXEnvironment.sApplication = application;
   	if(application == null){
   	  WXLogUtils.e(TAG, " doInitInternal application is null");
   	}
       WXEnvironment.JsFrameworkInit = false;
   	//向WxBridgeManager post一个Runnable进行初始化.我们知道其实WxBridgeManager运行在一个HandlerThread中。这里就进行了异步的初始化。
       WXBridgeManager.getInstance().post(new Runnable() {
         @Override
         public void run() {
           long start = System.currentTimeMillis();
           WXSDKManager sm = WXSDKManager.getInstance();
           //调用一个全局的回调
           sm.onSDKEngineInitialize();
           if(config != null ) {
             //将配置的参数，保存在SDK manager中
             sm.setInitConfig(config);
           }
           //初始化Android的JS引擎.
           WXSoInstallMgrSdk.init(application,
                                 sm.getIWXSoLoaderAdapter(),
                                 sm.getWXStatisticsListener());
           //进入这个方法，能够看到对so文件的初始化做了版本的适配。而且做了失败的重试
           boolean isSoInitSuccess = WXSoInstallMgrSdk.initSo(V8_SO_NAME, 1, config!=null?config.getUtAdapter():null);
           if (!isSoInitSuccess) {
             return;
           }
           //初始化JSFrameWork.其实就是像JSThread发送一个 INIT_FRAMEWORK的消息
           sm.initScriptsFramework(config!=null?config.getFramework():null);
   		//最后统计时间
           WXEnvironment.sSDKInitExecuteTime = System.currentTimeMillis() - start;
           WXLogUtils.renderPerformanceLog("SDKInitExecuteTime", WXEnvironment.sSDKInitExecuteTime);
         }
       });
     //这里注册公共的组件部分
       register();
     }
   ```

   这里的核心方法可以继续看，是如何初始化JSFramework的

   方法`initFramework`

   ```java
   private void initFramework(String framework) {
     	//这第一次一定是去加载main.js文件了。main.js文件到底是何方神圣？
       if (!isJSFrameworkInit()) {
         if (TextUtils.isEmpty(framework)) {
           // if (WXEnvironment.isApkDebugable()) {
           WXLogUtils.d("weex JS framework from assets");
           // }
           framework = WXFileUtils.loadAsset("main.js", WXEnvironment.getApplication());
         }
         //如果为空，则直接设置失败
         if (TextUtils.isEmpty(framework)) {
           setJSFrameworkInit(false);
           commitJSFrameworkAlarmMonitor(IWXUserTrackAdapter.JS_FRAMEWORK, WXErrorCode.WX_ERR_JS_FRAMEWORK, "JS Framework is empty!");
           return;
         }
         try {
           if (WXSDKManager.getInstance().getWXStatisticsListener() != null) {
             WXSDKManager.getInstance().getWXStatisticsListener().onJsFrameworkStart();
           }
   		//下面这段是去获取crash文件
           long start = System.currentTimeMillis();
           String crashFile = "";
           try {
             crashFile = WXEnvironment.getApplication().getApplicationContext().getCacheDir().getPath();
           } catch (Exception e) {
             e.printStackTrace();
           }
           boolean pieSupport = true;
           try {
             if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
               pieSupport = false;
             }
           } catch (Exception e) {
             e.printStackTrace();
           }
           WXLogUtils.d("[WXBridgeManager] initFrameworkEnv crashFile:" + crashFile + " pieSupport:" + pieSupport);
           //看注释，知道开始扩展frameworkenv
           // extends initFramework.这里这个是进入native方法中
           if (mWXBridge.initFrameworkEnv(framework, assembleDefaultOptions(), crashFile, pieSupport) == INIT_FRAMEWORK_OK) {
             WXEnvironment.sJSLibInitTime = System.currentTimeMillis() - start;
             WXLogUtils.renderPerformanceLog("initFramework", WXEnvironment.sJSLibInitTime);
             WXEnvironment.sSDKInitTime = System.currentTimeMillis() - WXEnvironment.sSDKInitStart;
             WXLogUtils.renderPerformanceLog("SDKInitTime", WXEnvironment.sSDKInitTime);
             //这里还没报错，那就算是初始化完成了。
             setJSFrameworkInit(true);

             if (WXSDKManager.getInstance().getWXStatisticsListener() != null) {
               WXSDKManager.getInstance().getWXStatisticsListener().onJsFrameworkReady();
             }
   		//这里先将失败的任务重新添加回来
             execRegisterFailTask();
             WXEnvironment.JsFrameworkInit = true;
             //重新注册。最后通过jsThread中JsBridge通过execJS系列native方法重新注册
             registerDomModule();
             String reinitInfo = "";
             if (reInitCount > 1) {
               reinitInfo = "reinit Framework:";
             }
             commitJSFrameworkAlarmMonitor(IWXUserTrackAdapter.JS_FRAMEWORK, WXErrorCode.WX_SUCCESS, reinitInfo + "success");
           } else {
             if (reInitCount > 1) {
               WXLogUtils.e("[WXBridgeManager] invokeReInitFramework  ExecuteJavaScript fail");
               String err = "[WXBridgeManager] invokeReInitFramework  ExecuteJavaScript fail reinit FrameWork";
               commitJSFrameworkAlarmMonitor(IWXUserTrackAdapter.JS_FRAMEWORK, WXErrorCode.WX_ERR_JS_REINIT_FRAMEWORK, err);
             } else {
               WXLogUtils.e("[WXBridgeManager] invokeInitFramework  ExecuteJavaScript fail");
               String err = "[WXBridgeManager] invokeInitFramework  ExecuteJavaScript fail";
               commitJSFrameworkAlarmMonitor(IWXUserTrackAdapter.JS_FRAMEWORK, WXErrorCode.WX_ERR_JS_FRAMEWORK, err);
             }
           }
         } catch (Throwable e) {
           if (reInitCount > 1) {
             WXLogUtils.e("[WXBridgeManager] invokeInitFramework ", e);
             String err = "[WXBridgeManager] invokeInitFramework reinit FrameWork exception!#" + e.toString();
             commitJSFrameworkAlarmMonitor(IWXUserTrackAdapter.JS_FRAMEWORK, WXErrorCode.WX_ERR_JS_REINIT_FRAMEWORK, err);
           } else {
             WXLogUtils.e("[WXBridgeManager] invokeInitFramework ", e);
             String err = "[WXBridgeManager] invokeInitFramework exception!#" + e.toString();
             commitJSFrameworkAlarmMonitor(IWXUserTrackAdapter.JS_FRAMEWORK, WXErrorCode.WX_ERR_JS_FRAMEWORK, err);
           }
         }

       }
     }

   ```

   ​

2. **加载本地的`main.js`**

SDK里面会带一个main.js，直接打开这个文件会看到一堆经过webpack压缩之后的文件。这个文件的源文件在[https://github.com/apache/incubator-weex/tree/master/html5](https://link.jianshu.com?t=https://github.com/apache/incubator-weex/tree/master/html5)目录下。对应的入口文件是 [html5/render/native/index.js](https://link.jianshu.com?t=https://github.com/apache/incubator-weex/blob/master/html5/render/native/index.js)

```javascript
import { subversion } from '../../../package.json'
import runtime from '../../runtime'
import frameworks from '../../frameworks/index'
import services from '../../services/index'

const { init, config } = runtime
config.frameworks = frameworks
const { native, transformer } = subversion

for (const serviceName in services) {
  runtime.service.register(serviceName, services[serviceName])
}

runtime.freezePrototype()
runtime.setNativeConsole()

// register framework meta info
global.frameworkVersion = native
global.transformerVersion = transformer

// init frameworks
const globalMethods = init(config)

// set global methods
for (const methodName in globalMethods) {
  global[methodName] = (...args) => {
    const ret = globalMethods[methodName](...args)
    if (ret instanceof Error) {
      console.error(ret.toString())
    }
    return ret
  }
}
```

这一段js是会被当做入参传递给WXSDKManager。它也就是Native这边的js framework。

3. **WXSDKEngine的初始化**

   ​