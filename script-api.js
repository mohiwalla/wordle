(async function () {
    const req = await fetch('https://random-word-api.herokuapp.com/word?length=5')
    const res = await req.json()
    const secretWord = res[0]
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    const previousAttempts = []
    const maxAttempts = 5
    const wordsLength = secretWord.length

    const wordsContainer = document.getElementById("wordsContainer")

    for (let i = 0;i < maxAttempts * wordsLength;i++) {
        const letterBox = document.createElement('span')
        const letterBoxContainer = document.createElement('span')
        letterBox.classList.add("border", "size-16", "text-4xl", "font-bold", "grid", "place-items-center", "rounded-lg")
        letterBoxContainer.classList.add("rounded-lg")

        letterBoxContainer.appendChild(letterBox)
        wordsContainer.appendChild(letterBoxContainer)
    }

    let attemptCount = 0
    let letterCount = 0

    window.addEventListener("keydown", handleKeys)

    async function handleKeys(e) {
        if (e.key == 'Enter' && letterCount == wordsLength) {
            let word = ''

            for (let i = (attemptCount * wordsLength);i < (attemptCount * wordsLength) + wordsLength;i++) {
                word += wordsContainer.children[i].textContent
            }

            word = word.toLowerCase()
            if (!(await wordExists(word))) {
                setShakeError()
                return
            }

            if (word != secretWord) {
                if (previousAttempts.includes(word)) {
                    alert("You've already tried this bro 🙂")
                    removeEventListener("keydown", handleKeys)

                    return
                }

                previousAttempts.push(word)

                setShakeError()
                showCorrectLetters(word)

                letterCount = 0
                attemptCount++

                if (attemptCount == maxAttempts) {
                    alert(`The word was ${secretWord} 😒`)
                    removeEventListener("keydown", handleKeys)

                    location.reload()
                    return
                }

                return
            }

            showCorrectLetters(word)
            setTimeout(() => alert('You did it 🥳\nRefresh the page to get new wordle!'), 200)
        }

        if (e.key == 'Backspace' && letterCount > 0) {
            const letterBox = wordsContainer.children[(attemptCount * wordsLength) + (--letterCount)].children[0]
            letterBox.textContent = ''
            return jumpZoom(letterBox)
        }

        if (letterCount == wordsLength) {
            return
        }

        if (!letters.includes(e.key)) {
            return
        }

        const box = wordsContainer.children[(attemptCount * wordsLength) + letterCount].children[0]
        box.textContent = e.key.toUpperCase()
        jumpZoom(box)

        letterCount++
    }

    function setShakeError() {
        for (let i = (attemptCount * wordsLength);i < (attemptCount * wordsLength) + wordsLength;i++) {
            let el = wordsContainer.children[i]

            el.classList.remove("error-shake")
            void el.offsetWidth
            el.classList.add("error-shake")
        }
    }

    function jumpZoom(el) {
        el.classList.remove("jump-zoom")
        void el.offsetWidth
        el.classList.add("jump-zoom")
    }

    function showCorrectLetters(word) {
        let j = 0

        for (let i = (attemptCount * wordsLength);i < (attemptCount * wordsLength) + wordsLength;i++) {
            let el = wordsContainer.children[i]

            if (secretWord[j] == word[j]) {
                el.classList.add("corret-letter-correct-position")
            } else if (secretWord.includes(word[j])) {
                el.classList.add("corret-letter-wrong-position")
            } else {
                el.classList.add("wrong-letter-wrong-position")
            }

            j++
        }
    }

    async function wordExists(word) {
        const req = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
        const res = await req.json()

        return !!res[0].word
    }
})()