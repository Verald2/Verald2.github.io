/* Made by NOWY */
const audioTracks = [
    "./MUSIC/Deftones-Change.mp3",
    "./MUSIC/OXYGEN.mp3",
    "./MUSIC/Soundgarden-Black_Hole_Sun.mp3",
    "./MUSIC/VIOLENT_VIRA-I_dont_Care.mp3"
]
const audioTitles = [
    "Deftones - Change",
    "Porch Light - Oxygen",
    "Soundgarden - Black Hole Sun",
    "VIOLENT VIRA - I don't care"
]

const letters = ['V', 'e', 'r', 'a', 'l', 'd']
const length = letters.length
let index = 0
let mode = 'a'

const modifyTitle = () => {
    switch (mode) {
        case 'a':
            {
                document.title += letters[index]
                index += 1
                break
            }
        case 'r':
            {
                document.title = document.title.substring(0, document.title.length - 1)
                index -= 1
                break
            }
    }
    if (index >= length && mode == 'a') {
        index -= 1
        mode = 'r'
    } else if (index == -1 && mode == 'r') {
        index = 0
        mode = 'a'
    }
}

const contentContainer = document.querySelector("#content")

const loadContent = async () => {
    await fetch(`./CONTENT/click.html`).then((res) => {
        if (res.ok) return res.text()
    }).then((data) => {
        contentContainer.innerHTML = data
    })
}

let tempTracklist = []

let changeContent = async () => {
    await fetch(`./CONTENT/page.html`).then((res) => {
        if (res.ok) return res.text()
    }).then((data) => {
        contentContainer.innerHTML = data
    })

    tempTracklist = audioTracks
    tempTitles = audioTitles

    let i = tempTracklist.length, j, temp, temp2
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1))
        temp = tempTracklist[j]
        temp2 = tempTitles[j]
        tempTracklist[j] = tempTracklist[i]
        tempTitles[j] = tempTitles[i]
        tempTracklist[i] = temp
        tempTitles[i] = temp2
    }

    contentContainer.removeEventListener("click", changeContent)

    const audio = document.querySelector('.audio-wrapper audio')
    const songTitle = document.querySelector('#audioTitle')
    const player = document.querySelector('#audioPlayer')

    if (!audio) return;

    let trackIndex = 0
    player.src = tempTracklist[trackIndex]
    songTitle.innerText = audioTitles[trackIndex]

    const enableSound = () => {
        audio.muted = false

        const playPromise = audio.play()
        if (playPromise == undefined) {
            playPromise.catch(error => {
                console.log('Odtwarzanie dźwięku nie powiodło się:', error)
            });
        }
        trackIndex += 1
    };

    document.addEventListener('click', enableSound, { once: true });
    document.addEventListener('keydown', enableSound, { once: true });
    document.addEventListener('touchstart', enableSound, { once: true });
    audio.addEventListener('ended', () => {
        if (trackIndex < tempTracklist.length - 1) trackIndex++; else trackIndex = 0
        player.src = tempTracklist[trackIndex]
        songTitle.innerText = audioTitles[trackIndex]
        audio.load()
        const playPromise = audio.play()
        if (playPromise == undefined) {
            playPromise.catch(error => {
                console.log('Odtwarzanie dźwięku nie powiodło się:', error)
            });
        }
    })
}

window.onload = async () => {
    await loadContent()

    contentContainer.addEventListener("click", changeContent)

    const titleChange = setInterval(() => {
        modifyTitle()
    }, 500)
}

