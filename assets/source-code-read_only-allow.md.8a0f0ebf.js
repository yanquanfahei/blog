import{_ as s,c as n,o as a,a as l}from"./app.84dc9d7e.js";const i=JSON.parse('{"title":"only-allow","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5B9E\u73B0\u539F\u7406","slug":"\u5B9E\u73B0\u539F\u7406","link":"#\u5B9E\u73B0\u539F\u7406","children":[]},{"level":2,"title":"\u7528\u6CD5","slug":"\u7528\u6CD5","link":"#\u7528\u6CD5","children":[]},{"level":2,"title":"\u6E90\u7801\u89E3\u6790","slug":"\u6E90\u7801\u89E3\u6790","link":"#\u6E90\u7801\u89E3\u6790","children":[]}],"relativePath":"source-code-read/only-allow.md","lastUpdated":1672121604000}'),p={name:"source-code-read/only-allow.md"},o=l(`<h1 id="only-allow" tabindex="-1">only-allow <a class="header-anchor" href="#only-allow" aria-hidden="true">#</a></h1><p><a href="https://github.com/pnpm/only-allow" target="_blank" rel="noreferrer">only-allow</a> \u5F3A\u5236\u5728\u9879\u76EE\u4E2D\u4F7F\u7528\u7279\u5B9A\u7684\u5305\u7BA1\u7406\u5DE5\u5177</p><h2 id="\u5B9E\u73B0\u539F\u7406" tabindex="-1">\u5B9E\u73B0\u539F\u7406 <a class="header-anchor" href="#\u5B9E\u73B0\u539F\u7406" aria-hidden="true">#</a></h2><p>\u5728 <code>preinstall</code> \u9879\u76EE\u4F9D\u8D56\uFF0C\u6267\u884C <code>only-allow</code>\uFF0C\u5224\u65AD\u5230\u5F53\u524D\u4F7F\u7528\u7684\u5305\u7BA1\u7406\u5DE5\u5177\u4E0E\u5F53\u524D\u9879\u76EE\u60F3\u8981\u4F7F\u7528\u7684\u5305\u7BA1\u7406\u5DE5\u5177\u4E0D\u540C\u65F6\uFF0C\u9000\u51FA\u8FDB\u7A0B\u5E76\u7ED9\u51FA\u76F8\u5E94\u7684\u63D0\u793A\u3002</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre><code><span class="line"><span style="color:#A6ACCD;">npx only-allow npm</span></span>
<span class="line"></span></code></pre></div><h2 id="\u7528\u6CD5" tabindex="-1">\u7528\u6CD5 <a class="header-anchor" href="#\u7528\u6CD5" aria-hidden="true">#</a></h2><p>\u5728 <code>package.json</code> \u6587\u4EF6\u4E2D <code>preinstall</code> \u6DFB\u52A0</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">scripts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">preinstall</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">npx only-allow npm</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;"># or pnpm cnpm yarn</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="\u6E90\u7801\u89E3\u6790" tabindex="-1">\u6E90\u7801\u89E3\u6790 <a class="header-anchor" href="#\u6E90\u7801\u89E3\u6790" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#676E95;">// \u68C0\u6D4B\u54EA\u4E2A\u5305\u7BA1\u7406\u5668\u6267\u884C\u8FDB\u7A0B\u3002</span></span>
<span class="line"><span style="color:#676E95;">// \u652F\u6301 npm\u3001pnpm\u3001Yarn\u3001cnpm\u3002npm_config_user_agent\u4EE5\u53CA\u8BBE\u7F6Eenv \u53D8\u91CF\u7684\u4EFB\u4F55\u5176\u4ED6\u5305\u7BA1\u7406\u5668</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> whichPMRuns </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">which-pm-runs</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">) </span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// \u5728\u7EC8\u7AEF\u521B\u5EFA\u6846</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> boxen </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">boxen</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// \u83B7\u53D6\u53C2\u6570 npx only-allow npm -&gt; [npm]</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> argv </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> process</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">argv</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">slice</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> (argv</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">length </span><span style="color:#89DDFF;">===</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Please specify the wanted package manager: only-allow &lt;npm|cnpm|pnpm|yarn&gt;</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">process</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">exit</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#676E95;">// npm</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> wantedPM </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> argv[</span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> (wantedPM </span><span style="color:#89DDFF;">!==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">npm</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> wantedPM </span><span style="color:#89DDFF;">!==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">cnpm</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> wantedPM </span><span style="color:#89DDFF;">!==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pnpm</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> wantedPM </span><span style="color:#89DDFF;">!==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">yarn</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">&quot;</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">wantedPM</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">&quot; is not a valid package manager. Available package managers are: npm, cnpm, pnpm, or yarn.</span><span style="color:#89DDFF;">\`</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">process</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">exit</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#676E95;">// \u5F53\u524D\u6267\u884C\u8FDB\u7A0B\u4F7F\u7528\u7684\u5305\u7BA1\u7406\u5668</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> usedPM </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">whichPMRuns</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#676E95;">// \u83B7\u5F97\u8FDB\u7A0B\u6267\u884C\u7684\u5B8C\u6574\u8DEF\u5F84</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> cwd </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> process</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">env</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">INIT_CWD </span><span style="color:#89DDFF;">||</span><span style="color:#A6ACCD;"> process</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">cwd</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#676E95;">// \u4E0D\u5305\u542B node_modules</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> isInstalledAsDependency </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> cwd</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">includes</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">node_modules</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> (usedPM </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> usedPM</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name </span><span style="color:#89DDFF;">!==</span><span style="color:#A6ACCD;"> wantedPM </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">isInstalledAsDependency) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// \u5F53\u524D\u4F7F\u7528\u7684\u5305\u7BA1\u7406\u5668\u4E0E\u60F3\u4F7F\u7528\u7684\u5305\u7BA1\u7406\u5668\u4E0D\u540C\u5E76\u4E14\u4E0D\u5305\u542B node_modules</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// \u7ED9\u51FA\u76F8\u5E94\u7684\u63D0\u793A\u6846</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boxenOpts</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> borderColor</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">red</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> borderStyle</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">double</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> padding</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">switch</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">wantedPM</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">case</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">npm</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#82AAFF;">boxen</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Use &quot;npm install&quot; for installation in this project</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boxenOpts</span><span style="color:#F07178;">))</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">break</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">case</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">cnpm</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#82AAFF;">boxen</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Use &quot;cnpm install&quot; for installation in this project</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boxenOpts</span><span style="color:#F07178;">))</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">break</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">case</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pnpm</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#82AAFF;">boxen</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">Use &quot;pnpm install&quot; for installation in this project.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C3E88D;">If you don&#39;t have pnpm, install it via &quot;npm i -g pnpm&quot;.</span></span>
<span class="line"><span style="color:#C3E88D;">For more details, go to https://pnpm.js.org/</span><span style="color:#89DDFF;">\`</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boxenOpts</span><span style="color:#F07178;">))</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">break</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">case</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">yarn</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#82AAFF;">boxen</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">Use &quot;yarn&quot; for installation in this project.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C3E88D;">If you don&#39;t have Yarn, install it via &quot;npm i -g yarn&quot;.</span></span>
<span class="line"><span style="color:#C3E88D;">For more details, go to https://yarnpkg.com/</span><span style="color:#89DDFF;">\`</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boxenOpts</span><span style="color:#F07178;">))</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">break</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">process</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">exit</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,10),e=[o];function c(t,r,y,F,D,C){return a(),n("div",null,e)}const d=s(p,[["render",c]]);export{i as __pageData,d as default};
