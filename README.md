## Feature
- Laravel ^9.11
- React ^17.0.2
- TypeScript ^4.7.4
- [Base Repository][Base Repository]
- [Reset CSS][Reset CSS]

## Start Up (on Windows using MakeFile)
```
make build
```
vendorとnode_modulesはvolumeマウントされているためホストOSで閲覧できません  
エディタがエラーを吐く場合  
srcディレクトリ下でホストにパッケージをインストールしてください

## Hot Reload
appコンテナ内でファイルを監視して自動コンパイル  
ローカルでファイルを監視してホットリロード

## 搭載機能 (随時加筆修正)
- [API認証][Auth]
- Global/Private/Presence Channel (using Pusher)
- DataBase Notification
- Postの投稿/Like
- UserのFollow
- Material UIによるのHeader/Drawer Component

[Base Repository]: https://github.com/mariebell/fullstack-project
[Reset CSS]: https://raw.githubusercontent.com/twbs/bootstrap/v4-dev/dist/css/bootstrap-reboot.css
[Auth]: https://akiblog10.com/authentication-spa-laravel-react/
