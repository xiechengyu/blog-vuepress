---
title: npm私有仓库搭建文档
date: 2019-6-5 11:36:17
tags: ["基础架构"]
category: 前端
prev: false
next: ../npm私有仓库使用文档
sticky: true
comments: true
---


# 前言

我们平时使用npm publish进行发布时，上传的仓库默认地址是npm，通过Verdaccio工具在本地新建一个仓库地址，再把本地的默认上传仓库地址切换到本地仓库地址即可。当npm install时没有找到本地的仓库，则Verdaccio默认配置中会从npm中央仓库下载。

<!-- more -->

# 环境

*   node
    
*   verdaccio
    
*   nrm（快速切换仓库源）
    
*   pm2（守护进程）
    

# 在linux环境中搭建

## 全局安装verdaccio

npm install --global verdaccio

## 全局安装pm2

npm install -g pm2

## 给pm2和verdaccio添加到命令

ln -s /usr/local/nodejs/bin/verdaccio /usr/local/bin/verdaccio

ln -s /usr/local/nodejs/bin/pm2 /usr/local/bin/pm2

## 创建一个普通用户

useradd wuhs

mkdir -p verdaccio/npmdata

## 修改配置文件

cp /root/.config/verdaccio/config.yaml /home/wuhs/verdaccio/

cd /home/wuhs/verdaccio/

chown root.root config.yaml

su - wuhs

cd verdaccio/

vim config.yaml

修改为

    #
    # This is the default configuration file. It allows all users to do anything,
    # please read carefully the documentation and best practices to
    # improve security.
    #
    # Look here for more config file examples:
    # https://github.com/verdaccio/verdaccio/tree/5.x/conf
    #
    # Read about the best practices
    # https://verdaccio.org/docs/best
    
    # path to a directory with all packages
    storage: ./storage
    # path to a directory with plugins to include
    plugins: ./plugins
    
    # https://verdaccio.org/docs/webui
    web:
      title: 玩美npm私库
      # comment out to disable gravatar support
      # gravatar: false
      # by default packages are ordercer ascendant (asc|desc)
      # sort_packages: asc
      # convert your UI to the dark side
      # darkMode: true
      # html_cache: true
      # by default all features are displayed
      # login: true
      # showInfo: true
      # showSettings: true
      # In combination with darkMode you can force specific theme
      # showThemeSwitch: true
      # showFooter: true
      # showSearch: true
      # showRaw: true
      # showDownloadTarball: true
      #  HTML tags injected after manifest <scripts/>
      # scriptsBodyAfter:
      #    - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
      #  HTML tags injected before ends </head>
      #  metaScripts:
      #    - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
      #    - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
      #    - '<meta name="robots" content="noindex" />'
      #  HTML tags injected first child at <body/>
      #  bodyBefore:
      #    - '<div id="myId">html before webpack scripts</div>'
      #  Public path for template manifest scripts (only manifest)
      #  publicPath: http://somedomain.org/
    
    # https://verdaccio.org/docs/configuration#authentication
    auth:
      htpasswd:
        file: ./htpasswd
        # Maximum amount of users allowed to register, defaults to "+inf".
        # You can set this to -1 to disable registration.
        # max_users: 1000
        # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
        # algorithm: bcrypt # by default is crypt, but is recommended use bcrypt for new installations
        # Rounds number for "bcrypt", will be ignored for other algorithms.
        # rounds: 10
    
    # https://verdaccio.org/docs/configuration#uplinks
    # a list of other known repositories we can talk to
    uplinks:
      npmjs:
        # url: https://registry.npmjs.org/
        # 镜像
        url: https://skimdb.npmjs.com/registry/
    
    # Learn how to protect your packages
    # https://verdaccio.org/docs/protect-your-dependencies/
    # https://verdaccio.org/docs/configuration#packages
    packages:
      '@*/*':
        # scoped packages
        access: $all
        publish: $authenticated
        unpublish: $authenticated
        #代理 如果本地仓库没找到会去npmjs中找，npmjs就是uplinks中的变量
        proxy: npmjs
    
      '**':
        # allow all users (including non-authenticated users) to read and
        # publish all packages
        #
        # you can specify usernames/groupnames (depending on your auth plugin)
        # and three keywords: "$all", "$anonymous", "$authenticated"
        access: $all
    
        # allow all known users to publish/publish packages
        # (anyone can register by default, remember?)
        publish: $authenticated
        unpublish: $authenticated
    
        # if package is not available locally, proxy requests to 'npmjs' registry
        proxy: npmjs
    
    # To improve your security configuration and  avoid dependency confusion
    # consider removing the proxy property for private packages
    # https://verdaccio.org/docs/best#remove-proxy-to-increase-security-at-private-packages
    
    # https://verdaccio.org/docs/configuration#server
    # You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections.
    # A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
    # WORKAROUND: Through given configuration you can workaround following issue https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.
    server:
      keepAliveTimeout: 60
      # Allow `req.ip` to resolve properly when Verdaccio is behind a proxy or load-balancer
      # See: https://expressjs.com/en/guide/behind-proxies.html
      # trustProxy: '127.0.0.1'
    
    # https://verdaccio.org/docs/configuration#offline-publish
    # publish:
    #   allow_offline: false
    
    # https://verdaccio.org/docs/configuration#url-prefix
    # url_prefix: /verdaccio/
    # VERDACCIO_PUBLIC_URL='https://somedomain.org';
    # url_prefix: '/my_prefix'
    # // url -> https://somedomain.org/my_prefix/
    # VERDACCIO_PUBLIC_URL='https://somedomain.org';
    # url_prefix: '/'
    # // url -> https://somedomain.org/
    # VERDACCIO_PUBLIC_URL='https://somedomain.org/first_prefix';
    # url_prefix: '/second_prefix'
    # // url -> https://somedomain.org/second_prefix/'
    
    # https://verdaccio.org/docs/configuration#security
    # security:
    #   api:
    #     legacy: true
    #     jwt:
    #       sign:
    #         expiresIn: 29d
    #       verify:
    #         someProp: [value]
    #    web:
    #      sign:
    #        expiresIn: 1h # 1 hour by default
    #      verify:
    #         someProp: [value]
    
    # https://verdaccio.org/docs/configuration#user-rate-limit
    # userRateLimit:
    #   windowMs: 50000
    #   max: 1000
    
    # https://verdaccio.org/docs/configuration#max-body-size
    # max_body_size: 10mb
    
    # https://verdaccio.org/docs/configuration#listen-port
    # listen:
    # - localhost:4873            # default value
    # - http://localhost:4873     # same thing
    # - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
    # - https://example.org:4873  # if you want to use https
    # - "[::1]:4873"                # ipv6
    # - unix:/tmp/verdaccio.sock    # unix socket
    
    # The HTTPS configuration is useful if you do not consider use a HTTP Proxy
    # https://verdaccio.org/docs/configuration#https
    # https:
    #   key: ./path/verdaccio-key.pem
    #   cert: ./path/verdaccio-cert.pem
    #   ca: ./path/verdaccio-csr.pem
    
    # https://verdaccio.org/docs/configuration#proxy
    # http_proxy: http://something.local/
    # https_proxy: https://something.local/
    
    # https://verdaccio.org/docs/configuration#notifications
    # notify:
    #   method: POST
    #   headers: [{ "Content-Type": "application/json" }]
    #   endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
    #   content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
    
    middlewares:
      audit:
        enabled: true
    
    # 监听本地所有ip，配置了后可以通过公网访问
    listen: 0.0.0.0:10241
    
    # https://verdaccio.org/docs/logger
    # log settings
    logs: { type: stdout, format: pretty, level: http }
    #experiments:
    #  # support for npm token command
    #  token: false
    #  # disable writing body size to logs, read more on ticket 1912
    #  bytesin_off: false
    #  # enable tarball URL redirect for hosting tarball with a different server, the tarball_url_redirect can be a template string
    #  tarball_url_redirect: 'https://mycdn.com/verdaccio/${packageName}/${filename}'
    #  # the tarball_url_redirect can be a function, takes packageName and filename and returns the url, when working with a js configuration file
    #  tarball_url_redirect(packageName, filename) {
    #    const signedUrl = // generate a signed url
    #    return signedUrl;
    #  }
    
    # translate your registry, api i18n not available yet
    # i18n:
    # list of the available translations https://github.com/verdaccio/verdaccio/blob/master/packages/plugins/ui-theme/src/i18n/ABOUT_TRANSLATIONS.md
    #   web: en-US
    

## 使用pm2启动verdaccio

pm2 start verdaccio

## 设置开机自启动

1、执行pm2 save 保存已启动项目

2、执行pm2 startup以后会得到以下提示 设置环境变量

    1 [PM2] Init System found: upstart
    2 [PM2] To setup the Startup Script, copy/paste the following command:
    3 sudo env PATH=$PATH:/opt/bitnami/nodejs/bin /opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 startup upstart -u bitnami --hp /home/bitnami

3、粘贴复制 sudo env….这一部分的命令 执行命令 完成。

4、设置完成，sudo reboot 手动重启服务器pm2 list 查看验证

# 在windows环境中搭建

## 全局安装verdaccio

npm install --global verdaccio

## 全局安装pm2

npm install -g pm2

## 修改配置文件

将 C:\Users\谢成昱\.config\verdaccio\config.yaml 文件更改内容为

    #
    # This is the default configuration file. It allows all users to do anything,
    # please read carefully the documentation and best practices to
    # improve security.
    #
    # Look here for more config file examples:
    # https://github.com/verdaccio/verdaccio/tree/5.x/conf
    #
    # Read about the best practices
    # https://verdaccio.org/docs/best
    
    # path to a directory with all packages
    storage: ./storage
    # path to a directory with plugins to include
    plugins: ./plugins
    
    # https://verdaccio.org/docs/webui
    web:
      title: 玩美npm私库
      # comment out to disable gravatar support
      # gravatar: false
      # by default packages are ordercer ascendant (asc|desc)
      # sort_packages: asc
      # convert your UI to the dark side
      # darkMode: true
      # html_cache: true
      # by default all features are displayed
      # login: true
      # showInfo: true
      # showSettings: true
      # In combination with darkMode you can force specific theme
      # showThemeSwitch: true
      # showFooter: true
      # showSearch: true
      # showRaw: true
      # showDownloadTarball: true
      #  HTML tags injected after manifest <scripts/>
      # scriptsBodyAfter:
      #    - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
      #  HTML tags injected before ends </head>
      #  metaScripts:
      #    - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
      #    - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
      #    - '<meta name="robots" content="noindex" />'
      #  HTML tags injected first child at <body/>
      #  bodyBefore:
      #    - '<div id="myId">html before webpack scripts</div>'
      #  Public path for template manifest scripts (only manifest)
      #  publicPath: http://somedomain.org/
    
    # https://verdaccio.org/docs/configuration#authentication
    auth:
      htpasswd:
        file: ./htpasswd
        # Maximum amount of users allowed to register, defaults to "+inf".
        # You can set this to -1 to disable registration.
        # max_users: 1000
        # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
        # algorithm: bcrypt # by default is crypt, but is recommended use bcrypt for new installations
        # Rounds number for "bcrypt", will be ignored for other algorithms.
        # rounds: 10
    
    # https://verdaccio.org/docs/configuration#uplinks
    # a list of other known repositories we can talk to
    uplinks:
      npmjs:
        # url: https://registry.npmjs.org/
        # 镜像
        url: https://skimdb.npmjs.com/registry/
    
    # Learn how to protect your packages
    # https://verdaccio.org/docs/protect-your-dependencies/
    # https://verdaccio.org/docs/configuration#packages
    packages:
      '@*/*':
        # scoped packages
        access: $all
        publish: $authenticated
        unpublish: $authenticated
        #代理 如果本地仓库没找到会去npmjs中找，npmjs就是uplinks中的变量
        proxy: npmjs
    
      '**':
        # allow all users (including non-authenticated users) to read and
        # publish all packages
        #
        # you can specify usernames/groupnames (depending on your auth plugin)
        # and three keywords: "$all", "$anonymous", "$authenticated"
        access: $all
    
        # allow all known users to publish/publish packages
        # (anyone can register by default, remember?)
        publish: $authenticated
        unpublish: $authenticated
    
        # if package is not available locally, proxy requests to 'npmjs' registry
        proxy: npmjs
    
    # To improve your security configuration and  avoid dependency confusion
    # consider removing the proxy property for private packages
    # https://verdaccio.org/docs/best#remove-proxy-to-increase-security-at-private-packages
    
    # https://verdaccio.org/docs/configuration#server
    # You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections.
    # A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
    # WORKAROUND: Through given configuration you can workaround following issue https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.
    server:
      keepAliveTimeout: 60
      # Allow `req.ip` to resolve properly when Verdaccio is behind a proxy or load-balancer
      # See: https://expressjs.com/en/guide/behind-proxies.html
      # trustProxy: '127.0.0.1'
    
    # https://verdaccio.org/docs/configuration#offline-publish
    # publish:
    #   allow_offline: false
    
    # https://verdaccio.org/docs/configuration#url-prefix
    # url_prefix: /verdaccio/
    # VERDACCIO_PUBLIC_URL='https://somedomain.org';
    # url_prefix: '/my_prefix'
    # // url -> https://somedomain.org/my_prefix/
    # VERDACCIO_PUBLIC_URL='https://somedomain.org';
    # url_prefix: '/'
    # // url -> https://somedomain.org/
    # VERDACCIO_PUBLIC_URL='https://somedomain.org/first_prefix';
    # url_prefix: '/second_prefix'
    # // url -> https://somedomain.org/second_prefix/'
    
    # https://verdaccio.org/docs/configuration#security
    # security:
    #   api:
    #     legacy: true
    #     jwt:
    #       sign:
    #         expiresIn: 29d
    #       verify:
    #         someProp: [value]
    #    web:
    #      sign:
    #        expiresIn: 1h # 1 hour by default
    #      verify:
    #         someProp: [value]
    
    # https://verdaccio.org/docs/configuration#user-rate-limit
    # userRateLimit:
    #   windowMs: 50000
    #   max: 1000
    
    # https://verdaccio.org/docs/configuration#max-body-size
    # max_body_size: 10mb
    
    # https://verdaccio.org/docs/configuration#listen-port
    # listen:
    # - localhost:4873            # default value
    # - http://localhost:4873     # same thing
    # - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
    # - https://example.org:4873  # if you want to use https
    # - "[::1]:4873"                # ipv6
    # - unix:/tmp/verdaccio.sock    # unix socket
    
    # The HTTPS configuration is useful if you do not consider use a HTTP Proxy
    # https://verdaccio.org/docs/configuration#https
    # https:
    #   key: ./path/verdaccio-key.pem
    #   cert: ./path/verdaccio-cert.pem
    #   ca: ./path/verdaccio-csr.pem
    
    # https://verdaccio.org/docs/configuration#proxy
    # http_proxy: http://something.local/
    # https_proxy: https://something.local/
    
    # https://verdaccio.org/docs/configuration#notifications
    # notify:
    #   method: POST
    #   headers: [{ "Content-Type": "application/json" }]
    #   endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
    #   content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
    
    middlewares:
      audit:
        enabled: true
    
    # 监听本地所有ip，配置了后可以通过公网访问
    listen: 0.0.0.0:10241
    
    # https://verdaccio.org/docs/logger
    # log settings
    logs: { type: stdout, format: pretty, level: http }
    #experiments:
    #  # support for npm token command
    #  token: false
    #  # disable writing body size to logs, read more on ticket 1912
    #  bytesin_off: false
    #  # enable tarball URL redirect for hosting tarball with a different server, the tarball_url_redirect can be a template string
    #  tarball_url_redirect: 'https://mycdn.com/verdaccio/${packageName}/${filename}'
    #  # the tarball_url_redirect can be a function, takes packageName and filename and returns the url, when working with a js configuration file
    #  tarball_url_redirect(packageName, filename) {
    #    const signedUrl = // generate a signed url
    #    return signedUrl;
    #  }
    
    # translate your registry, api i18n not available yet
    # i18n:
    # list of the available translations https://github.com/verdaccio/verdaccio/blob/master/packages/plugins/ui-theme/src/i18n/ABOUT_TRANSLATIONS.md
    #   web: en-US
    

## 下载、安装windows自启动包

1、npm install pm2-windows-startup -g

2、pm2-startup install

## 使用pm2启动verdaccio

pm2 start D:\\nvm\\v18.13.0\\node\_modules\\verdaccio\\bin\\verdaccio

## 设置开机自启动

1、执行pm2 save 保存已启动项目

2、重启后通过 pm2 list查看