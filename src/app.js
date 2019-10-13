const LS_TEAMS = "teams";
const LS_SCORE_EVENTS = "scoreEvents";
let app = new Vue({

    created() {
        //window.addEventListener('keydown', this.keydown);
        $.getJSON("data/ece-efc-social-media.json").done(r => {
            this.categories = r;
        });
        this.teams = JSON.parse(window.localStorage.getItem(LS_TEAMS)) || [];
        this.scoreEvents = JSON.parse(window.localStorage.getItem(LS_SCORE_EVENTS)) || {};
    },

    beforeDestroy() {
        //window.removeEventListener('keydown', this.keydown);
    },

    el: '#app',

    data: {
        categories: [],
        scoreEvents: {},
        teams: null,
        currentClue: null,
        showAnswer: false,
    },

    computed: {},
    methods: {
        keydown(e) {
            console.log(e);
        },
        editTeams() {
            $('#game-board').hide();
            $('#team-editor').show();
        },
        cancelTeams() {
            $('#game-board').show();
            $('#team-editor').hide();
        },
        saveTeams() {
            this.cancelTeams();
            this.storeTeams();
        },
        score(correct, clue, team) {
            if(correct === null) {
                delete this.scoreEvents[clue.hash][team.id];
            } else {
                this.scoreEvents[clue.hash][team.id] = correct ? clue.value : clue.value / 2 * -1;
            }
            this.$forceUpdate();
            this.storeScores();
        },
        storeTeams() {
            window.localStorage.setItem(LS_TEAMS, JSON.stringify(this.teams));
        },
        storeScores() {
            window.localStorage.setItem(LS_SCORE_EVENTS, JSON.stringify(this.scoreEvents));
        },
        resetScores() {
            if (confirm("Are you sure you want to reset all scores?")) {
                this.scoreEvents = {};
                this.storeScores();
                this.cancelTeams();
            }
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
        deleteTeam(t) {
            this.teams = this.teams.filter(i => i != t);
        },
        isComplete(category, clue) {
            const clueHash = category.category + '-' + clue.value;
            const dict = this.scoreEvents[clueHash];
            return dict != null && Object.keys(dict).length;
        },
        toggleAnswer() {
            this.showAnswer = !this.showAnswer;
        },
        showClue(category, clue) {
            const clueHash = category.category + '-' + clue.value;
            this.scoreEvents[clueHash] = (this.scoreEvents[clueHash] || {});
            this.currentClue = {hash: clueHash, ...clue};
            $('#game-board').transition({animation: 'fade', onComplete: () => $('#current-clue').transition('fade')});
        },
        back() {
            this.currentClue = null;
            this.showAnswer = false;
            $('#current-clue').transition({animation: 'fade', onComplete: () => $('#game-board').transition('fade')});
        }
    }
});
