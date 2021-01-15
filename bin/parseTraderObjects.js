const { readFileSync, writeFileSync } = require('fs')
const fs = require('fs')
const path = require('path')
const traderConfig = require(path.resolve(__dirname, '../Trader/config.json'))
const arguments = process.argv 

const run = async () => {
    try {
        const file = path.resolve(arguments[2])
        const dist = path.resolve(arguments[3] || __dirname + '/../dist')
        
        const data = JSON.parse(readFileSync(file, 'utf-8'))
        
        const fireBarrels = []
        const tradePoints = []
        let vehicle = null

        data.EditorObjects = data.EditorObjects.map(obj => {
            switch (true) {
                case obj.Type.startsWith("BarrelHoles_"):
                    fireBarrels.push(obj)
                    return null
                case obj.Type.startsWith("Survivor"):
                    tradePoints.push(obj)
                    return null
                case obj.Type.startsWith("Truck_"):
                    vehicle = obj
                    return null
                default:
                    return obj
            }
        }).filter(obj => obj)

        const dest = path.join(dist, path.basename(file))
        await fs.promises.mkdir(path.dirname(dest), { recursive: true }).catch(console.error);
        writeFileSync(dest, JSON.stringify(data, null, 4), 'utf-8')
        
        let traderObjects = `// ${path.basename(file, '.dze')}\n\n`
       
        traderObjects += `// Trader points:\n\n`
        tradePoints.forEach(obj => {
            let config = traderConfig.find(trader => trader.object === obj.Type)

            if (!config) {
                return
            }

            traderObjects += `<TraderMarker>			${config.trader}\n`
            traderObjects += `<TraderMarkerPosition>	${obj.Position[0]},		${obj.Position[1]},		${obj.Position[2]}\n`
            traderObjects += `<TraderMarkerSafezone>	325\n`

            if (config.trader === 5 && vehicle) {
                traderObjects += `<VehicleSpawn>			${vehicle.Position[0]},		${vehicle.Position[1]},		${vehicle.Position[2]}\n`
                traderObjects += `<VehicleSpawnOri>		${vehicle.Orientation[0]},	${vehicle.Orientation[1]},	${vehicle.Orientation[2]}\n`
            }

            traderObjects += `\n\n`
        })

        traderObjects += `// Persons:\n\n`
        tradePoints.forEach(obj => {
            let config = traderConfig.find(trader => trader.object === obj.Type)

            traderObjects += `<Object>				${obj.Type}\n`
            traderObjects += `<ObjectPosition>		${obj.Position[0]},		${obj.Position[1]},		${obj.Position[2]}\n`
            traderObjects += `<ObjectOrientation>		${obj.Orientation[0]},	${obj.Orientation[1]},	${obj.Orientation[2]}\n`
          
            if (config) {
                config.inventory.forEach(item => {
                    traderObjects += `<ObjectAttachment>		${item}\n`
                })
            }

            traderObjects += `\n\n`
        })

        traderObjects += `// Fire barrels:\n\n`
        fireBarrels.forEach(obj => {
            traderObjects += `<Object>				${obj.Type}\n`
            traderObjects += `<ObjectPosition>		${obj.Position[0]},		${obj.Position[1]},		${obj.Position[2]}\n`
            traderObjects += `<ObjectOrientation>		${obj.Orientation[0]},	${obj.Orientation[1]},	${obj.Orientation[2]}\n`
            traderObjects += `\n\n`
        })

        writeFileSync(path.join(dist, 'traderObjects.' + path.basename(file, '.dze') + '.txt'), traderObjects.trim("\n\n"), 'utf-8')

        console.log("Parse completed.")
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
} 

run()