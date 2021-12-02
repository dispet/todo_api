const sql = require("./db.js");

// конструктор нашего дела. В нашем todo будет два задаваемых значения
// текст и внутреннее inner_id для нашего дела

const Deal = function (deal) {
    this.name = deal.name;
    this.text = deal.text;
    this.inner_key = deal.inner_key;
};

// Employee.create = function (newEmp, result) {
//     dbConn.query("INSERT INTO employees set ?", newEmp, function (err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//         } else {
//             console.log(res.insertId);
//             result(null, res.insertId);
//         }
//     });
// };
Deal.create = (newDeal, result) => {
    console.log("newDeal: ", newDeal);
    const queryInsert = "INSERT INTO TODO SET ?";
    sql.query(queryInsert, newDeal, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Создано дело", {id: res.insertId, ...newDeal});
        result(null, {id: res.insertId, ...newDeal});
        //используем spread для отправки наших аргументов в базу данных

    });
};


//получение дела по одному inner_id
Deal.findById = (dealId, result) => {
    const queryFintbyId = `SELECT * FROM TODO WHERE inner_key = '${dealId}'`;
    sql.query(queryFintbyId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("найдено дело: ", res[0]);
            result(null, res[0]);
            return;
        }
        // когда ничего не удалось найти
        result({kind: "not_found"}, null);
    });
};

Deal.getAll = result => {
    // здесь я немного переписал по сравнению с предыдущим разом
    // я хочу из базы данных только текст и inner_key, сам id из базы данных я забирать не хочу
    const queryAll = "SELECT text, name, inner_key FROM TODO";
    sql.query(queryAll, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("deals: ", res);
        result(null, res);
    });
};

//мы будем обновлять дела по inner_key
Deal.updateById = (inner_key, deal, result) => {
    const queryUpdate = "UPDATE TODO SET text = ? , name = ? WHERE inner_key = ?";
    sql.query(
        queryUpdate,
        [deal.text, deal.name, inner_key],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows === 0) {
                result({kind: "not_found"}, null);
                return;
            }

            console.log("Обновлено дело ", {inner_key: inner_key, ...deal});
            result(null, {inner_key: inner_key, ...deal});
        }
    );
};


Deal.remove = (inner_key, result) => {
    const queryDelete = "DELETE FROM TODO WHERE inner_key = ?";
    sql.query(queryDelete, inner_key, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows === 0) {
            //  если дело не удалось получить по inner_key
            result({kind: "не найдено"}, null);
            return;
        }

        console.log("Удален пользователь с  ", inner_key);
        result(null, res);
    });
};

Deal.removeAll = result => {
    sql.query("DELETE FROM TODO", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} deals`);
        result(null, res);
    });
};

module.exports = Deal;
