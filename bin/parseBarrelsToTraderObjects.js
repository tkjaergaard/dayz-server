const { readFileSync, writeFileSync } = require('fs')
const fs = require('fs')
const path = require('path')
const arguments = process.argv 

const run = async () => {
    try {
        const file = path.resolve(arguments[2])
        const dist = path.resolve(arguments[3] || __dirname + '/../dist')
        
        const data = JSON.parse(readFileSync(file, 'utf-8'))
        
        const fireBarrels = []

        data.EditorObjects = data.EditorObjects.map(obj => {
            if (obj.Type.startsWith("BarrelHoles_")) {
                fireBarrels.push(obj)

                return null
            }

            return obj
        }).filter(obj => obj)

        const dest = path.join(dist, path.basename(file))
        await fs.promises.mkdir(path.dirname(dest), { recursive: true }).catch(console.error);
        writeFileSync(dest, JSON.stringify(data, null, 4), 'utf-8')
        
        let traderObjects = `// ${path.basename(file, '.dze')}\n\n`

        fireBarrels.forEach(obj => {
            traderObjects += `<Object>			${obj.Type}\n`
            traderObjects += `<ObjectPosition>	${obj.Position[0]},		${obj.Position[1]},		${obj.Position[2]}\n`
            traderObjects += `<ObjectOrientation>	${obj.Orientation[0]},	${obj.Orientation[1]},	${obj.Orientation[2]}\n`
            traderObjects += `\n`
        })

        writeFileSync(path.join(dist, 'traderObjects.' + path.basename(file, '.dze') + '.txt'), traderObjects.trim("\n"), 'utf-8')

        console.log("Parse completed.")
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
} 

run()