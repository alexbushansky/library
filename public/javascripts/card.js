let books = [];
let book = [];
let readers = [];
let reader = {};
let str = ' ';
let stockText = ' ';
let expiredText = ' ';

let id = document.getElementById('id').getAttribute('value');
let name = document.getElementById('name');
let author = document.getElementById('author');
let releaseDate = document.getElementById('releaseDate');
let stock = document.getElementById('stock');
let expired = document.getElementById('expired');
let allReaders = document.getElementById('allReaders');
let currentReader = document.getElementById('currentReader');
let returnElement = document.getElementById('return-element');
let editName = document.getElementById('editName');
let editAuthor = document.getElementById('editAuthor');
let editDateOfRelease = document.getElementById('editDateOfRelease');
let edit = document.getElementById('edit');
let saveEdit = document.getElementById('saveEdit');
let cancelEdit = document.getElementById('cancelEdit');
let addButton = document.querySelector('#add');
let returnButton = document.querySelector('#return');

addButton.addEventListener('click', addReader,true);
edit.addEventListener('click', editBook,true);
cancelEdit.addEventListener('click', cancelEditBook, true);
saveEdit.addEventListener('click', saveEditBook, true);
returnButton.addEventListener('click', returnBook, true);

render(id);

// Вырисовать книгу

function render(id){
    str = '';
    books = [];
    fetch('http://localhost:3000/getData')
        .then( res => { return res.json()})
        .then( data => {
            console.log('Data: ', data);
            books = data;
            for (let i = 0; i< books.length; i++) {
                if (books[i]!==undefined){
                    if(books[i].id == id){
                        book = books[i];
                        console.log('book', book);
                        name.innerHTML = books[i].name;
                        author.innerHTML = books[i].author;
                        releaseDate.innerHTML = books[i].releaseDate;
                        if(books[i].inStock) {
                            stockText = 'Да';
                            expiredText = 'Нет';
                        }  else {
                            stockText = 'Нет';
                            expiredText = 'Нет';
                            if(books[i].expired) {
                                expiredText = 'Да'
                            }
                            if(Date.now() > Date.parse(book.currentReader.dateOfEnd)) {
                                expiredText = 'Да';
                                console.log('Книга просрочена');
                            } else {
                                console.log("Книга не просрочена");
                                expiredText = 'Нет';
                            }
                        }
                        stock.innerHTML = stockText;
                        expired.innerHTML = expiredText;
                        for (let j = 0; j< books[i].allReaders.length; j++) {
                            str +='<div class="card-element"><p><strong>Имя: </strong>'+books[i].allReaders[j].name+'.</p><p><strong>Дата взятия: </strong> '+books[i].allReaders[j].dateOfBegin+'. </p><p><strong>Дата сдачи: </strong> '+books[i].allReaders[j].dateOfEnd+'.</div>';
                        }
                        allReaders.innerHTML = str;
                        str ='<div class="card-element"><p><strong>Имя: </strong>'+books[i].currentReader.name+'.</p><p><strong>Дата взятия: </strong> '+books[i].currentReader.dateOfBegin+'. </p><p><strong>Дата сдачи: </strong> '+books[i].currentReader.dateOfEnd+'.</div>';
                        currentReader.innerHTML = str;
                        if(books[i].currentReader.name == ""){
                            returnElement.classList.add('hidden');
                        } else {
                            returnElement.classList.remove('hidden');
                        }

                    }

                }
            }

        });

}

// Добавить читателя

function addReader(){
    var readerName = document.querySelector('#readerName').value;
    var dateOfBegin = document.querySelector('#dateOfBegin').value;
    var dateOfEnd = document.querySelector('#dateOfEnd').value;
    console.log('Add reader', readerName, ' ', dateOfBegin, ' ', dateOfEnd);
    readers = book.allReaders;

    if(readerName && dateOfBegin && dateOfEnd) {
        reader = {
            name: readerName,
            dateOfBegin: dateOfBegin,
            dateOfEnd: dateOfEnd
        };
        readers.push(reader);
        book = {
            id: book.id,
            name: book.name,
            author: book.author,
            releaseDate: book.releaseDate,
            inStock: false,
            expired: false,
            allReaders: readers,
            currentReader: reader
        };
        console.log('Book object', book);
        books.splice(id,1,book);
        console.log('Books array', books);
        fetch('http://localhost:3000/setData',{
            method: 'post',
            body: JSON.stringify(books),
            headers:{'content-type': 'application/json'}
        })
            .then(function(res){ return res.json(); })
            .then(function(data){ console.log('Set data request from client', JSON.stringify( data ) ) });
    }
    render(id);
}

// Отредактировать книгу

function editBook(){
    name.classList.add('hidden');
    author.classList.add('hidden');
    releaseDate.classList.add('hidden');
    edit.classList.add('hidden');
    cancelEdit.classList.remove('hidden');
    saveEdit.classList.remove('hidden');
    editName.classList.remove('hidden');
    editAuthor.classList.remove('hidden');
    editDateOfRelease.classList.remove('hidden');

    editName.value = book.name;
    editAuthor.value = book.author;
    editDateOfRelease.value = book.releaseDate;
}

// Отменить редактирование

function cancelEditBook() {
    name.classList.remove('hidden');
    author.classList.remove('hidden');
    releaseDate.classList.remove('hidden');
    edit.classList.remove('hidden');
    cancelEdit.classList.add('hidden');
    saveEdit.classList.add('hidden');
    editName.classList.add('hidden');
    editAuthor.classList.add('hidden');
    editDateOfRelease.classList.add('hidden');
}

// Сохранить редактирование

function saveEditBook(){
    if(editName.value && editAuthor.value && editDateOfRelease.value) {
        book = {
            id: book.id,
            name: editName.value,
            author: editAuthor.value,
            releaseDate: editDateOfRelease.value,
            inStock: false,
            expired: false,
            allReaders: book.allReaders,
            currentReader: book.currentReader
        };
        console.log('Saved book object', book);
        books.splice(id,1,book);
        console.log('Books array', books);
        fetch('http://localhost:3000/setData',{
            method: 'post',
            body: JSON.stringify(books),
            headers:{'content-type': 'application/json'}
        })
            .then(function(res){ return res.json(); })
            .then(function(data){ console.log('Set data request from client', JSON.stringify( data ) ) });
    }
    cancelEditBook();
    render(id);
}

// Вернуть книгу

function returnBook(){
        book = {
            id: book.id,
            name: book.name,
            author: book.author,
            releaseDate: book.releaseDate,
            inStock: true,
            expired: false,
            allReaders: book.allReaders,
            currentReader: {
                name: '',
                dateOfBegin: '',
                dateOfEnd: ''
            }
        };
        console.log('Returned book object', book);
        books.splice(id,1,book);
        console.log('Books array', books);
        fetch('http://localhost:3000/setData',{
            method: 'post',
            body: JSON.stringify(books),
            headers:{'content-type': 'application/json'}
        })
            .then(function(res){ return res.json(); })
            .then(function(data){ console.log('Set data request from client', JSON.stringify( data ) ) });
    render(id);
}


