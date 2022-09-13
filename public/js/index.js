window.onload = () => {
    const selectDivs = document.getElementsByClassName('search-select-div');
    Array.from(selectDivs).forEach(div => makeSearchable(div));
};
