"use strict";
const taskerApp = (function (){

    class TaskerView {

        constructor (container) {
            this.container = container;
        }

        init() {
            return false;
        }

        firstLoad() {
            this.container.innerHTML = "Hello"
        }

    };

    class TaskerModel {

        constructor (view) {
            this.view = view;
        }

        init () {
            return false;
        }

        firstLoad() {
            this.view.firstLoad();
        }
    };

    class TaskerController {

        constructor (model, container) {
            this.model = model;
            this.container = container;
        }

        init() {
            this.firstLoad();
        }

        firstLoad() {
            this.model.firstLoad();
        }
    };

    return {
        init: function() {
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