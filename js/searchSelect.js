window.onload = () => {
    const selectDiv = document.getElementById('selectDiv');
    makeSearchable(selectDiv, dropdownItems);
};

function makeSearchable(selectDiv, dropdownItems) {
    const selectInputElm = selectDiv.getElementsByClassName('search-select-name').item(0);
    const selectInputValueElm = selectDiv.getElementsByClassName('search-select-value').item(0);
    const dropdownUl = selectDiv.getElementsByTagName('ul').item(0);
    selectInputElm.value = '';
    selectInputElm.addEventListener('click', () => {
        dropdownUl.classList.contains('show') ?
            dropdownUl.classList.remove('show') :
            dropdownUl.classList.add('show');
    });
    const dropdownLiArray = [];
    dropdownItems.forEach(item => {
        const liElm = document.createElement('li');
        liElm.id = item.id;
        liElm.dataset.value = item.value;
        liElm.innerText = item.name;
        liElm.classList.add('dropdown-item');
        dropdownUl.insertAdjacentElement('beforeend', liElm);
        dropdownLiArray.push(liElm);
    });
    dropdownLiArray.forEach(liElm => {
       liElm.addEventListener('click', () => {
           selectInputElm.value = liElm.innerText;
           selectInputValueElm.value = liElm.dataset.value;
           dropdownUl.classList.remove('show');
       });
    });
    document.addEventListener('click', evt => {
        if (!dropdownLiArray.find(liElm => liElm === evt.target || selectInputElm === evt.target)) {
            dropdownUl.classList.remove('show');
        }
    });
    const liCollection = dropdownUl.getElementsByTagName('li');
    selectInputElm.addEventListener('input', () => {
        const removedItems = dropdownLiArray.filter(liElm =>
            !liElm.innerText.toLowerCase().includes(selectInputElm.value.toLowerCase())
        );
        dropdownLiArray.forEach(item => item.hidden = false);
        removedItems.forEach(item => liCollection.namedItem(item.id).hidden = true);
    });
}