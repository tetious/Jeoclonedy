Vue.component('ese-grammar-mc', {
  props: ['sentence', 'choices'],
  template: `
    <span>
        <h3>Read the sentence.</h3>
        <h2 style="border: 2px solid white; padding: 8px;" v-html="sentence"></h2>
        <h3>Which change, if any, is needed to the underlined text?</h3>
        <ol style="margin: 5em 2em">
            <li v-for="(choice, i) in choices" type="A">{{choice}}</li>
        </ol>
    </span>
    `,
});
