## このリポジトリは開発中です。動作の保証が出来ない部分があります。

## Feature
- Laravel ^9.11
- React ^17.0.2
- TypeScript ^4.7.4
- [Base Repository][Base Repository]
- [Reset CSS][Reset CSS]

## Start Up (on Windows using Makefile)
```
make build
```
vendorとnode_modulesはvolumeマウントされているためホストOSで閲覧できません  
必要な場合、srcディレクトリ下でホストにパッケージをインストールしてください  
  
mui-chips-inputが原因で型定義エラーが出るので、  
node_modules/mui-chips-input/node_modulesを各自削除してください

## Hot Reload
appコンテナ内でファイルを監視して自動コンパイル  
ローカルでファイルを監視してホットリロード

## 搭載機能 (随時加筆修正)
- [API認証][Auth]
- Global/Private/Presence Channel (using Pusher)
- DataBase Notification
- Postの投稿/Like
- UserのFollow
- Material UIによるHeader/Drawer Component

[Base Repository]: https://github.com/mariebell/fullstack-project
[Reset CSS]: https://raw.githubusercontent.com/twbs/bootstrap/v4-dev/dist/css/bootstrap-reboot.css
[Auth]: https://akiblog10.com/authentication-spa-laravel-react/
