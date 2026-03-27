const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");

const server = require("../app.js");
const bddsql = require("../config/databaseTest.config");

chai.use(chaiHttp);

describe("BDD connection", () => {
  beforeEach(function (done) {
    bddsql.BDDSQL.query("DELETE FROM EMPLOYEES", function (err, result) {
      if (err) throw err;
      done()
    });
  });

  describe("/GET employees", () => {
    // La suite de tests pour la route GET
    it("should get all employees when no employees are in database", done => {
      // Test qui vérifie qu'il n'y a pas d'erreurs lorsque la base de données est vide
      chai
        .request(server)
        .get("/api/employees")
        .end((err, res) => {
          // On requète la route GET
          res.should.have.status(200); // On vérifie le statu de la réponse
          res.body.should.be.a("array"); // On vérifie que le résultat est un tableau
          res.body.length.should.be.eql(0); // On vérifie que la longueur du tableau est de 0
          done(); // On dit à mocha que l'on a fini nos assertions
        });
    });

    it("should send employee's data when creating an employee in the database", done => {
      // Test qui vérifie qu'on a le bon résultat lorsque l'on crée un employé dans la base de données
      bddsql.BDDSQL.query("INSERT INTO EMPLOYEES(FirstName, LastName, BirthDate) VALUES ('Aude', 'Velly', '1981-03-30')", function (err, result) {
        if (err) throw err;
        chai
          .request(server)
          .get('/api/employees')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('ID_EMPLOYEE');
            res.body[0].should.have.property('FirstName');
            res.body[0].FirstName.should.be.eql('Aude'); // On vérifie que les éléments retournés par la route sont semblables à ceux que l'on a enregistré dans la base
            res.body[0].should.have.property('LastName');
            res.body[0].LastName.should.be.eql('Velly');
            res.body[0].should.have.property('BirthDate');
            res.body[0].BirthDate.should.be.eql('1981-03-30');
            done();
          });
      });
    });
  });

});
