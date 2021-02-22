'use strict';
// Screen elements
const signUpBtn = document.querySelector('.hallo-sign-up');
const signInBtn = document.querySelector('.hallo-sign-in');
const logoutBtn = document.querySelector('.hallo-logout');
const credantialsList = document.querySelector('.hallo-user-list');
const halloName = document.querySelector('.hallo-name');
const credantialsRemoveButtons = document.querySelectorAll('.credantials-remove');

// Variables
let userData = {
  firstName: '',
  lastName: '',
  login: '',
  password: '',
  regDate: '',
  userName: '',
  today: new Date(),
  monthsRu: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  signUpString: '',
  signUpFunc: function () { 
    // ввод данных учетной записи
    do {
      this.userName = prompt('Enter literal username separated by a space');
    } while (!this.checkString(this.userName) || this.userName.trim().split(' ').length !== 2);
    do {
      this.login = prompt('Enter literal login (not empty)');
    } while (!this.checkString(this.login) || this.login.trim().split(' ').length !== 1 || this.login.trim().length === 0);
    do {
      this.password = prompt('Enter password (not empty)');
    } while (this.password.trim().split(' ').length !== 1 || this.password.trim().length === 0);
    
    // формирование учетной строки
    this.firstName = this.userName.trim().split(' ')[0];
    this.lastName = this.userName.trim().split(' ')[1];
    this.regDate = this.getCurrentDate(this.today);

    this.signUpString = 'Имя: ' + this.firstName + ', ';
    this.signUpString += 'фамилия: ' + this.lastName + ', ';
    this.signUpString += 'зарегистрирован: ' + this.regDate;

    // сохранение учетных данных в localeStorage
    this.saveCredantials(this.signUpString, this.login, this.password);
    this.readCredantials();
  },
  saveCredantials: function (credentials, login, password) {  
    let credantialsArray = (localStorage.getItem('credantials')) ? JSON.parse(localStorage.getItem('credantials')) : [];
    const newCredantials = {
      value: credentials,
      login: login,
      password: password
    };
    credantialsArray.push(newCredantials);
    localStorage.setItem('credantials', JSON.stringify(credantialsArray));
  },
  removeFromStorage(credantials) {
    let credantialsArray = (localStorage.getItem('credantials')) ? JSON.parse(localStorage.getItem('credantials')) : [];
    let itemToRemove = credantialsArray.findIndex(array => array.value === credantials);
    credantialsArray.splice(itemToRemove, 1);
    localStorage.setItem('credantials', JSON.stringify(credantialsArray));
  },
  signInFunc: function () { 
    do {
      this.login = prompt('Enter literal login (not empty)');
    } while (!this.checkString(this.login) || this.login.trim().split(' ').length !== 1 || this.login.trim().length === 0);
    do {
      this.password = prompt('Enter password (not empty)');
    } while (this.password.trim().split(' ').length !== 1 || this.password.trim().length === 0);
    const isTrue = this.checkCredentials(this.login, this.password);
    if (isTrue) {
      halloName.innerHTML = this.login;
      signUpBtn.classList.toggle('disabled');
      signInBtn.classList.toggle('disabled');
      logoutBtn.classList.toggle('disabled');
    } else {
      alert('Пользователь не найден');
    }
  },
  logoutFunc: function () {  
    halloName.innerHTML = 'Anonim';
    signUpBtn.classList.toggle('disabled');
    signInBtn.classList.toggle('disabled');
    logoutBtn.classList.toggle('disabled');
    this.removeCredantialsShadow();
  },
  removeCredantialsShadow: function () { 
    const credantialsList = document.querySelectorAll('.hallo-user-list');
    let userLi = Array.from(credantialsList[0].querySelectorAll('li'));
    userLi.forEach((item) => {
      item.classList.remove('current-user');
    });
  },
  // credantials check
  checkCredentials: function (login, password) {  
    let credantialsArray = (localStorage.getItem('credantials')) ? JSON.parse(localStorage.getItem('credantials')) : [];
    for (let index = 0; index < credantialsArray.length; index++) {
      if (credantialsArray[index].login === login.toString()) {
        if (credantialsArray[index].password === password.toString()) {
          const credantialsList = document.querySelectorAll('.hallo-user-list');
          let userLi = Array.from(credantialsList[0].querySelectorAll('li'));
          const userCred = credantialsArray[index].value;
          userLi.forEach((item) => { 
            if (item.innerHTML.indexOf(userCred) > 0) {
              item.classList.toggle('current-user');
            }
          });
          return true;
        }
      }
    }
    return false;
  },
  checkString: function (str) { 
    if (str !== null) {
      let nameArray = str.trim().split(' ');
      for (let index = 0; index < nameArray.length; index++) {
        if (typeof parseInt(nameArray[index]) === 'number' && !isNaN(parseInt(nameArray[index]))) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  },
  addValue: function (param) {  
    return (param < 10) ? '0' + param : param;
  },
  getCurrentDate: function (now) {
    let dateString = '';
    dateString += this.addValue(now.getDate());
    dateString += ' ' + this.monthsRu[now.getMonth()];
    dateString += ' ' + now.getFullYear() + ' г.,';
    dateString += ' ' + this.addValue(now.getHours());
    dateString += ':' + this.addValue(now.getMinutes());
    dateString += ':' + this.addValue(now.getSeconds());
    return dateString;
  },
  readCredantials: function () {  
    credantialsList.innerHTML = '';
    let credantialsArray = (localStorage.getItem('credantials')) ? JSON.parse(localStorage.getItem('credantials')) : [];
    credantialsArray.forEach(element => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="credantials-item">${element.value}
                        <a class="credantials-remove">
                          <img src="img/close.svg" alt="Icon: close" class="credantials-remove-link" />
                        </a>
                      </span>`;
      credantialsList.append(li);
      const removeBtn = li.querySelector('.credantials-remove');
      removeBtn.addEventListener('click', function (e) {
        const itemText = e.target.closest('.credantials-remove').closest('.credantials-item').textContent.trim();
        let itemToRemove = credantialsArray.findIndex(array => array.value === itemText);
        userData.removeFromStorage(itemToRemove);
        userData.readCredantials();
      });
    });
  },
};

// Bind context to object
function bind(func, context) {  
  return function () { 
    return func.bind(context, arguments);
  };
}
const signUpFunction = bind(userData.signUpFunc, userData);
const signInFunction = bind(userData.signInFunc, userData);
const logoutFunction = bind(userData.logoutFunc, userData);

// Listeners
signUpBtn.addEventListener('click', signUpFunction());
signInBtn.addEventListener('click', signInFunction());
logoutBtn.addEventListener('click', logoutFunction());

// Read credantials
userData.readCredantials();