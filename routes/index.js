var express = require('express');
var router = express.Router();
var teamNames = require('./includes/real-team-names.json');
var dappAddress;

var env = process.env.NODE_ENV || 'dev';
if (env === 'dev' || env === 'development') {
  dappAddress = 'n1ezCBRtS4gYv9fBBJZ6HRPX8AGRzZDFeJx';
} else {
  dappAddress = 'n1nKJbTqcRSfMXQeJzWayyZGeWiGeTCuPTR';
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', teamNames: teamNames, dappAddress: dappAddress });
});

router.get('/team/:slug', function(req, res, next) {
  var team;
  teamNames.forEach(function(t) {
    if (t.slug === req.params.slug) {
      team = t;
    }
  });
  res.render('by-team', { title: 'Browse By Team', team: team, dappAddress: dappAddress });
});

router.get('/add-new', function(req, res, next) {
  res.render('add-new-team', { title: 'Add New Team', teamNames: teamNames, dappAddress: dappAddress });
});

module.exports = router;
