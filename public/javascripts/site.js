var NebPay = require('nebpay');
var nebPay = new NebPay();
var intervalQuery;

function checkWebExtensionWallet() {
  console.log('smart contract address', dappAddress);
  if (typeof webExtensionWallet === 'undefined') {
    $('#noExtension').removeClass('is-hidden');
  }
}

function funcIntervalQuery(serialNumber) {
  nebPay.queryPayInfo(serialNumber)
    .then(function (resp) {
        // console.log('tx result: ' + resp)
        var respObject = JSON.parse(resp)
        if(respObject.code === 0){
            clearInterval(intervalQuery)
        }
    })
    .catch(function (err) {
        // console.log(err);
    });
}

function loadFilteredTeamNames(slug) {
  var callArgs = "[\"" + slug + "\"]";
  nebPay.simulateCall(dappAddress, 0, 'getTeamNamesByAssociatedTeam', callArgs, {
     listener: showTeamNamesInfo
 });
}

function loadTeamNames() {
  nebPay.simulateCall(dappAddress, 0, 'getAllTeamNames', '', {
     listener: showTeamNamesInfo
 });
}

function showTeamNamesInfo(resp) {
  if (resp && resp.result) {
    var result = JSON.parse(resp.result);
    if (result && result.length) {
      result.forEach(function(r) {
        $('#team-names-container').append(`
          <div class="column is-one-third">
            <div class="card">
              <div class="card-content">
                <div class="content has-text-centered">
                  ${r.name}
                </div>
              </div>
              <footer class="card-footer">
                <p class="card-footer-item" data-number="${r.votes}">
                  ${r.votes} votes
                </p>
                <a href="#" class="vote-button card-footer-item" data-key="${r.key}">Vote</a>
              </footer>
            </div>
          </div>
        `);
      });
    } else {
      $('#team-names-container').html(`
        <div class="column">
          <div class="message is-danger">
            <h4 class="message-header">No teams</h4>
            <div class="message-body">
              Could not find any team names
            </div>
          </div>
        </div>
      `)
    }
  }
}

function submitVote(key, element) {
  var callArgs = "[\"" + key + "\"]";
  var serialNumber = nebPay.call(dappAddress, '0', 'upvoteTeamName', callArgs, {
    listener: function(resp) {
      // console.log('response of push: ' + JSON.stringify(resp));
      var votes = ($(element).parent().find('p.card-footer-item').data('number')) + 1;
      $(element).parent().find('p.card-footer-item').html(votes + ' votes').data('number', votes);
    }
  });
}

function submitTeamName() {
  if ($('#teamName').val()) {
    var data = {
      teamName: $('#teamName').val(),
      associatedTeams: $('#associatedTeams').val()
    };

    var callArgs = "[\"" + data.teamName + "\",\"" + data.associatedTeams.toString() + "\"]"

    var serialNumber = nebPay.call(dappAddress, '0', 'save', callArgs, {
      listener: function(resp) {
        $('#addTeamSuccess').addClass('is-active');
        // console.log('response of push: ' + JSON.stringify(resp));
      }
    });

    intervalQuery = setInterval(function () {
      funcIntervalQuery(serialNumber, data.key);
    }, 5000);
  } else {
    alert('Team name cannot be empty');
  }

}
