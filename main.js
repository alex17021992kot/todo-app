
window.onload = function() {
	showEmptyList();
};

let tasks = JSON.parse( localStorage.getItem('tasks') ) || [];

let ul = document.querySelector('.list-group');
let form = document.forms['addTodoItem'];
let inputText = form.elements['todoText'];
let listStatus = document.getElementsByClassName('list-status')[0];
let clearAllList = document.querySelector('.clear-btn');
let notificationAlert = document.querySelector('.notification-alert');

function generateId() {
	let id = '';
	let words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

	for (let i = 0; i < 15; i++) {
		let position = Math.floor(Math.random() * words.length);
		id += words[position];
	}

	return id;
}
function listTemplate(task) {
	// create list item
	let li = document.createElement('li');
	li.className = 'list-group-item d-flex align-items-center';
	li.setAttribute('data-id', task.id);
	// creating wrap span for task`s text
	let span = document.createElement('span');
	span.textContent = task.text;
	//create tag i fa-trash-alt
	let iDelete = document.createElement('i');
	iDelete.className = 'fas fa-trash-alt delete-item ml-4';
	// create editing icon
	let iEdit = document.createElement('i');
	iEdit.className = 'fas fa-edit edit-item ml-auto';
	// append deleting item to li
	li.appendChild(span);
	li.appendChild(iEdit);
	li.appendChild(iDelete);

	return li;
}
function clearList() {
	ul.innerHTML = '';
}
function generateList(taskArray) {

	clearList();

	for (let i = 0; i < taskArray.length; i++) {

	   ul.appendChild( listTemplate(taskArray[i]) );

	}

}
function addList(list) {

	let newTask ={
		id: generateId(),
		text: list
	};

	tasks.unshift(newTask);
	ul.insertAdjacentElement('afterbegin', listTemplate(newTask));
	localStorage.setItem('tasks', JSON.stringify(tasks));
	showEmptyList();

	message({
		text: 'Task added!',
		cssClass: 'alert-info',
		timeout: 700
	});

}
function deleteListItem(id) {

	for (let i = 0; i < tasks.length; i++){
		if (tasks[i].id === id) {
			tasks.splice(i, 1);
			break;
		}
	}

	localStorage.setItem('tasks', JSON.stringify(tasks));
	message({
		text: 'Task deleted success!',
		cssClass: 'alert-danger',
		timeout: 700
	});
}
/*function for showing of empty list*/
function showEmptyList() {

	if (!tasks.length) {
		listStatus.classList.remove('hidden');
	} else{
		listStatus.classList.add('hidden');
	}
}
function editListItem(id, newValue) {
	for (let i =0; i < tasks.length; i++){
		if (tasks[i].id === id) {
			tasks[i].text = newValue;
			break;
		}
	}

	// Update localStorage
	localStorage.setItem('tasks', JSON.stringify(tasks));
	message({
		text: 'Task updated success!',
		cssClass: 'alert-success',
		timeout: 700
	});
	showEmptyList();
}
function message (settings) {
	notificationAlert.classList.add(settings.cssClass);
	notificationAlert.textContent = settings.text;
	notificationAlert.classList.add('show');

	setTimeout(function(){
		notificationAlert.classList.remove('show');
		notificationAlert.classList.remove(settings.cssClass);
	},settings.timeout);
}
/*Events*/

ul.addEventListener('click', function(e){

	if (e.target.classList.contains('delete-item')) {
		let parent = e.target.closest('li');
		let id = parent.dataset.id;
		deleteListItem(id);
		parent.remove();
		showEmptyList();
	}else if (e.target.classList.contains('edit-item')){
		e.target.classList.toggle('fa-save');
		let id = e.target.closest('li').dataset.id;
		let span = e.target.closest('li').querySelector('span');

		if (e.target.classList.contains('fa-save')) {
			span.setAttribute('contenteditable', true);
			span.focus();
		} else {
			span.setAttribute('contenteditable', false);
			span.blur();
			editListItem(id, span.textContent);
		}
	}

});

form.addEventListener('submit', function(e){
	e.preventDefault();

	if (!inputText.value) {
		inputText.classList.add('is-invalid');
	} else {
		inputText.classList.remove('is-invalid');
		addList(inputText.value);
		form.reset();
	}
});

inputText.addEventListener('keyup', function(e) {

	if(inputText.value) {
		inputText.classList.remove('is-invalid');
	}

});

clearAllList.addEventListener('click', function() {
	tasks.splice(0, tasks.length);
	ul.innerHTML = '';

	showEmptyList();
});

generateList(tasks);



// function showMessage(message) {
//     let alertBox = document.querySelector('.tasks-wrap .alert');
//
//     alertBox.textContent = message;
//     alertBox.classList.add('show');
// }

// setting events for rebooted list

// showMessage('List of tasks');

// setTimeout(function(){
//     let alertBox = document.querySelector('.tasks-wrap .alert');
//     alertBox.classList.remove('show');
// }, 3000);

