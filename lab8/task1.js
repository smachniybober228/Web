function counter(n) {
    let current = n;
    timerId = setInterval(() => {
        if (current >= 0) {
            console.log(current);
            current--;
        }
        else
            clearInterval(timerId);
    }, 1000);
}

function createCounter(n) {
    let current = n;
    let timerId = null;

    function start() {
        if (timerId !== null) return // timer is already exists
        timerId = setInterval(() => {
            console.log(current);
            current--;
        }, 1000);
    }

    function pause() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function stop() {
        pause();
        current = n;
    }

    return { start, pause, stop };
}