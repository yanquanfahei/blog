# stats.js

[stats.js](https://github.com/mrdoob/stats.js) 是 `javascript` 性能监视器.

- FPS：上一秒渲染的 FPS 帧。数字越高越好
- MS：渲染帧需要毫秒。数字越低越好
- MB：MB 的已分配内存。(Run Chrome with --enable-precise-memory-info)

## Usage

```js
ar stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {

 stats.begin();

 // monitored code goes here

 stats.end();

 requestAnimationFrame( animate );

}

requestAnimationFrame( animate );

// or
javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
```

## 源码解析

```js
var Stats = function () {
  var mode = 0; // 默认显示 fps。0: fps, 1: ms, 2: mb, 3+: custom

  // 展示在页面的监控面板容器
  var container = document.createElement("div");
  container.style.cssText =
    "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
  container.addEventListener(
    "click",
    function (event) {
      event.preventDefault();
      // 点击循环切换展示的性能监控面板
      showPanel(++mode % container.children.length);
    },
    false
  );

  // 添加性能监控面板到容器中
  function addPanel(panel) {
    container.appendChild(panel.dom);
    return panel;
  }

  // 展示当前 mode 对应的面板
  function showPanel(id) {
    for (var i = 0; i < container.children.length; i++) {
      container.children[i].style.display = i === id ? "block" : "none";
    }

    mode = id;
  }


  var beginTime = (performance || Date).now(),
    prevTime = beginTime,
    frames = 0;

  // fps 监控面板
  var fpsPanel = addPanel(new Stats.Panel("FPS", "#0ff", "#002"));
  // ms 监控面板
  var msPanel = addPanel(new Stats.Panel("MS", "#0f0", "#020"));

  if (self.performance && self.performance.memory) {
    // mb 监控面板
    var memPanel = addPanel(new Stats.Panel("MB", "#f08", "#201"));
  }

  // 展示 fps 监控面板
  showPanel(0);

  return {
    REVISION: 16,

    dom: container,

    addPanel: addPanel,
    showPanel: showPanel,

    // 开始监控
    begin: function () {
      beginTime = (performance || Date).now();
    },

    // 结束监控
    end: function () {
      frames++;

      var time = (performance || Date).now();
      // ms 计算公式：(结束时间 - 开始时间)
      msPanel.update(time - beginTime, 200);

      if (time >= prevTime + 1000) {
        // fps 计算公式：执行次数 - (结束时间 - 开始时间)
        fpsPanel.update((frames * 1000) / (time - prevTime), 100);

        prevTime = time;
        frames = 0;

        if (memPanel) {
          var memory = performance.memory;
          // jsHeapSizeLimit：上下文内可用堆的最大体积，以字节计算
          // usedJSHeapSize：当前 JS 堆活跃段（segment）的体积，以字节计算
          // 1048576 === 1M
          memPanel.update(
            memory.usedJSHeapSize / 1048576,
            memory.jsHeapSizeLimit / 1048576
          );
        }
      }

      return time;
    },

    // 更新监控
    update: function () {
      beginTime = this.end();
    },

    // Backwards Compatibility

    domElement: container,
    setMode: showPanel,
  };
};

// 绘制监控面板
Stats.Panel = function (name, fg, bg) {
  var min = Infinity,
    max = 0,
    round = Math.round;
  var PR = round(window.devicePixelRatio || 1);

  var WIDTH = 80 * PR,
    HEIGHT = 48 * PR,
    TEXT_X = 3 * PR,
    TEXT_Y = 2 * PR,
    GRAPH_X = 3 * PR,
    GRAPH_Y = 15 * PR,
    GRAPH_WIDTH = 74 * PR,
    GRAPH_HEIGHT = 30 * PR;

  var canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.cssText = "width:80px;height:48px";

  var context = canvas.getContext("2d");
  context.font = "bold " + 9 * PR + "px Helvetica,Arial,sans-serif";
  context.textBaseline = "top";

  context.fillStyle = bg;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.fillStyle = fg;
  context.fillText(name, TEXT_X, TEXT_Y);
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  context.fillStyle = bg;
  context.globalAlpha = 0.9;
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  return {
    dom: canvas,

    // 更新监控面板数值
    update: function (value, maxValue) {
      min = Math.min(min, value);
      max = Math.max(max, value);

      context.fillStyle = bg;
      context.globalAlpha = 1;
      context.fillRect(0, 0, WIDTH, GRAPH_Y);
      context.fillStyle = fg;
      context.fillText(
        round(value) + " " + name + " (" + round(min) + "-" + round(max) + ")",
        TEXT_X,
        TEXT_Y
      );

      context.drawImage(
        canvas,
        GRAPH_X + PR,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
        GRAPH_X,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT
      );

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

      context.fillStyle = bg;
      context.globalAlpha = 0.9;
      context.fillRect(
        GRAPH_X + GRAPH_WIDTH - PR,
        GRAPH_Y,
        PR,
        round((1 - value / maxValue) * GRAPH_HEIGHT)
      );
    },
  };
};

export { Stats as default };
```
