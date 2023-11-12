import{_ as s}from"./chunks/30.31ae732a.js";import{_ as n,o as a,c as l,Q as p}from"./chunks/framework.9509352d.js";const d=JSON.parse('{"title":"代码规范工具及背后技术设计（下）","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"guide/30.md","filePath":"guide/30.md","lastUpdated":1699718970000}'),e={name:"guide/30.md"},o=p('<h1 id="代码规范工具及背后技术设计-下" tabindex="-1">代码规范工具及背后技术设计（下） <a class="header-anchor" href="#代码规范工具及背后技术设计-下" aria-label="Permalink to &quot;代码规范工具及背后技术设计（下）&quot;">​</a></h1><p>上一节课，我们主要介绍了代码规范工具，了解了它们的配置、使用方式。这一节，我们将深入原理，并根据其实现和扩展能力，开发更加灵活的工具集。</p><p>在此之前，我们先回顾一下「代码规范」主题的知识点：</p><p><img src="'+s+`" alt=""></p><h2 id="工具背后的技术原理和设计" tabindex="-1">工具背后的技术原理和设计 <a class="header-anchor" href="#工具背后的技术原理和设计" aria-label="Permalink to &quot;工具背后的技术原理和设计&quot;">​</a></h2><p>这一小节，我们挑选实现更为复杂精妙的 ESLint 来分析。大家都清楚 ESLint 是基于静态语法分析（AST）进行工作的，AST 已经不是一个新鲜话题，我们在 webpack 章节就有介绍。ESLint 使用 Espree 来解析 JavaScript 语句，生成 AST。有了完整的解析树，我们就可以基于解析树对代码进行检测和修改。</p><p>ESLint 的灵魂是每一条 rule，每条规则都是独立且插件化的，我们挑一个比较简单的“禁止块级注释规则”源码来分析：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  meta: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    docs: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      description: </span><span style="color:#9ECBFF;">&#39;禁止块级注释&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      category: </span><span style="color:#9ECBFF;">&#39;Stylistic Issues&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      recommended: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">create</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">context</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">sourceCode</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> context.</span><span style="color:#B392F0;">getSourceCode</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">Program</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">comments</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> sourceCode.</span><span style="color:#B392F0;">getAllComments</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">blockComments</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> comments.</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">(({ </span><span style="color:#FFAB70;">type</span><span style="color:#E1E4E8;"> }) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> type </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;Block&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">        blockComments.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> context.</span><span style="color:#B392F0;">report</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">          message: </span><span style="color:#9ECBFF;">&#39;No block comments&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">        })</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  meta: {</span></span>
<span class="line"><span style="color:#24292E;">    docs: {</span></span>
<span class="line"><span style="color:#24292E;">      description: </span><span style="color:#032F62;">&#39;禁止块级注释&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      category: </span><span style="color:#032F62;">&#39;Stylistic Issues&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      recommended: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">create</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">context</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">sourceCode</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> context.</span><span style="color:#6F42C1;">getSourceCode</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">Program</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">comments</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> sourceCode.</span><span style="color:#6F42C1;">getAllComments</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">blockComments</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> comments.</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">(({ </span><span style="color:#E36209;">type</span><span style="color:#24292E;"> }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> type </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;Block&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        blockComments.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> context.</span><span style="color:#6F42C1;">report</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">          message: </span><span style="color:#032F62;">&#39;No block comments&#39;</span></span>
<span class="line"><span style="color:#24292E;">        })</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><p>从中我们看出，一条规则就是一个 node 模块，它由 meta 和 create 组成。meta 包含了该条规则的文档描述，相对简单。而 create 接受一个 context 参数，返回一个对象：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">meta</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">docs</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">description</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;禁止块级注释&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">category</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;Stylistic Issues&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">recommended</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;"> </span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">create</span><span style="color:#E1E4E8;"> (context) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">meta</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">docs</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">description</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;禁止块级注释&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">category</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;Stylistic Issues&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">recommended</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;"> </span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">create</span><span style="color:#24292E;"> (context) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>从 context 对象上我们可以取得当前执行扫描到的代码，并通过选择器获取当前需要的内容。如上代码，我们获取代码的所有 comments（sourceCode.getAllComments()），如果 blockComments 长度大于 0，则 report No block comments 信息。</p><p>我们再来看一个 no-console rule 的实现：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#9ECBFF;">&quot;use strict&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    meta: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        type: </span><span style="color:#9ECBFF;">&quot;suggestion&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        docs: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            description: </span><span style="color:#9ECBFF;">&quot;disallow the use of \`console\`&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            category: </span><span style="color:#9ECBFF;">&quot;Possible Errors&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            recommended: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            url: </span><span style="color:#9ECBFF;">&quot;https://eslint.org/docs/rules/no-console&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        schema: [</span></span>
<span class="line"><span style="color:#E1E4E8;">            {</span></span>
<span class="line"><span style="color:#E1E4E8;">                type: </span><span style="color:#9ECBFF;">&quot;object&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                properties: {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    allow: {</span></span>
<span class="line"><span style="color:#E1E4E8;">                        type: </span><span style="color:#9ECBFF;">&quot;array&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                        items: {</span></span>
<span class="line"><span style="color:#E1E4E8;">                            type: </span><span style="color:#9ECBFF;">&quot;string&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">                        },</span></span>
<span class="line"><span style="color:#E1E4E8;">                        minItems: </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                        uniqueItems: </span><span style="color:#79B8FF;">true</span></span>
<span class="line"><span style="color:#E1E4E8;">                    }</span></span>
<span class="line"><span style="color:#E1E4E8;">                },</span></span>
<span class="line"><span style="color:#E1E4E8;">                additionalProperties: </span><span style="color:#79B8FF;">false</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        ],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        messages: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            unexpected: </span><span style="color:#9ECBFF;">&quot;Unexpected console statement.&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">create</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">context</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">options</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> context.options[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">] </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> {};</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">allowed</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> options.allow </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> [];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Checks whether the given reference is &#39;console&#39; or not.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{eslint-scope.Reference}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">reference</span><span style="color:#6A737D;"> - The reference to check.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the reference is &#39;console&#39;.</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isConsole</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">reference</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">id</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> reference.identifier;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> id </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> id.name </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;console&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Checks whether the property name of the given MemberExpression node</span></span>
<span class="line"><span style="color:#6A737D;">         * is allowed by options or not.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">node</span><span style="color:#6A737D;"> - The MemberExpression node to check.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the property name of the node is allowed.</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isAllowed</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">propertyName</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> astUtils.</span><span style="color:#B392F0;">getStaticPropertyName</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> propertyName </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> allowed.</span><span style="color:#B392F0;">indexOf</span><span style="color:#E1E4E8;">(propertyName) </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Checks whether the given reference is a member access which is not</span></span>
<span class="line"><span style="color:#6A737D;">         * allowed by options or not.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{eslint-scope.Reference}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">reference</span><span style="color:#6A737D;"> - The reference to check.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the reference is a member access which</span></span>
<span class="line"><span style="color:#6A737D;">         *      is not allowed by options.</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isMemberAccessExceptAllowed</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">reference</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">node</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> reference.identifier;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">parent</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node.parent;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">                parent.type </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;MemberExpression&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">                parent.object </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> node </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">!</span><span style="color:#B392F0;">isAllowed</span><span style="color:#E1E4E8;">(parent)</span></span>
<span class="line"><span style="color:#E1E4E8;">            );</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Reports the given reference as a violation.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{eslint-scope.Reference}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">reference</span><span style="color:#6A737D;"> - The reference to report.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">report</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">reference</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">node</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> reference.identifier.parent;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            context.</span><span style="color:#B392F0;">report</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">                node,</span></span>
<span class="line"><span style="color:#E1E4E8;">                loc: node.loc,</span></span>
<span class="line"><span style="color:#E1E4E8;">                messageId: </span><span style="color:#9ECBFF;">&quot;unexpected&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            });</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;Program:exit&quot;</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">scope</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> context.</span><span style="color:#B392F0;">getScope</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">consoleVar</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> astUtils.</span><span style="color:#B392F0;">getVariableByName</span><span style="color:#E1E4E8;">(scope, </span><span style="color:#9ECBFF;">&quot;console&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">shadowed</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> consoleVar </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> consoleVar.defs.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">                 * &#39;scope.through&#39; includes all references to undefined</span></span>
<span class="line"><span style="color:#6A737D;">                 * variables. If the variable &#39;console&#39; is not defined, it uses</span></span>
<span class="line"><span style="color:#6A737D;">                 * &#39;scope.through&#39;.</span></span>
<span class="line"><span style="color:#6A737D;">                 */</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">references</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> consoleVar</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> consoleVar.references</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> scope.through.</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">(isConsole);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">shadowed) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    references</span></span>
<span class="line"><span style="color:#E1E4E8;">                        .</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">(isMemberAccessExceptAllowed)</span></span>
<span class="line"><span style="color:#E1E4E8;">                        .</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">(report);</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        };</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#032F62;">&quot;use strict&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    meta: {</span></span>
<span class="line"><span style="color:#24292E;">        type: </span><span style="color:#032F62;">&quot;suggestion&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        docs: {</span></span>
<span class="line"><span style="color:#24292E;">            description: </span><span style="color:#032F62;">&quot;disallow the use of \`console\`&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            category: </span><span style="color:#032F62;">&quot;Possible Errors&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            recommended: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            url: </span><span style="color:#032F62;">&quot;https://eslint.org/docs/rules/no-console&quot;</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        schema: [</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                type: </span><span style="color:#032F62;">&quot;object&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                properties: {</span></span>
<span class="line"><span style="color:#24292E;">                    allow: {</span></span>
<span class="line"><span style="color:#24292E;">                        type: </span><span style="color:#032F62;">&quot;array&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                        items: {</span></span>
<span class="line"><span style="color:#24292E;">                            type: </span><span style="color:#032F62;">&quot;string&quot;</span></span>
<span class="line"><span style="color:#24292E;">                        },</span></span>
<span class="line"><span style="color:#24292E;">                        minItems: </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                        uniqueItems: </span><span style="color:#005CC5;">true</span></span>
<span class="line"><span style="color:#24292E;">                    }</span></span>
<span class="line"><span style="color:#24292E;">                },</span></span>
<span class="line"><span style="color:#24292E;">                additionalProperties: </span><span style="color:#005CC5;">false</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        ],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        messages: {</span></span>
<span class="line"><span style="color:#24292E;">            unexpected: </span><span style="color:#032F62;">&quot;Unexpected console statement.&quot;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">create</span><span style="color:#24292E;">(</span><span style="color:#E36209;">context</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">options</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> context.options[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> {};</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">allowed</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> options.allow </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> [];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Checks whether the given reference is &#39;console&#39; or not.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{eslint-scope.Reference}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">reference</span><span style="color:#6A737D;"> - The reference to check.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the reference is &#39;console&#39;.</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isConsole</span><span style="color:#24292E;">(</span><span style="color:#E36209;">reference</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">id</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> reference.identifier;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> id </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> id.name </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;console&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Checks whether the property name of the given MemberExpression node</span></span>
<span class="line"><span style="color:#6A737D;">         * is allowed by options or not.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">node</span><span style="color:#6A737D;"> - The MemberExpression node to check.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the property name of the node is allowed.</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isAllowed</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">propertyName</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> astUtils.</span><span style="color:#6F42C1;">getStaticPropertyName</span><span style="color:#24292E;">(node);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> propertyName </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> allowed.</span><span style="color:#6F42C1;">indexOf</span><span style="color:#24292E;">(propertyName) </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Checks whether the given reference is a member access which is not</span></span>
<span class="line"><span style="color:#6A737D;">         * allowed by options or not.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{eslint-scope.Reference}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">reference</span><span style="color:#6A737D;"> - The reference to check.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the reference is a member access which</span></span>
<span class="line"><span style="color:#6A737D;">         *      is not allowed by options.</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isMemberAccessExceptAllowed</span><span style="color:#24292E;">(</span><span style="color:#E36209;">reference</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">node</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> reference.identifier;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">parent</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node.parent;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">                parent.type </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;MemberExpression&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">                parent.object </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> node </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">isAllowed</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">            );</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Reports the given reference as a violation.</span></span>
<span class="line"><span style="color:#6A737D;">         *</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{eslint-scope.Reference}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">reference</span><span style="color:#6A737D;"> - The reference to report.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">report</span><span style="color:#24292E;">(</span><span style="color:#E36209;">reference</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">node</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> reference.identifier.parent;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            context.</span><span style="color:#6F42C1;">report</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">                node,</span></span>
<span class="line"><span style="color:#24292E;">                loc: node.loc,</span></span>
<span class="line"><span style="color:#24292E;">                messageId: </span><span style="color:#032F62;">&quot;unexpected&quot;</span></span>
<span class="line"><span style="color:#24292E;">            });</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;Program:exit&quot;</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">scope</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> context.</span><span style="color:#6F42C1;">getScope</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">consoleVar</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> astUtils.</span><span style="color:#6F42C1;">getVariableByName</span><span style="color:#24292E;">(scope, </span><span style="color:#032F62;">&quot;console&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">shadowed</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> consoleVar </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> consoleVar.defs.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">                 * &#39;scope.through&#39; includes all references to undefined</span></span>
<span class="line"><span style="color:#6A737D;">                 * variables. If the variable &#39;console&#39; is not defined, it uses</span></span>
<span class="line"><span style="color:#6A737D;">                 * &#39;scope.through&#39;.</span></span>
<span class="line"><span style="color:#6A737D;">                 */</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">references</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> consoleVar</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> consoleVar.references</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> scope.through.</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">(isConsole);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">shadowed) {</span></span>
<span class="line"><span style="color:#24292E;">                    references</span></span>
<span class="line"><span style="color:#24292E;">                        .</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">(isMemberAccessExceptAllowed)</span></span>
<span class="line"><span style="color:#24292E;">                        .</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">(report);</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        };</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br></div></div><p>代码中通过 astUtils.getVariableByName(scope, &quot;console&quot;) 以及 isConsole 函数来判别 console 语句的出现，通过 allowed.indexOf(propertyName) !== -1 来过滤白名单。</p><p>实现非常简单，了解了这些，相信你也能写出 no-alert，no-debugger 的规则内容。</p><p>我们再来看一下 no-duplicate-case 规则，它监测 switch...case 中是否存在相同的 case 分支：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    meta: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        type: </span><span style="color:#9ECBFF;">&quot;problem&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        docs: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            description: </span><span style="color:#9ECBFF;">&quot;disallow duplicate case labels&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            category: </span><span style="color:#9ECBFF;">&quot;Possible Errors&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            recommended: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            url: </span><span style="color:#9ECBFF;">&quot;https://eslint.org/docs/rules/no-duplicate-case&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        schema: [],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        messages: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            unexpected: </span><span style="color:#9ECBFF;">&quot;Duplicate case label.&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">create</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">context</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">sourceCode</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> context.</span><span style="color:#B392F0;">getSourceCode</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">SwitchStatement</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">mapping</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                node.cases.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">switchCase</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">key</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> sourceCode.</span><span style="color:#B392F0;">getText</span><span style="color:#E1E4E8;">(switchCase.test);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (mapping[key]) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                        context.</span><span style="color:#B392F0;">report</span><span style="color:#E1E4E8;">({ node: switchCase, messageId: </span><span style="color:#9ECBFF;">&quot;unexpected&quot;</span><span style="color:#E1E4E8;"> });</span></span>
<span class="line"><span style="color:#E1E4E8;">                    } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">                        mapping[key] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> switchCase;</span></span>
<span class="line"><span style="color:#E1E4E8;">                    }</span></span>
<span class="line"><span style="color:#E1E4E8;">                });</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        };</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    meta: {</span></span>
<span class="line"><span style="color:#24292E;">        type: </span><span style="color:#032F62;">&quot;problem&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        docs: {</span></span>
<span class="line"><span style="color:#24292E;">            description: </span><span style="color:#032F62;">&quot;disallow duplicate case labels&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            category: </span><span style="color:#032F62;">&quot;Possible Errors&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            recommended: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            url: </span><span style="color:#032F62;">&quot;https://eslint.org/docs/rules/no-duplicate-case&quot;</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        schema: [],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        messages: {</span></span>
<span class="line"><span style="color:#24292E;">            unexpected: </span><span style="color:#032F62;">&quot;Duplicate case label.&quot;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">create</span><span style="color:#24292E;">(</span><span style="color:#E36209;">context</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">sourceCode</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> context.</span><span style="color:#6F42C1;">getSourceCode</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">SwitchStatement</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">mapping</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                node.cases.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">(</span><span style="color:#E36209;">switchCase</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">key</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> sourceCode.</span><span style="color:#6F42C1;">getText</span><span style="color:#24292E;">(switchCase.test);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (mapping[key]) {</span></span>
<span class="line"><span style="color:#24292E;">                        context.</span><span style="color:#6F42C1;">report</span><span style="color:#24292E;">({ node: switchCase, messageId: </span><span style="color:#032F62;">&quot;unexpected&quot;</span><span style="color:#24292E;"> });</span></span>
<span class="line"><span style="color:#24292E;">                    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">                        mapping[key] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> switchCase;</span></span>
<span class="line"><span style="color:#24292E;">                    }</span></span>
<span class="line"><span style="color:#24292E;">                });</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        };</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div><p>代码非常简单，只是初始化时使用一个空的 mapping，每次添加 case 是进行对 mapping 的扩充，如果存在相同的 case 则 report。</p><p>虽然 ESLint 背后的技术内容比较复杂，但是基于 AST 技术，它已经给开发者提供了较为成熟的 APIs。写一条自己的规则并不是很难，只需要开发者找到相关的 AST 选择器，比如上面代码中的 getAllComments()，更多的选择器可以参考：<a href="https://eslint.org/docs/developer-%20guide/selectors" target="_blank" rel="noreferrer">Selectors - ESLint - Pluggable JavaScript linter</a>。熟练掌握选择器，将是我们开发插件扩展的关键。</p><p>当然，更复杂的场景远不止这么简单，比如，多条规则是如何串联起来生效的？</p><h3 id="多条规则串联生效" tabindex="-1">多条规则串联生效 <a class="header-anchor" href="#多条规则串联生效" aria-label="Permalink to &quot;多条规则串联生效&quot;">​</a></h3><p>事实上， 规则可以从多个源来定义，比如代码的注释当中，或者配置文件当中。</p><p>ESLint 首先收集到所有规则配置源，将所有规则归并之后，进行多重遍历：遍历由源码生成的 AST，将语法节点传入队列当中；之后遍历所有应用规则，采用事件发布订阅模式（类似 webpack tapable），为所有规则的选择器添加监听事件；在触发事件时执行，如果发现有问题，会将 report message 记录下来。最终记录下来的问题信息将会被输出。</p><p>具体 ESLint 的源码如下：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">runRules</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">sourceCode</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">configuredRules</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">ruleMapper</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">parserOptions</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">parserName</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">settings</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">filename</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">emitter</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">createEmitter</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nodeQueue</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [];</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> currentNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> sourceCode.ast;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    Traverser.</span><span style="color:#B392F0;">traverse</span><span style="color:#E1E4E8;">(sourceCode.ast, {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">enter</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">parent</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            node.parent </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> parent;</span></span>
<span class="line"><span style="color:#E1E4E8;">            nodeQueue.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">({ isEntering: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">, node });</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">leave</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            nodeQueue.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">({ isEntering: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">, node });</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        visitorKeys: sourceCode.visitorKeys</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">lintingProblems</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    Object.</span><span style="color:#B392F0;">keys</span><span style="color:#E1E4E8;">(configuredRules).</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">ruleId</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">severity</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> ConfigOps.</span><span style="color:#B392F0;">getRuleSeverity</span><span style="color:#E1E4E8;">(configuredRules[ruleId]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (severity </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">rule</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ruleMapper</span><span style="color:#E1E4E8;">(ruleId);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">messageIds</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> rule.meta </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> rule.meta.messages;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> reportTranslator </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">ruleContext</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Object.</span><span style="color:#B392F0;">freeze</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">            Object.</span><span style="color:#B392F0;">assign</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">Object.</span><span style="color:#B392F0;">create</span><span style="color:#E1E4E8;">(sharedTraversalContext),</span></span>
<span class="line"><span style="color:#E1E4E8;">                {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    id: ruleId,</span></span>
<span class="line"><span style="color:#E1E4E8;">                    options: </span><span style="color:#B392F0;">getRuleOptions</span><span style="color:#E1E4E8;">(configuredRules[ruleId]),</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#B392F0;">report</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">...</span><span style="color:#FFAB70;">args</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (reportTranslator </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">) {</span><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">                        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">problem</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">reportTranslator</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">args);</span></span>
<span class="line"><span style="color:#E1E4E8;">                        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (problem.fix </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> rule.meta </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">rule.meta.fixable) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                            </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Fixable rules should export a \`meta.fixable\` property.&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">                        }</span></span>
<span class="line"><span style="color:#E1E4E8;">                        lintingProblems.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(problem);</span></span>
<span class="line"><span style="color:#E1E4E8;">                    }</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"><span style="color:#E1E4E8;">            )</span></span>
<span class="line"><span style="color:#E1E4E8;">        );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">ruleListeners</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">createRuleListeners</span><span style="color:#E1E4E8;">(rule, ruleContext);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// add all the selectors from the rule as listeners</span></span>
<span class="line"><span style="color:#E1E4E8;">        Object.</span><span style="color:#B392F0;">keys</span><span style="color:#E1E4E8;">(ruleListeners).</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">selector</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            emitter.</span><span style="color:#B392F0;">on</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        });</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">eventGenerator</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CodePathAnalyzer</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">NodeEventGenerator</span><span style="color:#E1E4E8;">(emitter));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    nodeQueue.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">traversalInfo</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        currentNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> traversalInfo.node;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (traversalInfo.isEntering) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            eventGenerator.</span><span style="color:#B392F0;">enterNode</span><span style="color:#E1E4E8;">(currentNode);</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            eventGenerator.</span><span style="color:#B392F0;">leaveNode</span><span style="color:#E1E4E8;">(currentNode);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> lintingProblems;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">runRules</span><span style="color:#24292E;">(</span><span style="color:#E36209;">sourceCode</span><span style="color:#24292E;">, </span><span style="color:#E36209;">configuredRules</span><span style="color:#24292E;">, </span><span style="color:#E36209;">ruleMapper</span><span style="color:#24292E;">, </span><span style="color:#E36209;">parserOptions</span><span style="color:#24292E;">, </span><span style="color:#E36209;">parserName</span><span style="color:#24292E;">, </span><span style="color:#E36209;">settings</span><span style="color:#24292E;">, </span><span style="color:#E36209;">filename</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">emitter</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">createEmitter</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nodeQueue</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> currentNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> sourceCode.ast;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    Traverser.</span><span style="color:#6F42C1;">traverse</span><span style="color:#24292E;">(sourceCode.ast, {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">enter</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">, </span><span style="color:#E36209;">parent</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            node.parent </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> parent;</span></span>
<span class="line"><span style="color:#24292E;">            nodeQueue.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">({ isEntering: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">, node });</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">leave</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            nodeQueue.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">({ isEntering: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">, node });</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        visitorKeys: sourceCode.visitorKeys</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">lintingProblems</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    Object.</span><span style="color:#6F42C1;">keys</span><span style="color:#24292E;">(configuredRules).</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">(</span><span style="color:#E36209;">ruleId</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">severity</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ConfigOps.</span><span style="color:#6F42C1;">getRuleSeverity</span><span style="color:#24292E;">(configuredRules[ruleId]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (severity </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">rule</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ruleMapper</span><span style="color:#24292E;">(ruleId);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">messageIds</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> rule.meta </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> rule.meta.messages;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> reportTranslator </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">ruleContext</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Object.</span><span style="color:#6F42C1;">freeze</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">            Object.</span><span style="color:#6F42C1;">assign</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">Object.</span><span style="color:#6F42C1;">create</span><span style="color:#24292E;">(sharedTraversalContext),</span></span>
<span class="line"><span style="color:#24292E;">                {</span></span>
<span class="line"><span style="color:#24292E;">                    id: ruleId,</span></span>
<span class="line"><span style="color:#24292E;">                    options: </span><span style="color:#6F42C1;">getRuleOptions</span><span style="color:#24292E;">(configuredRules[ruleId]),</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6F42C1;">report</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">...</span><span style="color:#E36209;">args</span><span style="color:#24292E;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (reportTranslator </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) {</span><span style="color:#D73A49;">...</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">                        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">problem</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">reportTranslator</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">...</span><span style="color:#24292E;">args);</span></span>
<span class="line"><span style="color:#24292E;">                        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (problem.fix </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> rule.meta </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">!</span><span style="color:#24292E;">rule.meta.fixable) {</span></span>
<span class="line"><span style="color:#24292E;">                            </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Fixable rules should export a \`meta.fixable\` property.&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">                        }</span></span>
<span class="line"><span style="color:#24292E;">                        lintingProblems.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(problem);</span></span>
<span class="line"><span style="color:#24292E;">                    }</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"><span style="color:#24292E;">            )</span></span>
<span class="line"><span style="color:#24292E;">        );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">ruleListeners</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">createRuleListeners</span><span style="color:#24292E;">(rule, ruleContext);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// add all the selectors from the rule as listeners</span></span>
<span class="line"><span style="color:#24292E;">        Object.</span><span style="color:#6F42C1;">keys</span><span style="color:#24292E;">(ruleListeners).</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">(</span><span style="color:#E36209;">selector</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            emitter.</span><span style="color:#6F42C1;">on</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        });</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">eventGenerator</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CodePathAnalyzer</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NodeEventGenerator</span><span style="color:#24292E;">(emitter));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    nodeQueue.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">(</span><span style="color:#E36209;">traversalInfo</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        currentNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> traversalInfo.node;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (traversalInfo.isEntering) {</span></span>
<span class="line"><span style="color:#24292E;">            eventGenerator.</span><span style="color:#6F42C1;">enterNode</span><span style="color:#24292E;">(currentNode);</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            eventGenerator.</span><span style="color:#6F42C1;">leaveNode</span><span style="color:#24292E;">(currentNode);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> lintingProblems;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br></div></div><p>请再思考，我们的程序中免不了有各种条件语句、循环语句，因此 代码的执行是非顺序的 。相关规则比如：“检测定义但未使用变量”，“switch-case 中避免执行多条 case 语句”，这些规则的实现，就涉及 ESLint 更高级的 code path analysis 概念等。ESLint 将 code path 抽象为 5 个事件。</p><ul><li>onCodePathStart</li><li>onCodePathEnd</li><li>onCodePathSegmentStart</li><li>onCodePathSegmentEnd</li><li>onCodePathSegmentLoop</li></ul><p>利用这 5 个事件，我们可以更加精确地控制检测范围和粒度。更多的 ESLint rule 实现，可以翻看源码进行学习，总之根据这 5 种事件，我们可以监测非顺序性代码，其核心原理还是事件机制。</p><p>我们通过 no-unreachable 规则来进行了解，该规则可以通过监测 return，throws，break，continue 的使用，识别出不会被执行的代码，并 report：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Checks whether or not a given variable declarator has the initializer.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">node</span><span style="color:#6A737D;"> - A VariableDeclarator node to check.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the node has the initializer.</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isInitialized</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Boolean</span><span style="color:#E1E4E8;">(node.init);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Checks whether or not a given code path segment is unreachable.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{CodePathSegment}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">segment</span><span style="color:#6A737D;"> - A CodePathSegment to check.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the segment is unreachable.</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isUnreachable</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">segment</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">segment.reachable;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * The class to distinguish consecutive unreachable statements.</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ConsecutiveRange</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">constructor</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">sourceCode</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.sourceCode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> sourceCode;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.startNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.endNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * The location object of this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@type</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{Object}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">get</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">location</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            start: </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.startNode.loc.start,</span></span>
<span class="line"><span style="color:#E1E4E8;">            end: </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.endNode.loc.end</span></span>
<span class="line"><span style="color:#E1E4E8;">        };</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * \`true\` if this range is empty.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@type</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">get</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isEmpty</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.startNode </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.endNode);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Checks whether the given node is inside of this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{ASTNode|Token}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">node</span><span style="color:#6A737D;"> - The node to check.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the node is inside of this range.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">contains</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">            node.range[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">] </span><span style="color:#F97583;">&gt;=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.startNode.range[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">] </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">            node.range[</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">] </span><span style="color:#F97583;">&lt;=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.endNode.range[</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">        );</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Checks whether the given node is consecutive to this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">node</span><span style="color:#6A737D;"> - The node to check.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the node is consecutive to this range.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">isConsecutive</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">contains</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.sourceCode.</span><span style="color:#B392F0;">getTokenBefore</span><span style="color:#E1E4E8;">(node));</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Merges the given node to this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">node</span><span style="color:#6A737D;"> - The node to merge.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">merge</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.endNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Resets this range by the given node or null.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{ASTNode|null}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">node</span><span style="color:#6A737D;"> - The node to reset, or null.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">reset</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.startNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.endNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">//------------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#6A737D;">// Rule Definition</span></span>
<span class="line"><span style="color:#6A737D;">//------------------------------------------------------------------------------</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    meta: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        type: </span><span style="color:#9ECBFF;">&quot;problem&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        docs: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            description: </span><span style="color:#9ECBFF;">&quot;disallow unreachable code after \`return\`, \`throw\`, \`continue\`, and \`break\` statements&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            category: </span><span style="color:#9ECBFF;">&quot;Possible Errors&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            recommended: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            url: </span><span style="color:#9ECBFF;">&quot;https://eslint.org/docs/rules/no-unreachable&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        schema: []</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">create</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">context</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> currentCodePath </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">range</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ConsecutiveRange</span><span style="color:#E1E4E8;">(context.</span><span style="color:#B392F0;">getSourceCode</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Reports a given node if it&#39;s unreachable.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">node</span><span style="color:#6A737D;"> - A statement node to report.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#F97583;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">reportIfUnreachable</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> nextNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (node </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> currentCodePath.currentSegments.</span><span style="color:#B392F0;">every</span><span style="color:#E1E4E8;">(isUnreachable)) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// Store this statement to distinguish consecutive statements.</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (range.isEmpty) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    range.</span><span style="color:#B392F0;">reset</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// Skip if this statement is inside of the current range.</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (range.</span><span style="color:#B392F0;">contains</span><span style="color:#E1E4E8;">(node)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// Merge if this statement is consecutive to the current range.</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (range.</span><span style="color:#B392F0;">isConsecutive</span><span style="color:#E1E4E8;">(node)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    range.</span><span style="color:#B392F0;">merge</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">                nextNode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * Report the current range since this statement is reachable or is</span></span>
<span class="line"><span style="color:#6A737D;">             * not consecutive to the current range.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">range.isEmpty) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                context.</span><span style="color:#B392F0;">report</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">                    message: </span><span style="color:#9ECBFF;">&quot;Unreachable code.&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                    loc: range.location,</span></span>
<span class="line"><span style="color:#E1E4E8;">                    node: range.startNode</span></span>
<span class="line"><span style="color:#E1E4E8;">                });</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// Update the current range.</span></span>
<span class="line"><span style="color:#E1E4E8;">            range.</span><span style="color:#B392F0;">reset</span><span style="color:#E1E4E8;">(nextNode);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// Manages the current code path.</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">onCodePathStart</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">codePath</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                currentCodePath </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> codePath;</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">onCodePathEnd</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">                currentCodePath </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> currentCodePath.upper;</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// Registers for all statement nodes (excludes FunctionDeclaration).</span></span>
<span class="line"><span style="color:#E1E4E8;">            BlockStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            BreakStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ClassDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ContinueStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            DebuggerStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            DoWhileStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ExpressionStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ForInStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ForOfStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ForStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            IfStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ImportDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            LabeledStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ReturnStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            SwitchStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ThrowStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            TryStatement: reportIfUnreachable,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">VariableDeclaration</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (node.kind </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;var&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> node.declarations.</span><span style="color:#B392F0;">some</span><span style="color:#E1E4E8;">(isInitialized)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#B392F0;">reportIfUnreachable</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            WhileStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            WithStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ExportNamedDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ExportDefaultDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#E1E4E8;">            ExportAllDeclaration: reportIfUnreachable,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;Program:exit&quot;</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#B392F0;">reportIfUnreachable</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        };</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Checks whether or not a given variable declarator has the initializer.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">node</span><span style="color:#6A737D;"> - A VariableDeclarator node to check.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the node has the initializer.</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isInitialized</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Boolean</span><span style="color:#24292E;">(node.init);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Checks whether or not a given code path segment is unreachable.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{CodePathSegment}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">segment</span><span style="color:#6A737D;"> - A CodePathSegment to check.</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the segment is unreachable.</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isUnreachable</span><span style="color:#24292E;">(</span><span style="color:#E36209;">segment</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">!</span><span style="color:#24292E;">segment.reachable;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * The class to distinguish consecutive unreachable statements.</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ConsecutiveRange</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">constructor</span><span style="color:#24292E;">(</span><span style="color:#E36209;">sourceCode</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.sourceCode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> sourceCode;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.startNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.endNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * The location object of this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@type</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{Object}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">get</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">location</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            start: </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.startNode.loc.start,</span></span>
<span class="line"><span style="color:#24292E;">            end: </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.endNode.loc.end</span></span>
<span class="line"><span style="color:#24292E;">        };</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * \`true\` if this range is empty.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@type</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">get</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isEmpty</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">!</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.startNode </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.endNode);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Checks whether the given node is inside of this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{ASTNode|Token}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">node</span><span style="color:#6A737D;"> - The node to check.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the node is inside of this range.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">contains</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">            node.range[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">&gt;=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.startNode.range[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">            node.range[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">&lt;=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.endNode.range[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">        );</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Checks whether the given node is consecutive to this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">node</span><span style="color:#6A737D;"> - The node to check.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{boolean}</span><span style="color:#6A737D;"> \`true\` if the node is consecutive to this range.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">isConsecutive</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">contains</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.sourceCode.</span><span style="color:#6F42C1;">getTokenBefore</span><span style="color:#24292E;">(node));</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Merges the given node to this range.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">node</span><span style="color:#6A737D;"> - The node to merge.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">merge</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.endNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">     * Resets this range by the given node or null.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{ASTNode|null}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">node</span><span style="color:#6A737D;"> - The node to reset, or null.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">reset</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.startNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.endNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">//------------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#6A737D;">// Rule Definition</span></span>
<span class="line"><span style="color:#6A737D;">//------------------------------------------------------------------------------</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    meta: {</span></span>
<span class="line"><span style="color:#24292E;">        type: </span><span style="color:#032F62;">&quot;problem&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        docs: {</span></span>
<span class="line"><span style="color:#24292E;">            description: </span><span style="color:#032F62;">&quot;disallow unreachable code after \`return\`, \`throw\`, \`continue\`, and \`break\` statements&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            category: </span><span style="color:#032F62;">&quot;Possible Errors&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            recommended: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            url: </span><span style="color:#032F62;">&quot;https://eslint.org/docs/rules/no-unreachable&quot;</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        schema: []</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">create</span><span style="color:#24292E;">(</span><span style="color:#E36209;">context</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> currentCodePath </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">range</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ConsecutiveRange</span><span style="color:#24292E;">(context.</span><span style="color:#6F42C1;">getSourceCode</span><span style="color:#24292E;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">         * Reports a given node if it&#39;s unreachable.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{ASTNode}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">node</span><span style="color:#6A737D;"> - A statement node to report.</span></span>
<span class="line"><span style="color:#6A737D;">         * </span><span style="color:#D73A49;">@returns</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{void}</span></span>
<span class="line"><span style="color:#6A737D;">         */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">reportIfUnreachable</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> nextNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (node </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> currentCodePath.currentSegments.</span><span style="color:#6F42C1;">every</span><span style="color:#24292E;">(isUnreachable)) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// Store this statement to distinguish consecutive statements.</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (range.isEmpty) {</span></span>
<span class="line"><span style="color:#24292E;">                    range.</span><span style="color:#6F42C1;">reset</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// Skip if this statement is inside of the current range.</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (range.</span><span style="color:#6F42C1;">contains</span><span style="color:#24292E;">(node)) {</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// Merge if this statement is consecutive to the current range.</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (range.</span><span style="color:#6F42C1;">isConsecutive</span><span style="color:#24292E;">(node)) {</span></span>
<span class="line"><span style="color:#24292E;">                    range.</span><span style="color:#6F42C1;">merge</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                nextNode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * Report the current range since this statement is reachable or is</span></span>
<span class="line"><span style="color:#6A737D;">             * not consecutive to the current range.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">range.isEmpty) {</span></span>
<span class="line"><span style="color:#24292E;">                context.</span><span style="color:#6F42C1;">report</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">                    message: </span><span style="color:#032F62;">&quot;Unreachable code.&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                    loc: range.location,</span></span>
<span class="line"><span style="color:#24292E;">                    node: range.startNode</span></span>
<span class="line"><span style="color:#24292E;">                });</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// Update the current range.</span></span>
<span class="line"><span style="color:#24292E;">            range.</span><span style="color:#6F42C1;">reset</span><span style="color:#24292E;">(nextNode);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// Manages the current code path.</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">onCodePathStart</span><span style="color:#24292E;">(</span><span style="color:#E36209;">codePath</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">                currentCodePath </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> codePath;</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">onCodePathEnd</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">                currentCodePath </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> currentCodePath.upper;</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// Registers for all statement nodes (excludes FunctionDeclaration).</span></span>
<span class="line"><span style="color:#24292E;">            BlockStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            BreakStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ClassDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ContinueStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            DebuggerStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            DoWhileStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ExpressionStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ForInStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ForOfStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ForStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            IfStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ImportDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            LabeledStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ReturnStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            SwitchStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ThrowStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            TryStatement: reportIfUnreachable,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">VariableDeclaration</span><span style="color:#24292E;">(</span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (node.kind </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;var&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> node.declarations.</span><span style="color:#6F42C1;">some</span><span style="color:#24292E;">(isInitialized)) {</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6F42C1;">reportIfUnreachable</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            WhileStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            WithStatement: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ExportNamedDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ExportDefaultDeclaration: reportIfUnreachable,</span></span>
<span class="line"><span style="color:#24292E;">            ExportAllDeclaration: reportIfUnreachable,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;Program:exit&quot;</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">reportIfUnreachable</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        };</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br></div></div><p>实现中，通过 isUnreachable 函数来判别一个 code path 是否无法触及，我提供一些返例帮助大家理解：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">foo</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;done&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">bar</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Oops!&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;done&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">while</span><span style="color:#E1E4E8;">(value) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">break</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;done&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Oops!&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;done&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">baz</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (Math.</span><span style="color:#B392F0;">random</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0.5</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;done&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">foo</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;done&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">bar</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Oops!&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;done&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">while</span><span style="color:#24292E;">(value) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;done&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Oops!&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;done&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">baz</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Math.</span><span style="color:#6F42C1;">random</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.5</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;done&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><p>因为 unreachable 的代码需要放在一个区块当中去理解，单条语句无法去进行判别，因此使用 ConsecutiveRange 类来保留连续代码信息。</p><p>最后，这种优秀的插件扩展机制对于设计一个库，尤其是设计一个规范工具来说，是非常值得借鉴的模式。事实上，prettier 也会在新的版本中引入插件机制，目前已经在 beta 版，感兴趣的读者可以<a href="https://prettier.io/docs/en/plugins.html#docsNav" target="_blank" rel="noreferrer">尝鲜</a>。</p><h2 id="自动化规范与团队建设" tabindex="-1">自动化规范与团队建设 <a class="header-anchor" href="#自动化规范与团队建设" aria-label="Permalink to &quot;自动化规范与团队建设&quot;">​</a></h2><p>自动化规范还有其他一些细节，比如使用 EditorConfig 来保证编辑器的设置统一，确定在制表符空格或换行方面的一致性，又如使用 <a href="https://www.npmjs.com/package/@commitlint/config-conventional" target="_blank" rel="noreferrer">commitlint</a> 并配合 husky，来保证 commit message 的规范：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;"># 安装 commitlint cli 和 conventional config</span></span>
<span class="line"><span style="color:#E1E4E8;">npm install </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">save</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">dev @commitlint</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">{config-conventional,cli}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;"># 配置 commitlint</span></span>
<span class="line"><span style="color:#E1E4E8;">echo </span><span style="color:#9ECBFF;">&quot;module.exports = {extends: [&#39;@commitlint/config-conventional&#39;]}&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> commitlint.config.js</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;"># 安装 commitlint cli 和 conventional config</span></span>
<span class="line"><span style="color:#24292E;">npm install </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">save</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">dev @commitlint</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">{config-conventional,cli}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;"># 配置 commitlint</span></span>
<span class="line"><span style="color:#24292E;">echo </span><span style="color:#032F62;">&quot;module.exports = {extends: [&#39;@commitlint/config-conventional&#39;]}&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> commitlint.config.js</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>并在 commit-msg 的 git hook 阶段进行检查，在 package.json 中添加：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;husky&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&quot;hooks&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;commit-msg&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;commitlint -E HUSKY_GIT_PARAMS&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }  </span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;husky&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&quot;hooks&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;commit-msg&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;commitlint -E HUSKY_GIT_PARAMS&quot;</span></span>
<span class="line"><span style="color:#24292E;">        }  </span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>我们也可以根据团队需求做更多定制化的尝试，比如自动规范化或生产 commit message，有了规范的 commit message 之后，就可以提取关键内容，规范化生产 changelog 等。</p><p>其他方向上，还可以从团队文档的生产来考虑。举个例子，如果使用 React 开发项目，那么 React 组件文档如何规范化生成？如何提高组件使用的效率，减少学习成本？我在<a href="https://juejin.im/pin/5c45dd09092dcb473721710d" target="_blank" rel="noreferrer">掘金 AMA</a> 上做客时，有人便提出了这样的问题。</p><blockquote><p>我们组内面临着最古老的 React 管理平台重构任务，这次我们想生成关于管理平台的阅读文档（包括常用的样式命名、工具方法、全局组件、复杂 API 交互流程等）。 所以我想提出的问题是：面向 React 代码的可维护性和可持续发展（不要单个功能每个团队成员都实现一遍，当新成员加入的时候知道有哪些功能能从现在代码中复用， 也知道有哪些功能还没有，他可以添加实现进去），业内有哪些工具或 npm 库或开发模式是可以确切能够帮助解决痛点或者改善现状的呢？</p></blockquote><p>确实，随着项目复杂度的提升，各种组件也“爆炸式”增长。如何让这些组件方便易用，能快速上手，同时不成为负担，又避免重复造轮子现象，良好的组件管理在团队中非常重要。</p><p>关于“React 组件管理文档”，简单梳理一下：总得来说，社区在这方面的探索很多，相关方案也各有特色。</p><ul><li>最知名的一定是 <a href="https://storybook.js.org/" target="_blank" rel="noreferrer">storybook</a>，它会生成一个静态页面，专门用来展示组件的实际效果以及用法；缺点是业务侵入性较强，且 story 编写成本较高。</li><li>我个人很喜欢的是 <a href="https://github.com/reactjs/react-docgen" target="_blank" rel="noreferrer">react-docgen</a>，比较极客风格，它能够分析并提取 React 组件信息。原理是使用了 recast 和 @babel/parser AST 分析，最终产出一个 JSON 文档。 <a href="https://github.com/reactjs/react-docgen" target="_blank" rel="noreferrer">https://github.com/reactjs/react-docgen</a> 是它的网页链接，缺点是它较为轻量，缺乏有效的可视化能力。</li><li>那么在 react-docgen 之上，我们可以考虑 <a href="https://www.npmjs.com/package/react-styleguidist" target="_blank" rel="noreferrer">React Styleguidist</a>，这款 React 组件文档生成器，支持丰富的 demo，可能会更符合需求。</li><li>一些小而美的解决方案：比如 react-doc、react-doc-generator、cherrypdoc，都可以考虑尝试。</li></ul><p>“自己动手、丰衣足食”，其实开发一个类似的工具并不会太复杂。如果有时间和精力，你可以根据自己的需求，实现一个完全匹配自己团队的 React 组件管理文档，或者其他框架相关、业务相关的文档，这非常有意义。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在规范化的道路上，只有你想不到，没有你做不到。</p><p>简单的规范化工具用起来非常清爽，但是背后的实现却蕴含了很深的设计与技术细节，值得我们深入学习。</p><p>作为前端工程师，我们应该从平时开发的痛点和效率瓶颈入手，敢于尝试，不断探索。保证团队开发的自动化程度，就能减少不必要的麻烦。</p><p>除了“偏硬”的强制规范手段，一些“软方向”，比如团队氛围、code review/analyse 等，也直接决定着团队的代码质量。进阶的工程师不仅需要在技术上成长，在团队建设上更需要主动交流。</p>`,51),r=[o];function c(t,E,y,i,b,u){return a(),l("div",null,r)}const A=n(e,[["render",c]]);export{d as __pageData,A as default};
