const postData = async (url, data) => { //url i data дані які будуть поститись
    const res = await fetch(url, {
        method: 'POST',
        headers: { //при відправці FormData не JSON файл,-headers непотрібні
            'Content-type': 'application/json'
        },
        body: data
    });

    return await res.json(); //повертаємо promis
};

const getResource = async (url, data) => { //url i data дані які будуть поститись
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`); //викидає помилку catch 
    }                                                           //так fetch видає тільки при відсутності мережі

    return await res.json(); //повертаємо promis
};

export {postData};
export {getResource};

