let books = [];
let book = [];
let tabBooks = document.getElementById('tab-books');
let str = ' ';
let stock = ' ';
let expired = 'Просрочена';
addButton = document.querySelector('#add');
sortStockButton = document.querySelector('#sort-stock');
sortExpireButton = document.querySelector('#sort-expire');
deleteButton = document.querySelector('#delete');


addButton.addEventListener('click', addBook,true);
sortStockButton.addEventListener('click',sortByStock, true);
sortExpireButton.addEventListener('click',sortByExpire, true);

render();

// Отображение книг

function render(){
    str = '';
    books = [];
    fetch('http://localhost:3000/getData')
        .then( res => { return res.json()})
        .then( data => {
            console.log('Data: ', data);
            books = data;
            for (let i = 0; i< books.length; i++) {
                if (books[i]!==undefined){
                    if(books[i].inStock) {
                        stock = 'Да';
                        expired = '';
                    }  else {
                        stock = 'Нет';
                        if(books[i].expired) {
                            expired = 'Просрочена'
                        }
                    }
                    str +='<div class="book-element"><a href=books/'+books[i].id+'><p>'+books[i].id+'. <strong>Название:</strong> '+books[i].name+'. </p><p><strong>Автор:</strong> '+books[i].author+'. </p><p><strong>Год выпуска: </strong>'+books[i].releaseDate+'</p><p><strong>В наличии: </strong>'+stock+'</p><p style="color: red; font-weight: 700;">'+expired+'</p></a><button id="delete" onclick="deleteBook('+i+')">Удалить</button></div>';
                }
            }
            tabBooks.innerHTML = str;
        });
}


// Добавить книгу

function addBook(){
    var bookName = document.querySelector('#name').value;
    var bookAuthor = document.querySelector('#author').value;
    var bookReleaseDate = document.querySelector('#releaseDate').value;
    if(bookName && bookAuthor && bookReleaseDate) {
        book = {
            id: books.length,
            name: bookName,
            author: bookAuthor,
            releaseDate: bookReleaseDate,
            inStock: true,
            expired: false,
            allReaders: [ {
                name: '',
                dateOfBegin: '',
                dateOfEnd: ''
            } ],
            currentReader: {
                name: '',
                dateOfBegin: '',
                dateOfEnd: ''
            }
        };
        console.log('Book object', book);
        books.push(book);
        console.log('Books array', book);
        console.log('Book date', bookReleaseDate.valueOf());
        fetch('http://localhost:3000/setData',{
            method: 'post',
            body: JSON.stringify(books),
            headers:{'content-type': 'application/json'}
        })
            .then(function(res){ return res.json(); })
            .then(function(data){ console.log('Set data request from client', JSON.stringify( data ) ) });
    }
    render();
}

// Сортировать по наличию

function sortByStock() {
    str = ' ';
    books.sort(function(x, y) {
        // true values first
        return (x.inStock === y.inStock)? 0 : x? -1 : 1;
        // false values first
        // return (x === y)? 0 : x? 1 : -1;
    });
    console.log(books);
    for (let i = 0; i< books.length; i++) {
        if (books[i]!==undefined){
            if(books[i].inStock) stock = 'Да'; else stock = 'Нет';
            str +='<div class="book-element"><a href=books/'+books[i].id+'><p>'+books[i].id+'. <strong>Название:</strong> '+books[i].name+'. </p><p><strong>Автор:</strong> '+books[i].author+'. </p><p><strong>Год выпуска: </strong>'+books[i].releaseDate+'</p><p><strong>В наличии: </strong>'+stock+'</p><p style="color: red; font-weight: 700;">'+expired+'</p></a><button id="delete" onclick="deleteBook('+i+')">Удалить</button></div>';
        }
    }
    tabBooks.innerHTML = str;
}

// Сортировать по просрочке

function sortByExpire(){
    str = ' ';
    books.sort(function(x, y) {
        // true values first
        return (Date.parse(y.releaseDate) - Date.parse(x.releaseDate))
        // false values first
        // return (x === y)? 0 : x? 1 : -1;
    });
    console.log(books);
    for (let i = 0; i< books.length; i++) {
        if (books[i]!==undefined){
            if(books[i].inStock) stock = 'Да'; else stock = 'Нет';
            str +='<div class="book-element"><a href=books/'+books[i].id+'><p>'+books[i].id+'. <strong>Название:</strong> '+books[i].name+'. </p><p><strong>Автор:</strong> '+books[i].author+'. </p><p><strong>Год выпуска: </strong>'+books[i].releaseDate+'</p><p><strong>В наличии: </strong>'+stock+'</p><p style="color: red; font-weight: 700;">'+expired+'</p></a><button id="delete" onclick="deleteBook('+i+')">Удалить</button></div>';
        }
    }
    tabBooks.innerHTML = str;
}

// Удалить книгу

function deleteBook(index) {
    books.splice(index,1);
    console.log('Books array', books);
    fetch('http://localhost:3000/setData',{
        method: 'post',
        body: JSON.stringify(books),
        headers:{'content-type': 'application/json'}
    })
        .then(function(res){ return res.json(); })
        .then(function(data){ console.log('Set data request from client', JSON.stringify( data ) ) });
    render();
}
