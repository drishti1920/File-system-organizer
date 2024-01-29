let fs = require('fs')
let path = require('path')
//process.argv is used to take input from cmd
let inputArr = process.argv.slice(2);
console.log(inputArr)
//node main.js tree "directoryPath"
//node main.js organize "directoryPath"
//node main.js help
let command = inputArr[0]
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

function getCategory(name) {
    let ext = path.extname(name)
    ext = ext.slice(1)
    for (let type in types) {
        let currType = types[type]
        for (let i = 0; i < currType.length; i++) {
            if (ext == currType[i])
                return type;
        }
        return "others"
    }
}

function sendFiles(srcFile, dest, category) {
    let categoryPath = path.join(dest, category)
    if (!fs.existsSync(categoryPath)) { // Check if directory exists
        fs.mkdirSync(categoryPath)
    }
    let filePath = path.basename(srcFile)
    let destFilePath = path.join(categoryPath, filePath)
    fs.copyFileSync(srcFile, destFilePath)
    fs.unlinkSync(srcFile)
    console.log(filePath, "copied to ", category)
}
switch (command) {
    case "tree":
        treeFn(inputArr[1])
        break;
    case "organize":
        organizeFn(inputArr[1])
        break;
    case "help":
        helpFn(inputArr[1])
        break;
    default:
        console.log("Please🙏 input right command!")
        break;
}

// function treeHelper(dirPath){
//  //is file or folder
//  let isFile = fs.lstatSync(dirPath).isFile()
//  if(isFile)
//  {
//   let fileName =   path.basename(dirPath)
//   console.log(indent + "---"+fileName)
//  }
//  else{
//     console.log(indent + "")

//  }
// }

// function treeFn(dirPath) {
//     let destPath;
//     if(dirPath == undefined)
//     {
//         console.log("Kindly enter the path")
//     }else{
//         let doesExist = fs.existsSync(dirPath)
//         if(doesExist)
//         {
// treeHelper(dirPath, "")
//         }
//         else{
//             console.log("Kindly🙏 enter the correct path")
//             return 
//         }
//     }
// }

function treeFn(dirPath)
{
    console.log("tree")
}



function organizeFn(dirPath) {
    let destPath
    // 1. input -> directory path given
    if (dirPath == undefined) {
        console.log("Kindly enter the path")
        return;
    } else {
        let doesExist = fs.existsSync(dirPath)
        if (doesExist) {
            // 2. create -> organized_files -> directory
            destPath = path.join(dirPath, "organized_files")
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath)
            }
        }
        else {
            console.log("Kindly enter the correct path")
            return
        }
    }
    organizeHelper(dirPath, destPath)

}

function organizeHelper(src, dest) {
    // 3. identify category of all files present in the input directory ->
    let childNames = fs.readdirSync(src)
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i])
        let isFile = fs.lstatSync(childAddress).isFile()
        if (isFile) {
            let category = getCategory(childNames[i])
            console.log(childNames[i], " belongs to -->", category)
            // 4. copy / cut files to that organized directory inside category folder
            sendFiles(childAddress, dest, category)
        }
    }
}


//help implemented
function helpFn(dirPath) {
    console.log(`
    List of All the commands:
            node main.js tree "directoryPath"
            node main.js organize "directoryPath"
            node main.js help

    `)
}