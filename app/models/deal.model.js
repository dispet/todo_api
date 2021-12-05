const sql = require('./db.js');
const Deal = function (deal) {
  this.name = deal.name;
  this.text = deal.text;
  this.id = deal.id;
};

Deal.create = (newDeal, result) => {
  console.log('newDeal: ', newDeal);
  const queryInsert = 'INSERT INTO TODO SET ?';
  sql.query(queryInsert, newDeal, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    console.log('Создано дело', {id: res.insertId, ...newDeal});
    result(null, {id: res.insertId, ...newDeal});
    //используем spread для отправки наших аргументов в базу данных
  });
};

Deal.updateAll = (deals, result) => {
  sql.query('DELETE FROM TODO', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    const queryInsert = 'INSERT INTO TODO(id,name,text) VALUES ?';
    sql.query(queryInsert, [deals.map(item => [item.id, item.name, item.text])], (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
      }
      console.log('res: ', res);
    });
  });
  console.log('Изменены все дела', deals);
  result(null, deals);
};


//получение дела по одному inner_id
Deal.findById = (dealId, result) => {
  const queryFintbyId = `SELECT * FROM TODO WHERE id = '${dealId}'`;
  sql.query(queryFintbyId, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('найдено дело: ', res[0]);
      result(null, res[0]);
      return;
    }
    // когда ничего не удалось найти
    result({kind: 'not_found'}, null);
  });
};

Deal.getAll = result => {
  const queryAll = 'SELECT text, name, id FROM TODO';
  sql.query(queryAll, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('deals: ', res);
    result(null, res);
  });
};

//мы будем обновлять дела по id
Deal.updateById = (id, deal, result) => {
  const queryUpdate = 'UPDATE TODO SET text = ? , name = ? WHERE id = ?';
  sql.query(
    queryUpdate,
    [deal.text, deal.name, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        result({kind: 'not_found'}, null);
        return;
      }

      console.log('Обновлено дело ', {id: id, ...deal});
      result(null, {id: id, ...deal});
    }
  );
};


Deal.remove = (id, result) => {
  const queryDelete = 'DELETE FROM TODO WHERE id = ?';
  sql.query(queryDelete, id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows === 0) {
      //  если дело не удалось получить по id
      result({kind: 'не найдено'}, null);
      return;
    }

    console.log('Удален пользователь с  ', id);
    result(null, res);
  });
};

Deal.removeAll = result => {
  sql.query('DELETE FROM TODO', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} deals`);
    result(null, res);
  });
};

module.exports = Deal;
