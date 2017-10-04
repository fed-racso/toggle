jQuery(document).ready(function($) {
	'use strict';

	//hide reset icon at the beginning
	$(".search-field__close-icon").hide();

  
	//check for input change in search field
	$("#search-field").change(function() {
		if(this.value.replace(/\s/g, "") === "") {
			$(".search-field__close-icon").hide();
		} else {
			$(".search-field__close-icon").show();
		}
	});

	//handle on click reset icon to clear input and hide button
	$(".search-field__close-icon").click(function() {
		$('#search-field').val("");
		$(this).hide();
	});

	/* To Ufinity
	 * Replace this stub data with ur JSON format URL 
	 * See documentation on how to use this autocomplete function at 
	 * https://github.com/devbridge/jQuery-Autocomplete
	 */
	var nhlTeams = ['Anaheim Ducks', 'Atlanta Thrashers', 'Boston Bruins', 'Buffalo Sabres', 'Calgary Flames', 'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche', 'Columbus Blue Jackets', 'Dallas Stars', 'Detroit Red Wings', 'Edmonton OIlers', 'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild', 'Montreal Canadiens', 'Nashville Predators', 'New Jersey Devils', 'New Rork Islanders', 'New York Rangers', 'Ottawa Senators', 'Philadelphia Flyers', 'Phoenix Coyotes', 'Pittsburgh Penguins', 'Saint Louis Blues', 'San Jose Sharks', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 'Vancouver Canucks', 'Washington Capitals'];
    var nbaTeams = ['Atlanta Hawks', 'Boston Celtics', 'Charlotte Bobcats', 'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers', 'LA Clippers', 'LA Lakers', 'Memphis Grizzlies', 'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Jersey Nets', 'New Orleans Hornets', 'New York Knicks', 'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia Sixers', 'Phoenix Suns', 'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'];
    var nhl = $.map(nhlTeams, function (team) { return { value: team, data: { category: 'NHL' }}; });
    var nba = $.map(nbaTeams, function (team) { return { value: team, data: { category: 'NBA' } }; });
    var autocompleteDemo = nhl.concat(nba);

    // $('#search-field, #search-primary').autocomplete({
	   //  lookup: autocompleteDemo,
	   //  onSelect: function (suggestion) {
	   //      alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
	   //  }

		    /* this is what your script may be like

			$('#search-field').autocomplete({
			    serviceUrl: '/search/keyword1+keyword2',
			    onSelect: function (suggestion) {
					goToPage(suggestion.data);
			    }
			});

		    */
	// });
});




