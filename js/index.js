"use strict";
const taskerApp = (function () {

    class TaskerView {
        constructor(container) {
            this.container = container;
            this.openModal = false;

            this.HomePageComponent = {
                id: "homePage",
                title: "Tasker",
                render: (className = "tasker-page", ...rest) => {
                    return `
                    <main class="${className}">
                        <div class="header">
                            <div class="header__day"></div>
                            <a class="header__setup-button">
                            <span></span>
                            <span></span>
                            <span></span>
                            </a>
                        </div>
                        <div class="tasks"></div>
                        <div class="lists">
                            <div class="lists__title">Lists</div>
                        </div>
                        <div class="modal-add hidden"></div>
                        <div class="modal-add__buttons">
                                <a class="add-task" href="#createTask">Task</a>
                                <a class="add-list" href="#createCategory">List</a>
                        </div>
                        <a class="add-button"><img class="add-button__img" src="img/plus.svg" alt="add" title="add"></a>
                        <div class="modal-category">
                            <a class="modal-category__close-button"></a>
                            <div class="modal-category__header">
                                <div class="modal-category__header-text">
                                    <span class="modal-category__header-category"></span>
                                    <input type="text" class="input-text" id="input-text">
                                    <span class="modal-category__header-count"></span>
                                </div>
                                <a class="edit-button"><img class="shape"></a>
                            </div>
                            <div class="modal-category__main">
                                <ul class="modal-category__main-tasks"></ul>
                            </div>
                        </div>
                    </main>
                  `;
                }
            };

            this.CreateTask = {
                id: "createTask",
                title: "Tasker",
                render: (className = "create-task-page", ...rest) => {
                    return `
                    <main class="${className}">
                        <div>
                            <div class="create-task__header">
                                <a class="cancel-button" href="#homePage">Cancel</a>
                                <a class="done-button" href="#homePage">Done</a>
                            </div>
                            <div class="create-task__body">
                                <label>
                                    <input type="checkbox" class="custom-checkbox">
                                    <span class="task-checkbox"></span>
                                </label>
                                <div class="input-info">
                                    <input type="text" class="input-text" placeholder="What do you want to do?">
                                </div>
                                <span class="dot-color" style="background-color: #ebeff5"></span>
                            </div>
                        </div>
                        <div>
                            <div class="create-task__buttons">
                                <div>
                                    <a class="calendar-button"><img src="img/calendar.svg" alt="calendar" title="calendar"></a>
                                    <label for="clock">
                                        <a class="clock-button"><img class="clock-button" src="img/alarm.svg" alt="clock" title="clock"></a>
                                    </label>
                                </div>
                                <div>
                                    <a class="category-button"><span class="category-button__text">Inbox</span><span class="dot-color" style="background-color: #ebeff5"></span></a>
                                </div>
                            </div>
                            <div class="category-сhoose"></div>
                        </div>
                        
                    </main>
                  `;
                }
            };

            this.CreateCategory = {
                id: "createCategory",
                title: "Tasker",
                render: (className = "create-category-page", ...rest) => {
                    return `
                    <main class="${className}">
                        <div>
                            <div class="create-category__header">
                                <a class="cancel-button" href="#homePage">Cancel</a>
                                <a class="create-category__done-button" href="#homePage">Done</a>
                            </div>
                            <div class="create-category__body">
                                <input type="text" class="input-text" placeholder="Enter category name">
                            </div>
                        </div>
                        <div>
                            <div class="create-category__buttons create-category__colors"></div>
                        </div>
                    </main>
                  `;
                }
            };

            this.router = {
                homePage: this.HomePageComponent,
                createTask: this.CreateTask,
                createCategory: this.CreateCategory,
                default: this.HomePageComponent,
            };
        }

        init() {
            return false;
        }

        renderContent(hashPageName) {
            let routeName = "default";

            if (hashPageName.length > 0) {
                routeName = hashPageName in this.router ? hashPageName : "error";
            }

            window.document.title = this.router[routeName].title;
            this.container.innerHTML = this.router[routeName].render(`${routeName}-page`);
        }

        getCategoryList(storageInfo, colors) {
            const сategoryList = document.createElement('ul');
            const lists = storageInfo[0].lists;
            сategoryList.setAttribute("class", "lists__list");

            lists.forEach((item) => {
                const li = document.createElement('li');
                const spanText = document.createElement('span');
                const spanCountTask = document.createElement('span');
                const colorText = colors.find((element) => element.category === item.category).textColor;
                const colorBack = colors.find((element) => element.category === item.category).backColor;

                li.setAttribute("class", "lists__list-item");
                li.setAttribute("style", `background-color: ${colorBack}`);
                li.setAttribute("data-category", `${item.category}`);
                spanText.setAttribute("class", "list-text");
                spanText.setAttribute("style", `color: ${colorText}`);
                spanText.innerHTML = item.category;
                spanCountTask.setAttribute("class", "list-count-task");
                spanCountTask.setAttribute("style", `color: ${colorText}`);
                spanCountTask.innerHTML = `${item.count} ${item.count < 2 ? "task" : "tasks"}`;
                li.append(spanText);
                li.append(spanCountTask);
                сategoryList.append(li);
            })

            return сategoryList;
        }

        getTasksList(storageInfo, colors) {
            const tasksList = document.createElement('ul');
            const tasks = storageInfo[0].tasks;
            tasksList.setAttribute("class", "tasks__list");

            tasks.forEach((item) => {
                const li = document.createElement('li');
                const input = document.createElement('input');
                const pText = document.createElement('p');
                const spanText = document.createElement('span');
                const spanColor = document.createElement('span');
                const label = document.createElement('label');
                const colorBack = colors.find((element) => element.category === item.parent).backColor;

                li.setAttribute("class", "tasks__list-item");
                input.setAttribute("type", "checkbox");
                input.setAttribute("data-parent", item.parent);
                input.setAttribute("class", "custom-checkbox");
                input.setAttribute("id", `${item.id}`);
                input.checked = item.checked;
                spanText.setAttribute("class", "task-text");
                spanText.innerHTML = item.text;
                pText.append(spanText);

                if (!!item.time) {
                    const spanTime = document.createElement('span');
                    spanTime.setAttribute("class", "task-time");
                    spanTime.innerHTML = item.time;
                    pText.append(spanTime);
                }

                spanColor.setAttribute("class", "dot-color");
                spanColor.setAttribute("style", `background-color: ${colorBack}`);
                li.append(input);
                li.append(pText);
                li.append(spanColor);
                label.append(li);
                tasksList.append(label);
            })

            return tasksList;
        }

        createContent(storage, colors) {
            const headerDay = document.querySelector('.header__day');
            const tasksList = this.getTasksList(storage, colors);
            const tasks = document.querySelector('.tasks');
            const categoryList = this.getCategoryList(storage, colors);
            const lists = document.querySelector('.lists');

            headerDay.innerHTML = storage[0].day;
            tasks.append(tasksList);
            lists.append(categoryList);
        }

        createCategoryContent(storage, colors) {
            const elementChooseCategory = document.querySelector('.category-сhoose');
            const categoryList = this.getCategoryList(storage, colors);
            elementChooseCategory.innerHTML = "";
            elementChooseCategory.append(categoryList);
            const lisItems = document.querySelectorAll('.lists__list-item');
            const categoryButton = document.querySelector('.category-button__text');

            lisItems[0].classList.add("selected");
            categoryButton.innerHTML = lisItems[0].dataset.category;
        }

        showCategoryList() {
            const elementCategoryChoose = document.querySelector('.category-сhoose');

            if (!elementCategoryChoose.style.height || elementCategoryChoose.style.height === "0px") {
                elementCategoryChoose.style.height = "310px";
            } else {
                elementCategoryChoose.style.height = "0px";
            }
        }

        visibleToggle() {
            const modalButton = document.querySelector('.add-button');
            const modal = document.querySelector(".modal-add");
            const plus = document.querySelector('.add-button__img');
            const modalAddButton = document.querySelector('.modal-add__buttons');

            if (this.openModal) {
                this.openModal = false;
                modalButton.style.backgroundColor = "#ffffff";
                plus.setAttribute("src", "img/plus.svg");
                plus.style.transform = 'rotate(0deg)';
                modalAddButton.style.right = "-100%"
                setTimeout(() => {
                    modal.classList.toggle("hidden");
                }, 600);
                modal.style.opacity = 0;
            } else {
                this.openModal = true;
                modalButton.style.backgroundColor = "#006CFF";
                plus.setAttribute("src", "img/plusOpen.svg");
                plus.style.transform = 'rotate(135deg)';
                modal.classList.toggle("hidden");
                modal.style.opacity = 1;
                modalAddButton.style.right = "16px"
            }
        }

        selectСategory(category) {
            const listItems = document.querySelectorAll('.lists__list-item');

            listItems.forEach((item) => {
                if (item.dataset.category !== category) {
                    item.classList.remove('selected');
                } else {
                    const span = document.querySelectorAll('span[class$="color"]');
                    const categoryButton = document.querySelector('.category-button__text');

                    span.forEach((spanItem) => {
                        spanItem.style.backgroundColor = item.style.backgroundColor;
                        spanItem.className = `dot-color`;
                    })

                    item.classList.add('selected');
                    categoryButton.innerHTML = category;
                }
            })
        }

        openModalCategory(tasksArr, categoryInfo, colors) {
            const modal = document.querySelector('.modal-category');
            const ul = document.querySelector('.modal-category__main-tasks');
            const categorySpan = document.querySelector('.modal-category__header-category');
            const countSpan = document.querySelector('.modal-category__header-count');
            const shape = document.querySelector('.shape');
            const colorText = colors.find((item) => item.category === categoryInfo[0].category).textColor;
            const colorBack = colors.find((item) => item.category === categoryInfo[0].category).backColor;
            const colorImg = colors.find((item) => item.category === categoryInfo[0].category).img;

            ul.innerHTML = "";
            categorySpan.setAttribute('style', `color: ${colorText}`);
            countSpan.setAttribute('style', `color: ${colorText}`);

            tasksArr.forEach((item) => {
                const label = document.createElement('label');
                const li = document.createElement('li');
                const p = document.createElement('p');
                const span = document.createElement('span');

                label.setAttribute('for', `${item.id}`);
                li.setAttribute('class', 'tasks__list-item');
                span.classList.add('task-text');
                span.setAttribute('data-id', `${item.id}`);
                span.setAttribute('style', `color: ${colorText}`);

                if (item.checked) {
                    span.classList.add('check');
                }

                span.innerHTML = item.text;
                p.append(span);

                if (item.time) {
                    const spanTime = document.createElement('span');
                    spanTime.setAttribute('class', 'task-time');
                    spanTime.setAttribute('style', `color: ${colorText}`);
                    spanTime.innerHTML = item.time;
                    p.append(spanTime);
                }

                li.append(p);
                label.append(li);
                ul.append(label);
            });

            categorySpan.innerHTML = categoryInfo[0].category;
            categorySpan.setAttribute('data-category', `${categoryInfo[0].category}`);
            countSpan.innerHTML = `${categoryInfo[0].count} ${categoryInfo[0].count < 2 ? "task" : "tasks"}`;
            shape.setAttribute('src', `${colorImg}`);
            modal.style.backgroundColor = `${colorBack}`;
            modal.setAttribute('data-category', `${categoryInfo[0].category}`);
            modal.classList.remove('close')
            modal.classList.add('open');

        }

        modalTaskCheck(id) {
            document.querySelector(`[data-id='${id}']`).classList.toggle('check');
        }

        closeModalCategory() {
            const modal = document.querySelector('.modal-category');
            modal.classList.remove('open');
            modal.classList.add('close');
        }

        changeCategoryName() {
            const categorySpan = document.querySelector('.modal-category__header-category');
            const input = document.querySelector('#input-text');

            input.value = categorySpan.innerHTML;
            categorySpan.style.display = "none";
            input.setAttribute('style', `display: block; color: ${categorySpan.style.color}`)

            input.focus();
        }

        inputBlur() {
            const categorySpan = document.querySelector('.modal-category__header-category');
            const input = document.querySelector('#input-text');
            const li = document.querySelector(`.lists__list-item[data-category="${categorySpan.innerHTML}"]`);
            const span = document.querySelector(`.lists__list-item[data-category="${categorySpan.innerHTML}"] .list-text`);
            const tasksArr = document.querySelectorAll(`input[data-parent="${categorySpan.innerHTML}"]`);

            categorySpan.innerHTML = input.value;
            span.innerHTML = input.value;
            li.dataset.category = input.value;
            tasksArr.forEach((item) => item.dataset.parent = input.value);
            input.style.display = "none";
            categorySpan.style.display = "block";
        }

        createColorsElement(newColors) {
            const colorsContainer = document.querySelector('.create-category__colors');

            newColors.forEach((item, index) => {
                const span = document.createElement('span');
                span.style.backgroundColor = item.backColor;
                span.setAttribute('data-backColor', item.backColor);
                span.setAttribute('data-textColor', item.textColor);
                span.setAttribute('data-img', item.img);
                span.setAttribute('id', `${index}`);
                span.classList.add('color');
                if (index === 0) span.classList.add('selectedColor');
                colorsContainer.append(span);
            })
        }

        selectColor(id) {
            const colors = document.querySelectorAll('.color');

            colors.forEach((item) => item.id === id ? item.classList.add("selectedColor") : item.classList.remove("selectedColor"))
        }

        createTimeContent() {
            const timeContainer = document.querySelector('.category-сhoose');
            const inputTime = document.createElement('input');
            const rangeLine = document.createElement('div');

            timeContainer.innerHTML = "";
            inputTime.setAttribute("type", "time");
            inputTime.setAttribute("id", "clock");
            inputTime.classList.add("clock");
            rangeLine.classList.add('range-line');
            timeContainer.append(rangeLine);
            timeContainer.append(inputTime);
        }

        addTime(value) {
            const inputText = document.querySelector('.input-text');
            const dot = document.querySelector('.dot-color');
            const span = document.querySelector('.task-time');

            const spanTime = document.createElement('span');
            spanTime.setAttribute('class', 'task-time');
            spanTime.innerHTML = value;
            span ? span.replaceWith(spanTime) : inputText.after(spanTime);
        }
    };

    class TaskerModel {
        constructor(view) {
            this.view = view;
        }

        init() {
            const storage = this.getData();
            const storageColor = this.getColors();
            const storageNewColor = this.getNewColors();

            if (storageColor === null) {
                let colorsData = [{
                        category: "Work",
                        backColor: "#61dea4",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        category: "Shopping",
                        backColor: "#f45e6d",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        category: "Inbox",
                        backColor: "#ebeff5",
                        textColor: "#252A31",
                        img: "img/shapeBlack.svg",
                    },
                    {
                        category: "Family",
                        backColor: "#ffe761",
                        textColor: "#252A31",
                        img: "img/shapeBlack.svg",
                    },
                ]
                localStorage.setItem("colors", JSON.stringify(colorsData));
            }

            if (storageNewColor === null) {
                let newColors = [{
                        backColor: "#61dea4",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        backColor: "#f45e6d",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        backColor: "#ebeff5",
                        textColor: "#252A31",
                        img: "img/shapeBlack.svg",
                    },
                    {
                        backColor: "#ffe761",
                        textColor: "#252A31",
                        img: "img/shapeBlack.svg",
                    },
                    {
                        backColor: "#de6195",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        backColor: "#dc61de",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        backColor: "#9161de",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        backColor: "#616bde",
                        textColor: "#FFFFFF",
                        img: "img/shapeWhite.svg",
                    },
                    {
                        backColor: "#61bbde",
                        textColor: "#252A31",
                        img: "img/shapeBlack.svg",
                    },
                    {
                        backColor: "#61de82",
                        textColor: "#252A31",
                        img: "img/shapeBlack.svg",
                    },
                    {
                        backColor: "#bfde61",
                        textColor: "#252A31",
                        img: "img/shapeBlack.svg",
                    },
                    {
                        backColor: "#607d8b",
                        textColor: "#252A31",
                        img: "img/shapeWhite.svg",
                    },
                ]
                localStorage.setItem("newColors", JSON.stringify(newColors));
            }

            if (storage === null) {
                let storageData = [{
                    day: "Today",
                    tasks: [{
                            id: 1,
                            text: "Start making a presentation",
                            parent: "Work",
                            color: "#61dea4",
                            time: "",
                            checked: false,
                        },
                        {
                            id: 2,
                            text: "Pay for rent",
                            parent: "Shopping",
                            color: "#f45e6d",
                            time: "20:10",
                            checked: false,
                        },
                        {
                            id: 3,
                            text: "Buy a milk",
                            parent: "Shopping",
                            color: "#f45e6d",
                            time: "",
                            checked: false,
                        },
                        {
                            id: 4,
                            text: "Don’t forget to pick up Mickael from school",
                            parent: "Inbox",
                            color: "#ebeff5",
                            time: "",
                            checked: false,
                        },
                        {
                            id: 5,
                            text: "Buy a chocolate for Charlotte",
                            parent: "Family",
                            color: "#ffe761",
                            time: "",
                            checked: false,
                        }
                    ],
                    lists: [{
                            category: "Inbox",
                            count: 1,
                            color: "#ebeff5"
                        },
                        {
                            category: "Work",
                            count: 1,
                            color: "#61dea4"
                        },
                        {
                            category: "Shopping",
                            count: 2,
                            color: "#f45e6d"
                        },
                        {
                            category: "Family",
                            count: 1,
                            color: "#ffe761"
                        }
                    ],
                }, ];
                localStorage.setItem("userData", JSON.stringify(storageData));
            }

            this.updateState();
        }

        getData() {
            return JSON.parse(localStorage.getItem("userData"));
        }

        getColors() {
            return JSON.parse(localStorage.getItem("colors"));
        }

        getNewColors() {
            return JSON.parse(localStorage.getItem("newColors"));
        }

        initialLoad() {
            this.view.createContent(this.getData(), this.getColors());
        }

        updateState() {
            const hashPageName = window.location.hash.slice(1);
            this.view.renderContent(hashPageName);

            if (!hashPageName || hashPageName === "homePage") this.initialLoad();
            if (hashPageName === "createTask") this.view.createCategoryContent(this.getData(), this.getColors());
            if (hashPageName === "createCategory") this.view.createColorsElement(this.getNewColors());
        }

        updateData(targetId) {
            const storage = this.getData();

            for (let i = 0; i < storage[0].tasks.length; i++) {
                if (storage[0].tasks[i].id === targetId) {
                    storage[0].tasks[i].checked = !(storage[0].tasks[i].checked);
                };
            }
            localStorage.setItem("userData", JSON.stringify(storage));
        }

        visibleToggle() {
            this.view.visibleToggle();
        }

        show() {
            this.view.showCategoryList();
        }

        selectСategory(category) {
            this.view.selectСategory(category);
        }

        saveTask({
            message: text,
            category: parent,
            checked,
            time
        }) {
            const newData = this.getData();
            const {
                tasks,
                lists
            } = newData[0];
            const id = tasks.length + 1;
            const foundCategory = lists.find((item) => item.category === parent);

            if (!!foundCategory) {
                const task = {
                    id,
                    text,
                    parent,
                    checked,
                    color: foundCategory.color,
                    time,
                }

                tasks.push(task);
                foundCategory.count += 1;
            };

            localStorage.setItem("userData", JSON.stringify(newData));
        }

        openModalCategory(category) {
            const tasksArr = this.getData()[0].tasks.filter((item) => item.parent === category);
            const categoryInfo = this.getData()[0].lists.filter((item) => item.category === category);
            this.view.openModalCategory(tasksArr, categoryInfo, this.getColors());
        }

        modalTaskCheck(id) {
            this.view.modalTaskCheck(id);
        }

        closeModalCategory() {
            this.view.closeModalCategory();
        }

        changeCategoryName() {
            this.view.changeCategoryName();
        }

        replaceCategoryName(categoryOld, categoryNew) {
            const newData = this.getData();
            const {
                tasks,
                lists
            } = newData[0];
            const newColors = this.getColors();
            lists.forEach((item) => item.category === categoryOld ? item.category = categoryNew : null);
            tasks.forEach((item) => item.parent === categoryOld ? item.parent = categoryNew : null);
            newColors.forEach((item) => item.category === categoryOld ? item.category = categoryNew : null);
            localStorage.setItem("userData", JSON.stringify(newData));
            localStorage.setItem("colors", JSON.stringify(newColors));
            this.view.inputBlur();
        }

        selectColor(id) {
            this.view.selectColor(id);
        }

        saveColor({
            category,
            backColor,
            textColor,
            img
        }) {
            const newColor = {
                category,
                backColor,
                textColor,
                img,
            }
            const newCategory = {
                category,
                count: 0,
                color: backColor,
            }
            const newColorsData = this.getColors();
            const newData = this.getData();
            const lists = newData[0].lists;

            lists.push(newCategory);
            newColorsData.push(newColor);
            localStorage.setItem("colors", JSON.stringify(newColorsData));
            localStorage.setItem("userData", JSON.stringify(newData));
        }

        createTimeContent() {
            this.view.createTimeContent();
        }

        createCategoryContent() {
            this.view.createCategoryContent(this.getData(), this.getColors());
        }

        addTime(value) {
            if (value) {
                this.view.addTime(value);
            }
        }
    };

    class TaskerController {
        constructor(model, container) {
            this.model = model;
            this.container = container;
            this.categoryShow = false;
            this.clockShow = false;
            this.calendarShow = false;
        }

        init() {
            this.model.updateState();

            window.addEventListener("hashchange", () => {
                this.model.updateState();
                const listItems = document.querySelectorAll('.lists__list-item');

                listItems.forEach((item) => {
                    item.onclick = () => {
                        this.model.openModalCategory(item.dataset.category);
                    }
                })
            });

            this.container.addEventListener('click', (e) => {
                if (e.target.className === 'custom-checkbox') {
                    const targetId = Number(e.target.id);
                    this.updateData(targetId);
                };

                if (e.target.className === 'add-button' || e.target.className === "add-task" ||
                    e.target.className === "add-list" || e.target.className === "add-button__img") {
                    this.model.visibleToggle();
                };

                if (e.target.className === 'category-button__text') {
                    if (!this.clockShow && !this.calendarShow) {
                        this.model.show();
                        this.model.createCategoryContent();

                        if (this.categoryShow) {
                            this.categoryShow = false;
                        } else {
                            this.categoryShow = true;
                        }

                    } else {
                        const inputTime = document.querySelector('#clock');

                        if (inputTime) {
                            this.model.addTime(inputTime.value);
                        };

                        this.model.show();
                        this.clockShow = false;
                        this.calendarShow = false;

                        setTimeout(() => {
                            this.model.createCategoryContent();
                            this.model.show()
                        }, 600);

                        if (this.categoryShow) {
                            this.categoryShow = false;
                        } else {
                            this.categoryShow = true;
                        }
                    }
                };

                if (window.location.hash.slice(1) === 'createTask') {
                    const listItems = document.querySelectorAll('.lists__list-item');

                    listItems.forEach((item) => {
                        item.onclick = (e) => {
                            this.model.selectСategory(item.dataset.category);
                        }
                    });
                }

                if (e.target.className === 'done-button') this.saveTask();

                if (!window.location.hash.slice(1) || window.location.hash.slice(1) === "homePage") {
                    const listItems = document.querySelectorAll('.lists__list-item');
                    const labels = document.querySelectorAll('[for]');

                    listItems.forEach((item) => {
                        item.onclick = () => {
                            this.model.openModalCategory(item.dataset.category);
                        }
                    })

                    labels.forEach((item) => {
                        item.onclick = (e) => {
                            this.model.modalTaskCheck(item.htmlFor);
                        }
                    })

                    document.querySelector('.modal-category__close-button').onclick = () => {
                        this.model.closeModalCategory();
                    }

                    document.querySelector('.edit-button').onclick = () => {
                        this.model.changeCategoryName();
                    }

                    document.querySelector('#input-text').onblur = () => {
                        const categoryOld = document.querySelector('.modal-category__header-category').innerHTML;
                        const categoryNew = document.querySelector('#input-text').value;
                        this.model.replaceCategoryName(categoryOld, categoryNew);
                    }
                }

                if (e.target.className === 'clock-button') {
                    if (!this.categoryShow && !this.calendarShow) {
                        const inputTime = document.querySelector('#clock');

                        if (inputTime) {
                            this.model.addTime(inputTime.value);
                        };

                        this.model.createTimeContent();
                        this.model.show();

                        if (this.clockShow) {
                            this.clockShow = false;
                        } else {
                            this.clockShow = true;
                        }

                    } else {
                        this.model.show();
                        this.categoryShow = false;
                        this.calendarShow = false;
                        setTimeout(() => {
                            this.model.createTimeContent();
                            this.model.show()
                        }, 600);

                        if (this.clockShow) {
                            this.clockShow = false;
                        } else {
                            this.clockShow = true;
                        }
                    }
                };

                if (window.location.hash.slice(1) === 'createCategory') {
                    const colorsArr = document.querySelectorAll('.color');

                    colorsArr.forEach((item) => {
                        item.onclick = () => {
                            this.model.selectColor(item.id);
                        }
                    })
                }

                if (e.target.className === 'create-category__done-button') {
                    const selectedColor = document.querySelector('.selectedColor').dataset;
                    const inputValue = document.querySelector('.input-text').value;
                    const selectedColorData = {
                        category: !!inputValue ? inputValue : "New Category",
                        backColor: selectedColor.backcolor,
                        textColor: selectedColor.textcolor,
                        img: selectedColor.img,
                    }
                    this.model.saveColor(selectedColorData);
                };
            })

            const listItems = document.querySelectorAll('.lists__list-item');

            listItems.forEach((item) => {
                item.onclick = () => {
                    this.model.openModalCategory(item.dataset.category);
                }
            })
        }

        updateData(targetId) {
            this.model.updateData(targetId);
        }

        saveTask() {
            if (this.clockShow) {
                const inputTime = document.querySelector('#clock');

                if (inputTime) {
                    this.model.addTime(inputTime.value);
                };
            }

            const infoTask = {
                message: document.querySelector('.input-text').value,
                category: document.querySelector('.category-button__text').innerHTML,
                checked: document.querySelector('.custom-checkbox').checked,
                time: document.querySelector('.task-time').innerHTML,
            }
            this.model.saveTask(infoTask);
        }
    };

    return {
        init: function () {
            const containerElem = document.getElementById("container");

            const appView = new TaskerView(containerElem);
            const appModel = new TaskerModel(appView);
            const appController = new TaskerController(appModel, containerElem);

            appView.init();
            appModel.init();
            appController.init();
        }
    };
})();

document.addEventListener("DOMContentLoaded", taskerApp.init());