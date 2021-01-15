# DayZ Server

*This is intended for the use at the JAZZ DayZ Server. You're not allowed to distribute, repack og otherwise modify the code without explicit permission.*


### EditorFiles

This folder contains the .dze files form the DayZ Editor mod. This is used at the version control.

## Bin

### parseBarrelsToTraderObjects.js

This script crawls a .dze file and filters out all *BarrelHoles_** objects and create a seperate file for the traderObjects.txt config. This makes the barrels constant with fire and non-moveable.

#### Usage

```bash
$ node ./bin/parseBarrelsToTraderObjects.js ./EditorFiles/Pustatest.dze
```

This will result in a parsed edition of the *.dze* file (this is the one that should be put on the server) and a *traderObjects* file. Both are located in the `./dist` directory.