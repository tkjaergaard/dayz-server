const { readdirSync, readFileSync, writeFileSync, mkdirSync } = require('fs')
const path = require('path')

const traderConfig = require(path.resolve(__dirname, '../Trader/config.json'))
const dist = path.resolve(__dirname, '../dist')

let traderObjects = `// ------------------------------------------------------ Trader Markers -------------------------------------------------------\n\n`

const run = async () => {
    const traderDZEFilesPath = path.resolve(__dirname, '../EditorFiles/traders')
    
    const files = readdirSync(traderDZEFilesPath).filter(file => file.endsWith('.dze'))

    files.forEach(file => {
        const filePath = path.resolve(traderDZEFilesPath, file)
        const data = JSON.parse(readFileSync(filePath, 'utf-8'))
        const basename = path.basename(file, '.dze')

        const fireBarrels = []
        const tradePoints = []
        let vehicle = null
        let customObjects =  []

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

        const cObjects = traderConfig.customObjects[basename] || []

        traderObjects += `// ------------------------------------------------------ ${basename} -------------------------------------------------------\n\n`
    
        traderObjects += `// Trader points:\n\n`

        tradePoints.forEach(obj => {
            let config = traderConfig.defaultObjects.find(trader => trader.object === obj.Type)

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

        cObjects.forEach(config => {
            const obj = data.EditorObjects.find(o => o.m_Id === config.objectId)

            if (!obj) {
                return
            }

            traderObjects += `// Custom Object\n`
            traderObjects += `<TraderMarker>			${config.trader}\n`
            traderObjects += `<TraderMarkerPosition>	${obj.Position[0]},		${obj.Position[1]},		${obj.Position[2]}\n`
            traderObjects += `<TraderMarkerSafezone>	325\n`

            if (config.trader === 5 && vehicle) {
                traderObjects += `<VehicleSpawn>			${vehicle.Position[0]},		${vehicle.Position[1]},		${vehicle.Position[2]}\n`
                traderObjects += `<VehicleSpawnOri>		${vehicle.Orientation[0]},	${vehicle.Orientation[1]},	${vehicle.Orientation[2]}\n`
            }
            
            traderObjects += `\n`
            traderObjects += `<Object>				${obj.Type}\n`
            traderObjects += `<ObjectPosition>		${obj.Position[0]},		${obj.Position[1]},		${obj.Position[2]}\n`
            traderObjects += `<ObjectOrientation>		${obj.Orientation[0]},	${obj.Orientation[1]},	${obj.Orientation[2]}\n`
          
            if (config) {
                config.inventory.forEach(item => {
                    traderObjects += `<ObjectAttachment>		${item}\n`
                })
            }

            traderObjects += `\n\n`

            let index = data.EditorObjects.findIndex(o => o.m_Id === obj.m_Id)
            if (index > -1) {
                data.EditorObjects[index] = null 
            }
        })

        data.EditorObjects = data.EditorObjects.filter(obj => obj)

        traderObjects += `// Persons:\n\n`
        tradePoints.forEach(obj => {
            let config = traderConfig.defaultObjects.find(trader => trader.object === obj.Type)

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

        const dest = path.join(dist, file)
        mkdirSync(dist, { recursive: true })
        writeFileSync(dest, JSON.stringify(data, null, 4), 'utf-8')
    })

    traderObjects += '//<OpenFile> FileName.txt								// Links to another File; Must be right above <FileEnd>!\n'
    traderObjects += '<FileEnd>												// This has to be on the End of this File and is very importand!'
    

    writeFileSync(path.join(dist, 'TraderObjects.txt'), traderObjects.trim("\n\n"), 'utf-8')
    console.log("Parse completed.")
}

run()