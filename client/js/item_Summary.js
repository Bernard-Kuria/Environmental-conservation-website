const grid = document.getElementById('grid');
const list = document.getElementById('list');
const viewGrid = document.getElementById('grid-view');
const viewList = document.getElementById('list-view');
const uploadCancel = document.getElementById('upload-cancel');
const uploadItem = document.getElementById('upload-item');
const uploadBtn = document.querySelector('.upload-item-button');

grid.addEventListener("click", (event) => {
    viewGrid.classList.remove('hidden-view');
    viewList.classList.add('hidden-view');
});

list.addEventListener("click", (event) => {
    viewList.classList.remove('hidden-view');
    viewGrid.classList.add('hidden-view');
});

uploadCancel.addEventListener("click", (event) => {
    uploadItem.classList.add('hidden-view');
});

document.getElementById('primary_image').addEventListener('change', function(event) {
    const uploadDiv = this.closest('.upload_image');
    if (event.target.files.length > 0) {
        uploadDiv.style.backgroundColor = '#e0ffe0';
        uploadDiv.innerHTML = '<span>Primary image uploaded</span>';
    }
});

document.getElementById('additional_photos').addEventListener('change', function(event) {
    const uploadDiv = this.closest('.upload_image');
    if (event.target.files.length > 0) {
        uploadDiv.style.backgroundColor = '#e0ffe0';
        uploadDiv.innerHTML = '<span>Additional photos uploaded</span>';
    }
});

uploadBtn.addEventListener('click', () => {
    uploadItem.classList.remove('hidden-view');
})