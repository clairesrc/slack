var readline = require('readline');

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY)
    process.stdin.setRawMode(true);


const PLAYER_CHAR = "%"
const ENEMY_CHAR = "c"
const FRUIT_CHAR = "o"


const tiles = {
    w: {
        name: "Wall",
        walkable: false,
        char: "X "
    },
    f: {
        name: "Floor",
        walkable: true,
        char: "  ",
    },
    o: {
        name: "Fruit",
        walkable: true,
        char: "o "
    },
    c: {
        name: "Enemy",
        walkable: false,
        char: "c "
    },
    "%": {
        name: "Player",
        walkable: false,
        char: "% "
    }
}

let myMap = 
    [
        ["w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w"],
        ["w","f","f","f","f","w","f","f","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","w","f","f","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","w","f","f","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","f","f","f","f","f","f","f","f","f","w","w","w","w"],
        ["w","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","f","f","w","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","f","f","w","f","f","f","f","f","f","f","f","f","w"],
        ["w","f","f","f","f","f","f","w","f","f","f","f","f","f","f","f","f","w"],
        ["w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w"],
    ]

let log = ""
let playerCoords = {x: 4, y: 4}
let score = 0
let life = 5
let fruitCoords = {x: 0, y: 0}
let enemyCoords = []

const addFruit = (playerCoords) => {
    const maxCol = myMap[0].length + 1
    const maxRow = myMap.length + 1
    const col = Math.ceil(10 * Math.random() % maxCol)
    const row = Math.ceil(10 * Math.random() % maxRow)
    if (
        myMap[row][col] != "w" &&
        playerCoords.x != col &&
        playerCoords.y != row
    ) {
        fruitCoords.x = row
        fruitCoords.y = col
        myMap[row][col] = FRUIT_CHAR
        return
    }
    addFruit(playerCoords)
}
const addEnemy = (playerCoords) => {
    const maxCol = myMap[0].length + 1
    const maxRow = myMap.length + 1
    const col = Math.ceil(10 * Math.random() % maxCol)
    const row = Math.ceil(10 * Math.random() % maxRow)
    if (
        myMap[row][col] != ENEMY_CHAR &&
        playerCoords.x != col &&
        playerCoords.y != row
    ) {
        enemyCoords.push({
            x: row,
            y: col
        })
        myMap[row][col] = ENEMY_CHAR
        return
    }
    addEnemy(playerCoords)
}
const findCollider = ({x, y}, colliders) => {
    i = 0
    res = false
    colliders.forEach((coords) => {
        if (
            coords.x === x &&
            coords.y === y
        ) {
            res = i
            return
        }
        i++
    })
    return res
}
const isColliding = (playerCoords, fruitCoords) => {
    if (
        playerCoords.x === fruitCoords.x &&
        playerCoords.y === fruitCoords.y
    ) {
        return true
    }
    return false
}
const ouch = () => {
    life--
    if (life === 0) {
        gameOver()
    }
}
const gameOver = () => {
    console.clear()
    console.log("Game over")
    process.exit()
}
const removeFromMap = ({x, y}) => {
    myMap[x][y] = "f"
}
const remove = (source, i) => {
    return source.splice(i, i);
}
const renderer = (playerCoords, enemyCoords) => {
    let rowIndex = 0
    myMap.forEach(row => {
        let colIndex = 0
        console.log(
            row.reduce((output, tileKey) => {
                if (
                    playerCoords.x === rowIndex && 
                    playerCoords.y === colIndex
                ) {
                    tileKey = PLAYER_CHAR
                }
                if (
                    findCollider(
                        {x: rowIndex, y: colIndex}, 
                        enemyCoords
                    )
                ) {
                    tileKey = ENEMY_CHAR
                }
                if (
                    fruitCoords.x === rowIndex &&
                    fruitCoords.y === colIndex
                ) {
                    tileKey = FRUIT_CHAR
                }
                colIndex++
                return output + tiles[tileKey].char
            }, "")
        )
        rowIndex++
    })
}

console.clear()
console.log(`
#### ##            ##    
##  # ##            ##    
###   ##  ##    ### ## ##   PRESS
 ###  ## # ##  ## # ## #    ANY KEY
  ### ##  ###  ##   ###     TO BEGIN
#  ## ## #  #  ## # ## #  
####  ## #####  ### ## ## 
`)
addEnemy(playerCoords)
addFruit(playerCoords)
process.stdin.on('keypress', (chunk, key) => {
    log = ""
    console.clear()
    if (key && key.name == "q") {
        process.exit()
    }

    // movement
    if (key && key.name == "up") {
        if (
            myMap[playerCoords.x - 1] &&
            myMap[playerCoords.x - 1][playerCoords.y] != "w"
        ) {
            playerCoords.x -= 1
        }
    }
    if (key && key.name == "down") {
        if (
            myMap[playerCoords.x + 1] &&
            myMap[playerCoords.x + 1][playerCoords.y] != "w"
        ) {
            playerCoords.x += 1
        }
    }
    if (key && key.name == "left") {
        if (
            myMap[playerCoords.x][playerCoords.y - 1] &&
            myMap[playerCoords.x][playerCoords.y - 1] != "w"
        ) {
            playerCoords.y -= 1
        }
    }
    if (key && key.name == "right") {
        if (
            myMap[playerCoords.x][playerCoords.y + 1] &&
            myMap[playerCoords.x][playerCoords.y + 1] != "w"
        ) {
            playerCoords.y += 1
        }
    }
    if (isColliding(playerCoords, fruitCoords)) {
        // increment score and move fruit to next tile
        score++
        myMap[fruitCoords.x][fruitCoords.y] = "f"
        addFruit(playerCoords)
    }
    collidingEnemy = findCollider(playerCoords, enemyCoords)
    log += enemyCoords
    if (collidingEnemy !== false) {
        // clear out enemy
        removeFromMap(enemyCoords[collidingEnemy])
        enemyCoords = remove(enemyCoords, collidingEnemy)

        // regenerate enemy
        addEnemy(playerCoords)

        // decrement health
        ouch()
    }
    console.log("Score: " + score + "     Life: " + life)
    renderer(playerCoords, enemyCoords)
    console.log(log)
})

// setInterval(() => {
//     console.clear()
//     console.log("Score: " + score + "     Life: " + life)
//     renderer(playerCoords, enemyCoords)
// }, 500)