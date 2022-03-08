Vue.use(VueMaterial.default);
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.withCredentials = true


var table = new Vue({
    delimiters: ['[[', ']]'],
    el: '#table',
    data: () => ({
      selected: [],
      questions: [],
      temp: [],
      errored: false,
    }),
    methods: {
      onSelect (items) {
        this.selected = items
      },
      getAlternateLabel (count) {
        let plural = ''

        if (count > 1) {
          plural = 's'
        }

        return `${count} user${plural} selected`
      },
      getQuestions() {
        axios({
            method: 'get',
            url: 'get-tech',
            data: {},
        })
        .then(response => {
            let temp = JSON.parse(JSON.stringify(response.data));
            if (temp == null){
              this.errored = true;
            }
            for (i in temp){
                let admin_comment_array = [];
                let user_comment_array = [];
                let admin_rank = 0;
                let user_rank = 0;
                let admin_total = 0;
                let user_total = 0;
                for (rank in temp[i].admin_rankings) {
                    admin_comment_array.push(temp[i].admin_rankings[rank].comment);
                    admin_rank += 1;
                    admin_total += temp[i].admin_rankings[rank].rank;
                }
                for (rank in temp[i].user_rankings) {
                    user_comment_array.push(temp[i].user_rankings[rank].comment);
                    user_rank += 1;
                    user_total += temp[i].user_rankings[rank].rank;
                }
                if (user_rank != 0) {
                    user_total = user_total / user_rank;
                } else {
                    user_total = "N/A"
                }
                if (admin_rank != 0) {
                    admin_total = admin_total / admin_rank;
                } else {
                    admin_total = "N/A"
                }
                table.questions.push({
                    question: temp[i].question,
                    userRank: user_total,
                    adminRank: admin_total
                })
            }
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
      }
    }
  });

  table.getQuestions();