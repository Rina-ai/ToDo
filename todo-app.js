(function () {
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createToboItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('disabled', false);
    button.textContent = ('Добавить дело');

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', function () {
      if (input.value.length !== 0) {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, done, storageKey) {
    let item = document.createElement('li');
    let burromGroup = document.createElement('div');
    let doneButtom = document.createElement('buttom');
    let deleteButtom = document.createElement('buttom');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    burromGroup.classList.add('btn-group', 'btn-group-sm');
    doneButtom.classList.add('btn', 'btn-success');
    doneButtom.textContent = 'Готово';
    deleteButtom.classList.add('btn', 'btn-danger');
    deleteButtom.textContent = 'Удалить';

    if (done === true) {
      item.classList.toggle('list-group-item-success');
    }
    doneButtom.addEventListener('click', function () {
      toggleDone(item, storageKey)
    });
    deleteButtom.addEventListener('click', function () {
      toggleDelete(item, storageKey);
    });

    burromGroup.append(doneButtom);
    burromGroup.append(deleteButtom);
    item.append(burromGroup);

    return {
      item,
      doneButtom,
      deleteButtom,
    };
  }
  
  let dataFromStorage = [];
  function toggleDone(item, storageKey) {
    item.classList.toggle("list-group-item-success");
    let isDone = item.classList.contains('list-group-item-success');
     dataFromStorage = JSON.parse(localStorage.getItem(storageKey));
    for (let i = 0; i < dataFromStorage.length; i++) {
      if (item.firstChild.textContent === dataFromStorage[i].name) {
        dataFromStorage[i].done = isDone;
        localStorage.setItem(storageKey, JSON.stringify(dataFromStorage));
        break;
      }
    }
  };

  function toggleDelete(item, storageKey) {
     dataFromStorage = JSON.parse(localStorage.getItem(storageKey));
    if (confirm("Вы уверены?")) {
      item.remove();
      for (let i = 0; i < dataFromStorage.length; i++) {
        if (item.firstChild.textContent === dataFromStorage[i].name) {
          dataFromStorage.splice(i, 1);
          localStorage.setItem(storageKey, JSON.stringify(dataFromStorage));
          break;
        }
      }
    }
  };
  
  function createTodoApp(container, title = 'Список дел', storageKey, listDefault = null) {
    let todoAppTitle = createAppTitle(title);
    let toboItemForm = createToboItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(toboItemForm.form);
    container.append(todoList);

    if (localStorage.getItem(storageKey) === null) {
      if (listDefault === null) {
        listDefault = [];
      }
      localStorage.setItem(storageKey, JSON.stringify(listDefault));
    }

    dataFromStorage = JSON.parse(localStorage.getItem(storageKey));

    for (let i of dataFromStorage) {
      let todoItemLSDefault = createTodoItem(i.name, i.done, storageKey);
      todoList.append(todoItemLSDefault.item);
    }

    toboItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!toboItemForm.input.value) {
        return;
      }

      dataFromStorage.push({
        name: toboItemForm.input.value,
        done: false,
      });

      localStorage.setItem(storageKey, JSON.stringify(dataFromStorage));

      let todoItem = createTodoItem(toboItemForm.input.value, 'false', storageKey);

      todoList.append(todoItem.item);
      toboItemForm.button.disabled = true;
      toboItemForm.input.value = '';
    });

  }

  window.createTodoApp = createTodoApp;
})();