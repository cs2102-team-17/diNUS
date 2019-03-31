var express = require('express');
var router = express.Router();

const {Pool} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

var custid;

// GET
router.get('/', function (req, res, next) {
    custid = req.query.user;
    console.log(req.query.user);
    res.render('reservation', {title: 'Making Reservation'});
});


var sql_query = "insert into reserves (resid, restime, restpax, rid, custid) values ";


// POST
router.post('/', function (req, res, next) {
    // Retrieve Information
    var rname = req.body.rName;
    var restDate = req.body.date;
    var restime = req.body.resTime;
    var respax = req.body.resNum;

    //change implementation of timing: not key in but drop bar, and conversion takes place
    console.log("I'm here" + restDate.data);

    // Construct Specific SQL Query
    var rid_query = "select r.rid from restaurants r where r.rname = '" + rname + "';";
    console.log(rid_query);

    pool.query(rid_query, (err, rest_data) => {
    if (err) {
        res.render("error", {
            message: "Restaurant " + rname + " not found",
            error: {status: "", stack: ""}
        });
    } else {
        var restaurant  = rest_data.rows[0];
    var insert_query = sql_query + "(" + "DEFAULT, '" + restime + "'," + respax + "," + restaurant.rid + "," + custid + ");";
        pool.query(insert_query, (err, data) => {
            console.log(insert_query);
        if (err) {
            res.render('error', {message: err, error: {status: "", cstack: ""}})
        } else {
            //res.redirect('/select?table=reserves')
            res.redirect('/dashboard?user=' + custid);
        }
    });
    }});
});


module.exports = router;