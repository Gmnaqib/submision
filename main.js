// Seleksi elemen-elemen yang diperlukan
const inputBookForm = document.getElementById('inputBook');
const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const completeBookshelfList = document.getElementById('completeBookshelfList');

const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        books = data;
    }

    document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId) {
            return index;
        }

        index++;
    }

    return -1;
}

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const bookId = generateId();
    const bookObject = generateBookObject(bookId, title, author, parseInt(year), isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event('ondatasaved'));
    renderBook(bookObject);
}

function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis: ${bookObject.author}`;

    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun: ${bookObject.year}`;

    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(bookTitle, bookAuthor, bookYear);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('green');
    toggleButton.innerText = bookObject.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', function() {
        toggleBookComplete(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', function() {
        removeBook(bookObject.id);
    });

    actionContainer.append(toggleButton, deleteButton);
    bookContainer.append(actionContainer);

    return bookContainer;
}

function renderBook(bookObject) {
    const bookElement = makeBook(bookObject);
    if (bookObject.isComplete) {
        completeBookshelfList.append(bookElement);
    } else {
        incompleteBookshelfList.append(bookElement);
    }
}

function toggleBookComplete(bookId) {
    const book = findBook(bookId);
    if (book === null) return;

    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event('ondatasaved'));
    refreshBookshelf();
}

function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex === -1) return;

    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event('ondatasaved'));
    refreshBookshelf();
}

function refreshBookshelf() {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (book of books) {
        renderBook(book);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (isStorageExist()) {
        loadDataFromStorage();
    }

    inputBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
        updateDataToStorage();
    });

    document.addEventListener('ondataloaded', function() {
        refreshBookshelf();
    });

    document.addEventListener('ondatasaved', function() {
        updateDataToStorage();
    });
});
