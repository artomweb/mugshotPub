function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

let startButton = document.getElementById("startButton");
let imageOptionsCont = document.getElementById("imageOptionsCont");
let scoreCont = document.getElementById("scoreCont");
let scoreText = document.getElementById("scoreText");
let restartButton = document.getElementById("restartButton");

scoreCont.style.display = "none";

let database;
let originalDatabase;
let score;

async function getMugshotList() {
    let response = await fetch("https://rppi.artomweb.com/mugShot/mugShotList");
    let json = await response.json();

    database = shuffle(json);

    originalDatabase = database.slice();

    // console.log(database);
}

function noMoreMugshots() {
    imageOptionsCont.style.display = "none";
    console.log("No more mugshots");
    console.log(score + " out of " + originalDatabase.length);
    scoreCont.style.display = "flex";
    scoreText.innerHTML = "You scored " + score + " out of " + originalDatabase.length;
}

function nextMugshot() {
    if (!database.length) {
        return noMoreMugshots();
    }

    let thisMug = database.pop();

    // thisMug.similarList = thisMug.similarList.replace(/\[|\]|'| /g, "").split(",");

    // console.log(thisMug.similarList);

    let sketchImage = document.getElementById("sketchImage");
    sketchImage.src = "https://mugshot.artomweb.com/image/sketch/" + thisMug.image;

    let options = document.getElementsByClassName("posImage");

    let types = ["real", "incorrMugs", "incorrMugs"];

    types = shuffle(types);

    for (let i = 0; i < types.length; i++) {
        let thisType = types[i];
        let thisUrl;
        if (thisType == "real") {
            thisUrl = "https://mugshot.artomweb.com/image/real/" + thisMug.image;
            options[i].isReal = true;
        } else {
            thisUrl = "https://mugshot.artomweb.com/image/incorrMugs/" + thisMug.similarList.pop();
            options[i].isReal = false;
        }
        // console.log(thisUrl);
        options[i].src = thisUrl;
    }
}

async function startPressed() {
    await getMugshotList();

    startButton.style.display = "none";
    imageOptionsCont.style.display = "block";
    scoreCont.style.display = "none";
    score = 0;
    nextMugshot();
}

// startPressed();

startButton.addEventListener("click", (e) => {
    startPressed();
});

restartButton.addEventListener("click", (e) => {
    startPressed();
});

function optionClicked(e) {
    console.log(e.target.isReal);

    if (e.target.isReal) {
        score++;
    }
    nextMugshot();
}

const butnOptions = document.getElementsByClassName("option");

Array.from(butnOptions).forEach((element) => {
    element.addEventListener("click", optionClicked);
});