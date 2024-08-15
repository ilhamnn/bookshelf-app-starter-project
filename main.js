document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "BOOKSHELF_APP";

  function refreshData() {
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    let books = [];
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      books = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach(function (book) {
      const bookItem = createBookItem(book);

      if (book.isComplete) {
        completeBookList.appendChild(bookItem);
      } else {
        incompleteBookList.appendChild(bookItem);
      }
    });
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    refreshData();
  }

  function addBook(title, author, year, isComplete) {
    if (
      typeof title !== "string" ||
      typeof author !== "string" ||
      typeof parseInt(year) !== "number" ||
      typeof isComplete !== "boolean"
    ) {
      alert(
        "Tipe data buku tidak sesuai. Pastikan title dan author berupa string, year berupa number, dan isComplete berupa boolean."
      );
      return;
    }

    const newBook = {
      id: new Date().getTime().toString(),
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete,
    };

    books.push(newBook);
    saveData();
  }

  function createBookItem(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    const title = document.createElement("h3");
    title.innerText = book.title;
    title.setAttribute("data-testid", "bookItemTitle");
    bookItem.appendChild(title);

    const author = document.createElement("p");
    author.innerText = `Penulis: ${book.author}`;
    author.setAttribute("data-testid", "bookItemAuthor");
    bookItem.appendChild(author);

    const year = document.createElement("p");
    year.innerText = `Tahun: ${book.year}`;
    year.setAttribute("data-testid", "bookItemYear");
    bookItem.appendChild(year);

    const actionContainer = document.createElement("div");

    const completeButton = document.createElement("button");
    completeButton.innerText = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    completeButton.addEventListener("click", function () {
      toggleCompleteStatus(book.id);
    });
    actionContainer.appendChild(completeButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.addEventListener("click", function () {
      deleteBook(book.id);
    });
    actionContainer.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Buku";
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.addEventListener("click", function () {
      editBook(book.id);
    });
    actionContainer.appendChild(editButton);

    bookItem.appendChild(actionContainer);
    return bookItem;
  }

  function toggleCompleteStatus(bookId) {
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveData();
    }
  }

  function deleteBook(bookId) {
    books = books.filter((book) => book.id !== bookId);
    saveData();
  }

  function editBook(bookId) {
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      const newTitle = prompt("Masukkan judul baru:", books[index].title);
      const newAuthor = prompt("Masukkan penulis baru:", books[index].author);
      const newYear = prompt("Masukkan tahun baru:", books[index].year);
      const newIsComplete = confirm(
        "Apakah buku sudah selesai dibaca? Tekan OK untuk ya, Cancel untuk tidak."
      );

      if (
        typeof newTitle !== "string" ||
        typeof newAuthor !== "string" ||
        typeof parseInt(newYear) !== "number"
      ) {
        alert(
          "Tipe data tidak sesuai. Pastikan title dan author berupa string, dan year berupa number."
        );
        return;
      }

      books[index] = {
        ...books[index],
        title: newTitle,
        author: newAuthor,
        year: parseInt(newYear),
        isComplete: newIsComplete,
      };
      saveData();
    }
  }

  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, parseInt(year), isComplete);
    bookForm.reset();
  });

  const searchBookForm = document.getElementById("searchBook");
  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();

    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );

    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    filteredBooks.forEach(function (book) {
      const bookItem = createBookItem(book);

      if (book.isComplete) {
        completeBookList.appendChild(bookItem);
      } else {
        incompleteBookList.appendChild(bookItem);
      }
    });
  });

  let books = [];
  if (localStorage.getItem(STORAGE_KEY) !== null) {
    books = JSON.parse(localStorage.getItem(STORAGE_KEY));
  }
  refreshData();
});
