let app = new Vue({

    created() {
        $.getJSON("data/ece-efc-social-media.json").done(r => {
            this.categories = r;
        });
        this.teams = JSON.parse(window.localStorage.getItem("teams")) || [];
    },

    el: '#app',

    data: {
        categories: [],
        scoreEvents: {},
        teams: null,
        currentClue: null
    },

    computed: {},
    methods: {
        editTeams() {
            $('#game-board').hide();
            $('#team-editor').show();
        },
        saveTeams() {
            $('#game-board').show();
            $('#team-editor').hide();
            this.storeTeams();
        },
        score(correct, clue, team) {
            this.scoreEvents[clue.hash][team.id] = correct ? clue.value : clue.value / 2 * -1;
            this.$forceUpdate();
        },
        storeTeams() {
            window.localStorage.setItem("teams", JSON.stringify(this.teams));
        },
        getScore(teamId) {
            let score = 0;
            for(let item of Object.entries(this.scoreEvents)) {
                score += item[1][teamId] || 0;
            }

            return score;
        },
        getScoreState(hash, teamId) {
            if(this.scoreEvents[hash][teamId] == null) return 'None';
            if(this.scoreEvents[hash][teamId] > 0) return 'Correct';
            return 'Incorrect';
        },
        addTeam() {
            this.teams.push({id: this.teams.length});
        },
        isComplete(category, clue) {
            const clueHash = category.category + '-' + clue.value;
            const dict = this.scoreEvents[clueHash];
            return dict != null && Object.keys(dict).length;
        },
        showClue(category, clue) {
            const clueHash = category.category + '-' + clue.value;
            this.scoreEvents[clueHash] = (this.scoreEvents[clueHash] || {});
            this.currentClue = {hash: clueHash, ...clue};
            $('#game-board').transition('slide right');
            $('#current-clue').transition('slide right');
        },
        back() {
            $('#game-board').transition('slide left');
            $('#current-clue').transition('slide left');
        }
    }
});
