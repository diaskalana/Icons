import { featherImages } from '../icons/feather/images.js'
import { remixiconsImages } from '../icons/remixicons/images.js';
import { lucideImages } from '../icons/lucide/images.js';

import { filterData, SearchType } from 'filter-data';
import 'external-svg-loader'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"


const iconContainer = document.querySelector('.iconContainer')
const modalImageContainer = document.querySelector('.modalImageContainer')
const modalControls = document.querySelector('.modalControls')
const modal = document.querySelector('.modal')
const modalContent = document.querySelector('.modalContent')

const xCircle = document.querySelector('.x-circle')
const noResultText = document.querySelector('.noResultText')

const svgCode = document.querySelector('.svgCode')
const loader = document.querySelector('.loader')
const scrollToTop = document.querySelector('.scrollToTop')

const svgSize = document.querySelector('#svgSize')
const svgStrokeWidth = document.querySelector('#svgStrokeWidth')
const svgColor = document.querySelector('#svgColor')

const iconName = document.querySelector('#iconName')
const iconSet = document.querySelector('#iconSet')
const iconSize = document.querySelector('#iconSize')
const iconStrokeWidth = document.querySelector('#iconStrokeWidth')
const iconColor = document.querySelector('#iconColor')
const mainSearch = document.querySelector('#mainSearch')

const resetCode = document.querySelector('#resetCode')
const copyCode = document.querySelector('#copyCode')
const Download = document.querySelector('#Download')

const selectIconSet = document.querySelector('#selectIconSet')


let iconUpdated;
let arr = []

SVGLoader.destroyCache();
updateIconSet(selectIconSet.value)
updateIconList(arr)

scrollToTop.addEventListener('click', () => {
    window.scrollTo(0, 0);
})
selectIconSet.addEventListener('input', () => {
    modal.style.display = 'flex'
    loader.style.display = 'inline-block'
    modalContent.style.display = 'none'

    setTimeout(function () {
        updateIconSet(selectIconSet.value)
        updateIconList(arr)
        updateSearchResults()

        modal.style.display = 'none'
        loader.style.display = 'none'
        modalContent.style.display = 'flex'
    }, 100);

})

function updateIconSet(setName) {
    arr = []
    if (setName == 'feather') {
        Object.keys(featherImages).forEach(function (key) {

            const obj = {
                iconName: key,
                iconUrl: featherImages[key],
                iconSet: 'feather',
            }
            arr.push(obj)
        });
    } else if (setName == 'remixicons') {
        Object.keys(remixiconsImages).forEach(function (key) {

            const obj = {
                iconName: key,
                iconUrl: remixiconsImages[key],
                iconSet: 'remixicons',
            }
            arr.push(obj)
        });
    } else if (setName == 'lucide') {
        Object.keys(lucideImages).forEach(function (key) {

            const obj = {
                iconName: key,
                iconUrl: lucideImages[key],
                iconSet: 'lucide',
            }
            arr.push(obj)
        });
    }
}

function updateIconList(arr) {
    iconContainer.innerHTML = ''

    arr.forEach((item) => {

        const outerDiv = document.createElement('div')
        const coverDiv = document.createElement('div')
        const div = document.createElement('div')

        coverDiv.ariaLabel = item.iconName
        coverDiv.setAttribute('data-balloon-pos', 'up')
        div.classList.add('iconWrapper')
        outerDiv.classList.add('outerWrapper')
        coverDiv.classList.add('coverWrapper')
        coverDiv.setAttribute('id', item.iconName)
        div.innerHTML = `<svg data-src="${item.iconUrl}" data-loading="lazy" width="24" height="24"></svg>`
        outerDiv.appendChild(div)
        outerDiv.appendChild(coverDiv)
        document.querySelector('.iconContainer').appendChild(outerDiv)

    })

}

Download.addEventListener('click', () => {
    const downloadSvg = svgCode.textContent
    const blob = new Blob([downloadSvg], { type: 'image/svg+xml' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('download', `projectIcons-${getIconData().iconName}.svg`)
    a.setAttribute('href', url)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    Toastify({
        text: "📥 File Downloading!",
        className: "info",
        className: "notification",
        offset: {
            x: 20,
            y: 20
        },
    }).showToast();
})

copyCode.addEventListener('click', () => {
    navigator.clipboard.writeText(svgCode.textContent);

    Toastify({
        text: "📋 Code Copied!",
        className: "info",
        className: "notification",
        offset: {
            x: 20,
            y: 20
        },
    }).showToast();
})

resetCode.addEventListener('click', () => {

    resetFunc()

})

function resetFunc() {
    svgSize.value = 24
    svgStrokeWidth.value = 1
    svgColor.value = '#000000'

    updateIconAndCode()
}

iconContainer.addEventListener('click', (event) => {

    modal.style.display = 'flex'
    loader.style.display = 'inline-block'
    modalContent.style.display = 'none'

    setTimeout(function () {
        if (event.target.className == 'iconContainer') {
            // Do nothing
        } else {
            const selectedIcon = arr.find((item) => item.iconName === event.target.id)
            // const selectedIcon = `<svg data-src="${selectedIconUrl}" data-loading="lazy" width="24" height="24"></svg>`

            let resultText;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', selectedIcon.iconUrl, false);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    resultText = xhr.responseText;
                }
            };
            xhr.send();
            modalImageContainer.innerHTML = resultText

            iconUpdated = selectedIcon;

            updateIconAndCode(selectedIcon)
            modal.style.display = 'flex'
            modalControls.addEventListener('input', () => {
                updateIconAndCode(selectedIcon)

            })
        }

        loader.style.display = 'none'
        modalContent.style.display = 'flex'
    }, 100);
})


xCircle.addEventListener('click', () => {
    modal.style.display = 'none'
})
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function updateIconAndCode(iconData = getIconData()) {
    SVGLoader.destroyCache();

    iconName.textContent = iconData.iconName
    iconSet.textContent = iconData.iconSet
    iconSize.textContent = `(${svgSize.value}px) x (${svgSize.value}px)`
    iconStrokeWidth.textContent = `${svgStrokeWidth.value}px`
    iconColor.textContent = svgColor.value

    updateIconStyles()

    svgCode.textContent = modalImageContainer.innerHTML

}

function updateIconStyles() {

    modalImageContainer.firstChild.setAttribute('width', svgSize.value)
    modalImageContainer.firstChild.setAttribute('height', svgSize.value)
    modalImageContainer.firstChild.setAttribute('stroke-width', svgStrokeWidth.value)
    modalImageContainer.firstChild.setAttribute('stroke', svgColor.value)

    if (selectIconSet.value == 'remixicons') {
        modalImageContainer.firstChild.setAttribute('fill', svgColor.value)
    }
}

mainSearch.addEventListener('input', () => {
    updateSearchResults()
})

function updateSearchResults() {
    document.querySelector('.iconContainer').innerHTML = ''
    const searchConditions = [
        {
            key: 'iconName',
            value: mainSearch.value,
            type: SearchType.LK,
        },
    ];
    const resultArr = filterData(arr, searchConditions);

    if (resultArr.length == 0) {
        noResultText.style.display = 'block'
        iconContainer.style.display = 'none'
    } else {
        noResultText.style.display = 'none'
        iconContainer.style.display = 'flex'
        updateIconList(resultArr)

    }
}
function getIconData() {
    return iconUpdated;
}
