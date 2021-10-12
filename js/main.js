
const ACI = (function () {
    const j = {};
    j.UI = {};
    j.UI.data = {};
    return j;
})();

// All jQuery initialisations:
function initUI() {
    // jQuery('#beam-width').dropdown();
    // jQuery('#beam-heigt').dropdown();
}

function App() {
    // Vue event bus
    (function () {
        ACI.v_EVENT = new Vue();
    })();

    // Vue Root
    (function () {
        const { tableBody } = ACI.UI;
        const vue_options = {
            components: {
                // table body component:
                table_body: tableBody(),
            },
            data: function () {
                return {
                    shared: ACI.UI.data
                };
            },
            el: "#table-app",
            methods: {
                // selectItem(evt) {
                //     const entries = Object.keys(this.is_open);
                //     entries.forEach(entry => {
                //         this.is_open[entry] = entry === evt['val'] ? true : false
                //     });
                // },
                runTable: function () {

                }
            },
            mounted: function () {
                console.log(`> ACI.v_UI mounted.`);
                // ACI.v_EVENT.$on('nav_selection', evt => {
                //     this.selectItem(evt);
                // });
            },
            name: "aci-beam-app"
        };
        ACI.v_UI = new Vue(vue_options);
    })();
};

jQuery(document).ready(function () {
    App();
    initUI();
});
