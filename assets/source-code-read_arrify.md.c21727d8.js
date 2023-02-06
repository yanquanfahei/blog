import{_ as s,c as a,o as n,a as l}from"./app.11e2c87b.js";const C=JSON.parse('{"title":"arrify","description":"","frontmatter":{},"headers":[{"level":2,"title":"Usage","slug":"usage","link":"#usage","children":[]},{"level":2,"title":"\u6E90\u7801","slug":"\u6E90\u7801","link":"#\u6E90\u7801","children":[]}],"relativePath":"source-code-read/arrify.md","lastUpdated":1675645869000}'),p={name:"source-code-read/arrify.md"},o=l(`<h1 id="arrify" tabindex="-1">arrify <a class="header-anchor" href="#arrify" aria-hidden="true">#</a></h1><p><a href="https://github.com/sindresorhus/arrify" target="_blank" rel="noreferrer">arrify</a> \u5C06\u503C\u8F6C\u6362\u4E3A\u6570\u7EC4</p><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> arrify </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">arrify</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">arrify</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u{1F984}</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">//=&gt; [&#39;\u{1F984}&#39;]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">arrify</span><span style="color:#A6ACCD;">([</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u{1F984}</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">])</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">//=&gt; [&#39;\u{1F984}&#39;]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">arrify</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Set</span><span style="color:#A6ACCD;">([</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u{1F984}</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">]))</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">//=&gt; [&#39;\u{1F984}&#39;]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">arrify</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">null</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">//=&gt; []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">arrify</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">undefined</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">//=&gt; []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> value </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{}</span></span>
<span class="line"><span style="color:#A6ACCD;">value[Symbol</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">iterator] </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">yield</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">1</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#82AAFF;">arrify</span><span style="color:#A6ACCD;">(value)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">//=&gt; [&#39;1&#39;]</span></span>
<span class="line"></span></code></pre></div><h2 id="\u6E90\u7801" tabindex="-1">\u6E90\u7801 <a class="header-anchor" href="#\u6E90\u7801" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">arrify</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">||</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">undefined</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> []</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">Array</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">isArray</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">)) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">typeof</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">string</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> [</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">typeof</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">Symbol</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">iterator</span><span style="color:#F07178;">] </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">function</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> [</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> [</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,6),e=[o];function r(t,c,F,y,D,i){return n(),a("div",null,e)}const u=s(p,[["render",r]]);export{C as __pageData,u as default};
