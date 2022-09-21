function makeSearchable(selectDiv) {
    const selectElem = selectDiv.getElementsByTagName('select').item(0);
    selectElem.hidden = true;
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
    inputTextElm.addEventListener('click', () => {
        dropdownUl.classList.contains('show') ?
            dropdownUl.classList.remove('show') :
            dropdownUl.classList.add('show');
    });
    const dropdownLiArray = [];
    Array.from(selectElem.options).forEach(option => {
        const liElem = document.createElement('li');
        liElem.id = selectElem.id + option.value;
        liElem.innerText = option.innerText;
        liElem.classList.add('dropdown-item');
        dropdownUl.insertAdjacentElement('beforeend', liElem);
        liElem.addEventListener('click', () => {
            inputTextElm.value = liElem.innerText;
            inputHiddenElem.value = option.value;
            dropdownUl.classList.remove('show');
        });
        if (option.selected === true) {
            inputTextElm.value = option.innerText;
            inputHiddenElem.value = option.value;
        }
        dropdownLiArray.push(liElem);
    });
    document.addEventListener('click', evt => {
        if (!dropdownLiArray.find(liElm => liElm === evt.target || inputTextElm === evt.target)) {
            dropdownUl.classList.remove('show');
        }
    });
    const liCollection = dropdownUl.getElementsByTagName('li');
    inputTextElm.addEventListener('input', () => {
        dropdownLiArray.forEach(item => item.hidden = false);
        dropdownLiArray.filter(liElm =>
            !liElm.innerText.toLowerCase().includes(inputTextElm.value.toLowerCase())
        ).forEach(item => liCollection.namedItem(item.id).hidden = true);
    });
    selectElem.remove();

}
