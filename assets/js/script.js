import { featherImages } from '../icons/feather/images.js'
import { filterData, SearchType } from 'filter-data';
import 'external-svg-loader'
import Toastify from 'toastify-js'

import "toastify-js/src/toastify.css"


const arr = []
Object.keys(featherImages).forEach(function (key) {

    const obj = {
        iconName: key,
        iconUrl: featherImages[key],
        iconSet: 'feather',
    }
    arr.push(obj)
});

SVGLoader.destroyCache();
updateIconList(arr)

function updateIconList(arr) {
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

const iconContainer = document.querySelector('.iconContainer')
const modalImageContainer = document.querySelector('.modalImageContainer')
const modalControls = document.querySelector('.modalControls')
const modal = document.querySelector('.modal')
const xCircle = document.querySelector('.x-circle')

const svgCode = document.querySelector('.svgCode')

const svgSize = document.querySelector('#svgSize')
const svgStrokeWidth = document.querySelector('#svgStrokeWidth')
const svgColor = document.querySelector('#svgColor')

const iconName = document.querySelector('#iconName')
const iconSet = document.querySelector('#iconSet')
const iconSize = document.querySelector('#iconSize')
const iconStrokeWidth = document.querySelector('#iconStrokeWidth')
const iconColor = document.querySelector('#iconColor')

const resetCode = document.querySelector('#resetCode')
const copyCode = document.querySelector('#copyCode')
const Download = document.querySelector('#Download')

let iconNameUpdated;

Download.addEventListener('click', () => {
    const downloadSvg = svgCode.textContent
    const blob = new Blob([downloadSvg], { type: 'image/svg+xml' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('download', `projectIcons-${getIconName()}.svg`)
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

    svgSize.value = 24
    svgStrokeWidth.value = 1.5
    svgColor.value = '#000000'

    updateIconStyles()

})

iconContainer.addEventListener('click', (event) => {
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

        iconNameUpdated = selectedIcon.iconName

        updateIconAndCode(selectedIcon)
        modal.style.display = 'flex'
        modalControls.addEventListener('input', () => {
            updateIconAndCode(selectedIcon)

        })
    }
})


xCircle.addEventListener('click', () => {
    modal.style.display = 'none'
})
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function updateIconAndCode(iconData) {
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
}

const mainSearch = document.querySelector('#mainSearch')
mainSearch.addEventListener('input', () => {
    document.querySelector('.iconContainer').innerHTML = ''
    const searchConditions = [
        {
            key: 'iconName',
            value: mainSearch.value,
            type: SearchType.LK,
        },
    ];
    const resultArr = filterData(arr, searchConditions);
    updateIconList(resultArr)
})

function getIconName() {
    return iconNameUpdated;
}
