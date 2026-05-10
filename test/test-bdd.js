import * as chai from "chai";
import { default as chaiHttp, request } from "chai-http";
import { expect } from "chai";
import server from "../app.js";
import bddsql from "../config/databaseTest.config.js";

chai.use(chaiHttp);

describe("BDD connection", () => {
  beforeEach(function (done) {
    bddsql.BDDSQL.query("DELETE FROM EMPLOYEES", function (err, result) {
      if (err) throw err;
      done();
    });
  });

  describe("/GET employees", () => {
    // La suite de tests pour la route GET
    it("should get all employees when no employees are in database", (done) => {
      // Test qui vérifie qu'il n'y a pas d'erreurs lorsque la base de données est vide
      request
        .execute(server)
        .get("/api/employees")
        .end((err, res) => {
          // On requète la route GET
          expect(res).to.have.status(200); // On vérifie le statu de la réponse
          expect(res.body).to.be.a("array"); // On vérifie que le résultat est un tableau
          expect(res.body.length).to.be.eql(0); // On vérifie que la longueur du tableau est de 0
          done(); // On dit à mocha que l'on a fini nos assertions
        });
    });

    it("should send employee's data when creating an employee in the database", (done) => {
      // Test qui vérifie qu'on a le bon résultat lorsque l'on crée un employé dans la base de données
      bddsql.BDDSQL.query(
        "INSERT INTO EMPLOYEES(FirstName, LastName, BirthDate) VALUES ('Aude', 'Velly', '1981-03-30')",
        function (err, result) {
          if (err) throw err;
          request
            .execute(server)
            .get("/api/employees")
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.a("array");
              expect(res.body.length).to.be.eql(1);
              expect(res.body[0]).to.be.a("object");
              expect(res.body[0]).to.have.property("ID_EMPLOYEE");
              expect(res.body[0]).to.have.property("FirstName");
              expect(res.body[0].FirstName).to.be.eql("Aude"); // On vérifie que les éléments retournés par la route sont semblables à ceux que l'on a enregistré dans la base
              expect(res.body[0]).to.have.property("LastName");
              expect(res.body[0].LastName).to.be.eql("Velly");
              expect(res.body[0]).to.have.property("BirthDate");
              expect(res.body[0].BirthDate).to.be.eql("1981-03-30");
              done();
            });
        },
      );
    });
  });
});

// Fermer proprement le serveur à la fin des tests
after(function (done) {
  server.close(() => {
    if (bddsql && bddsql.BDDSQL && typeof bddsql.BDDSQL.end === "function") {
      bddsql.BDDSQL.end(() => done());
    } else {
      done();
    }
  });
});
