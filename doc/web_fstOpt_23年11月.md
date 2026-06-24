# 审批web性能优化一期

首屏时间定义：owl监测到页面中3s内没有发生DOM的变化且监测到有效的首屏外mutation超过15次，或3s内没有发生新的资源请求，记录当前的时间即为首屏时间。

[掘金优化文章](https://juejin.cn/post/7419306819283337266)

FST、FMP、FCP（First Contentful Paint, 首屏时间）LCP、TP90

重点关注首字节时间（TTFB，Time to First Byte）：代表从客户端（如浏览器）发起网页请求到接收到服务器响应的第一个字节所花费的时间。它是一个综合性指标，主要衡量服务器的响应速度与网络连接的质量

TTFB 的总耗时主要由以下三个阶段构成：

- 重定向时间：如果域名存在跳转，会增加额外的时间开
- 连接时间（RTT）：包括 DNS 解析、TCP 握手以及 TLS 加密连接的时间
- 网络延迟、数据传输时间
- 服务器响应时间：服务器接收到请求后，处理数据并生成 HTML 文档的首字节所耗费的时间。

TTFB 是所有加载指标的基础，它决定了浏览器何时能开始渲染网页

- “起跑线”作用：TTFB 是首屏加载的第一个环节。如果 TTFB 过长，后续的 DOM 解析、资源加载和页面渲染（如 FCP、LCP）都会被延后
- 用户体验：过长的 TTFB 会导致明显的“白屏”等待，增加用户跳出率
- SEO 影响：TTFB 是搜索引擎评估网页性能的重要指标，直接影响网站在搜索结果中的排名

根据 web.dev 官方建议，可通过以下方式缩短 TTFB，提升首屏表现，常见的优化方案如下：

- 使用 CDN：将页面内容分发至距离用户最近的边缘节点，大幅减少网络传输延迟
- 实施缓存策略：合理利用浏览器缓存、CDN 边缘缓存以及服务器端缓存（如 Redis），避免重复计算和数据库查询
- 避免重定向：减少多余的 URL 跳转，避免因链式请求增加额外的往返时间
- 优化服务端性能：升级服务器硬件、优化后端数据库查询逻辑，加快服务器处理速度

### 背景

从raptor数据来看，自2023.9月份开始，kuaida-app首屏时间指标开始变差，TP90超过3000ms的基线。

### 分析

**页面维度**、**容器维度**、**首字节变化（服务器响应时间）**、

根据raptor上近15天数据分析，整体页面分析【总PV为210515】，对于android 和 ios系统总体tp90符合预期，但win10 PC端超标严重，占总PV的30%；

存在问题：

- win10访问时tp90较高，是超标的主要原因
- 当前请求协议大都是h1.1，是否能够迁移到h2？
- 所有页面都会加载相同的资源，包括较大的AgTable.js文件
- 异步加载太多，接口和资源是否能整合一起，当前分段结构太多，是否能够实现资源一起加载，异步请求一起加载（配合业务具体看），比如先请求umi包 -> 资源包 -> 页面api请求 -> 业务个别请求；
- dayjs替换moment减小打包体积？

分析结论：

- 猜测 workbench作为入口，对kuaida.suankuai.com域名存在域名解析等，导致首字节慢。8月份，业务方是否直接提供了submission作为快搭入口，导致submission首字节也变慢。
- workbench 访问量占PC总访问量15%-20%，但性能最差，平均在5500ms。
- submission 在8月初恶化，从3000ms内 -> 4000ms+
- workflow 在8月10以后恶化，从3000ms左右 -> 4000ms+
- 在9月14日前端上线后，pc端、移动端TP90都有比较明显升高

### 目标

针对超标页面治理，降低项目总体的TP90，2700ms左右

### 分页面分析

- 业务逻辑
  - workbenche页面：涉及6个串行接口。其中后两个接口后端的TP90耗费时间，都过长
    串行：userInfo -> getAppInfo -> formlist -> viewlist(视图) -> viewInfo(视图schema) -> dataSource(视图数据)
    /view/data/list : TP90 653ms
    /view/showInfo/{viewCode} : TP90 347.5ms
  - submission页面：8月初，PV大量下降，未分析出具体变差原因。
  - workflow页面：
    8.10在workflow页面做了逻辑处理，用户重新提交后，为避免后端流程计算还未完成，得到的工作流是空的场景，和产品、后端对齐，延迟2s进行请求工作流，如右图2
    导致 workflow 在8月10以后恶化，从3000ms左右 -> 4000ms+
  - 资源加载上：
    umi.js gzip 357 kb. 平均请求耗时：290ms。9月14日之前是170kb，增加了180kb。
    ag-table gzip 277 kb 平均请求耗时：181ms

分析结论：

- 因raptor首屏口径的原因，动态拆包会比较大程度影响首屏时间，但本质页面中存在占位loading符合产品预期。
- 一些业务逻辑，需要对某些模块延迟加载，也导致首屏时间变慢，也符合产品预期。
- 接口串行加载，是否可以通过 中间层 进行 接口合并来优化? 如workbench页面的接口。
- 后端部分接口慢，需要推动后端进行优化。
- 前端资原过大，需分析umi.js变成原因。

### 解决方案

- 解决umi.js变大问题，主要原因如下，在某次迭代中，增加了如下代码，`export { searchAjax } from '@onejs/components-kuaida` 导致把@onejs/components-kuaida包，全部打到了umi.js中。
  而@onejs/components-kuaida依赖@ss/mtd-react 和 lodash。
  导致pc和移动端umi.js都大了很多，猜测是9月14日前端上线后，pc端、移动端TP90都有比较明显升高的主要原因。
  需要改成：`export { searchAjax } from '@onejs/components-kuaida/es/utils/search-ajax'`; 避免把整个包引入。修改后 umjs 包提交从 1.1MB（284.81kb）变为 556.63kb（162.64kb）
- 减少动态拆包导致chunk过多，多次资源的加载，收敛到 external_pc和external_mobile。
  同时多页面之间可以共用 external_xx 带来的缓存。合并后，external_pc 的大小在 81.8kb。
- 修改workflow页面逻辑：
  原来主要是为了解决重新提交后，后端工作流还没有执行完成，导致页面展示异常，概率很小。

- 后端接口较慢（需要提升接口性能）：
  在09.14快搭v0.8上线后，这几个接口明显变差，自定义ID需求引入问题。预计后端在12.11优化上线。
  - /api/zeroweb/record/get/{code} (查询记录)
    TP90：07.31(406.0ms) 12.04(1598.9ms)
    预期 TP999 1100ms
  - /api/zeroweb/record/workflow/list （查询工作流列表）
    TP90：08.14(225.0ms) 12.04(1405.9ms)
    预期 TP999 560ms
  - /api/zeroweb/record/workflow/get （查询工作流）
    TP90：07.31(453.1ms) 12.04(1615.6)
    预期 TP999 560ms
  - /api/zeroweb/record/with_workflow/get (获取工作流详情页表单信息)
    TP90：07.31(554.4ms) 12.04(903.3ms)
    预期 TP999 1064ms
