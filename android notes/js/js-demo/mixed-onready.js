let mix_onready = () => {
    function onReady(fn) {
        let readState = document.readyState;
        if (readState === 'interactive' || readState == 'complete') {
            setTimeout(() => {
                fn
            }, 0);
        } else {
            window.addEventListener('DomContentLoaded', fn);
        }
    }

    onReady(() => {
        console.log('Dom fully loaded and parsed');
    })

    /**
     * 链式调用
     */

    let taskA = () => {
        console.log('Task A');
        throw new Error("throw Error @ Task A");
    };
    let taskB = () => {
        console.log('Task B');

    };

    let onRejected = (error) => {
        console.log("Catch error: A or B", error);
    }
    let finalTask = () => {
        console.log('finalTask');

    };

    Promise
        .resolve()
        .then(taskA)
        .then(taskB)
        .catch(onRejected)
        .then(finalTask);


};
mix_onready();