# Dagger2

## 如何使用dagger2

`dagger2`对比绝大多数的注入框架的好处就在于，它是编译器的生成代码，而不是通过反射的方式。

但是还是有一些需要注意的事项：

## 哲学

因为适用在Android之上的代码和其他的`java`代码的模式有所不同。

为了达到惯用和可移植性代码的目标，Dagger依靠ProGuard来后处理编译的字节码。这使得Dagger能够在服务器和Android上发出看起来和感觉自然的源代码，同时使用不同的工具链来生成在两个环境中都能高效执行的字节码。此外，Dagger明确的目标是确保它生成的Java源与ProGuard优化一致。？？

因为Android本身会帮助我们创建好Activity和Fragment等的实例。然而，只有在dagger自行管理创建注入的对象时，才能完好的工作。所以你需要在生命周期内进行成员的注入。

会产生类似的代码

```java
public class FrombulationActivity extends Activity {
  @Inject Frombulator frombulator;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // DO THIS FIRST. Otherwise frombulator might be null!
    ((SomeApplicationBaseType) getContext().getApplicationContext())
        .getApplicationComponent()
        .newActivityComponentBuilder()
        .activity(this)
        .build()
        .inject(this);
    // ... now you can write the exciting code
  }
}
```

这样有有一些问题：

1. 复制这样的代码段极其丑陋。难以维护和重构
2. 从根本上说，它需要请求注入（`FrombulationActivity`）的类型来了解其注入器。即使这是通过接口而不是具体类型完成的，**它打破了依赖注入的核心原则：类不应该知道注入的方式。**



### 在`dagger.android`包下的类，可以简化这个问题

#### 注入`Activity`Objects

1. 在`Application`级别的Component中关联上的`AndroidInjectionModule`,来确保能够绑定上的基本类型可以使用。

2. 首先写一个**`@Subcomponent`实现`AndroidInjector<YourActivity>`**并扩展方法，提供`Builder`

   ```java
   @Subcomponent(modules = ...)
   public interface YourActivitySubcomponent extends AndroidInjector<YourActivity> {
     @Subcomponent.Builder
     public abstract class Builder extends AndroidInjector.Builder<YourActivity> {}
   }
   ```

3. 添加一个绑定的`Module`，并定义

   ```java
   @Module(subcomponents = YourActivitySubcomponent.class)
   abstract class YourActivityModule {
     @Binds
     @IntoMap
     @ActivityKey(YourActivity.class)
     //这里需要注意的是，返回的值Factory,传入的值是builder
     abstract AndroidInjector.Factory<? extends Activity>
         bindYourActivityInjectorFactory(YourActivitySubcomponent.Builder builder);
   }
   ```

   最后，将其绑定到`ApplicationComponent`上

   ```java
   @Component(modules = {..., YourActivityModule.class})
   interface YourApplicationComponent {}
   ```

4. 让`Application`实现`HasActivityInjector`和`@Inject`DispatchingAndroidInjector<Activity>,并通过接口的实现方法返回。

   ```java
   public class YourApplication extends Application implements HasActivityInjector {
     @Inject DispatchingAndroidInjector<Activity> dispatchingActivityInjector;

     @Override
     public void onCreate() {
       super.onCreate();
       DaggerYourApplicationComponent.create()
           .inject(this);
     }

     @Override
     public AndroidInjector<Activity> activityInjector() {
       return dispatchingActivityInjector;
     }
   }
   ```

   5. 最后，还需要在`Activity.onCreate()`方法中调用`    AndroidInjection.inject(this);`

      ```java
      public class YourActivity extends Activity {
        public void onCreate(Bundle savedInstanceState) {
          AndroidInjection.inject(this);
          super.onCreate(savedInstanceState);
        }
      }
      ```

   ##### 号外！

   如果你的子组件极其构造器没有器的方法或者超类的话，则可以使用 [`@ContributesAndroidInjector`](https://google.github.io/dagger/api/latest/dagger/android/ContributesAndroidInjector.html)它们为您生成它们。**也就是说第2步和第3步可以省略！**，还要添加一个`abstract`模块方法，该方法返回您的活动，对其进行注释`@ContributesAndroidInjector`并指定要安装到子组件中的模块。如果子组件需要作用域，则也可以将范围注释应用于该方法。

   ```java
   @Module
   abstract class YourActivityModule {

   @ActivityScope
   @ContributesAndroidInjector(modules = { /* modules to install into the subcomponent */ })
   abstract YourActivity contributeYourActivityInjector();

   }
   ```



注入`Fragment`

1. 相对于Activity之于Application,Fragment的宿主Activity就需要实现`HasFragmentInjector`接口，并`@Inject `DispatchingAndroidInjector<Fragment> fragmentInjector,并返回它。
2. 在`Fragment`的`Attach`方法中进行` AndroidInjection.inject(this);`
3. 写基于Fragment的`Subcomponent`和`module`

```java
public class YourActivity extends Activity
    implements HasFragmentInjector {
  @Inject DispatchingAndroidInjector<Fragment> fragmentInjector;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    AndroidInjection.inject(this);
    super.onCreate(savedInstanceState);
    // ...
  }

  @Override
  public AndroidInjector<Fragment> fragmentInjector() {
    return fragmentInjector;
  }
}

public class YourFragment extends Fragment {
  @Inject SomeDependency someDep;

  @Override
  public void onAttach(Activity activity) {
    AndroidInjection.inject(this);
    super.onAttach(activity);
    // ...
  }
}

@Subcomponent(modules = ...)
public interface YourFragmentSubcomponent extends AndroidInjector<YourFragment> {
  @Subcomponent.Builder
  public abstract class Builder extends AndroidInjector.Builder<YourFragment> {}
}

@Module(subcomponents = YourFragmentSubcomponent.class)
abstract class YourFragmentModule {
  @Binds
  @IntoMap
  @FragmentKey(YourFragment.class)
  abstract AndroidInjector.Factory<? extends Fragment>
      bindYourFragmentInjectorFactory(YourFragmentSubcomponent.Builder builder);
}

@Subcomponent(modules = { YourFragmentModule.class, ... }
public interface YourActivityOrYourApplicationComponent { ... }
```

### 创建基类

因为在运行时由类`DispatchingAndroidInjector`查找合适 `AndroidInjector.Factory`的，所以基类可以实现`HasActivityInjector`/ `HasFragmentInjector`/以及调用`AndroidInjection.inject()`。每个子类都需要做的是绑定一个对应的`@Subcomponent`。Dagger提供了一些基本类型，例如[`DaggerActivity`](https://google.github.io/dagger/api/latest/dagger/android/DaggerActivity.html)和[`DaggerFragment`](https://google.github.io/dagger/api/latest/dagger/android/DaggerFragment.html)，如果你没有复杂的类层次结构。Dagger也提供了一个[`DaggerApplication`](https://google.github.io/dagger/api/latest/dagger/android/DaggerApplication.html)相同的目的 - 你需要做的就是扩展它并覆盖`applicationInjector()`返回应该注入的组件的 方法 `Application`。

以下类型也包括在内：

- [`DaggerService`](https://google.github.io/dagger/api/latest/dagger/android/DaggerService.html) 和 [`DaggerIntentService`](https://google.github.io/dagger/api/latest/dagger/android/DaggerIntentService.html)
- [`DaggerBroadcastReceiver`](https://google.github.io/dagger/api/latest/dagger/android/DaggerBroadcastReceiver.html)
- [`DaggerContentProvider`](https://google.github.io/dagger/api/latest/dagger/android/DaggerContentProvider.html)

*注意：* [`DaggerBroadcastReceiver`](https://google.github.io/dagger/api/latest/dagger/android/DaggerBroadcastReceiver.html)只能在 `BroadcastReceiver`注册时使用`AndroidManifest.xml`。当`BroadcastReceiver`在你自己的代码中创建时，更喜欢构造器注入。



### 尽可能早的注入时机

最好在构造方法中注入。如果在成员函数中注入的话，同样也建议尽可能的早。因为这个原因，`DaggerActivity `的 `AndroidInjection.inject()` 调用甚至在 `super.onCreate()`之前。同样的， `DaggerFragment`也是一样，这样还能防止因为 `Fragment` 重复`attached`导致的不一致。





