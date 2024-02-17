# Amazon_host
*注：* 本项目还处于测试阶段，仅在本机测试通过，如有问题欢迎提 [issues](https://github.com/freysu/amazon_host/issues/new)


## 二、使用方法

下面的地址无需访问 GitHub 即可获取到最新的 hosts 内容：

- 文件：`https://raw.githubusercontent.com/freysu/amazon_host/main/hosts`
- JSON：`https://raw.githubusercontent.com/freysu/amazon_host/main/hosts.json`

### 2.1 手动方式

#### 2.1.1 复制下面的内容

```bash
23.45.51.129                  a.media-amazon.com
#                             a2z.com
52.95.113.102                 aan.amazon.de
176.32.111.121                aan.amazon.es
176.32.111.120                aan.amazon.fr
54.239.32.32                  aan.amazon.it
52.94.222.127                 aax-eu.amazon.de
52.95.121.195                 aax-eu.amazon.es
52.94.222.127                 aax-eu.amazon.fr
52.95.119.2                   aax-eu.amazon.it
52.46.157.92                  aax-us-iad.amazon.com
216.137.34.200                af4c2fc8cd0293f914dfc6c3f3b02a7a8.profile.lhr61-p2.cloudfront.net
#                             alexa-smart-nudge.amazon.com
#                             amazon-adsystem.com
205.251.242.103               amazon.com
52.95.120.34                  amazon.de
52.95.116.112                 amazon.es
54.239.33.91                  amazon.fr
52.95.116.114                 amazon.it
209.54.178.134                api.amazon.com
52.94.234.30                  appx.transient.amazon.com
#                             arcus-uswest.amazon.com
#                             avs-alexa-16-na.amazon.com
#                             cloudfront.net
#                             completion.amazon.com
#                             completion.amazon.de
#                             completion.amazon.es
#                             completion.amazon.fr
#                             completion.amazon.it
54.192.16.100                 d1f0esyb34c1g2.cloudfront.net
18.155.188.45                 d1lxz4vuik53pc.cloudfront.net
18.239.196.119                d39x00gckxu2jb.cloudfront.net
54.240.160.144                data-na.amazon.com
#                             device-metrics-us-2.amazon.com
#                             device-metrics-us.amazon.com
18.244.16.41                  dk9ps7goqoeef.cloudfront.net
13.227.21.131                 dtjsystab5p0r.cloudfront.net
146.75.113.16                 f.media-amazon.com
#                             fls-eu.amazon.de
#                             fls-eu.amazon.es
#                             fls-eu.amazon.fr
#                             fls-eu.amazon.it
#                             fls-na.amazon.com
54.230.86.28                  images-eu.ssl-images-amazon.com
18.155.205.108                images-fe.ssl-images-amazon.com
13.224.166.232                images-na.ssl-images-amazon.com
18.155.205.108                m.media-amazon.com
#                             mag-na.amazon.com
#                             media-amazon.com
209.54.179.227                msh.amazon.com
#                             prime.amazon.com
#                             prod-1.us-east-1.mdcs.mshop.amazon.dev
#                             ssl-images-amazon.com
52.46.156.186                 transient.amazon.com
52.46.129.152                 unagi-na.amazon.com
67.220.243.81                 unagi.amazon.com
67.220.228.135                unagi.amazon.de
52.95.127.145                 unagi.amazon.es
67.220.228.135                unagi.amazon.fr
52.94.222.19                  unagi.amazon.it
219.128.79.148                whoami.akamai.net
108.139.6.196                 www.amazon.com
18.238.182.88                 www.amazon.de
23.45.62.157                  www.amazon.es
13.227.77.207                 www.amazon.fr
18.155.183.93                 www.amazon.it
```

该内容会自动定时更新， 数据更新时间：2024-02-17T11:26:41.276Z

#### 2.1.2 修改 hosts 文件

hosts 文件在每个系统的位置不一，详情如下：
- Windows 系统：`C:\Windows\System32\drivers\etc\hosts`
- Linux 系统：`/etc/hosts`
- Mac（苹果电脑）系统：`/etc/hosts`
- Android（安卓）系统：`/system/etc/hosts`
- iPhone（iOS）系统：`/etc/hosts`

修改方法，把第一步的内容复制到文本末尾：

1. Windows 使用记事本。
2. Linux、Mac 使用 Root 权限：`sudo vi /etc/hosts`。
3. iPhone、iPad 须越狱、Android 必须要 root。

#### 2.1.3 激活生效
大部分情况下是直接生效，如未生效可尝试下面的办法，刷新 DNS：

1. Windows：在 CMD 窗口输入：`ipconfig /flushdns`

2. Linux 命令：`sudo nscd restart`，如报错则须安装：`sudo apt install nscd` 或 `sudo /etc/init.d/nscd restart`

3. Mac 命令：`sudo killall -HUP mDNSResponder`

**Tips：** 上述方法无效可以尝试重启机器。

### 2.2 自动方式（SwitchHosts）

**Tip**：推荐 [SwitchHosts](https://github.com/oldj/SwitchHosts) 工具管理 hosts

以 SwitchHosts 为例，看一下怎么使用的，配置参考下面：

- Hosts 类型: `Remote`

- Hosts 标题: 随意

- URL: `https://raw.githubusercontent.com/freysu/amazon_host/main/hosts`

- 自动刷新: 最好选 `1 小时`


## 声明
<a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh"><img alt="知识共享许可协议" style="border-width: 0" src="https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png"></a><br>本作品采用 <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh">署名-非商业性使用-禁止演绎 4.0 国际</a> 进行许可。
