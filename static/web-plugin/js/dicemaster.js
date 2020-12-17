const BASE_URL = 'https://dicemaster.laflys.com' // Url app
const CLIENT_ID = '' // App ID

// Images Dés
const images = [
    { src: 'img/des/1d4.svg', width: 60, height: 60, alt: '1d4', nombreDes: 1, typeDes: 4 },
    { src: 'img/des/2d4.svg', width: 60, height: 60, alt: '2d4', nombreDes: 2, typeDes: 4 },
    { src: 'img/des/3d4.svg', width: 60, height: 60, alt: '3d4', nombreDes: 3, typeDes: 4 },
    { src: 'img/des/4d4.svg', width: 60, height: 60, alt: '4d4', nombreDes: 4, typeDes: 4 },
    { src: 'img/des/1d6.svg', width: 60, height: 60, alt: '1d6', nombreDes: 1, typeDes: 6 },
    { src: 'img/des/2d6.svg', width: 60, height: 60, alt: '2d6', nombreDes: 2, typeDes: 6 },
    { src: 'img/des/3d6.svg', width: 60, height: 60, alt: '3d6', nombreDes: 3, typeDes: 6 },
    { src: 'img/des/4d6.svg', width: 60, height: 60, alt: '4d6', nombreDes: 4, typeDes: 6 },
    { src: 'img/des/1d8.svg', width: 60, height: 60, alt: '1d8', nombreDes: 1, typeDes: 8 },
    { src: 'img/des/2d8.svg', width: 60, height: 60, alt: '2d8', nombreDes: 2, typeDes: 8 },
    { src: 'img/des/3d8.svg', width: 60, height: 60, alt: '3d8', nombreDes: 3, typeDes: 8 },
    { src: 'img/des/4d8.svg', width: 60, height: 60, alt: '4d8', nombreDes: 4, typeDes: 8 },
    { src: 'img/des/1d10.svg', width: 60, height: 60, alt: '1d10', nombreDes: 1, typeDes: 10 },
    { src: 'img/des/2d10.svg', width: 60, height: 60, alt: '2d10', nombreDes: 2, typeDes: 10 },
    { src: 'img/des/3d10.svg', width: 60, height: 60, alt: '3d10', nombreDes: 3, typeDes: 10 },
    { src: 'img/des/4d10.svg', width: 60, height: 60, alt: '4d10', nombreDes: 4, typeDes: 10 },
    { src: 'img/des/1d12.svg', width: 60, height: 60, alt: '1d12', nombreDes: 1, typeDes: 12 },
    { src: 'img/des/2d12.svg', width: 60, height: 60, alt: '2d12', nombreDes: 2, typeDes: 12 },
    { src: 'img/des/3d12.svg', width: 60, height: 60, alt: '3d12', nombreDes: 3, typeDes: 12 },
    { src: 'img/des/4d12.svg', width: 60, height: 60, alt: '4d12', nombreDes: 4, typeDes: 12 },
    { src: 'img/des/1d20.svg', width: 60, height: 60, alt: '1d20', nombreDes: 1, typeDes: 20 },
    { src: 'img/des/2d20.svg', width: 60, height: 60, alt: '2d20', nombreDes: 2, typeDes: 20 },
    { src: 'img/des/3d20.svg', width: 60, height: 60, alt: '3d20', nombreDes: 3, typeDes: 20 },
    { src: 'img/des/4d20.svg', width: 60, height: 60, alt: '4d20', nombreDes: 4, typeDes: 20 },
    { src: 'img/des/1d100.svg', width: 60, height: 60, alt: '1d100', nombreDes: 1, typeDes: 100 },
    { src: 'img/des/2d100.svg', width: 60, height: 60, alt: '2d100', nombreDes: 2, typeDes: 100 },
    { src: 'img/des/3d100.svg', width: 60, height: 60, alt: '3d100', nombreDes: 3, typeDes: 100 },
    { src: 'img/des/4d100.svg', width: 60, height: 60, alt: '4d100', nombreDes: 4, typeDes: 100 },
]

/****************************
        Translator
*****************************/
class Translator {
    constructor(options = {}) {
        this._options = Object.assign({}, this.defaultConfig, options);
        this._elements = document.querySelectorAll("[data-i18n]");
        this._cache = new Map();

        if (
            this._options.defaultLanguage &&
            typeof this._options.defaultLanguage == "string"
        ) {
            this._getResource(this._options.defaultLanguage);
        }
    }

    _detectLanguage() {
        if (!this._options.detectLanguage) {
            return this._options.defaultLanguage;
        }

        var stored = localStorage.getItem("language");

        if (this._options.persist && stored) {
            return stored;
        }

        var lang = navigator.languages
            ? navigator.languages[0]
            : navigator.language;

        return lang.substr(0, 2);
    }

    _fetch(path) {
        return fetch(path)
            .then((response) => response.json())
            .catch(() => {
                console.error(
                    `Could not load ${path}. Please make sure that the file exists.`
                );
            });
    }

    async _getResource(lang) {
        if (this._cache.has(lang)) {
            return JSON.parse(this._cache.get(lang));
        }

        var translation = await this._fetch(
            `${this._options.filesLocation}/${lang}.json`
        );

        if (!this._cache.has(lang)) {
            this._cache.set(lang, JSON.stringify(translation));
        }

        return translation;
    }

    async load(lang) {
        if (!this._options.languages.includes(lang)) {
            return;
        }

        this._translate(await this._getResource(lang));

        document.documentElement.lang = lang;

        if (this._options.persist) {
            localStorage.setItem("language", lang);
        }
    }

    async getTranslationByKey(lang, key) {
        if (!key) throw new Error("Expected a key to translate, got nothing.");

        if (typeof key != "string")
            throw new Error(
                `Expected a string for the key parameter, got ${typeof key} instead.`
            );

        var translation = await this._getResource(lang);

        return this._getValueFromJSON(key, translation, true);
    }

    _getValueFromJSON(key, json, fallback) {
        var text = key.split(".").reduce((obj, i) => obj[i], json);

        if (!text && this._options.defaultLanguage && fallback) {
            let fallbackTranslation = JSON.parse(
                this._cache.get(this._options.defaultLanguage)
            );

            text = this._getValueFromJSON(key, fallbackTranslation, false);
        } else if (!text) {
            text = key;
            console.warn(`Could not find text for attribute "${key}".`);
        }

        return text;
    }

    _translate(translation) {
        var replace = (element) => {
            var key = element.getAttribute("data-i18n");
            var property = element.getAttribute("data-i18n-attr") || "innerHTML";
            var text = this._getValueFromJSON(key, translation, true);

            if (text) {
                element[property] = text;
            } else {
                console.error(`Could not find text for attribute "${key}".`);
            }
        };

        this._elements.forEach(replace);
    }

    get defaultConfig() {
        return {
            persist: false,
            languages: ["en"],
            defaultLanguage: "",
            detectLanguage: true,
            filesLocation: "/i18n",
        };
    }
}

/****************************
        Lanceur
*****************************/
async function versionThree(obj) {
    //Translate
    let dice_s
    let value_s
    let result_s
    if (localStorage.lang && localStorage.lang === 'en') {
        dice_s = "Dice"
        value_s = "Values"
        result_s = "Result"
    } else {
        dice_s = "Dés"
        value_s = "Valeurs"
        result_s = "Résultat"
    }
    //Dés
    let allDice = `( ${obj.jetResult.join(' + ')} )`
    let text = ''
    text += `${obj.username}\n\n`
    text += `${dice_s}\n${obj.lancer}\n\n`
    text += `${value_s}\n${allDice}\n\n`
    text += `${result_s}\n${obj.sumResult}`
    //Sticker color
    const stickerYellow = '#fff9b1';
    const stickerBlue = '#a6ccf5';
    //Sticker
    let selectSticker = await widgetsGet(stickerGet(obj.username))

    //Condition sticker unique
    if (obj.stickerUnique === 'oui') {
        if (selectSticker.length > 0) {
            for (i = 0; selectSticker.length > i; i++) {
                let stickerId = selectSticker[i].id
                //Sticker color
                let selStickerStyle = selectSticker[i].style
                let stickerColor
                if (selStickerStyle.stickerBackgroundColor == stickerYellow) {
                    stickerColor = stickerBlue
                } else {
                    stickerColor = stickerYellow
                }
                await miro.board.widgets.update({
                    id: stickerId,
                    x: selectSticker[i].x,
                    y: selectSticker[i].y,
                    scale: selectSticker[i].scale,
                    style: {
                        stickerType: 0,
                        textAlign: 'c',
                        stickerBackgroundColor: stickerColor
                    },
                    text: text
                })
            }
        } else {
            await miro.board.widgets.create({
                type: 'sticker',
                x: obj.x,
                y: obj.y,
                text: text,
                scale: 2.5,
                style: {
                    stickerType: 0,
                    textAlign: 'c'
                },
                metadata: {
                    [CLIENT_ID]:
                    {
                        user: obj.username
                    }
                }
            })
        }
    } else {
        await miro.board.widgets.create({
            type: 'sticker',
            x: obj.x,
            y: obj.y,
            style: {
                stickerType: 0,
                textAlign: 'c',
                stickerBackgroundColor: '#d5f692'
            },
            text: text,
            scale: 2.5
        })

    }
}

/****************************
    Fonctions Globales
*****************************/
//Fonction vs Globales
function getById(id) {
    return document.getElementById(id)
}

//CheckBox
function uncheck(cbox) {
    getById(cbox).checked = false;
}

function check(cbox) {
    getById(cbox).checked = true;
}

function sumDice(total, n) {
    return total + n;
}

function stickerGet(username) {
    return {
        type: 'sticker',
        metadata: {
            [CLIENT_ID]: { user: username }
        }
    }
}

function widgetsGet(objet) {
    return miro.board.widgets.get(objet)
}

/****************************
    Fonctions Dés
*****************************/
//Jet de dés Objet
function objRoll(obj) {
    // Variables
    const result = obj
    obj.lancer = `${obj.nombreDes}d${obj.typeDes}`

    //result des dés
    const jetResult = []
    for (let i = 0; i < obj.nombreDes; i++) {
        let roll = Math.floor(Math.random() * obj.typeDes + 1)
        jetResult.push(roll)
    }
    obj.jetResult = jetResult
    obj.sumResult = obj.jetResult.reduce(sumDice)

    //console.log(result)
    versionThree(result)
}

/****************************
    DOM
*****************************/

//Checkbox Unique
getById('sticker_unique').addEventListener('change', () => {
    if (getById('sticker_unique').checked) {
        localStorage.stickerUniqueM = 'oui'
    } else {
        localStorage.stickerUniqueM = 'non'

    }
})



function getImage(img) {
    return `<div class="draggable-item image-box">
            <img src="${img.src}" alt="${img.alt}" data-nombre-des="${img.nombreDes}" data-type-des="${img.typeDes}" data-image-url="${BASE_URL}/static/web-plugin/img/des/${img.alt}.svg">
            </div>`
}

function addImages(container) {
    container.innerHTML += images.map(i => getImage(i)).join('')
}

function createImage(canvasX, canvasY, url) {
    //console.log(url)
    return miro.board.widgets.create({
        type: 'image',
        url: url,
        x: canvasX,
        y: canvasY,
    })
}

// LocalStorage username when change
getById('username').addEventListener('keyup', (event) => {
    localStorage.usernameDiceM = getById('username').value
})

// LocalStorage Nombre Des when change manually
getById('nombreDes').addEventListener('keyup', () => {
    localStorage.nombreDesM = getById('nombreDes').value
})

// LocalStorage Nombre Des when change manually
getById('typeDes').addEventListener('keyup', () => {
    localStorage.typeDesM = getById('typeDes').value
})
// LocalStorage Nombre Des when change with arrow
getById('nombreDes').addEventListener('change', () => {
    localStorage.nombreDesM = getById('nombreDes').value
})

// LocalStorage Nombre Des when change with arrow
getById('typeDes').addEventListener('change', () => {
    localStorage.typeDesM = getById('typeDes').value
})

//Lancé de dés
getById("lancerDes")
    .addEventListener('click', async function (event) {
        const jetDes = {
            nombreDes: Math.floor(getById('nombreDes').value),
            typeDes: Math.floor(getById('typeDes').value),
            stickerUnique: localStorage.stickerUniqueM
        }
        let validJet = true
        localStorage.nombreDesM = getById('nombreDes').value
        localStorage.typeDesM = getById('typeDes').value

        //widget position
        const viewport = await miro.board.viewport.get();
        // const viewport = await miro.board.viewport.getViewport();
        const x = viewport.x + (viewport.width / 2);
        const y = viewport.y + (viewport.height / 2);
        jetDes.x = x
        jetDes.y = y

        // Translator
        let nombreDes_err
        let typeDes_err
        let username_err
        if (localStorage.lang && localStorage.lang === "en") {
            nombreDes_err = "Please roll at least one die!"
            typeDes_err = "Please roll a positive die!"
            username_err = "Please enter your username"
        } else {
            nombreDes_err = "Veuillez jetez au moins un dé !"
            typeDes_err = "Veuillez jetez un dé positif !"
            username_err = "Veuillez indiquer votre pseudo"
        }

        if (getById('nombreDes').value < 1) {
            miro.showErrorNotification(nombreDes_err)
            validJet = false
        } else if (getById('typeDes').value < 1) {
            miro.showErrorNotification(typeDes_err)
            validJet = false
        }
        if (getById('username').value == null || getById('username').value == "") {
            miro.showErrorNotification(username_err)
            validJet = false
        } else {
            if (localStorage.usernameDiceM) {
                if (getById('username').value == localStorage.usernameDiceM) {
                    jetDes.username = localStorage.usernameDiceM
                } else {
                    localStorage.usernameDiceM = getById('username').value
                    jetDes.username = localStorage.usernameDiceM
                }
            } else {
                localStorage.usernameDiceM = getById('username').value
                jetDes.username = localStorage.usernameDiceM
            }
        }

        if (validJet === true) {
            //console.log(jetDes)
            objRoll(jetDes)
        }
    })



var translator = new Translator({
    persist: false,
    languages: ["fr", "en"],
    defaultLanguage: "fr",
    detectLanguage: true,
    filesLocation: "./i18n"
});

const langStored = () => {
    if (localStorage.lang) {
        return localStorage.lang
    } else {
        return "fr"
    }
}

translator.load(langStored());

document.querySelector("#lang").addEventListener("click", function (evt) {
    if (evt.target.tagName === "SPAN") {
        translator.load(evt.target.getAttribute("data-value"));
        localStorage.lang = evt.target.getAttribute("data-value")
    }
});

// Load Miro

function bootstrap() {
    const container = document.getElementById('container')
    addImages(container)

    // Checkbox unique
    if (localStorage.stickerUniqueM) {
        if (localStorage.stickerUniqueM === 'oui') {
            check('sticker_unique')
        } else {
            uncheck('sticker_unique')
        }
    } else {
        localStorage.stickerUniqueM = 'non'
    }

    if (localStorage.usernameDiceM) {
        getById('username').value = localStorage.usernameDiceM
    }
    if (localStorage.nombreDesM) {
        getById('nombreDes').value = localStorage.nombreDesM
    }
    if (localStorage.typeDesM) {
        getById('typeDes').value = localStorage.typeDesM
    }
    let currentImageUrl
    let jetDes
    const imageOptions = {
        draggableItemSelector: 'img',
        onClick: async (targetElement) => {
            const url = targetElement.getAttribute('data-image-url')
            jetDes = {
                nombreDes: Math.floor(targetElement.getAttribute('data-nombre-des')),
                typeDes: Math.floor(targetElement.getAttribute('data-type-des')),
                stickerUnique: localStorage.stickerUniqueM

            }
            //widget position
            const viewport = await miro.board.viewport.get();
            // const viewport = await miro.board.viewport.getViewport();
            const x = viewport.x + (viewport.width / 2);
            const y = viewport.y + (viewport.height / 2);
            jetDes.x = x
            jetDes.y = y
            //Validation nom
            let validJet = true
            if (getById('username').value == null || getById('username').value == "") {
                miro.showNotification('Veuillez indiquer votre pseudo')
                validJet = false
            } else {
                if (localStorage.usernameDiceM) {
                    if (getById('username').value == localStorage.usernameDiceM) {
                        jetDes.username = localStorage.usernameDiceM
                    } else {
                        localStorage.usernameDiceM = getById('username').value
                        jetDes.username = localStorage.usernameDiceM
                    }
                } else {
                    localStorage.usernameDiceM = getById('username').value
                    jetDes.username = localStorage.usernameDiceM
                }
            }
            if (validJet === true) {
                objRoll(jetDes)
            }
        },
        getDraggableItemPreview: (targetElement) => { //drag-started
            currentImageUrl = targetElement.getAttribute('data-image-url')
            jetDes = {
                nombreDes: Math.floor(targetElement.getAttribute('data-nombre-des')),
                typeDes: Math.floor(targetElement.getAttribute('data-type-des')),
                stickerUnique: localStorage.stickerUniqueM

            }
            return {
                width: 100,
                height: 100,
                url: currentImageUrl
            }
        },
        onDrop: (canvasX, canvasY, targetElement) => {
            jetDes.x = canvasX
            jetDes.y = canvasY
            //Validation nom
            let validJet = true
            if (getById('username').value == null || getById('username').value == "") {
                miro.showNotification('Veuillez indiquer votre pseudo')
                validJet = false
            } else {
                if (localStorage.usernameDiceM) {
                    if (getById('username').value == localStorage.usernameDiceM) {
                        jetDes.username = localStorage.usernameDiceM
                    } else {
                        localStorage.usernameDiceM = getById('username').value
                        jetDes.username = localStorage.usernameDiceM
                    }
                } else {
                    localStorage.usernameDiceM = getById('username').value
                    jetDes.username = localStorage.usernameDiceM
                }
            }
            if (validJet === true) {
                objRoll(jetDes)
            }
        }
    }
    miro.board.ui.initDraggableItemsContainer(container, imageOptions)
}
miro.onReady(bootstrap)
