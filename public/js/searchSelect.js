/**
 * Makes a select searchable.
 *
 * Expects a HTMLDivElement that contains exactly one label and one select element.
 * As usual the name of the select element will be the name in post data.
 * The select element should have a (unique) id attribute.
 *
 * @param selectDiv
 */

function makeSearchable(selectDiv) {
    // hide the select element
    const selectElem = selectDiv.getElementsByTagName('select').item(0);
    selectElem.hidden = true;

    // create the substituting elements, e.g. input and dropdown
    const inputTextElm = document.createElement('input');
    inputTextElm.type = 'text';
    inputTextElm.classList.add('form-control');
    inputTextElm.autocomplete = 'off';
    selectDiv.insertAdjacentElement('beforeend', inputTextElm);
    const inputHiddenElem = document.createElement('input');
    inputHiddenElem.type = 'hidden';
    inputHiddenElem.name = selectElem.name;
    selectDiv.insertAdjacentElement('beforeend', inputHiddenElem);
    const dropdownDiv = document.createElement('div');
    dropdownDiv.classList.add('dropdown');
    const dropdownUl = document.createElement('ul');
    dropdownUl.classList.add('dropdown-menu');
    if (selectDiv.classList.contains('search-select-scroll')) {
        dropdownUl.style.overflowX = 'hidden';
        dropdownUl.style.overflowY = 'auto';
        dropdownUl.style.maxHeight = 'calc(100vh - 150px)';
    }
    dropdownDiv.insertAdjacentElement('beforeend', dropdownUl);
    selectDiv.insertAdjacentElement('beforeend', dropdownDiv);
    inputTextElm.value = '';

    // populate the dropdown
    const dropdownLiArray = [];
    Array.from(selectElem.options).forEach(option => {
        const liElem = document.createElement('li');
        liElem.id = selectElem.id + option.value;
        liElem.dataset.value = option.value;
        liElem.innerText = option.innerText;
        liElem.classList.add('dropdown-item');
        if (option.innerText === '') {
            liElem.style.minHeight = '2em';
        }
        dropdownUl.insertAdjacentElement('beforeend', liElem);
        liElem.addEventListener('click', () => {
            chooseValue(liElem);
        });
        if (option.selected === true) {
            chooseValue(liElem);
        }
        dropdownLiArray.push(liElem);
    });

    // event listeners
    inputTextElm.addEventListener('focus', () => {
        toggleDropdown();
    });
    document.addEventListener('click', evt => {
        if (!dropdownLiArray.find(liElm => liElm === evt.target || inputTextElm === evt.target)) {
            hideDropdown();
        }
    });
    inputTextElm.addEventListener('input', () => {
        filterDropdown();
    });
    inputTextElm.addEventListener('keydown', evt => {
        if (evt.key === "Enter") {
            hideDropdown();
        } else if ((evt.key === "ArrowUp" || evt.key === "ArrowDown") &&
            dropdownUl.classList.contains('show')) {
            const shownLiElems = dropdownLiArray.filter(liElem => !liElem.hidden);
            const activeIndex = shownLiElems.findIndex(liElem => liElem.classList.contains('active'));
            if (evt.key === "ArrowDown") {
                if (activeIndex === -1) {
                    shownLiElems[0].classList.add('active');
                } else if (activeIndex < shownLiElems.length - 1) {
                    shownLiElems[activeIndex].classList.remove('active');
                    shownLiElems[activeIndex + 1].classList.add('active');
                } else {
                    shownLiElems[activeIndex].classList.remove('active');
                    shownLiElems[0].classList.add('active');
                }
            } else {
                if (activeIndex === -1) {
                    shownLiElems[shownLiElems.length - 1].classList.add('active');
                } else if (activeIndex > 0) {
                    shownLiElems[activeIndex].classList.remove('active');
                    shownLiElems[activeIndex - 1].classList.add('active');
                } else {
                    shownLiElems[activeIndex].classList.remove('active');
                    shownLiElems[shownLiElems.length - 1].classList.add('active');
                }
            }
        }
    });

// helpers
    function toggleDropdown() {
        if (dropdownUl.classList.contains('show')) {
            hideDropdown();
        } else {
            dropdownUl.classList.add('show');
            inputTextElm.select();
        }
    }
    function hideDropdown() {
        const chosenLiElem = dropdownLiArray.find(liElem => {
            return liElem.innerText === inputTextElm.value && inputTextElm.value !== '';
        });
        if (chosenLiElem === undefined) {
            let firstLiElem;
            if (dropdownUl.classList.contains('show')) {
                const shownLiElems = dropdownLiArray.filter(liElem => !liElem.hidden);
                if (shownLiElems.length > 0) {
                    const activeIndex = shownLiElems.findIndex(liElem => liElem.classList.contains('active'));
                    if (activeIndex !== -1) {
                        firstLiElem = shownLiElems[activeIndex];

                    } else {
                        firstLiElem = shownLiElems[0];
                    }
                } else {
                    firstLiElem = dropdownLiArray[0];
                }
            } else {
                firstLiElem = dropdownLiArray[0];
            }
            inputTextElm.value = firstLiElem.innerText;
            inputHiddenElem.value = firstLiElem.value;
        } else {
            chooseValue(chosenLiElem);
        }
        dropdownUl.classList.remove('show');
        filterDropdown();
        dropdownLiArray.forEach(liElem => liElem.classList.remove('active'));
    }
    function filterDropdown() {
        dropdownLiArray.forEach(item => item.hidden = false);
        dropdownLiArray.filter(liElm =>
            !liElm.innerText.toLowerCase().includes(inputTextElm.value.toLowerCase())
        ).forEach(item => {
            dropdownLiArray.find(liElem => liElem.id === item.id).hidden = true;
        });
    }
    function chooseValue(liElem) {
        inputTextElm.value = liElem.innerText;
        inputHiddenElem.value = liElem.dataset.value;
        liElem.classList.add('active');
        dropdownUl.classList.remove('show');
    }

    // remove the select element from dom
    selectElem.remove();
}
