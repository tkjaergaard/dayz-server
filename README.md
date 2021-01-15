# DayZ Server

*This is intended for the use at the JAZZ DayZ Server. You're not allowed to distribute, repack og otherwise modify the code without explicit permission.*


### EditorFiles

This folder contains the .dze files form the DayZ Editor mod. This is used at the version control.

## Bin

### build.js

This script crawls all trader .dze files located in `EditorFiles/traders`. Trader points are configured in the trader config located in the `Treader/config.json` file.

Files are build to the `./dist` folder.

#### Usage

```bash
$ node ./bin/buiild.js
```