function delay(N) {
    return new Promise(res => setTimeout(res, N * 1000, "fine"));
}

function counter(N) {
    if (N < 0) return;

    delay(1).then((value) => {
        console.log(N);
        counter(N - 1);
    })
}

async function getFirstRepoName(username) {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error(`Пользователь ${username} не найден`);
    const userData = await userResponse.json();

    const reposResponse = await fetch(userData.repos_url);
    if (!reposResponse.ok) throw new Error(`Не удалось загрузить репозитории`);
    const repos = await reposResponse.json();

    if (repos.length === 0) throw new Error("У пользователя нет публичных репозиториев");

    return repos[0].name;
}

getFirstRepoName("smachniybober228")
  .then(name => console.log("Первый репозиторий:", name))
  .catch(err => console.error("Ошибка:", err.message));