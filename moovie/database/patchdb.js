const rate30 = require('./30ratings.json')
const rate40 = require('./40ratings.json')
const filmOri = require('./db-original.json')
const fs = require('fs');


// node repl and debug trace...
const deadlinks = [
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMjM4NTI5NzYyNV5BMl5BanBnXkFtZTgwNTkxNTYxMTE@._V1_SX300.jpg',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTYzYmRmZTQtYjk2NS00MDdlLTkxMDAtMTE2YTM2ZmNlMTBkXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BNGQxNDgzZWQtZTNjNi00M2RkLWExZmEtNmE1NjEyZDEwMzA5XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BNThiYjM3MzktMDg3Yy00ZWQ3LTk3YWEtN2M0YmNmNWEwYTE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg'
]
// sanitize
const film = [];
let skip = false;
for(let i=0; i< filmOri.length;i++){
    if(skip) { skip = !skip }
    for(let dl in deadlinks.length){
        if(filmOri[i].posterUrl === dl){
            skip = true;
            break;
        }
    }
    if(skip){ continue }
    film.push(filmOri[i])
}

console.log(filmOri.length, " , ",film.length )
process.exit(0);

let merged = [];

for(let i = 0; i < rate30.length; i++ ){
    const row = {};


    for(let key in film[i]){
        row[key] = film[i][key]
        // add a ratings
        row['rating'] = rate30[i].rating
    }
    merged.push(row)
}

fs.writeFileSync('./db_1.json', JSON.stringify(merged))

merged = [];

for(let i = 0; i < rate40.length; i++ ){
    const row = {};
    // entropy
    for(let key in film[i]){


        row[key] = film[i][key]
        // add a ratings
        row['rating'] = rate40[i].rating
    }
    merged.push(row)
}
fs.writeFileSync('./db_2.json', JSON.stringify(merged))
