module.exports = app => {
    const deals = require("../controllers/deal.controller.js");
  
    // Создание нового дела
    app.post("/deals", deals.create);
  
    // Получение всех дел сразу
    app.get("/deals", deals.findAll);
  
    //Получение отдельного дела по id
    app.get("/deal/:dealId", deals.findOne);
  
    // обновить дело по id
    app.put("/deal/:dealId", deals.update);
  
    //Удалить дело по id
    app.delete("/deal/:dealId", deals.delete);
  
    // Удалить сразу все дела
    app.delete("/deals", deals.deleteAll);
  };
  