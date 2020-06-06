//I found the videos made by Greg Healy very helpful.
//I wish I would of found 
//them for the other assignments earlier in the term
var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
app.set('port', 3000);
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const getAllQuery = 'SELECT * FROM workout';
const insertQuery = "INSERT INTO workout (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?, ?, ?, ?, ?)";
const updateQuery = "UPDATE workout SET name=?, reps=?, weight=?, unit=?, date=?, WHERE id=? ";
const deleteQuery = "DELETE FROM workout WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workout";
const makeTableQuery = `CREATE TABLE workout(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit BOOLEAN,
                        date DATE);`;
//unit of 0 = lbs, unit of 1 = kgs
const getAllData = () => {
    mysql.pool.query(getAllQuery, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ rows: rows });
    })
}
app.get('/', function (req, res, next) {
    var context = {};
    mysql.pool.query(getAllQuery, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        getAllData();
        //context.results = JSON.stringify(rows);
        //res.send(context);
    });
});

app.post('/', function (req, res, next) {
    var context = {};
    var { name, reps, weight, unit, date } = req.body;
    mysql.pool.query(insertQuery, [name, reps, weight, unit, date], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        getAllData();
    }
    );
});
//check and see if more than the id is needed for a row to be deleted
app.delete('/', function (req, res, next) {
    var context = {};
    mysql.pool.query(deleteQuery, [req.query.id], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        getAllData();
    });
});

//added in the req.query.reps, req.query.weight, req.query.unit, req.query.date,
app.put('/', (req, res, next) => {
    var context = {};
    mysql.pool.query(updateQuery,
        [req.query.name, req.query.reps, req.query.weight, req.query.unit, req.query.date, req.query.id],
        (err, result) => {
            if (err) {
                next(err);
                return;
            }
            getAllData();
        });
});

app.get('/reset-table', function (req, res, next) {
    var context = {};
    mysql.pool.query(dropTableQuery, function (err) {
        var createString = makeTableQuery;
        mysql.pool.query(createString, function (err) {
            getAllData();
            //context.results = "Table reset";
            //res.send(context);
        })
    });
});

app.use(function (req, res) {
    res.status(404);
    res.send('404');
    //res.render('404');
});
//should you change these to send from render? 
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.send('500');
    //res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});