# css3 animation 属性使用场景及技巧
### 1. animation-delay

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay) 中的介绍：

> animation-delay CSS 属性定义动画于何时开始，即从动画应用在元素上到动画开始的这段时间的长度。

该属性值默认为 0s，可为正值，也可为负值。

#### 动画时间轴

由于 css3 动画没有时间轴， `animation-delay` 最常见的是用于将动画与其他动画的执行时机错开，将动画落到不同的时间点，形成动画时间轴。



```
.ani--first {    animation-name: aniFirst;    animation-duration: 2s;    animation-delay: 0s;}.ani--second {    animation-name: aniSecond;    animation-duration: 1s;    animation-delay: 2s; /* aniSecond 延迟 2s 执行*/}
```

形成的时间轴如下图所示：

[image:1EC6F7E4-7B6B-47FE-93DA-415EB784F896-20968-000021BD4A32456B/animation-delay-timeline.png]
#### 轮播

css3 animation 亦可实现一些 js 的效果，例如利用 `animation-delay` 可以实现一个简单的轮播。以下是一个三屏轮播的例子。

```
.slider__item {    animation: ani 6s infinite linear both;    @for $i from 1 to 4 {      &:nth-child(#{$i}) {        animation-delay: (-1+$i)*2s;      }    }}@keyframes ani {  0%, 33.33% {opacity: 1; visibility: visible;}  33.34%, 100% {opacity: 0; visibility: hidden;}}
```

#### 序列动画

多个元素使用相同的动画效果时，将动画执行时机依次错开，可形成整齐有序的序列动画效果。

```
@for $i from 1 to 6 {  .list__item:nth-child(#{$i}) {    animation-delay: (-1+$i)*0.1s; /*计算每个元素的 animation-delay */  }}
```

#### 无限循环的序列动画

`animation-delay` 可为负值。 **负值会让动画从它的动画序列中某位置立即开始。** 巧用这个负值，可以解决实际开发中的一些问题。

如若上述的序列动画要进行无限循环，单纯将 `animation-iteration-count` 设置为 `infinite` ，动画开始时会有延迟。此时，将 `animation-delay` 设置为负值，提前动画开始执行的时机，当用户看到动画时，动画便已经处于进行中的状态。

```
@for $i from 1 to 6 {  .list__item:nth-child(#{$i}) {    animation-delay: -$i*0.1s; /* animation-delay 为负值*/  }}
```

#### 调试动画

将 `animation-play-state` 设置为 `paused` ， `animation-delay` 设置成不同的负值，可以查看动画在不同帧时的状态，便于进行动画调试。


```
.list__item {    animation: listAni 0.5s linear both alternate infinite;    animation-play-state: paused;}@for $i from 1 to 6 {    .list--first .list__item:nth-child(#{$i}) {        animation-delay: -$i*0.1s;    }}@for $i from 1 to 6 {    .list--second .list__item:nth-child(#{$i}) {        animation-delay: (-2-$i)*0.1s;    }}@for $i from 1 to 6 {    .list--third .list__item:nth-child(#{$i}) {        animation-delay: (-4-$i)*0.1s;    }}
```

### 2. animation-fill-mode

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) 中的介绍：

> animation-fill-mode 这个 CSS 属性用来指定在动画执行之前和之后如何给动画的目标应用样式。

`animation-fill-mode` 应该算是 `animation` 属性里比较难上手的一个，但它的作用却很大。

#### 保持结束状态

“动画结束后，突然跳回第一帧！” 很多刚接触 css3 动画的同学，都是在这个场景下，接触了 `animation-fill-mode` 属性。将 `animation-fill-mode` 设置为 `forwards` ，动画执行结束后保持最后一帧的样式。


```
.ani-area__item--forwards {    animation: ani 1s ease;    animation-fill-mode: forwards;}
```

#### 开始前状态

开发动画时，我们都是先根据视觉稿做好构建，再来给元素加动画的。如上文所述，可通过 `animation-delay` 来延迟的动画的执行。而在执行前，元素往往需要先隐藏（ `translate` 定位到视窗外 / `opacity` 设置为 0 / `scale` 设置为 0 等）。若将隐藏元素的样式直接应用到元素上，一来不利于构建，二来对于不支持动画的浏览器来说，只会呈现一片空白。此时， `animation-fill-mode` 的 `backwards` 属性值便派上用场。

对于 `backwards` 的解释，笔者见过不少文章的说法都有不妥之处，认为 `backwards` 与 `forwards` 相反，表示动画执行结束后保持第一帧的样式。实则不然，我们看下 [w3c](http://www.w3school.com.cn/cssref/pr_animation-fill-mode.asp) 的解释：

> backwards：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。

换句话说， `backwards` 作用的是 `animation-delay` 的时间段，应用第一个关键帧的样式。


```
.ani-area__item--backwards {    animation: ani 1s 1s ease;    animation-fill-mode: backwards;}
```

当然，动画的第一帧和最后一帧的计算还受 `animation-direction` 和 `animation-iteration-count` 的影响， [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) 中有详细解释：

> forwards animation-directionanimation-iteration-countlast keyframe encounterednormaleven or odd100% or toreverseeven or odd0% or fromalternateeven0% or fromalternateodd100% or toalternate-reverseeven100% or toalternate-reverseodd0% or from

> backwards animation-directionfirst relevant keyframenormal or alternate0% or fromreverse or alternate-reverse100% or to

### 3. animation-direction

既然上表中涉及了 `animation-direction` 属性，那我们就顺着来研究一下它。
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction) 中的介绍：

> animation-direction CSS 属性指示动画是否反向播放。

#### 进/退场动画复用

动画元素有进场动画，往往也会需要退场动画。比较常见的做法，退场时使用与进场动画反向的动画。 `animation-direction` 的 `reverse` 属性值可简单实现反向动画。

先看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction) 中的介绍：

> reverse：反向运行动画，每周期结束动画由尾到头运行。


```
.on {  .ani--translate {      animation: aniTranslate 1s ease forwards;  }}.off {  .ani--translate {      animation: aniTranslate 1s ease forwards reverse;  }}@keyframes aniTranslate {  0% { transform: translateY(300px) }  100% { transform: translateY(0) }}
```


```
$wrap.removeClass('on');$wrap.innerWidth($wrap.innerWidth); /* 使用 reflow 重新触发一下 animation */$wrap.addClass('off');
```

当然，上述例子为了演示方便，只是简单做了只有两帧的动画，这种效果用 `transition` 同样可以实现。

### 4. animation-play-state

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-play-state) 中的介绍：

> animation-play-state CSS 属性定义一个动画是否运行或者暂停。

#### 翻页动画控制

在做翻页 h5 时，需要对动画的播放进行控制。只有当用户进入当前屏时，动画才开始播放。通常我们会给当前屏加上一个 `acitve` 类，用来给元素添加动画：


```
.active .ele {    animation: ani 1s ease;}
```

或者如上文“进/退场动画复用”中的例子，分别用 `on` 和 `off` 控制进/退场动画。这都是常见的思路。
如果是不需要重复触发的动画，用 `animation-play-state` 同样可以实现动画的控制。动画属性直接添加到元素上， `animation-play-state` 默认设置为 `paused` ，当进入当前屏时，将 `animation-play-state` 设置为 `running` 即可。



```
.ani {     animation: ani1 1s ease;    animation-play-state: paused; /* animation-play-state 默认设置为 paused */}.active .ani {    animation-play-state: running; /* 进入当前屏，animation-play-state 设置为 running */}
```

#### 轮播的交互

在前文介绍 `animation-delay` 时，提到了一个轮播的例子，当用户 `hover` 时，轮播动画应该暂停，用 `animation-play-state` 属性便可轻松实现交互：


```
.slider:hover .slider__item{     animation-play-state: paused;}
```

### 5. animation-timing-function

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function) 中的介绍：

> CSS animation-timing-function 属性定义 CSS 动画在每一动画周期中执行的节奏。

关于 `animation-timing-function` ，有一个特别需要注意的点， [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function) 中有强调：

> 对于关键帧动画来说，timing function 作用于一个关键帧周期而非整个动画周期，即从关键帧开始开始，到关键帧结束结束。

也就是说， `animation-timing-function` 是作用于 `@keyframes` 中设置的两个关键帧之间的，这一点在该属性值为 `steps()` 时可明显感知。

#### 逐帧动画

`animation-timing-function` 最让人感到惊（beng）艳（kui）的莫过于 `steps()` 属性值。利用 `steps()` ，可以轻松实现逐帧动画（又称“精灵动画”），从而告别不可控的 gif 时代。
关于逐帧动画，笔者之前在 [凹凸实验室](https://aotu.io/) 平台已经发布过相关文章介绍，此处不再赘述，有兴趣的同学可前往围观： [《CSS3逐帧动画》](https://aotu.io/notes/2016/05/17/css3-animation-frame/) 。

