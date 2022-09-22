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
    //      show/hide dropdown
    inputTextElm.addEventListener('click', () => {
        toggleDropdown();
    });
    document.addEventListener('click', evt => {
        if (!dropdownLiArray.find(liElm => liElm === evt.target || inputTextElm === evt.target)) {
            dropdownUl.classList.remove('show');
        }
    });
    //      filter dropdown
    const liCollection = dropdownUl.getElementsByTagName('li');
    inputTextElm.addEventListener('input', () => {
        dropdownLiArray.forEach(item => item.hidden = false);
        dropdownLiArray.filter(liElm =>
            !liElm.innerText.toLowerCase().includes(inputTextElm.value.toLowerCase())
        ).forEach(item => liCollection.namedItem(item.id).hidden = true);
    });

    // helpers
    function toggleDropdown() {
        if (dropdownUl.classList.contains('show')) {
            dropdownUl.classList.remove('show');
        } else {
            dropdownUl.classList.add('show');
            inputTextElm.select();
        }
    }
    function chooseValue(liElem) {
        inputTextElm.value = liElem.innerText;
        inputHiddenElem.value = liElem.dataset.value;
        dropdownUl.classList.remove('show');
    }

    // remove the select element from dom
    selectElem.remove();

}
